import { Component} from "@angular/core";
import { ProviderService } from "../../services/provider.service";
import { AuthService } from "../../services/auth.service";


@Component({
  selector: 'app-google-login',
  standalone: true,
  templateUrl: './google-login.component.html',
  styleUrl: './google-login.component.css'
})
export class GoogleLoginComponent {

  constructor(private providerService: ProviderService, private authService: AuthService) {
  }

  async loginWithGoogle() {
    this.providerService.setProviderName('google');

    try {
      await this.authService.signInWithOAuth();
    } catch (error) {
      console.error('Error signing in with OAuth:', error);
    }
  }
}
