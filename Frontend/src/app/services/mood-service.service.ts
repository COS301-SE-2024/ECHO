import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private _currentMood: string = 'Neutral'; // Default mood set to 'Neutral'
  private _moodClasses = {
    Anger: 'bg-anger ',
    Admiration: 'bg-admiration hover:bg-admiration-dark text-black',
    Fear: 'bg-purple-300',
    Joy: 'bg-pink-300',
    Neutral: 'bg-pink text-white hover:bg-pink-dark',
  };

  getMoodClasses(): { [key: string]: string } {
    return this._moodClasses;
  }

  getCurrentMood(): string {
    return this._currentMood;
  }

  setCurrentMood(mood: string): void {
    this._currentMood = mood;
  }
}
