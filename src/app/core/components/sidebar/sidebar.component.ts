import { Component, OnInit } from '@angular/core';
import { MenuService } from '@core/components/sidebar/services/loadmenu.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  public modules: any[] = [];
  public submenuOpen: { [key: string]: boolean } = {};

  constructor(private menuService: MenuService) { }

  ngOnInit(): void {
    this.menuService.menu$.subscribe(modules => {
      this.modules = modules;
      console.log(this.modules);
      
    });
    this.menuService.loadMenu();
  }

  toggleSubmenu(moduleName: string) {
    this.submenuOpen[moduleName] = !this.submenuOpen[moduleName];
  }

  hasVisiblePages(module: any): boolean {
    return module.paginas.some((page: any) => page.paginaVisible);
  }
}
