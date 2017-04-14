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
import { ModelComponent } from './components/model/model.component'
import { NetworkComponent } from './components/network/network.component'
import { AlgchainDetailComponent } from './components/algchainDetail/algchainDetail.component'
import { JobDetailComponent } from './components/jobDetail/jobDetail.component'
import { AlgpluginDetailComponent } from './components/algpluginDetail/algpluginDetail.component'
import {ModelDetailComponent} from "./components/modelDetail/modelDetail.component";

const routes: Routes = [
  //{ path: '', component: NavigationComponent },
  { path: 'algchainDetail/:scene_id',component: AlgchainDetailComponent },
  { path: 'algchains', component: AlgChainsComponent },
  { path: 'algplugins', component: AlgPluginsComponent },
  { path: 'datasets', component: DatasetsComponent },
  { path: 'jobcreation', component: JobCreationComponent },
  { path: 'trainingjobs', component: TrainingJobsComponent },
  { path: 'overview', component: OverviewComponent },
  { path: 'network-editor', component: NetworkEditorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'model', component: ModelComponent },
  { path: 'modelDetail', component: ModelDetailComponent },
  { path: 'network/:scene_id', component: NetworkComponent },
  { path: 'jobDetail/:job_id', component: JobDetailComponent },
  { path: 'algpluginDetail/:plugin_id', component: AlgpluginDetailComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

 // { path: 'detail/:id', component: HeroDetailComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
