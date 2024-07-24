import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private _currentMood!: string;

    private _componentMoodClasses = {
      Anger:       'dark:bg-anger text-anger-text hover:bg-anger-dark focus:ring-anger-dark fill-anger',
      Admiration:  'bg-admiration text-admiration-text hover:bg-admiration-dark focus:ring-admiration-dark hover:text-admiration fill-admiration',
      Fear:        'bg-fear text-fear-text hover:bg-fear-dark focus:ring-fear-dark fill-fear',
      Joy:         'bg-joy text-joy-text hover:bg-joy-dark focus:ring-joy-dark hover:text-joy fill-joy',
      Neutral:     'dark:bg-default-component text-default-text dark:hover:bg-default focus:ring-default-dark fill-default',
      Amusement:   'bg-amusement text-amusement-text hover:bg-amusement-dark focus:ring-amusement-dark fill-amusement',
      Annoyance:   'bg-annoyance text-annoyance-text hover:bg-annoyance-dark focus:ring-annoyance-dark fill-annoyance',
      Approval:    'bg-approval text-approval-text hover:bg-approval-dark focus:ring-approval-dark fill-approval',
      Caring:      'bg-caring text-caring-text hover:bg-caring-dark focus:ring-caring-dark fill-caring',
      Confusion:   'bg-confusion text-confusion-text hover:bg-confusion-dark focus:ring-confusion-dark fill-confusion',
      Curiosity:   'bg-curiosity text-curiosity-text hover:bg-curiosity-dark focus:ring-curiosity-dark fill-curiosity',
      Desire:      'bg-desire text-desire-text hover:bg-desire-dark focus:ring-desire-dark fill-desire',
      Disappointment: 'bg-disappointment text-disappointment-text hover:bg-disappointment-dark focus:ring-disappointment-dark fill-disappointment',
      Disapproval: 'bg-disapproval text-disapproval-text hover:bg-disapproval-dark focus:ring-disapproval-dark fill-disapproval',
      Disgust:     'bg-disgust text-disgust-text hover:bg-disgust-dark focus:ring-disgust-dark fill-disgust',
      Embarrassment: 'bg-embarrassment text-embarrassment-text hover:bg-embarrassment-dark focus:ring-embarrassment-dark fill-embarrassment',
      Excitement:  'bg-excitement text-excitement-text hover:bg-excitement-dark focus:ring-excitement-dark fill-excitement',
      Gratitude:   'bg-gratitude text-gratitude-text hover:bg-gratitude-dark focus:ring-gratitude-dark fill-gratitude',
      Grief:       'bg-grief text-grief-text hover:bg-grief-dark focus:ring-grief-dark fill-grief',
      Love:        'bg-love text-love-text hover:bg-love-dark focus:ring-love-dark fill-love',
      Nervousness: 'bg-nervousness text-nervousness-text hover:bg-nervousness-dark focus:ring-nervousness-dark fill-nervousness',
      Optimism:    'bg-optimism text-optimism-text hover:bg-optimism-dark focus:ring-optimism-dark fill-optimism',
      Pride:       'bg-pride text-pride-text hover:bg-pride-dark focus:ring-pride-dark fill-pride',
      Realisation: 'bg-realisation text-realisation-text hover:bg-realisation-dark focus:ring-realisation-dark fill-realisation',
      Relief:      'bg-relief text-relief-text hover:bg-relief-dark focus:ring-relief-dark fill-relief',
      Remorse:     'bg-remorse text-remorse-text hover:bg-remorse-dark focus:ring-remorse-dark fill-remorse',
      Sadness:     'bg-sadness text-sadness-text hover:bg-sadness-dark focus:ring-sadness-dark fill-sadness',
      Surprise:    'bg-surprise text-surprise-text hover:bg-surprise-dark focus:ring-surprise-dark fill-surprise',
  };

  private _backgroundMoodClasses = {
      Anger:       'dark:bg-anger-background',
      Admiration:  'dark:bg-admiration-background',
      Fear:        'dark:bg-fear-background',
      Joy:         'dark:bg-joy-background',
      Neutral:     'dark:bg-default-background',
      Amusement:   'dark:bg-amusement-background',
      Annoyance:   'dark:bg-annoyance-background',
      Approval:    'dark:bg-approval-background',
      Caring:      'dark:bg-caring-background',
      Confusion:   'dark:bg-confusion-background',
      Curiosity:   'dark:bg-curiosity-background',
      Desire:      'dark:bg-desire-background',
      Disappointment: 'dark:bg-disappointment-background',
      Disapproval: 'dark:bg-disapproval-background',
      Disgust:     'dark:bg-disgust-background',
      Embarrassment: 'dark:bg-embarrassment-background',
      Excitement:  'dark:bg-excitement-background',
      Gratitude:   'dark:bg-gratitude-background',
      Grief:       'dark:bg-grief-background',
      Love:        'dark:bg-love-background',
      Nervousness: 'dark:bg-nervousness-background',
      Optimism:    'dark:bg-optimism-background',
      Pride:       'dark:bg-pride-background',
      Realisation: 'dark:bg-realisation-background',
      Relief:      'dark:bg-relief-background',
      Remorse:     'dark:bg-remorse-background',
      Sadness:     'dark:bg-sadness-background',
      Surprise:    'dark:bg-surprise-background',
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
  getAllMoods(): string[] {
    return Object.keys(this._componentMoodClasses);
  }
}