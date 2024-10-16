import { Component, HostListener, AfterViewInit } from '@angular/core';
import { NavbarComponent } from './../../../organisms/navbar/navbar.component';
import { InfoIconComponent } from './../../../organisms/info-icon/info-icon.component';
import { ProfileAtomicComponent } from './../../../organisms/profile/profile.component';
import { MoodDropDownComponent } from './../../../organisms/mood-drop-down/mood-drop-down.component';
import { SpotifyService } from '../../../../services/spotify.service';
import { ProviderService } from '../../../../services/provider.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ToolTipComponent } from '../../../atoms/tool-tip/tool-tip.component';

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
    ToolTipComponent
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
  goToChat(): void {
    this.router.navigate(['/chat']);
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
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