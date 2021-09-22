import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BookingModel, BookingService } from '../services/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookings: BookingModel[];
  bookingSub: Subscription;

  constructor(
    private bookingService: BookingService,
  ) { }

  ngOnInit() {
    this.bookingSub = this.bookingService.getBookings().subscribe((bookings: BookingModel[]) => {
      this.loadedBookings = bookings;
    });
  }

  onCancelBooking(bookingId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    // cancel booking with id offerId
  }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

}
