import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation } from 'src/app/services/places.service';
import { environment } from 'src/environments/environment';
import { MapModalComponent } from '../../map-modal/map-modal.component';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  @Output() locationPick = new EventEmitter<PlaceLocation>();
  selectedLocationImage: string;
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
  ) { }

  ngOnInit() { }

  onPickLocation() {
    this.modalCtrl.create({
      component: MapModalComponent
    })
      .then(modalEl => {
        modalEl.onDidDismiss().then(result => {
          // console.log(result.data);
          if (!result.data) {
            return;
          }
          const pickedLocation: PlaceLocation = {
            lat: result.data.lat,
            lng: result.data.lng,
            address: null,
            staticMapImageUrl: null,
          };
          this.isLoading = true;

          this.getAddress(result.data.lat, result.data.lng).pipe(
            switchMap(address => {
              pickedLocation.address = address;
              return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 16))
            })
          ).subscribe(staticMapImageUrl => {
            pickedLocation.staticMapImageUrl = staticMapImageUrl;
            this.selectedLocationImage = staticMapImageUrl;
            this.isLoading = false;
            this.locationPick.emit(pickedLocation);
          })
        })
        modalEl.present();
      })
  }

  private getAddress(lat: number, lng: number) {
    return this.http.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPIKey}`
    ).pipe(
      map((geoData: any) => {
        // console.log(geoData);
        if (!geoData || !geoData.results || geoData.results.length === 0) {
          return null;
        }
        return geoData.results[0].formatted_address;
      })
    )
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleMapsAPIKey}`
  }


}
