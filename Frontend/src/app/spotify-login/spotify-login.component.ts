import { Component } from '@angular/core';
import { Router} from "express";

@Component({
  selector: 'app-spotify-login',
  standalone: true,
  imports: [],
  templateUrl: './spotify-login.component.html',
  styleUrl: './spotify-login.component.css'
})
export class SpotifyLoginComponent {

  loginWithSpotify() {
    console.log('Logging in with Spotify');
    //Router.navigate(['/spotify-login']);

  }
}
