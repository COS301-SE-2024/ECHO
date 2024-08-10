import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { BottomPlayerComponent } from "./shared/bottom-player/bottom-player.component";
import { BottomNavComponent } from './shared/bottom-nav/bottom-nav.component';
import { ScreenSizeService } from './services/screen-size-service.service';

import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { NgIf } from "@angular/common";
import { SideBarComponent } from "./shared/side-bar/side-bar.component";
import { ProviderService } from "./services/provider.service";
import { PageHeaderComponent } from "./shared/page-header/page-header.component";
@Component({
    selector: 'app-root',
    standalone: true,
  imports: [RouterOutlet, BottomPlayerComponent, NgIf, SideBarComponent, BottomNavComponent, PageHeaderComponent],

    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Echo';
  update: boolean = false;
  screenSize?: string;
  showPlayer = false;
  displayPlayer = false;
  currentPage: string = '';
  displayPageName: boolean = false;
  showSideBar = true;

  constructor(private router: Router, private screenSizeService: ScreenSizeService, private providerService: ProviderService, updates: SwUpdate) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.showPlayer = ['/home', '/home#','/home#search', '/home#library', '/profile', '/mood'].includes(event.urlAfterRedirects);
        this.showSideBar = !event.urlAfterRedirects.includes('/mood');
        switch (event.urlAfterRedirects) {
          case '/home':
          case '/home#search':
          case '/home#library':
            this.currentPage = 'Home';
            this.displayPageName = true;
            break;
          case '/profile':
            this.currentPage = 'Profile';
            this.displayPageName = true;
            break;
          case '/settings':
            this.currentPage = 'Settings';
            this.displayPageName = true;
            break;
          default:
            this.currentPage = '';
            this.displayPageName = false;
        }
      }
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.displayPlayer = ['/settings'].includes(event.urlAfterRedirects);
      }
    });

    updates.versionUpdates.subscribe(event => {
      if (event.type === 'VERSION_READY') {
        console.log('Version ready to install:');
        updates.activateUpdate().then(() => {
          this.update = true;
          document.location.reload();
        });
      }
    });
  }

  async ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showSideBar = this.shouldShowSideBar(event.urlAfterRedirects);
      }
    });
  }

  shouldShowSideBar(url: string): boolean {
    const excludedRoutes = ['/mood', '/login', '/register', '/artist-profile',];
    return !excludedRoutes.some(route => url.includes(route));
  }
}

