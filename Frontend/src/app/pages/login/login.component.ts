import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { SpotifyLoginComponent } from '../../components/organisms/spotify-login/spotify-login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../components/organisms/toast/toast.component';
import { CommonModule } from '@angular/common';
import { GoogleLoginComponent } from "../../components/organisms/google-login/google-login.component";
import { AppleLoginComponent } from "../../components/organisms/apple-login/apple-login.component";
import { ProviderService } from "../../services/provider.service";
import { YouTubeService } from "../../services/youtube.service";

@Component({
    selector: 'app-login',
    standalone: true,
  imports: [CommonModule, FormsModule, SpotifyLoginComponent, ToastComponent, GoogleLoginComponent, AppleLoginComponent],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent  {
}