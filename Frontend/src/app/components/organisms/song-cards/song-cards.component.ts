import { Component, Input, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProviderService } from "../../../services/provider.service";
import { SpotifyService } from "../../../services/spotify.service";
import { SvgIconComponent } from "../../atoms/svg-icon/svg-icon.component";
import { EchoButtonComponent } from "../../atoms/echo-button/echo-button.component";
import { Router } from "@angular/router";
import { MoodService } from "../../../services/mood-service.service";
import { YouTubeService } from "../../../services/youtube.service";
import { PlayIconComponent } from "../play-icon/play-icon.component";

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

@Component({
  selector: "app-song-cards",
  standalone: true,
  imports: [CommonModule, SvgIconComponent, EchoButtonComponent, PlayIconComponent],
  templateUrl: "./song-cards.component.html",
  styleUrls: ["./song-cards.component.css"]
})

export class SongCardsComponent
{
  @Input() card: any;
  @Input() imgSize: string = "100px"; // Default image size
  @Input() svgSize: string = "100px"; // Default image size
  @Output() echoTrackEvent = new EventEmitter<{ trackName: string, artistName: string, event: MouseEvent }>();
  moodComponentClasses!: { [key: string]: string };
  echoTracks: any[] = [];
  isEchoModalVisible: boolean = false;

  constructor(
    private providerService: ProviderService,
    private spotifyService: SpotifyService,
    private youtubeService: YouTubeService,
    private router: Router,
    public moodService: MoodService
  )
  {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();

  }

  onEchoButtonClick(event: MouseEvent)
  {
    event.stopPropagation();
    this.router.navigate(["/echo Song"], {
      queryParams: {
        trackName: this.card.text,
        artistName: this.card.secondaryText
      }
    });
  }

  async playTrack(trackId: string, trackName: string, trackArtist: string): Promise<void>
  {
    if (/^[A-Za-z0-9]{22}$/.test(trackId))
    {
      await this.spotifyService.playTrackById(await this.spotifyService.getTrackDetailsByName(trackName, trackArtist).then((track) => track.id));
    }
    else if (/^[A-Za-z0-9_-]{11}$/.test(trackId))
    {
      await this.youtubeService.playTrackById(trackId);
    }
    else
    {
      if (this.providerService.getProviderName() === "spotify")
      {
        await this.spotifyService.playTrackById(await this.spotifyService.getTrackDetailsByName(trackName, trackArtist).then((track) => track.id));
      }
      else
      {
        await this.youtubeService.playTrackById((await this.youtubeService.getTrackByName(trackName, trackArtist)).id);
      }
    }
  }

}
