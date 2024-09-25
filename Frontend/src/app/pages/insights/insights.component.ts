import { AfterViewInit, AfterViewChecked, Component, Inject, PLATFORM_ID, Input, ElementRef, ViewChild } from "@angular/core";
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
  public chartTypes: ChartType[] = ["pie", "bar", "line", "doughnut", "radar", "polarArea"];
  public currentChartIndex: number = 0;
  public moodComponentClasses!: { [key: string]: string };
  private chartInitialized: boolean = false;

  // ViewChild sections for smooth scrolling
  @ViewChild('widgets', { static: false }) widgetsSection!: ElementRef;
  @ViewChild('moodChart', { static: false }) moodChartSection!: ElementRef;
  @ViewChild('serviceChart', { static: false }) serviceChartSection!: ElementRef;
  @ViewChild('genreChart', { static: false }) genreChartSection!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, public moodService: MoodService) {
    this.moodComponentClasses = {
      'Joy': 'bg-yellow-400 text-black',
      'Sadness': 'bg-blue-400 text-white',
      'Anger': 'bg-red-400 text-white',
      'Love': 'bg-pink-400 text-white',
      'Fear': 'bg-gray-400 text-white',
      'Optimism': 'bg-green-400 text-white'
    };
  }

  ngAfterViewInit() {
    this.chartInitialized = false;
  }

  ngAfterViewChecked() {
    if (isPlatformBrowser(this.platformId) && !this.chartInitialized) {
      this.initializeCharts();
    }
  }

  initializeCharts() {
    this.createChart('MoodChart', this.chartTypes[this.currentChartIndex], this.getMoodData());
    this.createChart('ServiceChart', 'doughnut', this.getServiceDistributionData());
    this.createChart('GenreChart', 'bar', this.getGenreData());
    this.chartInitialized = true;
  }

  createChart(chartId: string, type: ChartType, chartData: any) {
    const chartCanvas = document.getElementById(chartId) as HTMLCanvasElement;
    if (chartCanvas) {
      const existingChart = Chart.getChart(chartId);
      if (existingChart) existingChart.destroy();

      new Chart(chartCanvas, {
        type: type,
        data: chartData,
        options: {
          aspectRatio: 2.5,
          responsive: true,
          plugins: {
            legend: { display: true, position: 'bottom' },
            tooltip: { enabled: true }
          }
        }
      });
    }
  }

  nextChartType() {
    this.currentChartIndex = (this.currentChartIndex + 1) % this.chartTypes.length;
    this.createChart('MoodChart', this.chartTypes[this.currentChartIndex], this.getMoodData());
  }

  scrollToSection(section: string) {
    let targetSection: ElementRef | undefined;
    switch (section) {
      case 'widgets':
        targetSection = this.widgetsSection;
        break;
      case 'moodChart':
        targetSection = this.moodChartSection;
        break;
      case 'serviceChart':
        targetSection = this.serviceChartSection;
        break;
      case 'genreChart':
        targetSection = this.genreChartSection;
        break;
    }

    if (targetSection) {
      targetSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getMoodData() {
    return {
      labels: [
        "Joy", "Sadness", "Anger", "Disgust", "Fear", "Surprise", "Love", "Optimism", "Pride", "Relief"
      ],
      datasets: [{
        label: 'Mood Distribution',
        data: [30, 10, 5, 3, 7, 8, 25, 5, 2, 5],
        backgroundColor: [
          '#facc15', '#94a3b8', '#ef4444', '#a3e635', '#3b82f6', '#eab308',
          '#ec4899', '#10b981', '#fb923c', '#6b7280'
        ],
        hoverOffset: 4
      }]
    };
  }

  getServiceDistributionData() {
    return {
      labels: ['Spotify', 'YouTube'],
      datasets: [{
        label: 'Listening Distribution',
        data: [70, 30],
        backgroundColor: ['#1DB954', '#FF0000'],
      }]
    };
  }

  getGenreData() {
    return {
      labels: ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical', 'Indie', 'R&B'],
      datasets: [{
        label: 'Top Genres',
        data: [35, 20, 15, 10, 5, 5, 7, 3],
        backgroundColor: [
          '#f43f5e', '#3b82f6', '#22c55e', '#facc15', '#6366f1', '#8b5cf6', '#f59e0b', '#10b981'
        ]
      }]
    };
  }
}
