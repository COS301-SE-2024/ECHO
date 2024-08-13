import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private _currentMood!: string;
  private colorCache: { [key: string]: string } = {};

     private _componentMoodClassesHover = {
      Neutral:     'bg-default text-default-text hover:bg-default-dark focus:ring-default-dark fill-default font-semibold shadow-sm',
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
      Neutral:     'bg-default-component text-default-text focus:ring-default-dark fill-default transition-colors duration-mood ease-in-out',
      Anger:       'bg-anger text-anger-text  focus:ring-anger-dark fill-anger-dark transition-colors duration-mood ease-in-out',
      Admiration:  'bg-admiration text-admiration-text  focus:ring-admiration-dark fill-admiration-dark transition-colors duration-mood ease-in-out',
      Fear:        'bg-fear text-fear-text  focus:ring-fear-dark fill-fear-dark transition-colors duration-mood ease-in-out',
      Joy:         'bg-joy text-joy-text  focus:ring-joy-dark  fill-joy-dark transition-colors duration-mood ease-in-out',
      Amusement:   'bg-amusement text-amusement-text  focus:ring-amusement-dark fill-amusement-dark transition-colors duration-mood ease-in-out',
      Annoyance:   'bg-annoyance text-annoyance-text  focus:ring-annoyance-dark fill-annoyance-dark transition-colors duration-mood ease-in-out',
      Approval:    'bg-approval text-approval-text  focus:ring-approval-dark fill-approval-dark transition-colors duration-mood ease-in-out',
      Caring:      'bg-caring text-caring-text  focus:ring-caring-dark fill-caring-dark transition-colors duration-mood ease-in-out',
      Confusion:   'bg-confusion text-confusion-text  focus:ring-confusion-dark fill-confusion-dark transition-colors duration-mood ease-in-out',
      Curiosity:   'bg-curiosity text-curiosity-text  focus:ring-curiosity-dark fill-curiosity-dark transition-colors duration-mood ease-in-out',
      Desire:      'bg-desire text-desire-text  focus:ring-desire-dark fill-desire-dark transition-colors duration-mood ease-in-out',
      Disappointment: 'bg-disappointment text-disappointment-text  focus:ring-disappointment-dark fill-disappointment-dark transition-colors duration-mood ease-in-out',
      Disapproval: 'bg-disapproval text-disapproval-text focus:ring-disapproval-dark fill-disapproval-dark transition-colors duration-mood ease-in-out',
      Disgust:     'bg-disgust text-disgust-text  focus:ring-disgust-dark fill-disgust-dark transition-colors duration-mood ease-in-out',
      Embarrassment: 'bg-embarrassment text-embarrassment-text  focus:ring-embarrassment-dark fill-embarrassment-dark transition-colors duration-mood ease-in-out',
      Excitement:  'bg-excitement text-excitement-text  focus:ring-excitement-dark fill-excitement-dark transition-colors duration-mood ease-in-out',
      Gratitude:   'bg-gratitude text-gratitude-text  focus:ring-gratitude-dark fill-gratitude-dark transition-colors duration-mood ease-in-out',
      Grief:       'bg-grief text-grief-text  focus:ring-grief-dark fill-grief-dark transition-colors duration-mood ease-in-out',
      Love:        'bg-love text-love-text  focus:ring-love-dark fill-love-dark transition-colors duration-mood ease-in-out',
      Nervousness: 'bg-nervousness text-nervousness-text  focus:ring-nervousness-dark fill-nervousness-dark transition-colors duration-mood ease-in-out',
      Optimism:    'bg-optimism text-optimism-text  focus:ring-optimism-dark fill-optimism-dark transition-colors duration-mood ease-in-out',
      Pride:       'bg-pride text-pride-text  focus:ring-pride-dark fill-pride-dark transition-colors duration-mood ease-in-out',
      Realisation: 'bg-realisation text-realisation-text  focus:ring-realisation-dark fill-realisation-dark transition-colors duration-mood# ease-in-out',
      Relief:      'bg-relief text-relief-text  focus:ring-relief-dark fill-relief-dark transition-colors duration-mood ease-in-out',
      Remorse:     'bg-remorse text-remorse-text  focus:ring-remorse-dark fill-remorse-dark transition-colors duration-mood ease-in-out',
      Sadness:     'bg-sadness text-sadness-text  focus:ring-sadness-dark fill-sadness-dark transition-colors duration-mood ease-in-out',
      Surprise:    'bg-surprise text-surprise-text  focus:ring-surprise-dark fill-surprise-dark transition-colors duration-mood ease-in-out',
  };
  private _MoodClassesDark = {
    Anger:       'dark:bg-anger-dark transition-colors duration-mood ease-in-out',
    Admiration:  'dark:bg-admiration-dark transition-colors duration-mood ease-in-out',
    Fear:        'dark:bg-fear-dark transition-colors duration-mood ease-in-out',
    Joy:         'dark:bg-joy-dark transition-colors duration-mood ease-in-out',
    Neutral:     'dark:bg-default-dark transition-colors duration-mood ease-in-out',
    Amusement:   'dark:bg-amusement-dark transition-colors duration-mood ease-in-out',
    Annoyance:   'dark:bg-annoyance-dark transition-colors duration-mood ease-in-out',
    Approval:    'dark:bg-approval-dark transition-colors duration-mood ease-in-out',
    Caring:      'dark:bg-caring-dark transition-colors duration-mood ease-in-out',
    Confusion:   'dark:bg-confusion-dark transition-colors duration-mood ease-in-out',
    Curiosity:   'dark:bg-curiosity-dark transition-colors duration-mood ease-in-out',
    Desire:      'dark:bg-desire-dark transition-colors duration-mood ease-in-out',
    Disappointment: 'dark:bg-disappointment-dark transition-colors duration-mood ease-in-out',
    Disapproval: 'dark:bg-disapproval-dark transition-colors duration-mood ease-in-out',
    Disgust:     'dark:bg-disgust-dark transition-colors duration-mood ease-in-out',
    Embarrassment: 'dark:bg-embarrassment-dark transition-colors duration-mood ease-in-out',
    Excitement:  'dark:bg-excitement-dark transition-colors duration-mood ease-in-out',
    Gratitude:   'dark:bg-gratitude-dark transition-colors duration-mood ease-in-out',
    Grief:       'dark:bg-grief-dark transition-colors duration-mood ease-in-out',
    Love:        'dark:bg-love-dark transition-colors duration-mood ease-in-out',
    Nervousness: 'dark:bg-nervousness-dark transition-colors duration-mood ease-in-out',
    Optimism:    'dark:bg-optimism-dark transition-colors duration-mood ease-in-out',
    Pride:       'dark:bg-pride-dark transition-colors duration-mood ease-in-out',
    Realisation: 'dark:bg-realisation-dark transition-colors duration-mood ease-in-out',
    Relief:      'dark:bg-relief-dark transition-colors duration-mood ease-in-out',
    Remorse:     'dark:bg-remorse-dark transition-colors duration-mood ease-in-out',
    Sadness:     'dark:bg-sadness-dark transition-colors duration-mood ease-in-out',
    Surprise:    'dark:bg-surprise-dark transition-colors duration-mood ease-in-out',
};

private _backgroundMoodClasses = {
  Anger: 'dark:bg-anger-backgrounddark bg-anger-background transition-colors duration-mood ease-in-out',
  Admiration: 'dark:bg-admiration-backgrounddark bg-admiration-background transition-colors duration-mood ease-in-out',
  Fear: 'dark:bg-fear-backgrounddark bg-fear-background transition-colors duration-mood ease-in-out',
  Joy: 'dark:bg-joy-backgrounddark bg-joy-background transition-colors duration-mood ease-in-out',
  Neutral: 'dark:bg-default-backgrounddark bg-default-background transition-colors duration-mood ease-in-out',
  Amusement: 'dark:bg-amusement-backgrounddark bg-amusement-background transition-colors duration-mood ease-in-out',
  Annoyance: 'dark:bg-annoyance-backgrounddark bg-annoyance-background transition-colors duration-mood ease-in-out',
  Approval: 'dark:bg-approval-backgrounddark bg-approval-background transition-colors duration-mood ease-in-out',
  Caring: 'dark:bg-caring-backgrounddark bg-caring-background transition-colors duration-mood ease-in-out',
  Confusion: 'dark:bg-confusion-backgrounddark bg-confusion-background transition-colors duration-mood ease-in-out',
  Curiosity: 'dark:bg-curiosity-backgrounddark bg-curiosity-background transition-colors duration-mood ease-in-out',
  Desire: 'dark:bg-desire-backgrounddark bg-desire-background transition-colors duration-mood ease-in-out',
  Disappointment: 'dark:bg-disappointment-backgrounddark bg-disappointment-background transition-colors duration-mood ease-in-out',
  Disapproval: 'dark:bg-disapproval-backgrounddark bg-disapproval-background transition-colors duration-mood ease-in-out',
  Disgust: 'dark:bg-disgust-backgrounddark bg-disgust-background transition-colors duration-mood ease-in-out',
  Embarrassment: 'dark:bg-embarrassment-backgrounddark bg-embarrassment-background transition-colors duration-mood ease-in-out',
  Excitement: 'dark:bg-excitement-backgrounddark bg-excitement-background transition-colors duration-mood ease-in-out',
  Gratitude: 'dark:bg-gratitude-backgrounddark bg-gratitude-background transition-colors duration-mood ease-in-out',
  Grief: 'dark:bg-grief-backgrounddark bg-grief-background transition-colors duration-mood ease-in-out',
  Love: 'dark:bg-love-backgrounddark bg-love-background transition-colors duration-mood ease-in-out',
  Nervousness: 'dark:bg-nervousness-backgrounddark bg-nervousness-background transition-colors duration-mood ease-in-out',
  Optimism: 'dark:bg-optimism-backgrounddark bg-optimism-background transition-colors duration-mood ease-in-out',
  Pride: 'dark:bg-pride-backgrounddark bg-pride-background transition-colors duration-mood ease-in-out',
  Realisation: 'dark:bg-realisation-backgrounddark bg-realisation-background transition-colors duration-mood ease-in-out',
  Relief: 'dark:bg-relief-backgrounddark bg-relief-background transition-colors duration-mood ease-in-out',
  Remorse: 'dark:bg-remorse-backgrounddark bg-remorse-background transition-colors duration-mood ease-in-out',
  Sadness: 'dark:bg-sadness-backgrounddark bg-sadness-background transition-colors duration-mood ease-in-out',
  Surprise: 'dark:bg-surprise-backgrounddark bg-surprise-background transition-colors duration-mood ease-in-out',
};

  constructor() {
    this.initMood();
    console.log('colorCache initialized:', this.colorCache);
  }
  
  private initMood(): void {
    if (typeof window !== 'undefined') {
      this._currentMood = this.getLocalStorageItem('currentMood') || 'Neutral';
    } 
  }

  getTailwindColorRBG(mood: string): string {
    const className = `bg-${mood}`;
    if (this.colorCache[className]) {
      return this.colorCache[className];
      console.log(this.colorCache[className]);
    }

    const tempDiv = document.createElement('div');
    tempDiv.className = className;
    document.body.appendChild(tempDiv);
  
    const color = getComputedStyle(tempDiv).backgroundColor;
  
    document.body.removeChild(tempDiv);
    this.colorCache[className] = color;

    return color;
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