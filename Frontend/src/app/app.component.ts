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
import { MoodService} from "./services/mood-service.service";
import { NavbarComponent } from './shared/navbar/navbar.component';

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
    NavbarComponent
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit
{
  title = "Echo";
  update: boolean = false;
  screenSize?: string;
  showPlayer = false;
  displayPlayer = false;
  displaySideBar = false;
  currentPage: string = "";
  displayPageName: boolean = false;
   //Mood Service Variables
   currentMood!: string;
   moodComponentClasses!:{ [key: string]: string };
   backgroundMoodClasses!:{ [key: string]: string };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private screenSizeService: ScreenSizeService,
    private providerService: ProviderService,
    private updates: SwUpdate,
    public moodService: MoodService
  ){
    this.currentMood = this.moodService.getCurrentMood();
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.displaySideBar = ['/home', '/profile', '/mood', '/home#','home#search', '/home#search','home#home', '/home#home', 'home#library', '/home#library'].includes(event.urlAfterRedirects);
        this.displayPlayer = ['/settings'].includes(event.urlAfterRedirects);
        this.showPlayer = ['/home', '/profile',  '/mood', 'artist-profile',"/search", '/home#','home#home', '/home#home','home#search', 'home#library', '/home#library','/home#insight'].includes(event.urlAfterRedirects);
        switch (event.urlAfterRedirects) {
          case '/home':
            this.currentPage = 'Home';
            this.displayPageName = true;
            break;
          case '/home#search':
            this.currentPage = 'Search';
            this.displayPageName = true;
            break;
          case '/home#library':
            this.currentPage = 'Library';
            this.displayPageName = true;
            break;
          case '/home#insight':
            this.currentPage = 'Insight';
            this.displayPageName = true;
            break;
          case "/home#home":
            this.currentPage = 'Home';
            this.displayPageName = true;
            break;
          case '/profile':
            this.currentPage = 'Profile';
            this.displayPageName = false;
            break;
          case '/settings':
            this.currentPage = 'Settings';
            this.displayPageName = true;
            break;
          case '/search':
            this.currentPage = 'Search';
            this.displayPageName = true;
            break;
          default:
            this.currentPage = '';
            this.displayPageName = false;
        }
      }
    });
    
    updates.versionUpdates.subscribe(event =>
    {
      if (event.type === "VERSION_READY")
      {
        console.log("Version ready to install:");
        updates.activateUpdate().then(() =>
        {
          this.update = true;
          document.location.reload();
        });
      }
    });
  }
  onNavChange(newNav: string) {
    this.title = newNav;
    this.router.navigate(['/home'], { fragment: newNav.toLowerCase() });
}
  async ngOnInit()
  {
    this.screenSizeService.screenSize$.subscribe(screenSize =>
    {
      this.screenSize = screenSize;
    });
  }
  isAuthRoute(): boolean {
    const authRoutes = ['/login', '/register'];
    return authRoutes.includes(this.router.url);
  }
  handleRouteChange(url: string)
  {
    const [path, fragment] = url.split("#");

    this.displaySideBar = ["/home", "home", "insight", "library", "/profile", "/mood"].includes(path);
    this.displayPlayer = ["/settings"].includes(path);
    this.showPlayer = ["/home", "/profile", "home", "insight", "library", "/mood"].includes(path);

    switch (path)
    {
      case "/home":
        this.currentPage = fragment === "search" ? "Search" :
          fragment === "library" ? "Library" :
            fragment === "insight" ? "Insight" : "Home";
        this.displayPageName = true;
        break;
      case "/profile":
        this.currentPage = "Profile";
        this.displayPageName = false;
        break;
      case "/settings":
        this.currentPage = "Settings";
        this.displayPageName = true;
        break;
      default:
        this.currentPage = "";
        this.displayPageName = false;
    }
  }
}
