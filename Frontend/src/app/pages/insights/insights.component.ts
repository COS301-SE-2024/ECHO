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
  @Input() percentageData: number[] = [25, 5, 30, 40, 10, 15, 20, 25, 30, 10, 15, 5, 20, 5, 5, 15, 10, 10, 25, 10, 20, 15, 10, 5, 20, 15];
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
                  this.moodService.getRBGAColor("Anger"),
                  this.moodService.getRBGAColor("Annoyance"),
                  this.moodService.getRBGAColor("Fear"),
                  this.moodService.getRBGAColor("Excitement"),
                  this.moodService.getRBGAColor("Amusement"),
                  this.moodService.getRBGAColor("Admiration"),
                  this.moodService.getRBGAColor("Approval"),
                  this.moodService.getRBGAColor("Caring"),
                  this.moodService.getRBGAColor("Joy"),
                  this.moodService.getRBGAColor("Desire"),
                  this.moodService.getRBGAColor("Curiosity"),
                  this.moodService.getRBGAColor("Confusion"),
                  this.moodService.getRBGAColor("Gratitude"),
                  this.moodService.getRBGAColor("Surprise"),
                  this.moodService.getRBGAColor("Disappointment"),
                  this.moodService.getRBGAColor("Disapproval"),
                  this.moodService.getRBGAColor("Disgust"),
                  this.moodService.getRBGAColor("Embarrassment"),
                  this.moodService.getRBGAColor("Sadness"),
                  this.moodService.getRBGAColor("Grief"),
                  this.moodService.getRBGAColor("Love"),
                  this.moodService.getRBGAColor("Nervousness"),
                  this.moodService.getRBGAColor("Optimism"),
                  this.moodService.getRBGAColor("Pride"),
                  this.moodService.getRBGAColor("Realisation"),
                  this.moodService.getRBGAColor("Relief"),
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