import { Component, OnInit } from "@angular/core";
import { RouterOutlet, Router, NavigationEnd, Event as RouterEvent, ActivatedRoute } from "@angular/router";
import { BottomPlayerComponent } from "./components/organisms/bottom-player/bottom-player.component";
import { BottomNavComponent } from "./components/organisms/bottom-nav/bottom-nav.component";
import { ScreenSizeService } from "./services/screen-size-service.service";
import { SwUpdate } from "@angular/service-worker";
import { filter } from "rxjs/operators";
import { CommonModule } from "@angular/common";
import { SideBarComponent } from "./components/organisms/side-bar/side-bar.component";
import { ProviderService } from "./services/provider.service";
import { PageHeaderComponent } from "./components/molecules/page-header/page-header.component";
import { MoodService } from "./services/mood-service.service";
//template imports
import {HeaderComponent} from "./components/templates/desktop/header/header.component";
import {OtherNavComponent} from "./components/templates/desktop/other-nav/other-nav.component";
import {ExploreBarComponent} from "./components/templates/desktop/explore-bar/explore-bar.component";
import {LeftComponent} from "./components/templates/desktop/left/left.component";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    BottomPlayerComponent,
    CommonModule,
    SideBarComponent,
    BottomNavComponent,
    PageHeaderComponent,
    HeaderComponent,
    OtherNavComponent,
    ExploreBarComponent,
    LeftComponent
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  update: boolean = false;
  screenSize?: string;
  displayPageName: boolean = false;
  private isReady: boolean = false;
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
    public moodService: MoodService,
    private authService: AuthService
  ) {
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
    });
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



}
