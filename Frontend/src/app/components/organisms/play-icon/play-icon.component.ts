import { Component,Input } from '@angular/core';
import { SvgIconComponent } from '../../atoms/svg-icon/svg-icon.component';
const SVG_PATHS = {
  PLAYSVG: 'M8 4v46l40-23z', // Adjusted to match the height range
  PAUSESVG: 'M6 4h12v46H6V4zm24 0v46h12V4H30z', // Adjusted to match the height range
  STOPSVG: 'M6 4h46v46H6z', // Adjusted to match the height range
};
@Component({
  selector: 'app-play-icon',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './play-icon.component.html',
  styleUrl: './play-icon.component.css'
})
export class PlayIconComponent {
  @Input() mood?:any;
  playSvg: string = SVG_PATHS.PLAYSVG;
}
