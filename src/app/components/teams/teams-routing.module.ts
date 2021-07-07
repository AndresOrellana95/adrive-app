import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamControlComponent } from './team-control/team-control.component';
import { AuthGuardService as AuthGuard } from '../../services/auth-guard.service';

const routes: Routes = [
    { path: 'control', canActivate: [AuthGuard], data:{role:[1,3]},component: TeamControlComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeamsRoutingModule {}
