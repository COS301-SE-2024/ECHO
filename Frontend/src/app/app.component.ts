import { Component, OnInit } from "@angular/core";
import { RouterOutlet, Router, NavigationEnd, Event as RouterEvent, ActivatedRoute } from "@angular/router";
import { BottomPlayerComponent } from "./shared/bottom-player/bottom-player.component";
import { BottomNavComponent } from "./shared/bottom-nav/bottom-nav.component";
import { ScreenSizeService } from "./services/screen-size-service.service";
import { SwUpdate } from "@angular/service-worker";
import { filter } from "rxjs/operators";
import { NgIf, NgClass } from "@angular/common";
import { SideBarComponent } from "./shared/side-bar/side-bar.component";
import { ProviderService } from "./services/provider.service";
import { PageHeaderComponent } from "./shared/page-header/page-header.component";
import { MoodService } from "./services/mood-service.service";
import { NavbarComponent } from './components/organisms/navbar/navbar.component';
import { MoodDropDownComponent } from './shared/mood-drop-down/mood-drop-down.component';
import { ProfileAtomicComponent} from './components/atoms/profile/profile.component';


@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    BottomPlayerComponent,
    NgIf,
    NgClass,
    SideBarComponent,
    BottomNavComponent,
    PageHeaderComponent,
    NavbarComponent,
    MoodDropDownComponent,
    ProfileAtomicComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title!: string;
  update: boolean = false;
  screenSize?: string;
  displayPageName: boolean = false;
  // Mood Service Variables
  currentMood!: string;
  moodComponentClasses!: { [key: string]: string };
  backgroundMoodClasses!: { [key: string]: string };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private screenSizeService: ScreenSizeService,
    private providerService: ProviderService,
    private updates: SwUpdate,
    public moodService: MoodService
  ) {
    this.title = "Home";
    this.currentMood = this.moodService.getCurrentMood();
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    updates.versionUpdates.subscribe(event => {
      if (event.type === "VERSION_READY") {
        console.log("Version ready to install:");
        updates.activateUpdate().then(() => {
          this.update = true;
          document.location.reload();
        });
      }
    });

    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitle();
    });
  }

  onNavChange(newNav: string) {
    this.title = newNav;
  }

  async ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
  }

  isAuthRoute(): boolean {
    const authRoutes = ['/login', '/register'];
    return authRoutes.includes(this.router.url);
  }

  private updateTitle() {
    const currentRoute = this.route.root.firstChild?.snapshot.routeConfig?.path || '';
    this.title = this.capitalizeFirstLetter(currentRoute);
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}