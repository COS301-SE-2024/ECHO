import { Injectable } from '@angular/core';
//"Neutral","Joy", "Surprise", "Sadness", "Anger", "Disgust", "Contempt", "Shame", "Fear", "Guilt", "Excitement", "Love"
@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private _currentMood!: string;
  private  _automaticMoodChange: boolean = false;
  
  private _moodColors: { [key: string]: string } = {
    Neutral: 'rgb(238, 2, 88)',   // #EE0258
    Anger: 'rgb(164, 0, 20)',     // #A40014
    Fear: 'rgb(142, 113, 195)',   // #8E71C3
    Joy: 'rgb(244, 189, 1)',      // #F4BD01
    Disgust: 'rgb(85, 107, 47)',  // #556B2F
    Excitement: 'rgb(255, 83, 8)', // #FF5308
    Love: 'rgb(238, 59, 133)',    // #EE3B85
    Sadness: 'rgb(76, 142, 197)', // #4C8EC5
    Surprise: 'rgb(26, 173, 184)', // #1AADB8
    Contempt: 'rgb(112, 128, 144)', // #708090
    Shame: 'rgb(255, 160, 174)',  // #FFA0AE
    Guilt: 'rgb(112, 63, 158)'    // #703F9E    
  };

  private _componentMoodClasses = {
    Neutral:     'bg-default text-default-text focus:ring-default-dark fill-default font-semibold transition-colors',
    Anger:       'bg-anger text-anger-text focus:ring-anger-dark fill-anger-dark font-semibold transition-colors duration-mood ease-in-out',
    Fear:        'bg-fear text-fear-text focus:ring-fear-dark fill-fear-dark font-semibold transition-colors duration-mood ease-in-out',
    Joy:         'bg-joy text-joy-text focus:ring-joy-dark fill-joy-dark font-semibold transition-colors duration-mood ease-in-out',
    Disgust:     'bg-disgust text-disgust-text focus:ring-disgust-dark fill-disgust-dark font-semibold transition-colors duration-mood ease-in-out',
    Excitement:  'bg-excitement text-excitement-text focus:ring-excitement-dark fill-excitement-dark font-semibold transition-colors duration-mood ease-in-out',
    Love:        'bg-love text-love-text focus:ring-love-dark fill-love-dark transition-colors font-semibold duration-mood ease-in-out',
    Sadness:     'bg-sadness text-sadness-text focus:ring-sadness-dark fill-sadness-dark transition-colors font-semibold duration-mood ease-in-out',
    Surprise:    'bg-surprise text-surprise-text focus:ring-surprise-dark fill-surprise-dark transition-colors font-semibold duration-mood ease-in-out',
    Contempt:    'bg-contempt text-contempt-text focus:ring-contempt-dark fill-contempt-dark transition-colors font-semibold duration-mood ease-in-out',
    Shame:       'bg-shame text-shame-text focus:ring-shame-dark fill-shame-dark transition-colors duration-mood font-semibold ease-in-out',
    Guilt:       'bg-guilt text-guilt-text focus:ring-guilt-dark fill-guilt-dark transition-colors duration-mood font-semibold ease-in-out',
  };
  private _componentMoodClassesHover = {
    Neutral:     'bg-default text-default-text hover:bg-default-dark focus:ring-default-dark fill-default shadow-sm transition-colors shadow-2xl shadow-inherit',
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
    Anger:       'bg-anger-dark text-anger-text transition-colors duration-mood ease-in-out',
    Fear:        'bg-fear-dark text-fear-text transition-colors duration-mood ease-in-out',
    Joy:         'bg-joy-dark text-joy-text transition-colors duration-mood ease-in-out',
    Neutral:     'bg-default-dark text-default-text transition-colors',
    Disgust:     'bg-disgust-dark text-disgust-text transition-colors duration-mood ease-in-out',
    Excitement:  'bg-excitement-dark text-excitement-text transition-colors duration-mood ease-in-out',
    Love:        'bg-love-dark text-love-text transition-colors duration-mood ease-in-out',
    Optimism:    'bg-optimism-dark text-optimism-text transition-colors duration-mood ease-in-out',
    Sadness:     'bg-sadness-dark text-sadness-text transition-colors duration-mood ease-in-out',
    Surprise:    'bg-surprise-dark text-surprise-text transition-colors duration-mood ease-in-out',
    Contempt:    'bg-contempt-dark text-gray-text transition-colors duration-mood ease-in-out',
    Shame:       'bg-shame-dark text-shame-text transition-colors duration-mood ease-in-out',
    Guilt:       'bg-guilt-dark text-guilt-text transition-colors duration-mood ease-in-out',
  };
  private _underlineMoodClasses = {
      Anger: 'bg-default-background transition-colors duration-mood ease-in-out border-b-2 border-anger-dark opacity-99 font-semibold focus:border-anger-dark',
      Fear: 'bg-default-background transition-colors duration-mood ease-in-out border-b-2 border-fear-dark opacity-99 font-semibold focus:border-fear-dark',
      Joy: 'bg-default-background transition-colors duration-mood ease-in-out border-b-2 border-joy-dark opacity-99 font-semibold focus:border-joy-dark',
      Neutral: 'bg-default-background transition-colors duration-mood ease-in-out border-b-2 border-default-dark opacity-99 font-semibold focus:border-default-dark',
      Disgust: 'bg-default-background transition-colors duration-mood ease-in-out border-b-2 border-disgust-dark opacity-99 font-semibold focus:border-disgust-dark',
      Excitement: 'bg-default-background transition-colors duration-mood ease-in-out border-b-2 border-excitement-dark opacity-99 font-semibold focus:border-excitement-dark',
      Love: 'bg-default-background transition-colors duration-mood ease-in-out border-b-2 border-love-dark opacity-99 font-semibold focus:border-love-dark',
      Optimism: 'bg-default-background transition-colors duration-mood ease-in-out border-b-2 border-optimism-dark opacity-99 font-semibold focus:border-optimism-dark',
      Sadness: 'bg-default-background transition-colors duration-mood ease-in-out border-b-2 border-sadness-dark opacity-99 font-semibold focus:border-sadness-dark',
      Surprise: 'bg-default-background transition-colors duration-mood ease-in-out border-b-2 border-surprise-dark opacity-99 font-semibold focus:border-surprise-dark',
      Contempt: 'bg-default-background transition-colors duration-mood ease-in-out border-b-2 border-contempt-dark opacity-99 font-semibold focus:border-contempt-dark',
      Shame: 'bg-default-background transition-colors duration-mood ease-in-out border-b-2 border-shame-dark opacity-99 font-semibold focus:border-shame-dark',
      Guilt: 'bg-default-background transition-colors duration-mood ease-in-out border-b-2 border-guilt-dark opacity-99 font-semibold focus:border-guilt-dark',
  };
  
  constructor() {
    this.initMood();
  }

  private initMood(): void {
    if (typeof window !== 'undefined') {
      this._currentMood = this.getLocalStorageItem('currentMood') || 'Neutral';
      this._automaticMoodChange = this.getLocalStorageItem('moodServiceToggle') === 'true';
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
  // random mood selector fucntion 
  randomMood(): void {
    const moods = Object.keys(this._componentMoodClasses);
    this.setCurrentMood(moods[Math.floor(Math.random() * moods.length)]);
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
    if(this._automaticMoodChange)
    {
      this._currentMood = mood;
      this.setLocalStorageItem('currentMood', mood);
    }
    
  }

  moodServicetoggle()
  {
    this._automaticMoodChange = !this._automaticMoodChange;
    this.setLocalStorageItem('moodServiceToggle', this._automaticMoodChange.toString());
  }
  getMoodToggleSetting()
  {
    return this._automaticMoodChange;
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