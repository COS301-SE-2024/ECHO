import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {CommonModule} from '@angular/common';
@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css'
})
export class BottomNavComponent {
  selectedIndex:string = 'home';
  constructor(private router: Router) {}

  selectedIndexChanged(index: string){
    this.selectedIndex = index;
  }

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
