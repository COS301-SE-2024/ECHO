import { Component } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent, ActivatedRoute } from "@angular/router";
import { filter } from "rxjs/operators";

import {PageHeaderComponent} from "./../../../molecules/page-header/page-header.component";
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private route: ActivatedRoute, private router: Router) {
    this.updateTitle();
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitle();
    });
  }
  title: string ="Home";
  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  private updateTitle() {
    const currentRoute = this.route.root.firstChild?.snapshot.routeConfig?.path || '';
    this.title = this.capitalizeFirstLetter(currentRoute);
  }
}
