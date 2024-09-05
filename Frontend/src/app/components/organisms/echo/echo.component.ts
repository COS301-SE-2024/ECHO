import { Component, OnInit,ViewChild,Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SongCardsComponent } from "../song-cards/song-cards.component";
import { SearchService } from "../../../services/search.service";
import { PageTitleComponent } from '../../atoms/page-title/page-title.component';
import { SkeletonSongCardComponent } from '../../atoms/skeleton-song-card/skeleton-song-card.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-echo',
  standalone: true,
  imports: [CommonModule, SongCardsComponent, PageTitleComponent, SkeletonSongCardComponent,ToastComponent],
  templateUrl: './echo.component.html',
  styleUrls: ['./echo.component.css']
})
export class EchoComponent implements OnInit {
  @Input() echoedName?: string;
  @Input() echoedArtist?: string;
  @Input() imgSize: string = '100px'; 
  @ViewChild(ToastComponent) toastComponent!: ToastComponent; // Declare ToastComponent
  echoTracks: any[] = [];
  skeletonArray = Array(20);
  isLoading: boolean = false;

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.echoedName = params["trackName"];
      this.echoedArtist = params["artistName"];
      if (this.echoedName && this.echoedArtist) {
        this.echoTrack(this.echoedName, this.echoedArtist);
      } else {
        this.isLoading = false; // Stop loading if no track or artist name is provided
      }
    });
  }

  async echoTrack(trackName: string, artistName: string, event?: MouseEvent): Promise<void> {
    if (event) {
      event.stopPropagation();
    }
    this.isLoading = true; // Start loading
    this.echoTracks= [];
    try {
      this.echoTracks = await this.searchService.echo(trackName, artistName);
    } catch (error) {
      console.error("Error echoing track: ", error);
      this.toastComponent.showToast("Error echoing track", "error"); // Show error toast
    } finally {
      this.isLoading = false; // Stop loading
    }
  }
}