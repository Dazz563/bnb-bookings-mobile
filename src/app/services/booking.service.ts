import { Injectable } from '@angular/core';

export class BookingModel {
  id: string;
  placeId: string;
  userId: string;
  placeTitle: string;
  guestNumber: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  _bookings: BookingModel[] = [
    {
      id: 'xyz',
      placeId: 'p1',
      userId: 'abc',
      placeTitle: 'Manhattan Mansion', 
      guestNumber: 5
    }
  ];

  constructor() { }

  getBookings() {
    return [...this._bookings];
  }
}
