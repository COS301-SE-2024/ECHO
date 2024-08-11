import { AfterViewInit, Component, Inject, PLATFORM_ID, Input } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import Chart, { ChartType } from "chart.js/auto";
import { MoodService } from '../../services/mood-service.service';
import { NgClass } from '@angular/common';

@Component({
  selector: "app-insights",
  standalone: true,
  imports: [NgClass],
  templateUrl: "./insights.component.html",
  styleUrls: ["./insights.component.css"]
})
export class InsightsComponent implements AfterViewInit {
  @Input() percentageData: number[] = [];
  public chart: any;
  private colorCache: { [key: string]: string } = {};
  private chartTypes: ChartType[] = ["pie", "bar", "line", "doughnut", "radar","polarArea"];
  private currentChartIndex: number = 0;
  moodComponentClasses!:{ [key: string]: string };
  constructor(@Inject(PLATFORM_ID) private platformId: Object,public moodService: MoodService) {
    this.moodComponentClasses = this.moodService.getComponentMoodClasses(); 
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createChart();
    }
  }

  getTailwindColor(className: string): string {
    if (this.colorCache[className]) {
      return this.colorCache[className];
    }

    const tempDiv = document.createElement('div');
    tempDiv.className = className;
    document.body.appendChild(tempDiv);

    const color = getComputedStyle(tempDiv).backgroundColor;

    document.body.removeChild(tempDiv);
    this.colorCache[className] = color;
    return color;
  }

  createChart() {
    try {
      const chartCanvas = document.getElementById("MyChart") as HTMLCanvasElement;
      if (chartCanvas) {
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
                this.getTailwindColor('bg-anger'), // Anger
                this.getTailwindColor('bg-annoyance'), // Annoyance
                this.getTailwindColor('bg-fear'), // Fear
                this.getTailwindColor('bg-excitement'), // Excitement
                this.getTailwindColor('bg-amusement'), // Amusement
                this.getTailwindColor('bg-admiration'), // Admiration
                this.getTailwindColor('bg-approval'), // Approval
                this.getTailwindColor('bg-caring'), // Caring
                this.getTailwindColor('bg-joy'), // Joy
                this.getTailwindColor('bg-desire'), // Desire
                this.getTailwindColor('bg-curiosity'), // Curiosity
                this.getTailwindColor('bg-confusion'), // Confusion
                this.getTailwindColor('bg-gratitude'), // Gratitude
                this.getTailwindColor('bg-surprise'), // Surprise
                this.getTailwindColor('bg-disappointment'), // Disappointment
                this.getTailwindColor('bg-disapproval'), // Disapproval
                this.getTailwindColor('bg-disgust'), // Disgust
                this.getTailwindColor('bg-embarrassment'), // Embarrassment
                this.getTailwindColor('bg-sadness'), // Sadness
                this.getTailwindColor('bg-grief'), // Grief
                this.getTailwindColor('bg-love'), // Love
                this.getTailwindColor('bg-nervousness'), // Nervousness
                this.getTailwindColor('bg-optimism'), // Optimism
                this.getTailwindColor('bg-pride'), // Pride
                this.getTailwindColor('bg-realisation'), // Realisation
                this.getTailwindColor('bg-relief'), // Relief
              ],
              hoverOffset: 4
            }]            
          },
          options: {
            aspectRatio: 2.5
          }
        });
      }
    } catch (error) {
      console.error("Failed to create chart:", error);
    }
  }

  nextChartType() {
    this.currentChartIndex = (this.currentChartIndex + 1) % this.chartTypes.length;
    this.createChart();
  }
}