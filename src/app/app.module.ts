import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {AppComponent} from "./app.component";
import {AlgPluginsComponent} from "./algplugins/algplugins.component";
import {DatasetsComponent} from "./datasets/datasets.component";
import {JobCreationComponent} from "./jobcreation/jobcreation.component";
import {NavigationComponent} from "./navigation/navigation.component";
import {NetworkEditorComponent} from "./network-editor/network-editor.component";
import {OverviewComponent} from "./overview/overview.component";
import {TrainingJobsComponent} from "./trainingjobs/trainingjobs.component";
import {VisualizedNetworkComponent} from "./network-editor/visualized-network.component";
import {LoginComponent} from "./login/login.component";
import {ModelComponent} from "./model/model.component";
import {NetworkComponent} from "./network/network.component";
import {AlgchainDetailComponent} from "./algchainDetail/algchainDetail.component";
import {JobDetailComponent} from "./jobDetail/jobDetail.component";
import {AlgpluginDetailComponent} from "./algpluginDetail/algpluginDetail.component";
import {ModelDetailComponent} from "./modelDetail/modelDetail.component";
import {HistoryComponent} from "./history/history.component";
import {HistoryDetailComponent} from "./historyDetail/historyDetail.component";
import {AlgorithmChainComponent} from "./algorithmChain/algorithmChain.component";
import {TaskStatusComponent} from "./taskStatus/taskStatus.component";
import {AlgchainAloneComponent} from "./algchainAlone/algchainAlone.component";
import {ShowResultComponent} from "./showResult/showResult.component";
import {ShowImageComponent} from "./showImage/showImage.componment";
import {FileUploadModule} from "ng2-file-upload";
import {AlgChainsComponent} from "./algchains/algchains.component";
import {Router} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {PageComponent} from "./page/page.component";
import {TestComponent} from "./test/test.component";

@NgModule({
  declarations: [
    AppComponent, AlgChainsComponent, DatasetsComponent,
    AlgPluginsComponent,
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
    ModelDetailComponent,
    HistoryComponent,
    HistoryDetailComponent,
    AlgorithmChainComponent,
    TaskStatusComponent,
    AlgchainAloneComponent,
    ShowResultComponent,
    ShowImageComponent,
    TestComponent,
    PageComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    FileUploadModule,
  ],
  providers: [],
  bootstrap: [NavigationComponent]
})
export class AppModule {
}
