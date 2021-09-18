import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { BookingModel, BookingService } from '../services/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {

  loadedBookings: BookingModel[];

  constructor(
    private bookingService: BookingService,
  ) { }

  ngOnInit() {
    this.loadedBookings = this.bookingService.getBookings();
  }

  onCancelBooking(bookingId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    // cancel booking with id offerId
  }

}
