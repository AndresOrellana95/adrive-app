import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistryJobComponent } from './registry-job/registry-job.component';
import { CheckScheduleComponent } from './check-schedule/check-schedule.component';
import { AuthGuardService as AuthGuard } from '../../services/auth-guard.service';

const routes: Routes = [
    { path: 'register', canActivate: [AuthGuard], data:{role:[2]}, component: RegistryJobComponent },
    { path: 'schedule', canActivate: [AuthGuard], data:{role:[2]}, component: CheckScheduleComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JobsRoutingModule {}
