import { Injectable } from '@angular/core';

export class Place {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  availableFrom: Date;
  availableTo: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places: Place[] = [
    {
      id: 'p1',
      title: 'Manhattan Mansion',
      description: 'In the heart of New York City',
      imageUrl: '../../assets/Carnegie-Mansion-nyc.jpg',
      price: 149.99,
      availableFrom: new Date('2019-01-01'),
      availableTo: new Date('2019-12-31'),
    },
    {
      id: 'p2',
      title: `L'Amour Toujours`,
      description: 'A romantic place in Paris',
      imageUrl: '../../assets/lAmourToujours.jpg',
      price: 189.99,
      availableFrom: new Date('2019-01-01'),
      availableTo: new Date('2019-12-31'),
    },
    {
      id: 'p3',
      title: `The Foggy Palace`,
      description: 'Not your average city trip!',
      imageUrl: '../../assets/foggy-sunrise-in-the-alhambra-palace-guido-montanes-castillo.jpg',
      price: 99.99,
      availableFrom: new Date('2019-01-01'),
      availableTo: new Date('2019-12-31'),
    },
  ];

  // get places() {
  //   return [...this._places];
  // }

  constructor() { }

  getPlaces() {
    return [...this._places];
  }

  getPlace(id: string) {
    return { ...this._places.find(place => place.id === id) };
  }
}
