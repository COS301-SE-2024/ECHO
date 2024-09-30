import { Component } from "@angular/core";
import { ProviderService } from "../../../services/provider.service";

@Component({
  selector: "app-spotify-login",
  standalone: true,
  imports: [],
  templateUrl: "./spotify-login.component.html",
  styleUrl: "./spotify-login.component.css"
})
export class SpotifyLoginComponent {

  constructor(private providerService: ProviderService) {
  }

  loginWithSpotify() {
    this.providerService.setProviderName("spotify");
    console.log("Logging in with Spotify");
  }
}
