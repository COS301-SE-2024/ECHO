import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private _currentMood: string = 'Neutral'; // Default mood set to 'Neutral'
  private _moodClasses = {
    Anger:      'bg-anger text-anger-text hover:bg-anger-dark focus:ring-anger-dark',
    Admiration: 'bg-admiration text-admiration-text hover:bg-admiration-dark ',
    Fear:       'bg-purple-300',
    Joy:        'bg-pink-300',
    Neutral:    'bg-default text-default-text hover:bg-default-dark focus:ring-default-dark',
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
