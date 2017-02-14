import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { RouterModule }   from '@angular/router';

import { NetworkEditorComponent } from './network-editor.component';
import { VisualizedNetworkComponent } from './visualized-network.component'
                                   
import { AppRoutingModule }     from './app-routing.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule],
    declarations: [NetworkEditorComponent, VisualizedNetworkComponent],
    bootstrap: [NetworkEditorComponent]
})
export class WorkspaceModule {}