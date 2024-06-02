import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
@Component({
    selector: 'app-moods',
    standalone: true,
    imports: [MatGridListModule, MatCardModule, NgClass, NgForOf, NgIf],
    templateUrl: './moods.component.html',
    styleUrl: './moods.component.css',
})
export class MoodsComponent {
    favouriteMoods = [
        {
            name: 'Confident',
            image: '/assets/moods/Confident.jpg',
        },
        {
            name: 'Chill',
            image: '/assets/moods/chill.jpg',
        },
        {
            name: 'Happy',
            image: '/assets/moods/happy.jpg',
        },
        {
            name: 'Melancholy',
            image: '/assets/moods/Melancholy.png',
        },
        {
            name: 'Nostalgic',
            image: '/assets/moods/Nostalgic.jpg',
        },
        {
            name: 'Unknows',
            image: '/assets/moods/img6.jpg',
        },
    ];

    RecommendedMoods = [
        {
            name: 'Melancholy',
            image: '/assets/moods/Melancholy.png',
        },
        {
            name: 'Nostalgic',
            image: '/assets/moods/Nostalgic.jpg',
        },
        {
            name: 'Unknows',
            image: '/assets/moods/img6.jpg',
        },
        {
            name: 'Confident',
            image: '/assets/moods/Confident.jpg',
        },
        {
            name: 'Chill',
            image: '/assets/moods/chill.jpg',
        },
        {
            name: 'Happy',
            image: '/assets/moods/happy.jpg',
        },
    ];
}
