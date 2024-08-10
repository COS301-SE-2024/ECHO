import { AfterViewInit, Component, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import Chart from "chart.js/auto";

@Component({
  selector: "app-insights",
  standalone: true,
  imports: [],
  templateUrl: "./insights.component.html",
  styleUrl: "./insights.component.css"
})
export class InsightsComponent implements AfterViewInit
{
  public chart: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object)
  {
  }

  ngAfterViewInit()
  {
    if (isPlatformBrowser(this.platformId))
    {
      this.createChart();
    }
  }

  createChart()
  {
    try
    {
      const chartCanvas = document.getElementById("MyChart") as HTMLCanvasElement;
      if (chartCanvas)
      {
        this.chart = new Chart(chartCanvas, {
          type: "pie",
          data: {
            labels: ["Anger", "Fear", "Joy", "Excitement"],
            datasets: [{
              label: "Percentage of recent Moods",
              data: [25, 5, 30, 40],
              backgroundColor: [
                "red",
                "pink",
                "green",
                "yellow"
              ],
              hoverOffset: 4
            }]
          },
          options: {
            aspectRatio: 2.5
          }
        });
      }
    }
    catch (error)
    {
      console.error("Failed to create chart:", error);
    }
  }
}
