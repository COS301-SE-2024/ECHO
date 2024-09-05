import { Component, OnInit } from '@angular/core';
import { EchoComponent } from '../../../organisms/echo/echo.component';
import { ActivatedRoute } from '@angular/router';
import { PageTitleComponent } from '../../../atoms/page-title/page-title.component';
@Component({
  selector: 'app-echo-song',
  standalone: true,
  imports: [EchoComponent,PageTitleComponent],
  templateUrl: './echo-song.component.html',
  styleUrls: ['./echo-song.component.css']
})
export class EchoSongComponent implements OnInit {
  echoedSongName!: string;
  echoedSongArtist!: string ;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.echoedSongName = params['trackName'];
      this.echoedSongArtist = params['artistName'];
    });
  }

  ngOnInit(): void {

  }
}