import { Component } from '@angular/core';
import { NavbarComponent } from './../../../organisms/navbar/navbar.component';
import { SideBarComponent } from './../../../organisms/side-bar/side-bar.component';
import { CommonModule} from "@angular/common";
import { AuthService } from "../../../../services/auth.service";
import { ProviderService } from "../../../../services/provider.service";

@Component({
  selector: 'app-left',
  standalone: true,
  imports: [NavbarComponent, SideBarComponent, CommonModule],
  templateUrl: './left.component.html',
  styleUrl: './left.component.css'
})
export class LeftComponent {
  constructor(private authService: AuthService, private providerService: ProviderService){}
  //Check whether the app is ready to load data from Spotify
  async ready()
  {
    if (this.providerService.getProviderName() === 'spotify')
    {
      return await this.authService.isReady();
    }
    return false;
  }

}
