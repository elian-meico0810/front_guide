import { inject, Inject, Injectable, OnInit } from '@angular/core';
import { HttpBaseService } from '@core/services/http-base.service';
import { ResponseAPI, UserData, UserDataDirectorioActivo } from '@core/interfaces/base/responseApi.interface';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuService } from '@core/components/sidebar/services/loadmenu.service';
import { environment } from 'src/environments/enviroments';
import { AuthenticationResult, EventType, RedirectRequest } from '@azure/msal-browser';
import { User } from '@core/store/app.store';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnInit {
  /**
   * Metodo constructor del modelo
   * @param _msalService Servicio de autenticación de microsoft
   * @param _msalGuardConfig Configuracion de Guard
   */

  private apiUrl = 'api/auth/validar_token/';
  private refreshUrl = 'api/auth/refresh_token/';
  private apiCheckUserInfo = 'api/auth/getUserInfoActiveDirectory/';
  private userFotoSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}').userFoto || '');
  private _isAuthenticatedCache: boolean=false;
  private userSubject = new BehaviorSubject<User | null>(null);

  user$ = this.userSubject.asObservable();
  userFoto$ = this.userFotoSubject.asObservable();
  snackBar = inject(MatSnackBar);
  userInfo: UserDataDirectorioActivo = {} as UserDataDirectorioActivo;

  constructor(
    private httpBase: HttpBaseService,
    private router: Router,
    private _msalService: MsalService,
    private _msalBroadcastService: MsalBroadcastService,
    private menuService: MenuService,
  ) { }

  ngOnInit(): void {
    if (!this.isAutenticated()) {
      this.AutenticacionMicrosoft();
    }
  }

  public async AutenticacionMicrosoft(): Promise<void> {
    await delay(500);
    if (this.isAutenticated()) {
      this.router.navigate(['/usuarios']);
    } else {
      this._msalService.loginRedirect({
        scopes: ['User.Read']
      });
    }
  }

  public async LoadPermissions(token: string): Promise<void> {
    this.login(token).subscribe(async response => {
      if (response && response['success']) {
        const helper = new JwtHelperService();
        const jwtToken = response['data']['token']['access'];
        const jwtRefresh = response['data']['token']['refresh'];
        const menu = response['data']['menu'];
        const decodedToken = helper.decodeToken(jwtToken);
        await this.loadUserInfo(decodedToken, jwtToken, jwtRefresh, menu);
        await this.CheckUserInfo();
        this.menuService.loadMenu();
        this.router.navigate([localStorage.getItem('auxRoute')]);
      } else {
        this._msalService.loginRedirect({
          scopes: ['User.Read']
        });
      }
    }, error => {
      this.snackBar.open("Error en la consulta de permisos", "X", {
        verticalPosition: "bottom",
        horizontalPosition: "right",
        duration: 3000,
        panelClass: 'error-snackbar'
      });
    });
  }

  private async loadUserInfo(decodedToken: any, jwtToken: string, jwtRefresh: string, menu: any): Promise<void> {
    const idAplicacion = environment.idAplicacion;
    const storageKey = `AuthUser${idAplicacion}`;

    const userInfo = {
      JWT: jwtToken,
      JWTRefresh: jwtRefresh,
      username: decodedToken['user_name'],
      Name: decodedToken['display_name'],
      expiration: decodedToken['exp'],
      Email: decodedToken['email'],
      Menu: menu,
      UserFoto: ""
    };

    await localStorage.setItem(storageKey, JSON.stringify(userInfo));
    this.updateUser();
  }

  public logout(): void {
    this.resetAuthenticationCache();

    document.body.innerHTML = '';
    document.body.style.backgroundColor = '#fff';
    localStorage.clear();
    setTimeout(() => {
      this._msalService.logoutRedirect();
    }, 500);
  }

  login(token: string): Observable<any> {
    const body = { token: token };
    return this.httpBase.post<ResponseAPI<UserData>>(this.apiUrl, body, [], []).pipe(
      map((response: ResponseAPI<UserData>) => {
        return response;
      }),
      catchError((error) => {
        console.error('Error en la llamada HTTP', error);
        return throwError(error);
      })
    );
  }

  isAutenticated(): boolean {
    if (this._isAuthenticatedCache) {
      return this._isAuthenticatedCache;
    }

    const accounts = this._msalService.instance.getAllAccounts();

    if (accounts.length > 0) {
      const idTokenClaims = accounts[0].idTokenClaims as any;
      const exp = idTokenClaims?.exp;

      if (exp) {
        const expirationDate = new Date(exp * 1000);
        const now = new Date();
        this._isAuthenticatedCache = expirationDate > now;
        return this._isAuthenticatedCache;
      }
    }

    this._isAuthenticatedCache = false;
    return false;
  }

  resetAuthenticationCache(): void{
    this._isAuthenticatedCache = false;
  }

  GetToken(){
    const accounts = this._msalService.instance.getAllAccounts();
    if (accounts.length > 0) {
      const idToken = accounts[0].idToken || '';
      return idToken;
    }
    return '';
  }

  async CheckUserInfo(){
    const userInfo = JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}');
    const email = userInfo.Email || '';

    await (await this.getUserInfoActiveDirectory(email)).subscribe(
      async (data) => {
        if (data) {
          this.userInfo = data;
          userInfo.UserFoto = data.Foto;
          localStorage.setItem(`AuthUser${environment.idAplicacion}`, JSON.stringify(userInfo));
          this.userFotoSubject.next(data.Foto);
        }
      },
      (error) => {
        console.error('Error al cargar el usuario:', error);
      }
    );
  }

  async getUserInfoActiveDirectory(email: string): Promise<Observable<any>> {
    const token = this.GetToken();
    const body = {
      email: email,
      token: token
    };
    return this.httpBase.post<ResponseAPI<UserDataDirectorioActivo>>(this.apiCheckUserInfo, body, [], []).pipe(
      map((response: ResponseAPI<UserDataDirectorioActivo>) => {
        return response.data;
      }),
      catchError((error) => {
        console.error('Error en la llamada HTTP', error);
        return throwError(error);
      })
    );
  }

  public async verifyPermissions(permission: string): Promise<boolean> {
    const helper = new JwtHelperService();
    const userInfo = JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}');
    const token = userInfo.JWT || '';
    if (!token) return false;
    const decodedToken: any = helper.decodeToken(token);
    const permissions: string[] = decodedToken['permissions'] || [];
    return permissions.includes(permission);
  }

  public async ChangeAccount(){
    const redirectRequest: RedirectRequest = {
      scopes: ['User.Read'],
      prompt: 'select_account',
      redirectUri: '/'
    };

    this._msalService.loginRedirect(redirectRequest);
  }

  checkRedirectCallback(): void {
    this._msalService.handleRedirectObservable().subscribe((result) => {
      if (result !== null && result.account) {
        this._msalService.instance.setActiveAccount(result.account);

        (async() => {
          await this.LoadPermissions(result.account.idToken || '');
          this.updateUser();
        })();
      }
    });
  }

  updateUser(): void{
    const user: User = {
      email: JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}').Email || '',
      FirstName: JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}').Name || '',
      Permissions: JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}').JWT || '',
      userName: JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}').userName || '',
      Foto: ''
    };

    this.userSubject.next(user);
  }

  getRefreshToken(token:string): Observable<any>
  {
    const body = { token: token };
    return this.httpBase.post<ResponseAPI<UserData>>(this.refreshUrl, body, [], []).pipe(
      map((response: ResponseAPI<UserData>) => {
        return response;
      }),
      catchError((error) => {
        console.error('Error en la llamada HTTP', error);
        return throwError(error);
      })
    );
  }

  refreshTokenFromBackend(token: string) {
    this.getRefreshToken(token)
    .subscribe(async response => {
      if (response && response['success']) {
        const helper = new JwtHelperService();
        const jwtToken = response['data']['token']['access'];
        const jwtRefresh = response['data']['token']['refresh'];
        const menu = response['data']['menu'];
        const decodedToken = helper.decodeToken(jwtToken);
        await this.loadUserInfo(decodedToken, jwtToken, jwtRefresh, menu);
        await this.CheckUserInfo();
        this.menuService.loadMenu();
        this.router.navigate(['/usuarios']);
      } else {
        this._msalService.loginRedirect({
          scopes: ['User.Read']
        });
      }
    });
  }

  handleMsalEvents(){
    this._msalBroadcastService.msalSubject$
    .subscribe(event => {
      if (event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
        const userInfo = JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}');
        const token = userInfo.JWTRefresh;
        this.refreshTokenFromBackend(token);
      }
    });
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
