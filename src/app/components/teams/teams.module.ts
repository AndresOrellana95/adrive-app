import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgmDirectionModule } from 'agm-direction';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamService } from '../../services/teams.service';
import { AuthService } from '../../services/auth.service';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { TeamsRoutingModule } from './teams-routing.module';
import { TeamControlComponent } from './team-control/team-control.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { DecimalPipe } from '@angular/common';
import { AuthGuardService } from '../../services/auth-guard.service';

@NgModule({
    declarations: [
        TeamControlComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        AgmDirectionModule,
        NgbModule,
        TeamsRoutingModule,
        ReactiveFormsModule,
        AutocompleteLibModule
    ],
    providers: [
        AuthService,
        TeamService,
        NgbProgressbarConfig,
        DecimalPipe,
        AuthGuardService
    ]
})

export class TeamModule {}