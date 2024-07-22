import { Component, Input, OnInit } from "@angular/core";
import { NgClass, NgForOf, NgIf, AsyncPipe } from '@angular/common';
import { SearchService, Track } from "../../services/search.service";
import { Observable } from 'rxjs';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { ThemeService } from './../../services/theme.service';
import { Router } from '@angular/router';
import {NavbarComponent} from "./../../shared/navbar/navbar.component";
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';

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
