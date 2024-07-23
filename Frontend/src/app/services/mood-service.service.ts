import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  private _currentMood: string; // No default initialization here

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
  
  constructor() {
    // Check if running in a browser environment
    if (typeof window !== 'undefined') {
      // Initialize _currentMood from local storage or set to 'Neutral' if not available
      this._currentMood = localStorage.getItem('currentMood') || 'Neutral';
    } else {
      // Default to 'Neutral' if not running in a browser environment
      this._currentMood = 'Neutral';
    }
  }

  getComponentMoodClasses(): { [key: string]: string } {
    return this._componentMoodClasses;
  }

  getBackgroundMoodClasses(): { [key: string]: string } {
    return this._backgroundMoodClasses;
  }

  getCurrentMood(): string {
    return this._currentMood;
  }

  setCurrentMood(mood: string): void {
    this._currentMood = mood;
    // Update local storage whenever the mood is set
    localStorage.setItem('currentMood', mood);
  }
}