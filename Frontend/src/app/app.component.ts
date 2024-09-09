import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from "@angular/core";
import { RouterOutlet, Router, NavigationEnd, Event as RouterEvent, ActivatedRoute } from "@angular/router";
import { BottomPlayerComponent } from "./components/organisms/bottom-player/bottom-player.component";
import { BottomNavComponent } from "./components/organisms/bottom-nav/bottom-nav.component";
import { ScreenSizeService } from "./services/screen-size-service.service";
import { SwUpdate } from "@angular/service-worker";
import { filter } from "rxjs/operators";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { SideBarComponent } from "./components/organisms/side-bar/side-bar.component";
import { ProviderService } from "./services/provider.service";
import { PageHeaderComponent } from "./components/molecules/page-header/page-header.component";
import { MoodService } from "./services/mood-service.service";
import { BackgroundAnimationComponent } from "./components/organisms/background-animation/background-animation.component";

//template imports
import { HeaderComponent } from "./components/organisms/header/header.component";
import { OtherNavComponent } from "./components/templates/desktop/other-nav/other-nav.component";
import { LeftComponent } from "./components/templates/desktop/left/left.component";
import { AuthService } from "./services/auth.service";
import { PlayerStateService } from "./services/player-state.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    BottomPlayerComponent,
    CommonModule,
    BottomNavComponent,
    PageHeaderComponent,
    HeaderComponent,
    OtherNavComponent,
    LeftComponent,
    BackgroundAnimationComponent
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  update: boolean = false;
  screenSize!: string;
  displayPageName: boolean = false;
  protected displaySideBar: boolean = false;
  protected isAuthRoute: boolean = false;
  protected isCallbackRoute: boolean = false;
  // Mood Service Variables
  currentMood!: string;
  moodComponentClasses!: { [key: string]: string };
  backgroundMoodClasses!: { [key: string]: string };
  isLoggedIn$!: Observable<boolean>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private screenSizeService: ScreenSizeService,
    private providerService: ProviderService,
    private updates: SwUpdate,
    public moodService: MoodService,
    private authService: AuthService,
    private playerStateService: PlayerStateService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    this.isLoggedIn$ = this.authService.isLoggedIn$;
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
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('Navigation ended:', event.urlAfterRedirects);
      this.isAuthRoute = ['/login', '/register'].includes(event.urlAfterRedirects);
      this.isCallbackRoute = ['/auth/callback'].includes(event.urlAfterRedirects);
    });
  }

  async ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
  }
  async ngAfterViewInit() {
    this.playerStateService.setReady();
  }

  isCurrentRouteAuth(): boolean {
    return ['/login', '/register','/Auth/callback'].includes(this.router.url);
  }


  isReady(): boolean {
    if (isPlatformBrowser(this.platformId))
      return this.playerStateService.isReady();
    return false;
  }

  ngOnDestroy()
  {
    this.authService.signOut();
  }
}
