import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private _currentMood: string = 'Neutral'; // Default mood set to 'Neutral'
  private _componentMoodClasses = {
    Anger:      'bg-anger text-anger-text hover:bg-anger-dark focus:ring-anger-dark',
    Admiration: 'bg-admiration text-admiration-text hover:bg-admiration-dark focus:ring-admiration-dark',
    Fear:       'bg-purple-300',
    Joy:        'bg-pink-300',
    Neutral:    'bg-default text-default-text hover:bg-default-dark focus:ring-default-dark',
  };
  private _backgroundMoodClasses = {
    Anger:      'bg-anger',
    Admiration: 'bg-admiration',
    Fear:       'bg-purple-300',
    Joy:        'bg-pink-300',
    Neutral:    'dark:bg-default-background',
  };

  getComponentMoodClasses(): { [key: string]: string } {
    return this._componentMoodClasses;
  }
  getBackgroundMoodClasses(): { [key: string]: string } {
    return this._backgroundMoodClasses;
  }
  //get the mood 
  getCurrentMood(): string {
    return this._currentMood;
  }
  //Set the mood 
  setCurrentMood(mood: string): void {
    this._currentMood = mood;
  }
}
