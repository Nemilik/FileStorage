import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promo-carousel',
  templateUrl: './promo-carousel.component.html',
  styleUrls: ['./promo-carousel.component.scss']
})
export class PromoCarouselComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

export interface PromoCarouselSlide {
  [key: string]: any;

  src: string;
  title: string;
  discription: string;
}
