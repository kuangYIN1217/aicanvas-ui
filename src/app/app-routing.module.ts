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


const routes: Routes = [
  //{ path: '', component: NavigationComponent },
  {path: 'algchainDetail/:scene_id', component: AlgchainDetailComponent},
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
  {path: 'jobDetail/:jobPath', component: JobDetailComponent},
  {path: 'jobDetail', component: JobDetailComponent},
  {path: 'algpluginDetail/:plugin_id', component: AlgpluginDetailComponent},
  {path: 'algpluginDetail', component: AlgpluginDetailComponent},
  {path: 'history', component: HistoryComponent},
  {path: 'historyDetail', component: HistoryDetailComponent},
  {path: 'algorithmChain', component: AlgorithmChainComponent},
  {path: 'taskStatus', component: TaskStatusComponent},
  {path: 'page', component: PageComponent},
  {path: 'test', component: TestComponent},
  {path: 'algchainAlone', component: AlgchainAloneComponent},
  {path: 'showResult', component: ShowResultComponent},
  {path: 'showImage', component: ShowImageComponent},
  {path: 'nav', component: NavigationComponent},
  {path: 'inferenceModel', component: InferenceModelComponent},
  {path: '', redirectTo: '/nav', pathMatch: 'full'},
  // { path: 'detail/:id', component: HeroDetailComponent },

];
@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
