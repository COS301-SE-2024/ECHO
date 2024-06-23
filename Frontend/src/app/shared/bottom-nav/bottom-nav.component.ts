import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css'
})
export class BottomNavComponent {
  constructor(private router: Router) {}
  goHome(){
    this.router.navigate(['/home']);
  }
  goSearch(){
    this.router.navigate(['/search']);
  }
  goInsights(){
    this.router.navigate(['/insights']);
  }
  goLibrary(){
    this.router.navigate(['/library']);
  }
}
