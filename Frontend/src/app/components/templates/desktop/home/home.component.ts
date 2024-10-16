import { Component } from "@angular/core";
import { NgClass, NgForOf, NgIf} from '@angular/common';
import { MoodsComponent } from '../../../organisms/moods/moods.component';
import { SearchBarComponent } from '../../../molecules/search-bar/search-bar.component';
@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        NgClass,
        NgForOf,
        NgIf,
        MoodsComponent,
        SearchBarComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})

export class HomeComponent   {
    constructor(
    ) {

    }
}
