import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule,ReactiveFormsModule} from "@angular/forms";
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
import {AppRoutingModule} from "./app-routing.module";
import {PageComponent} from "./page/page.component";
import {TestComponent} from "./test/test.component";
import {AmChartsModule} from "amcharts3-angular2";
import { InferenceModelComponent } from './inference-model/inference-model.component';
import { StompService } from 'ng2-stomp-service-fixed';
/*import {FontAwesomeDirective} from "ng2-fontawesome";*/
import {enableProdMode} from '@angular/core';
enableProdMode();
import { ProgressComponent } from './jobDetail/progress/progress.component'
import {MyDataComponent} from './datasets/mydata/mydata.component'
import {PublicDataComponent} from './datasets/publicdata/publicdata.component'

import {ToastyModule} from 'ng2-toasty';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { PopupComponent } from './datasets/popup/popup.component';
import { ResumableModule } from 'ng2-resumable';
import { ConfirmComponent } from './confirm/confirm.component';
import {ErrorComponent} from './errortip/error.component';
import {NodataComponent} from './nodata/nodata.component'
import {GpuComponent} from "./jobDetail/gpu/gpu.component";
import {SenceComponent} from "./algchains/sence/sence";
import {ShowAllComponent} from "./showAll/showAll.component";
import {ApiComponent} from "./api/api.component";
import {DatasetsDetailComponent} from "./datasetsDetail/datasetsDetail.component";
import {PublishModelComponent} from "./publishmodel/publishmodel.component";
import {ShowTxtComponent} from "./showTxt/showTxt.component";
import {DatasetsSaveComponent} from "./dataSetSave/datasetsSave.component";
import {Ng2DragDropModule} from "ng2-drag-drop";
import {CreateFileComponent} from "./datasets/createfile/createfile.component";
import {MyFileComponent} from "./datasets/myfile/myfile.component";
import {EnterDatasetComponent} from "./datasets/enterdataset/enterdataset.component";
import {FileLevelComponent} from "./datasets/filelevel/filelevel.component";
import {MarkComponent} from "app/datasets/mark/mark.component";
import {AddMarkComponent} from "./datasets/mark/addmark/addmark";
import {TipsComponent} from "app/tips/tips.component";
import {PublicFileComponent} from "./datasets/publicFile/publicfile.component";
import {PublicDatasetComponent} from "app/datasets/publicdataset/publicdataset.component";
import {PublicLevelComponent} from "./datasets/publicLevel/publiclevel.component";
import {MyModelComponent} from "./inference-model/my-model/mymodel.component";
import { UniformTipsComponent } from './uniform-tips/uniform-tips.component';
import {DataPageComponent} from "./datasetsDetail/page/data-page.component";
import {PublicModelComponent} from "./inference-model/public-model/publicmodel.component";
import {BoostedTreeComponent} from "./boostedTree/boostedTree.component";
import { RunningTaskComponent } from './running-task/running-task.component';
import { CreateJobComponent } from './create-job/create-job.component';
import { UserComponent } from './user/user.component';
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
    PageComponent,
    InferenceModelComponent,
    MyDataComponent,
    PublicDataComponent,
    PopupComponent,
    ConfirmComponent,
    ProgressComponent,
    ErrorComponent,
    NodataComponent,
    GpuComponent,
    SenceComponent,
    ShowAllComponent,
    ApiComponent,
    DatasetsDetailComponent,
    PublishModelComponent,
    ShowTxtComponent,
    DatasetsSaveComponent,
    CreateFileComponent,
    AddMarkComponent,
    MyFileComponent,
    EnterDatasetComponent,
    FileLevelComponent,
    MarkComponent,
    TipsComponent,
    PublicFileComponent,
    PublicDatasetComponent,
    PublicLevelComponent,
    MyModelComponent,
    UniformTipsComponent,
    DataPageComponent,
    PublicModelComponent,
    BoostedTreeComponent,
    RunningTaskComponent,
    CreateJobComponent,
    UserComponent
    //InputReadonlyDirective
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    FileUploadModule,
    AmChartsModule,
    ToastyModule,
    BrowserAnimationsModule,
    ResumableModule,
    ReactiveFormsModule,
    Ng2DragDropModule.forRoot()
  ],
  providers: [StompService],
  bootstrap: [NavigationComponent]
})
export class AppModule {

}
