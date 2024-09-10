import { Component, HostListener, AfterViewInit } from '@angular/core';
import { NavbarComponent } from './../../../organisms/navbar/navbar.component';
import { InfoIconComponent } from './../../../organisms/info-icon/info-icon.component';
import { ProfileAtomicComponent } from './../../../organisms/profile/profile.component';
import { MoodDropDownComponent } from './../../../organisms/mood-drop-down/mood-drop-down.component';
import { SearchBarComponent } from '../../../molecules/search-bar/search-bar.component';
import { SpotifyService } from '../../../../services/spotify.service';
import { ProviderService } from '../../../../services/provider.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-other-nav',
  standalone: true,
  imports: [
    NavbarComponent,
    InfoIconComponent,
    ProfileAtomicComponent,
    MoodDropDownComponent,
    CommonModule,
    RouterModule,
    SearchBarComponent
  ],
  templateUrl: './other-nav.component.html',
  styleUrls: ['./other-nav.component.css']
})
export class OtherNavComponent implements AfterViewInit {
  username: string = "";
  isDropdownOpen = false;

  constructor(
    private authService: AuthService,
    private spotifyService: SpotifyService,
    private providerService: ProviderService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    if (this.providerService.getProviderName() === "spotify") {
      this.authService.currentUser().subscribe((res) => {
        this.username = res.user.user_metadata.name;
      });
    }
  }

  toggleDropdown(): void {
    console.log('Profile picture clicked. Toggling dropdown...');
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('Dropdown open:', this.isDropdownOpen);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const dropdownButton = document.getElementById('dropdownInformationButton');

    if (dropdownButton && !dropdownButton.contains(targetElement)) {
      this.isDropdownOpen = false;
    }
  }

  signOut(): void {
    this.authService.signOut().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error signing out:', error);
      }
    });
  }
}