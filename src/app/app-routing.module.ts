import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
  { path: 'manage', loadChildren: () => import('./components/manage/manage.module').then(m => m.ManageModule) },
  { path: 'teams', loadChildren: () => import('./components/teams/teams.module').then(m => m.TeamModule) },
  { path: 'jobs', loadChildren: () => import('./components/jobs/jobs.module').then(m => m.JobsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
