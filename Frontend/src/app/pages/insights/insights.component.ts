import { AfterViewInit, Component, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import Chart from "chart.js/auto";

@Component({
  selector: "app-insights",
  standalone: true,
  imports: [],
  templateUrl: "./insights.component.html",
  styleUrls: ["./insights.component.css"]
})
export class InsightsComponent implements AfterViewInit {
  public chart: any;
  private colorCache: { [key: string]: string } = {};

  constructor(@Inject(PLATFORM_ID) private platformId: Object)
  {
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
        this.chart = new Chart(chartCanvas, {
          type: "pie",
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
              data: [25, 5, 30, 40, 10, 15, 20, 25, 30, 10, 15, 5, 20, 5, 5, 15, 10, 
                     10, 25, 10, 20, 15, 10, 5, 20, 15, 10],
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
}
