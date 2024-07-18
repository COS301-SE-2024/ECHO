import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { BottomPlayerComponent } from "./shared/bottom-player/bottom-player.component";
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { NgIf } from "@angular/common";
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, BottomPlayerComponent, NgIf],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    title = 'Echo';
    update: boolean = false;
    showPlayer = false;

    constructor(private router: Router, updates: SwUpdate) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
          this.showPlayer = ['/home', '/profile'].includes(event.urlAfterRedirects);
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
  }

