import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlgChainsComponent } from './components/algchains/algchains.component'
import { AlgPluginsComponent } from './components/algplugins/algplugins.component'
import { DatasetsComponent } from './components/datasets/datasets.component'
import { JobCreationComponent } from './components/jobcreation/jobcreation.component'
import { NavigationComponent } from './components/navigation/navigation.component'
import { NetworkEditorComponent } from './components/network-editor/network-editor.component'
import { OverviewComponent } from './components/overview/overview.component'
import { TrainingJobsComponent } from './components/trainingjobs/trainingjobs.component'
import { VisualizedNetworkComponent } from './components/network-editor/visualized-network.component'
import { LoginComponent } from './components/login/login.component'

const routes: Routes = [
  //{ path: '', component: NavigationComponent },
  { path: 'algchains', component: AlgChainsComponent },
  { path: 'algplugins', component: AlgPluginsComponent },
  { path: 'datasets', component: DatasetsComponent },
  { path: 'jobcreation', component: JobCreationComponent },
  { path: 'trainingjobs', component: TrainingJobsComponent },
  { path: 'overview', component: OverviewComponent },
  { path: 'network-editor', component: NetworkEditorComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

 // { path: 'detail/:id', component: HeroDetailComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
