import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AlgChainsComponent } from './components/algchains/algchains.component'
import { AlgPluginsComponent } from './components/algplugins/algplugins.component'
import { DatasetsComponent } from './components/datasets/datasets.component'
import { JobCreationComponent } from './components/jobcreation/jobcreation.component'
import { NavigationComponent } from './components/navigation/navigation.component'
import { NetworkEditorComponent } from './components/network-editor/network-editor.component';
import { OverviewComponent } from './components/overview/overview.component'
import { TrainingJobsComponent } from './components/trainingjobs/trainingjobs.component'
import { VisualizedNetworkComponent } from './components/network-editor/visualized-network.component'
import { LoginComponent } from './components/login/login.component'
import { ModelComponent } from './components/model/model.component'
import { NetworkComponent } from './components/network/network.component'
import { AlgchainDetailComponent } from './components/algchainDetail/algchainDetail.component'
import { JobDetailComponent } from './components/jobDetail/jobDetail.component'
import { AlgpluginDetailComponent } from './components/algpluginDetail/algpluginDetail.component'
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [AppRoutingModule, BrowserModule, HttpModule,FormsModule],
    declarations: [
        AlgChainsComponent,
        AlgPluginsComponent,
        DatasetsComponent,
        JobCreationComponent,
        NavigationComponent,
        NetworkEditorComponent,
        OverviewComponent,
        TrainingJobsComponent,
        VisualizedNetworkComponent,
        LoginComponent,
        ModelComponent,
        NetworkComponent,
        AlgchainDetailComponent,
        JobDetailComponent,
        AlgpluginDetailComponent,
    ],
    bootstrap: [NavigationComponent]
})
export class AicanvasModule { }
