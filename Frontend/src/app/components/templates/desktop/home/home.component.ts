import { Component } from "@angular/core";
import { NgClass, NgForOf, NgIf} from '@angular/common';
import { MoodsComponent } from '../../../organisms/moods/moods.component';
import { ExploreBarComponent } from "../../../organisms/explore-bar/explore-bar.component";
@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        NgClass,
        NgForOf,
        NgIf,
        MoodsComponent,
        ExploreBarComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})

export class HomeComponent   {
    constructor(
    ) {

    }
}
