import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MapModalComponent } from "./map-modal/map-modal.component";
import { LocationPickerComponent } from "./pickers/location-picker/location-picker.component";
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

@NgModule({
    declarations: [
        LocationPickerComponent,
        MapModalComponent,
    ],
    exports: [
        LocationPickerComponent,
        MapModalComponent,
    ],
    imports: [
        CommonModule,
        IonicModule,
    ],
    entryComponents: [
        MapModalComponent,
    ]

})
export class SharedModule {

}