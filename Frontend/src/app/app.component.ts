import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from "@angular/core";
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { BottomPlayerComponent } from "./components/organisms/bottom-player/bottom-player.component";
import { BottomNavComponent } from "./components/organisms/bottom-nav/bottom-nav.component";
import { ScreenSizeService } from "./services/screen-size-service.service";
import { SwUpdate } from "@angular/service-worker";
import { filter } from "rxjs/operators";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { ProviderService } from "./services/provider.service";
import { PageHeaderComponent } from "./components/molecules/page-header/page-header.component";
import { MoodService } from "./services/mood-service.service";
import {
  BackgroundAnimationComponent
} from "./components/organisms/background-animation/background-animation.component";
import { ExpandableIconComponent } from './components/organisms/expandable-icon/expandable-icon.component';
import { NavbarComponent } from "./components/organisms/navbar/navbar.component";
import { SideBarComponent } from './components/organisms/side-bar/side-bar.component';
//template imports
import { HeaderComponent } from "./components/organisms/header/header.component";
import { OtherNavComponent } from "./components/templates/desktop/other-nav/other-nav.component";
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
    BackgroundAnimationComponent,
    NavbarComponent,
    SideBarComponent,
    ExpandableIconComponent
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy
{
  update: boolean = false;
  screenSize!: string;
  displayPageName: boolean = false;
  columnStart: number = 3;
  columnStartNav: number = 1;
  colSpan: number = 4;
  isSidebarOpen: boolean = false;
  protected displaySideBar: boolean = false;
  protected isAuthRoute: boolean = false;
  protected isCallbackRoute: boolean = false;
  // Mood Service Variables
  currentMood!: string;
  moodComponentClasses!: { [key: string]: string };
  backgroundMoodClasses!: { [key: string]: string };
  isLoggedIn$!: Observable<boolean>;
  isSideBarHidden!: boolean; // Declare Input

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private screenSizeService: ScreenSizeService,
    private providerService: ProviderService,
    private updates: SwUpdate,
    public moodService: MoodService,
    private authService: AuthService,
    private playerStateService: PlayerStateService,
    @Inject(PLATFORM_ID) private platformId: Object
  )
  {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    updates.versionUpdates.subscribe(event =>
    {
      if (event.type === "VERSION_READY")
      {
        updates.activateUpdate().then(() =>
        {
          this.update = true;
          document.location.reload();
        });
      }
    });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) =>
    {
      this.isAuthRoute = ["/login", "/register"].includes(event.urlAfterRedirects);
      this.isCallbackRoute = ["/auth/callback"].includes(event.urlAfterRedirects);
    });
  }

  async ngOnInit()
  {
    window.addEventListener('beforeunload', this.handleTabClose);
    this.screenSizeService.screenSize$.subscribe(screenSize =>
    {
      this.screenSize = screenSize;
    });

    // Handle OAuth login and redirect to /auth/callback
    const url = window.location.href;
    if (url.includes("access_token")) {
      const fragment = url.split("#")[1];  // Get everything after #
      this.router.navigate(['auth/callback'], { fragment });
    }
  }

  // Handle the browser tab close event
  handleTabClose = (event: BeforeUnloadEvent) => {
    this.authService.signOut().subscribe({
      next: (response) => {
        console.log('User signed out successfully on tab close');
      },
      error: (error) => {
        console.error('Error during sign out on tab close:', error);
      }
    });
  }

  async ngAfterViewInit()
  {
    this.playerStateService.setReady();
  }

  isCurrentRouteAuth(): boolean
  {
    return ["/login", "/register", "/Auth/callback"].includes(this.router.url);
  }

  layout(isSidebarOpen: boolean) {
    this.isSidebarOpen = isSidebarOpen;
    this.columnStart = isSidebarOpen ? 1 : 3;
    this.colSpan = isSidebarOpen ? 5 : 4;
  }

  isReady(): boolean
  {
    if (isPlatformBrowser(this.platformId))
      return this.playerStateService.isReady();
    return false;
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.handleTabClose);
  }


  toggleSideBar() {
    this.isSideBarHidden = !this.isSideBarHidden;
    this.layout(this.isSideBarHidden);
  }


}

