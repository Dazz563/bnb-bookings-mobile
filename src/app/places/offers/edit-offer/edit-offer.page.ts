import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place, PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  place: Place;
  form: FormGroup;
  private placesSub: Subscription;
  isLoading = false;
  placeId: string;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) { }


  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placesId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placesSub = this.placesService.getPlace(paramMap.get('placesId')).subscribe((place: Place) => {
        this.place = place;

        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          description: new FormControl(this.place.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)]
          }),
        })
        this.isLoading = false;

      }, err => {
        this.alertCtrl.create({
          header: 'An error occured',
          message: 'Place could not be fetched',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.router.navigateByUrl('/places/tabs/offers');
              }
            }
          ]
        })
          .then(alertEl => {
            alertEl.present();
          })
      })
    })
  }

  onUpdateOffer() {
    if (this.form.invalid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Updating place...',
    })
      .then(loadingEl => {
        loadingEl.present();
        this.placesService.updatePlace(
          this.place.id,
          this.form.value.title,
          this.form.value.description,
        ).subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigateByUrl('/places/tabs/offers');
        });
      })
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
