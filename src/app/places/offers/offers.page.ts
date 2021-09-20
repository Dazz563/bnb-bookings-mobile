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

  constructor(private placesService: PlacesService) { }


  ngOnInit() {
    this.placesSub = this.placesService.getPlaces().subscribe((places: Place[]) => {
      this.offers = places;
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
