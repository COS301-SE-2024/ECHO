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
            name: 'Anxious',
            image: '/assets/moods/arctic.jpeg',
        },
        {
            name: 'Chill',
            image: '/assets/moods/kendrick.jpeg',
        },
        {
            name: 'Happy',
            image: '/assets/moods/gambino.jpeg',
        },
        {
            name: 'Melancholy',
            image: '/assets/moods/radiohead.jpeg',
        },
        {
            name: 'Nostalgic',
            image: '/assets/moods/sza.jpeg',
        },
        {
            name: 'Unknown',
            image: '/assets/moods/img6.jpg',
        },
    ];

    RecommendedMoods = [
        {
            name: 'Mad',
            image: '/assets/moods/yonce.jpeg',
        },
        {
            name: 'Nostalgic',
            image: '/assets/moods/taylor.jpeg',
        },
        {
            name: 'Ethereal',
            image: '/assets/moods/impala.jpeg',
        },
        {
            name: 'Confident',
            image: '/assets/moods/tyler.jpeg',
        },
        {
            name: 'Happy',
            image: '/assets/moods/beatles.jpg',
        },
        {
            name: 'Happy',
            image: '/assets/moods/happy.jpg',
        },
    ];
}
