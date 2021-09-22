import { Component, Input, OnInit } from '@angular/core';
import { Place } from 'src/app/services/places.service';

@Component({
  selector: 'app-offers-item',
  templateUrl: './offers-item.component.html',
  styleUrls: ['./offers-item.component.scss'],
})
export class OffersItemComponent implements OnInit {

  @Input() offer: Place;

  constructor() { }

  ngOnInit() { }



}
