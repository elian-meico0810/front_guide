import { MatPaginatorIntl } from '@angular/material/paginator';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';

export interface User {
  email?: string,
  FirstName?: string,
  Permissions?: string,
  userName?: string,
  Foto?: string
}

type AppState = {
  isLoginUser: boolean;
  loading: boolean;
  userLogin: User
};

const initialState: AppState = {
  isLoginUser: false,
  loading: false,
  userLogin: { email: "", FirstName: "", Permissions: "", userName: "" }
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    startSessionUser(status: boolean, currentUserLogin: User) {
      patchState(store, (state) => ({ isLoginUser: status, userLogin: currentUserLogin }));
    },
    closeSession() {
      patchState(store, (state) => ({ isLoginUser: false }))
      localStorage.clear()
    }
  }),),
  withHooks({
    // onInit(store) {
    //  const seguridadService = inject(SeguridadService);
    //   store.startSessionUser(seguridadService.hasSessionActive(),seguridadService.getUserLogin());
    // },
    onDestroy(store) {
      localStorage.setItem("state", JSON.stringify(store))
    },
  }),
);

export class MatPaginatorSettings extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elementos por página';
  override nextPageLabel = 'Página siguiente';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primera página';
  override lastPageLabel = 'Última página';
}