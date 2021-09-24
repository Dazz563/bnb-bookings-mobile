import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place, PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  offers: Place[];
  private placesSub: Subscription;
  isLoading = false;

  constructor(private placesService: PlacesService) { }


  ngOnInit() {
    this.placesSub = this.placesService.fetchPlaces().subscribe((places: Place[]) => {
      this.offers = places;
      console.log(this.offers);
      this.offers.forEach((offer) => {
        offer.availableFrom = new Date(offer.availableFrom.seconds * 1000);
        offer.availableTo = new Date(offer.availableTo.seconds * 1000);
      })
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCloseSlide(slidingItem: IonItemSliding) {
    slidingItem.close();
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
