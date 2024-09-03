import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ProviderService } from '../../../services/provider.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-profile-atomic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileAtomicComponent implements AfterViewInit {
  username!: string;
  imgpath: string = "assets/images/back.jpg";

  constructor(
    private authService: AuthService,
    private providerService: ProviderService,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  async ngAfterViewInit(): Promise<void>
  {
    if (this.providerService.getProviderName() === "spotify")
    {
      (await this.authService.currentUser()).subscribe((res) =>
      {
        this.imgpath = res.user.user_metadata.picture;
      });
    }
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
