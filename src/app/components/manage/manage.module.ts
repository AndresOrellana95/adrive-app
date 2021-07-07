import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoadDotsComponent } from './load-dots/load-dots.component';
import { ManageRoutingModule } from './manage-routing.module';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreService } from '../../services/store.service';
import { TeamService } from '../../services/teams.service';
import { SectorsService } from '../../services/sectors.service';
import { ManageService } from '../../services/manage.services';
import { SaveDotsComponent } from './save-dots/save-dots.component';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuardService } from '../../services/auth-guard.service';
import { StocktackingComponent } from './stocktacking/stocktacking.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CheckjobComponent } from './checkjob/checkjob.component';
import { ImageToDataUrlModule } from "ngx-image2dataurl";

@NgModule({
    declarations: [
        LoadDotsComponent,
        SaveDotsComponent,
        StocktackingComponent,
        CheckjobComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ManageRoutingModule,
        ImageToDataUrlModule,
        ReactiveFormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'HERE GOES THE API KEY CONFIURED ON GCP'
          }),
        AgmDirectionModule,
        AutocompleteLibModule,
        NgbModule
    ],
    providers: [
        StoreService,
        SectorsService,
        TeamService,
        ManageService,
        GoogleMapsAPIWrapper,
        NgbProgressbarConfig,
        AuthGuardService
    ]
})

export class ManageModule {}
