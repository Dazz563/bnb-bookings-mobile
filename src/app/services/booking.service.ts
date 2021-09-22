import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export class BookingModel {
  id: string;
  placeId: string;
  userId: string;
  placeTitle: string;
  placeImage: string;
  firstName: string;
  lastName: string;
  guestNumber: number;
  dateFrom: Date;
  dateTo: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  _bookings = new BehaviorSubject<BookingModel[]>([]);

  constructor(
    private authService: AuthService,
  ) { }

  getBookings() {
    return this._bookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date,
  ) {
    const newBooking: BookingModel = {
      id: Math.random().toString(),
      placeId,
      userId: this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo,
    }
    return this._bookings.pipe(
      take(1),
      delay(2000),
      tap((bookings) => {
        this._bookings.next(bookings.concat(newBooking));
      })
    )
  }

  cancelBooking(bookingId: string) {

  }
}
