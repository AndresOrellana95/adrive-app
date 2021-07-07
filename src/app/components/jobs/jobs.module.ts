import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreService } from '../../services/store.service';
import { TeamService } from '../../services/teams.service';
import { SectorsService } from '../../services/sectors.service';
import { ManageService } from '../../services/manage.services';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuardService } from '../../services/auth-guard.service';
import { GeoLocationService } from '../../services/geo-location.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { RegistryJobComponent } from '../../components/jobs/registry-job/registry-job.component';
import { JobsRoutingModule } from './jobs-routing.module';
import { CheckScheduleComponent } from './check-schedule/check-schedule.component';
import { ImageToDataUrlModule } from "ngx-image2dataurl";

@NgModule({
    declarations: [
        RegistryJobComponent,
        CheckScheduleComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        ImageToDataUrlModule,
        AgmCoreModule.forRoot({
            apiKey: 'HERE GOES THE GOOGLE KEY API CONFIGURED ON GCP'
          }),
        AgmDirectionModule,
        AutocompleteLibModule,
        NgbModule,
        JobsRoutingModule,
    ],
    providers: [
        StoreService,
        SectorsService,
        TeamService,
        ManageService,
        GeoLocationService,
        GoogleMapsAPIWrapper,
        NgbProgressbarConfig,
        AuthGuardService
    ]
})

export class JobsModule {}
