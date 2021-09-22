import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';
import { Place, PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: Place;
  isBookable = false;
  private placesSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private placeService: PlacesService,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placesSub = this.placeService.getPlace(paramMap.get('placeId')).subscribe((place: Place) => {
        this.isBookable = place.userId !== this.authService.userId;
        this.place = place;
      });
    })
  }

  onBookPlace() {

    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          },
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    })


  }

  openBookingModal(mode: 'select' | 'random') {

    console.log('Mode selected: ', mode);

    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place,
        selectedMode: mode,
      }
    })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === 'confirm') {
          this, this.loadingCtrl.create({
            message: 'Booking place...',
          })
            .then(loadingEl => {
              loadingEl.present();
              const data = resultData.data.bookingData;
              this.bookingService.addBooking(
                this.place.id,
                this.place.title,
                this.place.imageUrl,
                data.firstName,
                data.lastName,
                data.guestNumber,
                data.startDate,
                data.endDate,
              ).subscribe(() => {
                loadingEl.dismiss();
              });
            });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
