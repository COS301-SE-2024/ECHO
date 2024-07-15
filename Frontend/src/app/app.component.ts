import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { BottomPlayerComponent } from "./shared/bottom-player/bottom-player.component";
import { BottomNavComponent } from './shared/bottom-nav/bottom-nav.component';
import { ScreenSizeService } from './services/screen-size-service.service';

import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf } from "@angular/common";
import { SideBarComponent } from "./shared/side-bar/side-bar.component";
import { ProviderService } from "./services/provider.service";
@Component({
    selector: 'app-root',
    standalone: true,
  imports: [RouterOutlet, BottomPlayerComponent, NgIf, SideBarComponent, BottomNavComponent],

    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    title = 'Echo';

  screenSize?: string;
  showPlayer = false;

  constructor(private router: Router,private screenSizeService: ScreenSizeService  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.showPlayer = ['/home', '/profile','/search'].includes(event.urlAfterRedirects);
      }
    });
  }
  async ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
  }
}
