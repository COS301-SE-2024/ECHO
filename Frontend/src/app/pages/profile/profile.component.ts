import { AfterViewInit, Component } from "@angular/core";
import { CommonModule, NgClass, NgForOf, NgIf } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { EditProfileModalComponent } from "../../components/organisms/edit-profile-modal/edit-profile-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { ScreenSizeService } from "../../services/screen-size-service.service";
import { SpotifyService } from "../../services/spotify.service";
import { ProviderService } from "../../services/provider.service";
import { TopCardComponent } from "../../components/molecules/top-card/top-card.component";
import { MoodService } from "../../services/mood-service.service";
import { SongViewComponent } from "../../components/molecules/song-view/song-view.component";
import { TopArtistCardComponent } from "../../components/molecules/top-artist-card/top-artist-card.component";
import {ProfileAtomicComponent} from '../../components/organisms/profile/profile.component';
@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    MatCard,
    MatCardContent,
    MatButtonModule,
    MatIconModule,
    NgForOf,
    EditProfileModalComponent,
    CommonModule,
    TopCardComponent,
    SongViewComponent,
    TopArtistCardComponent,
    ProfileAtomicComponent,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css"
})
export class ProfileComponent implements AfterViewInit
{
  imgpath: string = "assets/images/back.jpg";
  screenSize?: string;
  //Mood Service Variables
  currentMood!: string;
  moodComponentClasses!: { [key: string]: string };
  backgroundMoodClasses!: { [key: string]: string };

  public topTracks: TrackInfo[] = [];
  public topArtists: ArtistInfo[] = [];

  username: string = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    protected dialog: MatDialog,
    private screenSizeService: ScreenSizeService,
    private spotifyService: SpotifyService,
    private providerService: ProviderService,
    public moodService: MoodService
  )
  {
    this.currentMood = this.moodService.getCurrentMood();
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
  }

  ngAfterViewInit(): void
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      let currUser = this.authService.currentUser().subscribe((res) =>
      {
        this.username = res.user.user_metadata.name;
        this.imgpath = res.user.user_metadata.picture;
      });
      this.getTopArtists();
      this.getTopTracks();
    }
  }

  async ngOnInit()
  {
    this.screenSizeService.screenSize$.subscribe(screenSize =>
    {
      this.screenSize = screenSize;
    });
  }

  onNavChange($event: string)
  {
  }

  save()
  {
    if (localStorage.getItem("path") !== null)
    {
      // @ts-ignore
      this.imgpath = localStorage.getItem("path");
    }
  }

  refresh()
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      this.authService.currentUser().subscribe((res) =>
      {
        this.username = res.user.user_metadata.username;
      });
    }
  }

  settings()
  {
    this.router.navigate(["/settings"]);
  }

  async getTopTracks()
  {
    this.topTracks = await this.spotifyService.getTopTracks();
  }

  async getTopArtists()
  {
    this.topArtists = await this.spotifyService.getTopArtists();
  }

  playTrack(id: string)
  {
    this.spotifyService.playTrackById(id);
  }
}

export interface TrackInfo
{
  id: string;
  text: string;
  albumName: string;
  imageUrl: string;
  secondaryText: string;
  previewUrl: string;
  spotifyUrl: string;
  explicit: boolean;
}

export interface ArtistInfo
{
  id: string;
  name: string;
  imageUrl: string;
  spotifyUrl: string;
}
