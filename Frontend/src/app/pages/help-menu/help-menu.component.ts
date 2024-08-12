import { Component } from '@angular/core';
import { MoodService } from '../../services/mood-service.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-help-menu',
  standalone: true,
  imports: [ NgClass ],
  templateUrl: './help-menu.component.html',
  styleUrl: './help-menu.component.css'
})
export class HelpMenuComponent {
  currentMood!: string;
  moodComponentClasses!:{ [key: string]: string };
  backgroundMoodClasses!:{ [key: string]: string };
  private openAccordions = new Set<string>();

  constructor(
    public moodService: MoodService,
    ) {
      this.currentMood = this.moodService.getCurrentMood();
      this.moodComponentClasses = this.moodService.getComponentMoodClasses();
      this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    }

    ngOnInit(): void {
      this.currentMood = this.moodService.getCurrentMood();
      this.moodComponentClasses = this.moodService.getComponentMoodClasses();
      this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
    }

  toggleAccordion(section: string) {
    if (this.openAccordions.has(section)) {
      this.openAccordions.delete(section);
    } else {
      this.openAccordions.add(section);
    }
  }

  isAccordionOpen(section: string): boolean {
    return this.openAccordions.has(section);
  }

}
