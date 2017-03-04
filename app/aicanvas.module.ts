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



@NgModule({
    imports: [AppRoutingModule, BrowserModule, HttpModule],
    declarations: [
        AlgChainsComponent,
        AlgPluginsComponent,
        DatasetsComponent,
        JobCreationComponent,
        NavigationComponent,
        NetworkEditorComponent,
        OverviewComponent,
        TrainingJobsComponent,
        VisualizedNetworkComponent
    ],
    bootstrap: [NavigationComponent]
})
export class AicanvasModule { }