import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private _currentMood!: string;
  private colorCache: { [key: string]: string } = {};

  private _moodColors: { [key: string]: string } = {
    Neutral: 'rgb(238, 2, 88)', // #EE0258
    Anger: 'rgb(164, 0, 20)', // #A40014
    Admiration: 'rgb(255, 83, 8)', // #FF5308
    Fear: 'rgb(154, 68, 206)', // #9A44CE
    Joy: 'rgb(255, 215, 0)', // #FFD700
    Amusement: 'rgb(255, 99, 71)', // #FF6347
    Annoyance: 'rgb(255, 69, 0)', // #FF4500
    Approval: 'rgb(50, 205, 50)', // #32CD32
    Caring: 'rgb(255, 105, 180)', // #FF69B4
    Confusion: 'rgb(139, 0, 139)', // #8B008B
    Curiosity: 'rgb(255, 140, 0)', // #FF8C00
    Desire: 'rgb(255, 105, 180)', // #FF69B4
    Disappointment: 'rgb(112, 128, 144)', // #708090
    Disapproval: 'rgb(255, 0, 0)', // #FF0000
    Disgust: 'rgb(85, 107, 47)', // #556B2F
    Embarrassment: 'rgb(255, 182, 193)', // #FFB6C1
    Excitement: 'rgb(255, 69, 0)', // #FF4500
    Gratitude: 'rgb(255, 215, 0)', // #FFD700
    Grief: 'rgb(47, 79, 79)', // #2F4F4F
    Love: 'rgb(255, 20, 147)', // #FF1493
    Nervousness: 'rgb(255, 69, 0)', // #FF4500
    Optimism: 'rgb(255, 215, 0)', // #FFD700
    Pride: 'rgb(138, 43, 226)', // #8A2BE2
    Realisation: 'rgb(0, 206, 209)', // #00CED1
    Relief: 'rgb(0, 255, 127)', // #00FF7F
    Remorse: 'rgb(139, 0, 0)', // #8B0000
    Sadness: 'rgb(70, 130, 180)', // #4682B4
    Surprise: 'rgb(255, 69, 0)' // #FF4500
};


     private _componentMoodClassesHover = {
      Neutral:     'bg-default text-default-text hover:bg-default-dark focus:ring-default-dark fill-default font-semibold shadow-sm transition-colors duration-mood ease-in-out',
      Anger:       'bg-anger text-anger-text hover:bg-anger-dark focus:ring-anger-dark fill-anger-dark transition-colors duration-mood ease-in-out',
      Admiration:  'bg-admiration text-admiration-text hover:bg-admiration-dark focus:ring-admiration-dark hover:text-admiration fill-admiration-dark transition-colors duration-mood ease-in-out',
      Fear:        'bg-fear text-fear-text hover:bg-fear-dark focus:ring-fear-dark fill-fear-dark transition-colors duration-mood ease-in-out',
      Joy:         'bg-joy text-joy-text hover:bg-joy-dark focus:ring-joy-dark hover:text-joy fill-joy-dark transition-colors duration-mood ease-in-out',
      Amusement:   'bg-amusement text-amusement-text hover:bg-amusement-dark focus:ring-amusement-dark fill-amusement-dark transition-colors duration-mood ease-in-out',
      Annoyance:   'bg-annoyance text-annoyance-text hover:bg-annoyance-dark focus:ring-annoyance-dark fill-annoyance-dark transition-colors duration-mood ease-in-out',
      Approval:    'bg-approval text-approval-text hover:bg-approval-dark focus:ring-approval-dark fill-approval-dark transition-colors duration-mood ease-in-out',
      Caring:      'bg-caring text-caring-text hover:bg-caring-dark focus:ring-caring-dark fill-caring-dark transition-colors duration-mood ease-in-out',
      Confusion:   'bg-confusion text-confusion-text hover:bg-confusion-dark focus:ring-confusion-dark fill-confusion-dark transition-colors duration-mood ease-in-out',
      Curiosity:   'bg-curiosity text-curiosity-text hover:bg-curiosity-dark focus:ring-curiosity-dark fill-curiosity-dark transition-colors duration-mood ease-in-out',
      Desire:      'bg-desire text-desire-text hover:bg-desire-dark focus:ring-desire-dark fill-desire-dark transition-colors duration-mood ease-in-out',
      Disappointment: 'bg-disappointment text-disappointment-text hover:bg-disappointment-dark focus:ring-disappointment-dark fill-disappointment-dark transition-colors duration-mood ease-in-out',
      Disapproval: 'bg-disapproval text-disapproval-text hover:bg-disapproval-dark focus:ring-disapproval-dark fill-disapproval-dark transition-colors duration-mood ease-in-out',
      Disgust:     'bg-disgust text-disgust-text hover:bg-disgust-dark focus:ring-disgust-dark fill-disgust-dark transition-colors duration-mood ease-in-out',
      Embarrassment: 'bg-embarrassment text-embarrassment-text hover:bg-embarrassment-dark focus:ring-embarrassment-dark fill-embarrassment-dark transition-colors duration-mood ease-in-out',
      Excitement:  'bg-excitement text-excitement-text hover:bg-excitement-dark focus:ring-excitement-dark fill-excitement-dark transition-colors duration-mood ease-in-out',
      Gratitude:   'bg-gratitude text-gratitude-text hover:bg-gratitude-dark focus:ring-gratitude-dark fill-gratitude-dark transition-colors duration-mood ease-in-out',
      Grief:       'bg-grief text-grief-text hover:bg-grief-dark focus:ring-grief-dark fill-grief-dark transition-colors duration-mood ease-in-out',
      Love:        'bg-love text-love-text hover:bg-love-dark focus:ring-love-dark fill-love-dark transition-colors duration-mood ease-in-out',
      Nervousness: 'bg-nervousness text-nervousness-text hover:bg-nervousness-dark focus:ring-nervousness-dark fill-nervousness-dark transition-colors duration-mood ease-in-out',
      Optimism:    'bg-optimism text-optimism-text hover:bg-optimism-dark focus:ring-optimism-dark fill-optimism-dark transition-colors duration-mood ease-in-out',
      Pride:       'bg-pride text-pride-text hover:bg-pride-dark focus:ring-pride-dark fill-pride-dark transition-colors duration-mood ease-in-out',
      Realisation: 'bg-realisation text-realisation-text hover:bg-realisation-dark focus:ring-realisation-dark fill-realisation-dark transition-colors duration-mood ease-in-out',
      Relief:      'bg-relief text-relief-text hover:bg-relief-dark focus:ring-relief-dark fill-relief-dark transition-colors duration-mood ease-in-out',
      Remorse:     'bg-remorse text-remorse-text hover:bg-remorse-dark focus:ring-remorse-dark fill-remorse-dark transition-colors duration-mood ease-in-out',
      Sadness:     'bg-sadness text-sadness-text hover:bg-sadness-dark focus:ring-sadness-dark fill-sadness-dark transition-colors duration-mood ease-in-out',
      Surprise:    'bg-surprise text-surprise-text hover:bg-surprise-dark focus:ring-surprise-dark fill-surprise-dark transition-colors duration-mood ease-in-out',
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
    Anger:       'bg-anger-dark transition-colors duration-mood ease-in-out',
    Admiration:  'bg-admiration-dark transition-colors duration-mood ease-in-out',
    Fear:        'bg-fear-dark transition-colors duration-mood ease-in-out',
    Joy:         'bg-joy-dark transition-colors duration-mood ease-in-out',
    Neutral:     'bg-default-dark transition-colors duration-mood ease-in-out',
    Amusement:   'bg-amusement-dark transition-colors duration-mood ease-in-out',
    Annoyance:   'bg-annoyance-dark transition-colors duration-mood ease-in-out',
    Approval:    'bg-approval-dark transition-colors duration-mood ease-in-out',
    Caring:      'bg-caring-dark transition-colors duration-mood ease-in-out',
    Confusion:   'bg-confusion-dark transition-colors duration-mood ease-in-out',
    Curiosity:   'bg-curiosity-dark transition-colors duration-mood ease-in-out',
    Desire:      'bg-desire-dark transition-colors duration-mood ease-in-out',
    Disappointment: 'bg-disappointment-dark transition-colors duration-mood ease-in-out',
    Disapproval: 'bg-disapproval-dark transition-colors duration-mood ease-in-out',
    Disgust:     'bg-disgust-dark transition-colors duration-mood ease-in-out',
    Embarrassment: 'bg-embarrassment-dark transition-colors duration-mood ease-in-out',
    Excitement:  'bg-excitement-dark transition-colors duration-mood ease-in-out',
    Gratitude:   'bg-gratitude-dark transition-colors duration-mood ease-in-out',
    Grief:       'bg-grief-dark transition-colors duration-mood ease-in-out',
    Love:        'bg-love-dark transition-colors duration-mood ease-in-out',
    Nervousness: 'bg-nervousness-dark transition-colors duration-mood ease-in-out',
    Optimism:    'bg-optimism-dark transition-colors duration-mood ease-in-out',
    Pride:       'bg-pride-dark transition-colors duration-mood ease-in-out',
    Realisation: 'bg-realisation-dark transition-colors duration-mood ease-in-out',
    Relief:      'bg-relief-dark transition-colors duration-mood ease-in-out',
    Remorse:     'bg-remorse-dark transition-colors duration-mood ease-in-out',
    Sadness:     'bg-sadness-dark transition-colors duration-mood ease-in-out',
    Surprise:    'bg-surprise-dark transition-colors duration-mood ease-in-out',
};

private _backgroundMoodClasses = {
  Anger: 'bg-anger-backgrounddark bg-anger-background transition-colors duration-mood ease-in-out',
  Admiration: 'bg-admiration-backgrounddark bg-admiration-background transition-colors duration-mood ease-in-out',
  Fear: 'bg-fear-backgrounddark bg-fear-background transition-colors duration-mood ease-in-out',
  Joy: 'bg-joy-backgrounddark bg-joy-background transition-colors duration-mood ease-in-out',
  Neutral: 'bg-default-backgrounddark bg-default-background transition-colors duration-mood ease-in-out',
  Amusement: 'bg-amusement-backgrounddark bg-amusement-background transition-colors duration-mood ease-in-out',
  Annoyance: 'bg-annoyance-backgrounddark bg-annoyance-background transition-colors duration-mood ease-in-out',
  Approval: 'bg-approval-backgrounddark bg-approval-background transition-colors duration-mood ease-in-out',
  Caring: 'bg-caring-backgrounddark bg-caring-background transition-colors duration-mood ease-in-out',
  Confusion: 'bg-confusion-backgrounddark bg-confusion-background transition-colors duration-mood ease-in-out',
  Curiosity: 'bg-curiosity-backgrounddark bg-curiosity-background transition-colors duration-mood ease-in-out',
  Desire: 'bg-desire-backgrounddark bg-desire-background transition-colors duration-mood ease-in-out',
  Disappointment: 'bg-disappointment-backgrounddark bg-disappointment-background transition-colors duration-mood ease-in-out',
  Disapproval: 'bg-disapproval-backgrounddark bg-disapproval-background transition-colors duration-mood ease-in-out',
  Disgust: 'bg-disgust-backgrounddark bg-disgust-background transition-colors duration-mood ease-in-out',
  Embarrassment: 'bg-embarrassment-backgrounddark bg-embarrassment-background transition-colors duration-mood ease-in-out',
  Excitement: 'bg-excitement-backgrounddark bg-excitement-background transition-colors duration-mood ease-in-out',
  Gratitude: 'bg-gratitude-backgrounddark bg-gratitude-background transition-colors duration-mood ease-in-out',
  Grief: 'bg-grief-backgrounddark bg-grief-background transition-colors duration-mood ease-in-out',
  Love: 'bg-love-backgrounddark bg-love-background transition-colors duration-mood ease-in-out',
  Nervousness: 'bg-nervousness-backgrounddark bg-nervousness-background transition-colors duration-mood ease-in-out',
  Optimism: 'bg-optimism-backgrounddark bg-optimism-background transition-colors duration-mood ease-in-out',
  Pride: 'bg-pride-backgrounddark bg-pride-background transition-colors duration-mood ease-in-out',
  Realisation: 'bg-realisation-backgrounddark bg-realisation-background transition-colors duration-mood ease-in-out',
  Relief: 'bg-relief-backgrounddark bg-relief-background transition-colors duration-mood ease-in-out',
  Remorse: 'bg-remorse-backgrounddark bg-remorse-background transition-colors duration-mood ease-in-out',
  Sadness: 'bg-sadness-backgrounddark bg-sadness-background transition-colors duration-mood ease-in-out',
  Surprise: 'bg-surprise-backgrounddark bg-surprise-background transition-colors duration-mood ease-in-out',
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
  
  getMoodColors(): { [key: string]: string } {
    return this._moodColors;
  }
  getRBGAColor(mood: string): string {
    return this._moodColors[mood];
  }
}