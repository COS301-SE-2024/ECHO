import { Component,Input } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgIf,NgForOf,NgClass],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Input() searchQuery!: string;

  
  songs : any = [ 
    {},
    {},
    {} ,{},
    {},
    {} ,{},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {}
];
}
