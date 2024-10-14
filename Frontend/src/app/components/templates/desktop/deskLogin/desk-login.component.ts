import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { SpotifyLoginComponent } from "../../../../components/organisms/spotify-login/spotify-login.component";
import { AuthService } from "../../../../services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ToastComponent } from "../../../../components/organisms/toast/toast.component";
import { CommonModule } from "@angular/common";
import { GoogleLoginComponent } from "../../../../components/organisms/google-login/google-login.component";
import { AppleLoginComponent } from "../../../../components/organisms/apple-login/apple-login.component";
import { ProviderService } from "../../../../services/provider.service";
import { YouTubeService } from "../../../../services/youtube.service";
import { ToolTipComponent } from "../../../atoms/tool-tip/tool-tip.component";

@Component({
  selector: "app-desk-login",
  standalone: true,
  imports: [CommonModule, FormsModule, SpotifyLoginComponent, ToastComponent, GoogleLoginComponent, AppleLoginComponent,ToolTipComponent],
  templateUrl: "./desk-login.component.html",
  styleUrl: "./desk-login.component.css"
})
export class DeskLoginComponent implements OnInit
{
  email: string = "";
  password: string = "";
  username: string = "";
  showModal: boolean = false;
  showAboutModal: boolean = false;
  showContactModal: boolean = false;
  showPrivacyModal: boolean = false;

  @ViewChild(ToastComponent) toastComponent!: ToastComponent;

  constructor(
    private authService: AuthService,
    private router: Router,
    private providerService: ProviderService,
    private youtubeService: YouTubeService
  )
  {
  }

  ngOnInit(): void
  {

  }

  async spotify()
  {
    if (typeof window !== "undefined")
    {
      await this.authService.signInWithOAuth();
    }
  }

  navigateToRegister()
  {
    this.router.navigate(["/register"]);
  }

  login()
  {
    if (!this.email || !this.password)
    {
      this.toastComponent.showToast("Email and password are required", "error");
      return;
    }

    const loginButton = document.querySelector("button[type=\"submit\"]");
    loginButton?.setAttribute("disabled", "true");

    this.authService.signIn(this.email, this.password).subscribe(
      response =>
      {
        if (response && response.user)
        {
          localStorage.setItem("username", this.email);
          this.toastComponent.showToast("User logged in successfully", "success");
          setTimeout(async () =>
          {
            await this.youtubeService.init();
          }, 1000);
        }
        else
        {
          this.toastComponent.showToast("Invalid username or password", "info");
        }
        loginButton?.removeAttribute("disabled");
      },
      error =>
      {
        console.error("Error logging in user", error);
        this.toastComponent.showToast("There was an issue logging in", "error");
        loginButton?.removeAttribute("disabled");
      }
    );
  }

  toggleModal(): void
  {
    this.showModal = !this.showModal;
  }

  toggleAboutModal(): void
  {
    this.showAboutModal = !this.showAboutModal;
  }

  toggleContactModal(): void
  {
    this.showContactModal = !this.showContactModal;
  }

  togglePrivacyModal(): void
  {
    this.showPrivacyModal = !this.showPrivacyModal;
  }

  closeModal(): void
  {
    this.showModal = false;
    this.showAboutModal = false;
    this.showContactModal = false;
    this.showPrivacyModal = false;
  }

  async google()
  {
    await this.youtubeService.init();
    this.providerService.setProviderName("google");
  }
}

