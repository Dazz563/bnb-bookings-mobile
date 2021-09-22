import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';
import { AuthService } from './auth.service';

export class Place {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  availableFrom: Date;
  availableTo: Date;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([
    {
      id: 'p1',
      title: 'Manhattan Mansion',
      description: 'In the heart of New York City',
      imageUrl: '../../assets/Carnegie-Mansion-nyc.jpg',
      price: 149.99,
      availableFrom: new Date('2019-01-01'),
      availableTo: new Date('2019-12-31'),
      userId: 'abc',
    },
    {
      id: 'p2',
      title: `L'Amour Toujours`,
      description: 'A romantic place in Paris',
      imageUrl: '../../assets/lAmourToujours.jpg',
      price: 189.99,
      availableFrom: new Date('2019-01-01'),
      availableTo: new Date('2019-12-31'),
      userId: 'abc',
    },
    {
      id: 'p3',
      title: `The Foggy Palace`,
      description: 'Not your average city trip!',
      imageUrl: '../../assets/foggy-sunrise-in-the-alhambra-palace-guido-montanes-castillo.jpg',
      price: 99.99,
      availableFrom: new Date('2019-01-01'),
      availableTo: new Date('2019-12-31'),
      userId: 'abc',
    },
  ]);

  // get places() {
  //   return [...this._places];
  // }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private afDB: AngularFirestore,
  ) { }

  getPlaces() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.getPlaces().pipe(
      take(1),
      map(places => {
        return { ...places.find(place => place.id === id) };
      }),
    );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace: Place = {
      // id: Math.random().toString(),
      title: title,
      description: description,
      imageUrl: '../../assets/Carnegie-Mansion-nyc.jpg',
      price: price,
      availableFrom: dateFrom,
      availableTo: dateTo,
      userId: this.authService.userId,
    }
    // Firebase add
    return this.afDB.collection('offered-places').add(newPlace).then(res => {
      console.log('Add offer res: ', res)
    });

    // return this.getPlaces().pipe(
    //   take((1)),
    //   delay(2000),
    //   tap((places) => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this._places.pipe(
      take(1),
      delay(2000),
      tap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = {
          id: oldPlace.id,
          title: title,
          description: description,
          imageUrl: oldPlace.imageUrl,
          price: oldPlace.price,
          availableFrom: oldPlace.availableFrom,
          availableTo: oldPlace.availableTo,
          userId: oldPlace.userId,
        };
        this._places.next(updatedPlaces);
      })
    )
  }
}
