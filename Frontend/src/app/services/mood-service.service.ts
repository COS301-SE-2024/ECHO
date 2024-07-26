import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private _currentMood!: string;
     private _componentMoodClassesHover = {
      Neutral:     'bg-default-component text-default-text dark:hover:bg-default-dark focus:ring-default-dark fill-default',
      Anger:       'bg-anger text-anger-text dark:hover:bg-anger-dark focus:ring-anger-dark fill-anger-dark',
      Admiration:  'bg-admiration text-admiration-text dark:hover:bg-admiration-dark focus:ring-admiration-dark hover:text-admiration fill-admiration-dark',
      Fear:        'bg-fear text-fear-text dark:hover:bg-fear-dark focus:ring-fear-dark fill-fear-dark',
      Joy:         'bg-joy text-joy-text dark:hover:bg-joy-dark focus:ring-joy-dark hover:text-joy fill-joy-dark',
      Amusement:   'bg-amusement text-amusement-text dark:hover:bg-amusement-dark focus:ring-amusement-dark fill-amusement-dark',
      Annoyance:   'bg-annoyance text-annoyance-text dark:hover:bg-annoyance-dark focus:ring-annoyance-dark fill-annoyance-dark',
      Approval:    'bg-approval text-approval-text dark:hover:bg-approval-dark focus:ring-approval-dark fill-approval-dark',
      Caring:      'bg-caring text-caring-text dark:hover:bg-caring-dark focus:ring-caring-dark fill-caring-dark',
      Confusion:   'bg-confusion text-confusion-text dark:hover:bg-confusion-dark focus:ring-confusion-dark fill-confusion-dark',
      Curiosity:   'bg-curiosity text-curiosity-text dark:hover:bg-curiosity-dark focus:ring-curiosity-dark fill-curiosity-dark',
      Desire:      'bg-desire text-desire-text dark:hover:bg-desire-dark focus:ring-desire-dark fill-desire-dark',
      Disappointment: 'bg-disappointment text-disappointment-text dark:hover:bg-disappointment-dark focus:ring-disappointment-dark fill-disappointment-dark',
      Disapproval: 'bg-disapproval text-disapproval-text dark:hover:bg-disapproval-dark focus:ring-disapproval-dark fill-disapproval-dark',
      Disgust:     'bg-disgust text-disgust-text dark:hover:bg-disgust-dark focus:ring-disgust-dark fill-disgust-dark',
      Embarrassment: 'bg-embarrassment text-embarrassment-text dark:hover:bg-embarrassment-dark focus:ring-embarrassment-dark fill-embarrassment-dark',
      Excitement:  'bg-excitement text-excitement-text dark:hover:bg-excitement-dark focus:ring-excitement-dark fill-excitement-dark',
      Gratitude:   'bg-gratitude text-gratitude-text dark:hover:bg-gratitude-dark focus:ring-gratitude-dark fill-gratitude-dark',
      Grief:       'bg-grief text-grief-text dark:hover:bg-grief-dark focus:ring-grief-dark fill-grief-dark',
      Love:        'bg-love text-love-text dark:hover:bg-love-dark focus:ring-love-dark fill-love-dark',
      Nervousness: 'bg-nervousness text-nervousness-text dark:hover:bg-nervousness-dark focus:ring-nervousness-dark fill-nervousness-dark',
      Optimism:    'bg-optimism text-optimism-text dark:hover:bg-optimism-dark focus:ring-optimism-dark fill-optimism-dark',
      Pride:       'bg-pride text-pride-text dark:hover:bg-pride-dark focus:ring-pride-dark fill-pride-dark',
      Realisation: 'bg-realisation text-realisation-text dark:hover:bg-realisation-dark focus:ring-realisation-dark fill-realisation-dark',
      Relief:      'bg-relief text-relief-text dark:hover:bg-relief-dark focus:ring-relief-dark fill-relief-dark',
      Remorse:     'bg-remorse text-remorse-text dark:hover:bg-remorse-dark focus:ring-remorse-dark fill-remorse-dark',
      Sadness:     'bg-sadness text-sadness-text dark:hover:bg-sadness-dark focus:ring-sadness-dark fill-sadness-dark',
      Surprise:    'bg-surprise text-surprise-text dark:hover:bg-surprise-dark focus:ring-surprise-dark fill-surprise-dark',
  };

    private _componentMoodClasses = {
      Neutral:     'bg-default-component text-default-text focus:ring-default-dark fill-default',
      Anger:       'bg-anger text-anger-text  focus:ring-anger-dark fill-anger-dark',
      Admiration:  'bg-admiration text-admiration-text  focus:ring-admiration-dark  fill-admiration-dark',
      Fear:        'bg-fear text-fear-text  focus:ring-fear-dark fill-fear-dark',
      Joy:         'bg-joy text-joy-text  focus:ring-joy-dark  fill-joy-dark',
      Amusement:   'bg-amusement text-amusement-text  focus:ring-amusement-dark fill-amusement-dark',
      Annoyance:   'bg-annoyance text-annoyance-text  focus:ring-annoyance-dark fill-annoyance-dark',
      Approval:    'bg-approval text-approval-text  focus:ring-approval-dark fill-approval-dark',
      Caring:      'bg-caring text-caring-text  focus:ring-caring-dark fill-caring-dark',
      Confusion:   'bg-confusion text-confusion-text  focus:ring-confusion-dark fill-confusion-dark',
      Curiosity:   'bg-curiosity text-curiosity-text  focus:ring-curiosity-dark fill-curiosity-dark',
      Desire:      'bg-desire text-desire-text  focus:ring-desire-dark fill-desire-dark',
      Disappointment: 'bg-disappointment text-disappointment-text  focus:ring-disappointment-dark fill-disappointment-dark',
      Disapproval: 'bg-disapproval text-disapproval-text focus:ring-disapproval-dark fill-disapproval-dark',
      Disgust:     'bg-disgust text-disgust-text  focus:ring-disgust-dark fill-disgust-dark',
      Embarrassment: 'bg-embarrassment text-embarrassment-text  focus:ring-embarrassment-dark fill-embarrassment-dark',
      Excitement:  'bg-excitement text-excitement-text  focus:ring-excitement-dark fill-excitement-dark',
      Gratitude:   'bg-gratitude text-gratitude-text  focus:ring-gratitude-dark fill-gratitude-dark',
      Grief:       'bg-grief text-grief-text  focus:ring-grief-dark fill-grief-dark',
      Love:        'bg-love text-love-text  focus:ring-love-dark fill-love-dark',
      Nervousness: 'bg-nervousness text-nervousness-text  focus:ring-nervousness-dark fill-nervousness-dark',
      Optimism:    'bg-optimism text-optimism-text  focus:ring-optimism-dark fill-optimism-dark',
      Pride:       'bg-pride text-pride-text  focus:ring-pride-dark fill-pride-dark',
      Realisation: 'bg-realisation text-realisation-text  focus:ring-realisation-dark fill-realisation-dark',
      Relief:      'bg-relief text-relief-text  focus:ring-relief-dark fill-relief-dark',
      Remorse:     'bg-remorse text-remorse-text  focus:ring-remorse-dark fill-remorse-dark',
      Sadness:     'bg-sadness text-sadness-text  focus:ring-sadness-dark fill-sadness-dark',
      Surprise:    'bg-surprise text-surprise-text  focus:ring-surprise-dark fill-surprise-dark',
  };
  private _MoodClassesDark = {
    Anger:       'dark:bg-anger-dark',
    Admiration:  'dark:bg-admiration-dark',
    Fear:        'dark:bg-fear-dark',
    Joy:         'dark:bg-joy-dark',
    Neutral:     'dark:bg-default-dark',
    Amusement:   'dark:bg-amusement-dark',
    Annoyance:   'dark:bg-annoyance-dark',
    Approval:    'dark:bg-approval-dark',
    Caring:      'dark:bg-caring-dark',
    Confusion:   'dark:bg-confusion-dark',
    Curiosity:   'dark:bg-curiosity-dark',
    Desire:      'dark:bg-desire-dark',
    Disappointment: 'dark:bg-disappointment-dark',
    Disapproval: 'dark:bg-disapproval-dark',
    Disgust:     'dark:bg-disgust-dark',
    Embarrassment: 'dark:bg-embarrassment-dark',
    Excitement:  'dark:bg-excitement-dark',
    Gratitude:   'dark:bg-gratitude-dark',
    Grief:       'dark:bg-grief-dark',
    Love:        'dark:bg-love-dark',
    Nervousness: 'dark:bg-nervousness-dark',
    Optimism:    'dark:bg-optimism-dark',
    Pride:       'dark:bg-pride-dark',
    Realisation: 'dark:bg-realisation-dark',
    Relief:      'dark:bg-relief-dark',
    Remorse:     'dark:bg-remorse-dark',
    Sadness:     'dark:bg-sadness-dark',
    Surprise:    'dark:bg-surprise-dark',
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
  getComponentMoodClassesHover(): { [key: string]: string } {
    return this._componentMoodClassesHover;
  }
  getComponentMoodClassesDark(): { [key: string]: string } {
    return this._MoodClassesDark
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