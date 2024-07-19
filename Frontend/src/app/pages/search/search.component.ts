import { Component, Input, OnInit } from "@angular/core";
import { NgClass, NgForOf, NgIf, AsyncPipe } from '@angular/common';
import { SearchService, Track } from "../../services/search.service";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgIf, NgForOf, NgClass, AsyncPipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  @Input() searchQuery!: string;
  songs$: Observable<Track[]>;
  albums$: Observable<Track[]>;
  topResult$: Observable<Track>;

  constructor(private searchService: SearchService) {
    this.songs$ = this.searchService.getSearch();
    this.albums$ = this.searchService.getAlbumSearch();
    this.topResult$ = this.searchService.getTopResult();
  }

  ngOnInit() {
  }
}
