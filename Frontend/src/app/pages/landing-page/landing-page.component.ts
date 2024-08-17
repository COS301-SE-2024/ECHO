import { Component, Input } from '@angular/core';
// comon module
import { CommonModule } from '@angular/common';
import { ButtonComponentComponent } from './../../components/atoms/button-component/button-component.component';
@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [ButtonComponentComponent,CommonModule],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
 
}
