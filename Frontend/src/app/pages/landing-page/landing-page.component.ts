import { Component } from '@angular/core';
import {MoodDropDownComponent} from './../../shared/mood-drop-down/mood-drop-down.component';
@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [MoodDropDownComponent],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {}
