import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import  {LandingPageComponent}  from './pages/landing-page/landing-page.component';
import { MatSidenavModule } from '@angular/material/sidenav';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Echo';
}
