import { AfterViewInit, AfterViewChecked, Component, Inject, PLATFORM_ID, Input } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import Chart, { ChartType } from "chart.js/auto";
import { MoodService } from '../../services/mood-service.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: "app-insights",
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: "./insights.component.html",
  styleUrls: ["./insights.component.css"]
})
export class InsightsComponent implements AfterViewInit, AfterViewChecked {
  @Input() percentageData: number[] = [];
  public chart: any;
  // Chart Variables
  public chartTypes: ChartType[] = ["pie", "bar", "line", "doughnut", "radar", "polarArea"];
  public currentChartIndex: number = 0;
  screenSize?: string;
  //Mood Service Variables
  currentMood!: string;
  moodComponentClasses!:{ [key: string]: string };
  backgroundMoodClasses!:{ [key: string]: string };
  // Page Variables
  private chartInitialized: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, public moodService: MoodService) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses();
    this.backgroundMoodClasses = this.moodService.getBackgroundMoodClasses();
  }

  ngAfterViewInit() {
    this.chartInitialized = false; // Reset chart initialization flag
  };
  

  ngAfterViewChecked() {
    if (isPlatformBrowser(this.platformId) && !this.chartInitialized) {
      const chartCanvas = document.getElementById("MyChart") as HTMLCanvasElement;
      if (chartCanvas) {
        this.createChart().then(() => {
          this.chartInitialized = true; // Set chart initialization flag
        }).catch(error => {
        });
      }
    }
  }

  createChart(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const chartCanvas = document.getElementById("MyChart") as HTMLCanvasElement;
        if (chartCanvas) {
          console.log("Canvas element found");
          if (this.chart) {
            this.chart.destroy();
          }
          this.chart = new Chart(chartCanvas, {
            type: this.chartTypes[this.currentChartIndex],
            data: {
              labels: [
                "Anger", "Annoyance", "Fear", "Excitement", "Amusement", "Admiration",
                "Approval", "Caring", "Joy", "Desire", "Curiosity", "Confusion",
                "Gratitude", "Surprise", "Disappointment", "Disapproval", "Disgust",
                "Embarrassment", "Sadness", "Grief", "Love", "Nervousness", "Optimism",
                "Pride", "Realisation", "Relief"
              ],
              datasets: [{
                label: "Percentage of recent Moods",
                data: this.percentageData,
                backgroundColor: [
                  this.moodService.getTailwindColorRBG('anger'), // Anger
                  this.moodService.getTailwindColorRBG('annoyance'), // Annoyance
                  this.moodService.getTailwindColorRBG('fear'), // Fear
                  this.moodService.getTailwindColorRBG('excitement'), // Excitement
                  this.moodService.getTailwindColorRBG('amusement'), // Amusement
                  this.moodService.getTailwindColorRBG('admiration'), // Admiration
                  this.moodService.getTailwindColorRBG('approval'), // Approval
                  this.moodService.getTailwindColorRBG('caring'), // Caring
                  this.moodService.getTailwindColorRBG('joy'), // Joy
                  this.moodService.getTailwindColorRBG('desire'), // Desire
                  this.moodService.getTailwindColorRBG('curiosity'), // Curiosity
                  this.moodService.getTailwindColorRBG('confusion'), // Confusion
                  this.moodService.getTailwindColorRBG('gratitude'), // Gratitude
                  this.moodService.getTailwindColorRBG('surprise'), // Surprise
                  this.moodService.getTailwindColorRBG('disappointment'), // Disappointment
                  this.moodService.getTailwindColorRBG('disapproval'), // Disapproval
                  this.moodService.getTailwindColorRBG('disgust'), // Disgust
                  this.moodService.getTailwindColorRBG('embarrassment'), // Embarrassment
                  this.moodService.getTailwindColorRBG('sadness'), // Sadness
                  this.moodService.getTailwindColorRBG('grief'), // Grief
                  this.moodService.getTailwindColorRBG('love'), // Love
                  this.moodService.getTailwindColorRBG('nervousness'), // Nervousness
                  this.moodService.getTailwindColorRBG('optimism'), // Optimism
                  this.moodService.getTailwindColorRBG('pride'), // Pride
                  this.moodService.getTailwindColorRBG('realisation'), // Realisation
                  this.moodService.getTailwindColorRBG('relief'), // Relief
                ],
                hoverOffset: 4
              }]
            },
            options: {
              aspectRatio: 2.5
            }
          });
          resolve();
        } else {
          reject("Canvas element not found");
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  nextChartType() {
    this.currentChartIndex = (this.currentChartIndex + 1) % this.chartTypes.length;
    this.createChart().then(() => {
    }).catch(error => {
    });
  }
}