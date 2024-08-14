import { Component, Output, EventEmitter } from '@angular/core';
import { ScreenSizeService } from '../../../services/screen-size-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from "../../../services/search.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  screenSize?: string;
  searchQuery: string = '';

  constructor(
    private screenSizeService: ScreenSizeService,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
  }

  onSearchSubmit() {
    this.searchService.storeSearch(this.searchQuery).subscribe(
      () => {},
      error => console.error('Error performing search:', error)
    );
    this.searchService.storeAlbumSearch(this.searchQuery).subscribe(
      () => {},
      error => console.error('Error performing search:', error)
    );

    // Navigate to the search results page with the search query as a parameter
    this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
  }
}