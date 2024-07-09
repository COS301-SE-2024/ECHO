import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { BottomPlayerComponent } from "./shared/bottom-player/bottom-player.component";
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf } from "@angular/common";
import { ProviderService } from "./services/provider.service";
import { SideBarComponent } from "./shared/side-bar/side-bar.component";
@Component({
    selector: 'app-root',
    standalone: true,
  imports: [RouterOutlet, BottomPlayerComponent, NgIf, SideBarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
  private providerService = inject(ProviderService);
    title = 'Echo';

  showPlayer = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.showPlayer = ['/home', '/profile'].includes(event.urlAfterRedirects);
      }
    });
  }
}
