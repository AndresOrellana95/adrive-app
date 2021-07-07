import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadDotsComponent } from './load-dots/load-dots.component';
import { StocktackingComponent } from '../manage/stocktacking/stocktacking.component';
import { CheckjobComponent } from '../manage/checkjob/checkjob.component';
import { AuthGuardService as AuthGuard } from '../../services/auth-guard.service';

const routes: Routes = [
    { path: 'map', canActivate: [AuthGuard],data:{role:[1,3]},component: LoadDotsComponent},
    { path: 'stock', canActivate: [AuthGuard],data:{role:[1,3]},component: StocktackingComponent },
    { path: 'checkjob', canActivate: [AuthGuard], data: {role:[1,3]},component: CheckjobComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageRoutingModule {}
