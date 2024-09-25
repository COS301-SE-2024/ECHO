import { Injectable } from '@angular/core';
//"Neutral","Joy", "Surprise", "Sadness", "Anger", "Disgust", "Contempt", "Shame", "Fear", "Guilt", "Excitement", "Love"
@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private _currentMood!: string;
  private _moodColors: { [key: string]: string } = {
    Neutral: 'rgb(238, 2, 88)', // #EE0258
    Anger: 'rgb(164, 0, 20)', // #A40014
    Fear: 'rgb(154, 68, 206)', // #9A44CE
    Joy: 'rgb(255, 215, 0)', // #FFD700
    Disgust: 'rgb(85, 107, 47)', // #556B2F
    Excitement: 'rgb(255, 83, 8)', // #FF5308
    Love: 'rgb(255, 20, 147)', // #FF1493
    Sadness: 'rgb(70, 130, 180)', // #4682B4
    Surprise: 'rgb(255, 69, 0)', // #FF4500
    Contempt: 'rgb(255, 105, 97)', // #FF6961 (new color for Contempt)
    Shame: 'rgb(255, 87, 51)', // #FF5733 (new color for Shame)
    Guilt: 'rgb(255, 165, 0)', // #FFA500 (new color for Guilt)
  };
  private _componentMoodClasses = {
    Neutral:     'bg-default-component text-default-text focus:ring-default-dark fill-default transition-colors',
    Anger:       'bg-anger text-anger-text focus:ring-anger-dark fill-anger-dark transition-colors duration-mood ease-in-out',
    Fear:        'bg-fear text-fear-text focus:ring-fear-dark fill-fear-dark transition-colors duration-mood ease-in-out',
    Joy:         'bg-joy text-joy-text focus:ring-joy-dark fill-joy-dark transition-colors duration-mood ease-in-out',
    Disgust:     'bg-disgust text-disgust-text focus:ring-disgust-dark fill-disgust-dark transition-colors duration-mood ease-in-out',
    Excitement:  'bg-excitement text-excitement-text focus:ring-excitement-dark fill-excitement-dark transition-colors duration-mood ease-in-out',
    Love:        'bg-love text-love-text focus:ring-love-dark fill-love-dark transition-colors duration-mood ease-in-out',
    Sadness:     'bg-sadness text-sadness-text focus:ring-sadness-dark fill-sadness-dark transition-colors duration-mood ease-in-out',
    Surprise:    'bg-surprise text-surprise-text focus:ring-surprise-dark fill-surprise-dark transition-colors duration-mood ease-in-out',
    Contempt:    'bg-contempt text-contempt-text focus:ring-contempt-dark fill-contempt-dark transition-colors duration-mood ease-in-out',
    Shame:       'bg-shame text-shame-text focus:ring-shame-dark fill-shame-dark transition-colors duration-mood ease-in-out',
    Guilt:       'bg-guilt text-guilt-text focus:ring-guilt-dark fill-guilt-dark transition-colors duration-mood ease-in-out',
  };
  private _componentMoodClassesHover = {
    Neutral:     'bg-default text-default-text hover:bg-default-dark focus:ring-default-dark fill-default font-semibold shadow-sm transition-colors shadow-2xl shadow-inherit',
    Anger:       'bg-anger text-anger-text hover:bg-anger-dark focus:ring-anger-dark fill-anger-dark transition-colors duration-mood ease-in-out',
    Fear:        'bg-fear text-fear-text hover:bg-fear-dark focus:ring-fear-dark fill-fear-dark transition-colors duration-mood ease-in-out',
    Joy:         'bg-joy text-joy-text hover:bg-joy-dark focus:ring-joy-dark hover:text-joy fill-joy-dark transition-colors duration-mood ease-in-out',
    Disgust:     'bg-disgust text-disgust-text hover:bg-disgust-dark focus:ring-disgust-dark fill-disgust-dark transition-colors duration-mood ease-in-out',
    Excitement:  'bg-excitement text-excitement-text hover:bg-excitement-dark focus:ring-excitement-dark fill-excitement-dark transition-colors duration-mood ease-in-out',
    Love:        'bg-love text-love-text hover:bg-love-dark focus:ring-love-dark fill-love-dark transition-colors duration-mood ease-in-out',
    Optimism:    'bg-optimism text-optimism-text hover:bg-optimism-dark focus:ring-optimism-dark fill-optimism-dark transition-colors duration-mood ease-in-out',
    Sadness:     'bg-sadness text-sadness-text hover:bg-sadness-dark focus:ring-sadness-dark fill-sadness-dark transition-colors duration-mood ease-in-out',
    Surprise:    'bg-surprise text-surprise-text hover:bg-surprise-dark focus:ring-surprise-dark fill-surprise-dark transition-colors duration-mood ease-in-out',
    Contempt:    'bg-contempt text-contempt-text hover:bg-contempt-dark focus:ring-contempt-dark fill-contempt-dark transition-colors duration-mood ease-in-out',
    Shame:       'bg-shame text-shame-text hover:bg-shame-dark focus:ring-shame-dark fill-shame-dark transition-colors duration-mood ease-in-out',
    Guilt:       'bg-guilt text-guilt-text hover:bg-guilt-dark focus:ring-guilt-dark fill-guilt-dark transition-colors duration-mood ease-in-out',
  };
  
  private _MoodClassesDark = {
    Anger:       'bg-anger-dark text-gray-light transition-colors duration-mood ease-in-out',
    Fear:        'bg-fear-dark text-gray-light transition-colors duration-mood ease-in-out',
    Joy:         'bg-joy-dark text-gray-light transition-colors duration-mood ease-in-out',
    Neutral:     'bg-default-dark text-gray-light transition-colors',
    Disgust:     'bg-disgust-dark text-gray-light transition-colors duration-mood ease-in-out',
    Excitement:  'bg-excitement-dark text-gray-light transition-colors duration-mood ease-in-out',
    Love:        'bg-love-dark text-gray-light transition-colors duration-mood ease-in-out',
    Optimism:    'bg-optimism-dark text-gray-light transition-colors duration-mood ease-in-out',
    Sadness:     'bg-sadness-dark text-gray-light transition-colors duration-mood ease-in-out',
    Surprise:    'bg-surprise-dark text-gray-light transition-colors duration-mood ease-in-out',
    Contempt:    'bg-contempt-dark text-gray-light transition-colors duration-mood ease-in-out',
    Shame:       'bg-shame-dark text-gray-light transition-colors duration-mood ease-in-out',
    Guilt:       'bg-guilt-dark text-gray-light transition-colors duration-mood ease-in-out',
  };
  private _underlineMoodClasses = {
    Anger: 'bg-anger transition-colors duration-mood ease-in-out border-b-2 border-anger-dark',
    Fear: 'bg-fear transition-colors duration-mood ease-in-out border-b-2 border-fear-dark',
    Joy: 'bg-joy transition-colors duration-mood ease-in-out border-b-2 border-joy-dark',
    Neutral: 'bg-component transition-colors duration-mood ease-in-out border-b-2 border-pink',
    Disgust: 'bg-disgust transition-colors duration-mood ease-in-out border-b-2 border-disgust-dark',
    Excitement: 'bg-excitement transition-colors duration-mood ease-in-out border-b-2 border-excitement-dark',
    Love: 'bg-love transition-colors duration-mood ease-in-out border-b-2 border-love-dark',
    Optimism: 'bg-optimism transition-colors duration-mood ease-in-out border-b-2 border-optimism-dark',
    Sadness: 'bg-sadness transition-colors duration-mood ease-in-out border-b-2 border-sadness-dark',
    Surprise: 'bg-surprise transition-colors duration-mood ease-in-out border-b-2 border-surprise-dark',
    Contempt: 'bg-contempt transition-colors duration-mood ease-in-out border-b-2 border-contempt-dark',
    Shame: 'bg-shame transition-colors duration-mood ease-in-out border-b-2 border-shame-dark',
    Guilt: 'bg-guilt transition-colors duration-mood ease-in-out border-b-2 border-guilt-dark',
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
  getUnerlineMoodClasses(): { [key: string]: string } {
    return this._underlineMoodClasses;
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