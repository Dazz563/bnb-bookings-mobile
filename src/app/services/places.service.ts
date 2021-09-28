import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';


// {
//   id: 'p1',
//   title: 'Manhattan Mansion',
//   description: 'In the heart of New York City',
//   imageUrl: '../../assets/Carnegie-Mansion-nyc.jpg',
//   price: 149.99,
//   availableFrom: new Date('2019-01-01'),
//   availableTo: new Date('2019-12-31'),
//   userId: 'abc',
// },
// {
//   id: 'p2',
//   title: `L'Amour Toujours`,
//   description: 'A romantic place in Paris',
//   imageUrl: '../../assets/lAmourToujours.jpg',
//   price: 189.99,
//   availableFrom: new Date('2019-01-01'),
//   availableTo: new Date('2019-12-31'),
//   userId: 'abc',
// },
// {
//   id: 'p3',
//   title: `The Foggy Palace`,
//   description: 'Not your average city trip!',
//   imageUrl: '../../assets/foggy-sunrise-in-the-alhambra-palace-guido-montanes-castillo.jpg',
//   price: 99.99,
//   availableFrom: new Date('2019-01-01'),
//   availableTo: new Date('2019-12-31'),
//   userId: 'abc',
// },

export class Place {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  availableFrom: Date | any;
  availableTo: Date | any;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([]);

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

  fetchPlaces() {
    return from(
      this.afDB
        .collection('offered-places')
        .snapshotChanges()
        .pipe(
          map((offers) => {
            return offers.map((offer) => {
              return <any>{
                id: offer.payload.doc.id,
                ...(offer.payload.doc.data() as any),
              };
            });
          }),
          tap((places) => {
            this._places.next(places);
          })

        ),
    )
  }

  getPlace(id: string) {
    // return from(
    //   this.afDB.collection('offered-places').doc(id)
    //     .snapshotChanges().pipe(
    //       map((offer) => {
    //         return offer.payload.id
    //       })
    //     )
    // )
    // return this.getPlaces().pipe(
    //   take(1),
    //   map(places => {
    //     return { ...places.find(place => place.id === id) };
    //   }),
    // );

    return from(
      this.afDB.collection('offered-places').doc(id)
        .valueChanges().pipe(
          take(1),
          tap((res) => console.log(res))
        )
    )
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
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
    return from(this.afDB.collection('offered-places').add(newPlace)).pipe(
      switchMap((resData) => {
        console.log(resData);
        generatedId = resData.id;
        return this.getPlaces();
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    )
    // return this.getPlaces().pipe(
    //   take((1)),
    //   delay(2000),
    //   tap((places) => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlace = {
      title,
      description,
    }

    let updatedPlaces: Place[];

    return this.getPlaces().pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        }
        else {
          return of(places);
        }
      }),
      switchMap(places => {
        console.log('Places in switchmap: ', places);
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        console.log('updatedPlaceIndex: ', updatedPlaceIndex);

        updatedPlaces = [...places];
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
        return from(this.afDB.collection('offered-places').doc(placeId).update(updatedPlace));
      }),
      tap((resData) => {
        this._places.next(updatedPlaces);
      })
    )
  }
}
