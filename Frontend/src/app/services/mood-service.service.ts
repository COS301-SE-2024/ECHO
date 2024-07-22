import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private _currentMood: string = 'Neutral'; // Default mood set to 'Neutral'
  private _componentMoodClasses = {
    Anger:      'dark:bg-anger text-anger-text hover:bg-anger-dark focus:ring-anger-dark fill-anger ',
    Admiration: 'bg-admiration text-admiration-text hover:bg-admiration-dark focus:ring-admiration-dark hover:text-admiration fill-admiration',
    Fear:       'bg-fear text-fear-text hover:bg-fear-dark focus:ring-fear-dark fill-fear',
    Joy:        'bg-joy text-joy-text hover:bg-joy-dark focus:ring-joy-dark hover:text-joy hover:text-joy fill-joy',
    Neutral:    'dark:bg-default text-default-text hover:bg-default-dark focus:ring-default-dark fill-default ',
  };
  private _backgroundMoodClasses = {
    Anger:      'dark:bg-anger-background ',
    Admiration: 'dark:bg-admiration-background  ',
    Fear:       'dark:bg-fear-background  ',
    Joy:        'dark:bg-joy-background  ',
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
