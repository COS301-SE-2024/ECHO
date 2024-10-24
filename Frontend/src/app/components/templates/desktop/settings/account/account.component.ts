import { Component } from '@angular/core';
import { MoodService } from '../../../../../services/mood-service.service';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [NgClass],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  currentMood!: string;
  currentUser!: string;
  currentPfpPath!: string;
  currentProvider!: string;
  moodComponentClasses!:{ [key: string]: string };
  backgroundMoodClasses!:{ [key: string]: string };

  constructor(
    public moodService: MoodService,
    public authService: AuthService,
  ) {
    this.currentMood = this.moodService.getCurrentMood(); 
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
    this.currentUser = 'John Doe'
    this.authService.currentUser().subscribe((res) => {
      this.currentUser = res.user.user_metadata.name;
      this.currentPfpPath = res.user.user_metadata.picture;
    }); 
    this.authService.checkOAuth().subscribe((res) => {
      console.log(res.currentProvider);
      this.currentProvider = res.currentProvider;
    });
  }

  validProvider() : boolean {
    if(this.currentProvider != 'spotify' && this.currentProvider != 'google')
    {
      return true;
    }
    return false;
  }

  getCurrentUser()
  {

  }

  getLinkedAccounts()
  {
    
  }
}
