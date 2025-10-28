import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/enviroments';

@Injectable({
    providedIn: 'root',
})
export class MenuService {
    private menuSubject = new BehaviorSubject<any[]>([]);
    public menu$ = this.menuSubject.asObservable();

    loadMenu() {
        const menuData = JSON.parse(localStorage.getItem(`AuthUser${environment.idAplicacion}`) || '{}').Menu;

        if (menuData) {
            const modules = menuData;
            this.menuSubject.next(modules);
        }
    }
}
