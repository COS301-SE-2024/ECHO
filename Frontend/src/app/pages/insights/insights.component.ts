import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { InsightsService } from "../../services/insights.service";

@Component({
  selector: "app-insights",
  templateUrl: "./insights.component.html",
  standalone: true,
  styleUrls: ["./insights.component.css"]
})
export class InsightsComponent implements OnInit, OnDestroy {
  listeningOverTime: any = {};
  artistsVsTracks: any = {};
  recentTrackGenres: any = {};

  topMood: string = '';
  totalListeningTime: string = '';
  mostListenedArtist: string = '';
  mostPlayedTrack: string = '';
  topGenre: string = '';
  averageSongDuration: string = '';
  mostActiveDay: string = '';
  uniqueArtistsListened: number = 0;

  private artistsVsTracksChartInstance: Chart | null = null;

  constructor(private insightsService: InsightsService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.fetchInsights();

    this.insightsService.getListeningOverTime().subscribe((data: any) => {
      this.listeningOverTime = data || {};
      this.createListeningOverTimeChart();
    });

    this.insightsService.getArtistsVsTracks().subscribe((data: any) => {
      this.artistsVsTracks = data || {};
      this.createArtistsVsTracksChart();
    });

    this.insightsService.getRecentTrackGenres().subscribe((data: any) => {
      this.recentTrackGenres = data || {};
      this.createRecentTrackGenresChart();
    });

    this.fetchArtistsVsTracksData();
  }

  ngOnDestroy(): void {
    if (this.artistsVsTracksChartInstance) {
      this.artistsVsTracksChartInstance.destroy();
    }
  }

  fetchInsights(): void {
    this.insightsService.getTopMood().subscribe((data: any) => {
      this.topMood = data?.mood || 'N/A';
    });

    this.insightsService.getTotalListeningTime().subscribe((data: any) => {
      this.totalListeningTime = data?.totalListeningTime || 'N/A';
    });

    this.insightsService.getMostListenedArtist().subscribe((data: any) => {
      this.mostListenedArtist = data?.artist || 'N/A';
    });

    this.insightsService.getMostPlayedTrack().subscribe((data: any) => {
      this.mostPlayedTrack = data?.name || 'N/A';
    });

    this.insightsService.getTopGenre().subscribe((data: any) => {
      this.topGenre = data?.topGenre || 'N/A';
    });

    this.insightsService.getAverageSongDuration().subscribe((data: any) => {
      this.averageSongDuration = data?.averageDuration || 'N/A';
    });

    this.insightsService.getMostActiveDay().subscribe((data: any) => {
      this.mostActiveDay = data?.mostActiveDay || 'N/A';
    });

    this.insightsService.getUniqueArtistsListened().subscribe((data: any) => {
      this.uniqueArtistsListened = data?.uniqueArtists?.length || 0;
    });
  }

  createListeningOverTimeChart() {
    new Chart('listeningOverTimeChart', {
      type: 'line',
      data: {
        labels: Object.keys(this.listeningOverTime),
        datasets: [{
          label: 'Listening Over Time',
          data: Object.values(this.listeningOverTime),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Listening Time (minutes)'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw} minutes`;
              }
            }
          }
        }
      }
    });
  }

  private fetchArtistsVsTracksData() {
    this.insightsService.getArtistsVsTracks().subscribe((data: any) => {
      this.artistsVsTracks = data || {
        distinctArtists: 0,
        distinctTracks: 0
      };
      console.log("Artists vs Tracks Data:", this.artistsVsTracks);
      this.createArtistsVsTracksChart();
    });
  }

  createArtistsVsTracksChart() {
    if (this.artistsVsTracksChartInstance) {
      this.artistsVsTracksChartInstance.destroy();
    }

    console.log("Creating Artists vs Tracks Chart with data:", this.artistsVsTracks);

    this.artistsVsTracksChartInstance = new Chart('artistsVsTracksChart', {
      type: 'bar',
      data: {
        labels: ['Distinct Artists', 'Distinct Tracks'],
        datasets: [
          {
            label: 'Count',
            data: [this.artistsVsTracks.distinctArtists, this.artistsVsTracks.distinctTracks],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Categories'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Count'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw}`;
              }
            }
          }
        }
      }
    });
  }

  createRecentTrackGenresChart() {
    new Chart('recentTrackGenresChart', {
      type: 'pie',
      data: {
        labels: Object.keys(this.recentTrackGenres),
        datasets: [{
          label: 'Recent Track Genres',
          data: Object.values(this.recentTrackGenres),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.raw !== null && typeof context.raw === 'number') {
                  const total = (context.chart.data.datasets[0].data as (number | null)[]).reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
                  if (total !== 0) {
                    label += `${context.raw} (${((context.raw / (total ?? 1)) * 100).toFixed(2)}%)`;
                  }
                }
                return label;
              }
            }
          }
        }
      }
    });
  }
}
