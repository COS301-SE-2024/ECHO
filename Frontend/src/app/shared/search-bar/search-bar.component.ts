import { Component } from '@angular/core';
import { ScreenSizeService } from '../../services/screen-size-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  screenSize?: string;
  searchQuery:string = '';
  constructor(private screenSizeService: ScreenSizeService) {}

  ngOnInit() {
    this.screenSizeService.screenSize$.subscribe(screenSize => {
      this.screenSize = screenSize;
    });
  }
  onSearchSubmit() {
    console.log('Searching for:', this.searchQuery);
  }

}
