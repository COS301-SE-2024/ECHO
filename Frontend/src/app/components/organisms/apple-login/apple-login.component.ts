import { Component } from "@angular/core";
import { ProviderService } from "../../../services/provider.service";

@Component({
  selector: "app-apple-login",
  standalone: true,
  imports: [],
  templateUrl: "./apple-login.component.html",
  styleUrl: "./apple-login.component.css"
})
export class AppleLoginComponent {

  constructor(private providerService: ProviderService) {
  }

  loginWithApple() {
    this.providerService.setProviderName("apple");
    console.log("Logging in with Apple");
  }
}
