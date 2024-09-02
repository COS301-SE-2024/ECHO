import { Component, HostListener } from '@angular/core';
import { NavbarComponent } from './../../../organisms/navbar/navbar.component';
import { InfoIconComponent } from './../../../organisms/info-icon/info-icon.component';
import { ProfileAtomicComponent } from './../../../organisms/profile/profile.component';
import { MoodDropDownComponent } from './../../../organisms/mood-drop-down/mood-drop-down.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-other-nav',
  standalone: true,
  imports: [
    NavbarComponent,
    InfoIconComponent,
    ProfileAtomicComponent,
    MoodDropDownComponent,
    CommonModule
  ],
  templateUrl: './other-nav.component.html',
  styleUrl: './other-nav.component.css'
})

export class OtherNavComponent {
  isDropdownOpen = false;

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
}
