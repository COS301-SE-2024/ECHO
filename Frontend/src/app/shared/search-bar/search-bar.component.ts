import { Component, Output, EventEmitter } from '@angular/core';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from "../../services/search.service";

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

  @Output() searchDown = new EventEmitter<string>();

  constructor(
    private screenSizeService: ScreenSizeService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
  }

  onSearchSubmit() {
    console.log('Searching...' + this.searchQuery);
    this.searchDown.emit(this.searchQuery);
    this.searchService.storeSearch(this.searchQuery).subscribe(
      () => {},
      error => console.error('Error performing search:', error)
    );
    this.searchService.storeAlbumSearch(this.searchQuery).subscribe(
      () => {},
      error => console.error('Error performing search:', error)
    );
  }
}
