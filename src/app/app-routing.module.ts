import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AlgchainDetailComponent} from "./algchainDetail/algchainDetail.component";
import {AlgPluginsComponent} from "./algplugins/algplugins.component";
import {DatasetsComponent} from "./datasets/datasets.component";
import {JobCreationComponent} from "./jobcreation/jobcreation.component";
import {TrainingJobsComponent} from "./trainingjobs/trainingjobs.component";
import {OverviewComponent} from "./overview/overview.component";
import {NetworkEditorComponent} from "./network-editor/network-editor.component";
import {LoginComponent} from "./login/login.component";
import {ModelComponent} from "./model/model.component";
import {ModelDetailComponent} from "./modelDetail/modelDetail.component";
import {NetworkComponent} from "./network/network.component";
import {JobDetailComponent} from "./jobDetail/jobDetail.component";
import {AlgpluginDetailComponent} from "./algpluginDetail/algpluginDetail.component";
import {HistoryComponent} from "./history/history.component";
import {HistoryDetailComponent} from "./historyDetail/historyDetail.component";
import {AlgorithmChainComponent} from "./algorithmChain/algorithmChain.component";
import {TaskStatusComponent} from "./taskStatus/taskStatus.component";
import {AlgchainAloneComponent} from "./algchainAlone/algchainAlone.component";
import {ShowResultComponent} from "./showResult/showResult.component";
import {ShowImageComponent} from "./showImage/showImage.componment";
import {AlgChainsComponent} from "./algchains/algchains.component";
import {NavigationComponent} from "./navigation/navigation.component";
import {TestComponent} from "./test/test.component";
import {PageComponent} from "./page/page.component";
import {InferenceModelComponent} from "./inference-model/inference-model.component";
import {GpuComponent} from "./jobDetail/gpu/gpu.component";
import {ShowAllComponent} from "./showAll/showAll.component";
import {ApiComponent} from "./api/api.component";
import {DatasetsDetailComponent} from "./datasetsDetail/datasetsDetail.component";
import {PublishModelComponent} from "./publishmodel/publishmodel.component";
import {ShowTxtComponent} from "./showTxt/showTxt.component";
import {DatasetsSaveComponent} from "./dataSetSave/datasetsSave.component";
import {CreateFileComponent} from "./datasets/createfile/createfile.component";
import {EnterDatasetComponent} from "./datasets/enterdataset/enterdataset.component";
import {FileLevelComponent} from "./datasets/filelevel/filelevel.component";
import {MarkComponent} from "./datasets/mark/mark.component";
import {PublicDatasetComponent} from "./datasets/publicdataset/publicdataset.component";
import {MyModelComponent} from "./inference-model/my-model/mymodel.component";
import {DataPageComponent} from "./datasetsDetail/page/data-page.component";


const routes: Routes = [
  //{ path: '', component: NavigationComponent },
  {path: 'algchainDetail/:scene_id', component: AlgchainDetailComponent },
  {path: 'algchains', component: AlgChainsComponent},
  {path: 'algplugins', component: AlgPluginsComponent},
  {path: 'datasets', component: DatasetsComponent},
  {path: 'jobcreation', component: JobCreationComponent},
  {path: 'trainingjobs', component: TrainingJobsComponent},
  {path: 'overview', component: OverviewComponent},
  {path: 'network-editor', component: NetworkEditorComponent},
  {path: 'network', component: NetworkComponent},
  {path: 'login', component: LoginComponent},
  {path: 'model', component: ModelComponent},
  {path: 'modelDetail', component: ModelDetailComponent},
  {path: 'network/:scene_id', component: NetworkComponent},
  {path: 'jobDetail/:job_id', component: JobDetailComponent},
  {path: 'jobDetail/:job_id/:page', component: JobDetailComponent},
  // {path: 'jobcreation?pageNo=:page', component: JobDetailComponent},
  {path: 'jobDetail/:jobPath', component: JobDetailComponent},
  {path: 'jobDetail', component: JobDetailComponent},
  {path: 'algpluginDetail/:plugin_id', component: AlgpluginDetailComponent},
  {path: 'algpluginDetail', component: AlgpluginDetailComponent},
  {path: 'history', component: HistoryComponent},
  {path: 'historyDetail', component: HistoryDetailComponent},
  {path: 'algorithmChain', component: AlgorithmChainComponent},
  {path: 'taskStatus', component: TaskStatusComponent},
  {path: 'page', component: PageComponent},
  {path: 'data-page', component: DataPageComponent},
  {path: 'test', component: TestComponent},
  {path: 'algchainAlone', component: AlgchainAloneComponent},
  {path: 'showResult', component: ShowResultComponent},
  {path: 'showImage', component: ShowImageComponent},
  {path: 'nav', component: NavigationComponent},
  {path: 'inferenceModel', component: InferenceModelComponent},
  {path: 'gpu', component: GpuComponent},
  {path: 'showall', component: ShowAllComponent},
  {path: 'api', component: ApiComponent},
  {path: 'datasetsdetail', component: DatasetsDetailComponent},
  {path: 'publishmodel', component: PublishModelComponent},
  {path: 'showtxt', component: ShowTxtComponent},
  {path: 'datasetssave', component: DatasetsSaveComponent},
  {path: 'createfile', component: CreateFileComponent},
  {path: 'enterdataset', component: EnterDatasetComponent},
  {path: 'publicdataset', component: PublicDatasetComponent},
  {path: 'filelevel', component: FileLevelComponent},
  {path: 'mark', component: MarkComponent},
  {path: 'mymodel', component: MyModelComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  // { path: 'detail/:id', component: HeroDetailComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
