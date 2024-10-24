import { Component, Input, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { MoodService } from "../../../services/mood-service.service";
import { YouTubeService } from "../../../services/youtube.service";
import { ProviderService } from "../../../services/provider.service";
import { SpotifyService } from "../../../services/spotify.service";
import { SearchService, TrackInfo } from "../../../services/search.service";
import { PlayIconComponent } from "../../organisms/play-icon/play-icon.component";

@Component({
  selector: "app-song-view",
  standalone: true,
  templateUrl: "./song-view.component.html",
  styleUrls: ["./song-view.component.css"],
  imports: [CommonModule, PlayIconComponent]
})
export class SongViewComponent implements OnInit
{
  text!: string; // trackName
  secondaryText!: string; // artistName
  imageUrl!: string; // imageUrl
  selectedSong: TrackInfo | null = null;
  isExpanded: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SongViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { text: string, secondaryText: string, imageUrl: string },
    public moodService: MoodService,
    private providerService: ProviderService,
    private spotifyService: SpotifyService,
    private youtubeService: YouTubeService,
    private searchService: SearchService
  )
  {
    this.text = data.text;
    this.secondaryText = data.secondaryText;
    this.imageUrl = data.imageUrl;
  }

  ngOnInit(): void
  {
    this.fetchTrackDetails();
  }

  async fetchTrackDetails(): Promise<void>
  {
    try
    {
      const searchQuery = `${this.secondaryText} - ${this.text}`;
      await this.searchService.storeSearch(searchQuery).toPromise();
      const result = await this.searchService.getTopResult().toPromise();
      this.selectedSong = result ?? null;
    }
    catch (error)
    {
      console.error("Error fetching track details:", error);
    }
  }

  async playTrack(trackId: string): Promise<void>
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      await this.spotifyService.playTrackById(trackId);
    }
    else
    {
      await this.youtubeService.playTrackById(trackId);
    }
  }

  closeModal()
  {
    this.dialogRef.close();
  }

  toggleSimilarSongs()
  {
    this.isExpanded = !this.isExpanded;
  }
}
