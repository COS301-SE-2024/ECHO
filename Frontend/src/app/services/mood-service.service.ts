import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private _currentMood!: string;

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
    this.initMood();
  }

  private initMood(): void {
    if (typeof window !== 'undefined') {
      this._currentMood = this.getLocalStorageItem('currentMood') || 'Neutral';
    } 
  }

  private getLocalStorageItem(key: string): string | null {
    if (typeof localStorage === 'undefined') {
      console.error('localStorage is not available in this environment.');
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing local storage:', error);
      return null; // Fallback or alternative logic here
    }
  }
  private setLocalStorageItem(key: string, value: string): void {
    if (typeof localStorage === 'undefined') {
      console.error('localStorage is not available in this environment.');
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting local storage item:', error);
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
    this.setLocalStorageItem('currentMood', mood);
  }
}