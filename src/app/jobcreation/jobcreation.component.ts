import {Component, Input} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../common/services/user.service";
import {JobService} from "../common/services/job.service";
import {SceneService} from "../common/services/scene.service";
import {PluginService} from "../common/services/plugin.service";
import {modelService} from "../common/services/model.service";
import {AlgChainService} from "../common/services/algChain.service";
import {Editable_param, Parameter} from "../common/defs/parameter";
import {ChainInfo, Cpu, CpuInfo, JobInfo, PluginInfo, SceneInfo} from "../common/defs/resources";
import {ToastyService, ToastyConfig} from 'ng2-toasty';
import {addWarningToast, addSuccessToast} from '../common/ts/toast';
import {DatasetsService} from "../common/services/datasets.service";
import {escape} from "querystring";
declare var $: any;
import {calc_height} from '../common/ts/calc_height'
import {nextTick} from "q";
import {ResourcesService} from "../common/services/resources.service";
@Component({
  moduleId: module.id,
  selector: 'jobcreation',
  styleUrls: ['./css/jobcreation.component.css'],
  templateUrl: './templates/jobcreation.html',
  providers: [UserService, JobService, SceneService, PluginService, modelService, AlgChainService, DatasetsService,ResourcesService]
})
export class JobCreationComponent {
  creator: any;
  editable_params: Editable_param[] = [];
  // 被选中plugin的参数组合（结合了字典）
  editable_parameters: Editable_param[] = [];
  // 是否已经创建了新的
  created: number = 0;
  //
  scenes: SceneInfo[] = [];
  scene: number;
  chosenSceneId: number;
  chosen_scene: SceneInfo = new SceneInfo();
  pluginArr: PluginInfo[] = [];
  PluginInfo: PluginInfo[] = [];
  chosenPluginId: string;
  createdJob: JobInfo = new JobInfo();
  pluginIds: string[] = [];
  // record the current step
  stepNumber: number = 1;
  // "manage"/"createJob"
  jobPageStatus: string = "manage";
  Jobs: JobInfo[] = [];
  Jobs_current: JobInfo[] = [];
  page: number = 1;
  pageMaxItem: number = 10;
  interval: any;
  // 右侧是否显示node参数，0--显示plugin参数 ， 1--显示node参数
  rightBox_node = 0;
  student: number;
  selected: number = 0;
  item: string = '0';
  ChainInfo: ChainInfo[] = [];
  arr: any[] = [];
  result: number = 1;
  remainder: number;
  data: number;
  length: number;
  haveModel: number = 0;
  firstChainId: string;
  firstSceneId:string='-1'
 /* @Input() statuss: string = '';*/
  jobName: string;
  pageNumber: number=0;
  d_dataSets: any = [];
  dataId: any;
  s_error_show: boolean = false;
  s_error_message: string = '';
  s_error_level: string = 'error';
  click_flag: boolean = true;
  name_validation: boolean = false;
  plugin_validation: boolean = false;
  data_validation: boolean = false;
  fileCount:number=0;
  focus:number=0;
  blur:number=0;
  gpus:any[]=[];
  gpuorder:any='';
  dataFirst:number;
  dataSecond:number;
  dataThird:number;
  cmemory:any;
  gmemory:number;
  auditing:any;
  cpu:number;
  gpu:number=0;
  core:number;
  datasetsType:any[]=[];
  dataKeyword:string='';
  username:string;

  tipWidth:string='';
  tipContent:string='';
  tipType:string='';
  showTip:boolean = false;
  tipMargin:string='';
  isTrain:boolean = false;
  notTrain:boolean = false;
  taskStatusArr:any[]=["请选择任务状态","未启动","运行","停止","完成","异常","模型发布中","模型发布成功","模型发布失败"];
  taskStatusArr1:any[]=["请选择任务状态","模型发布中","模型发布成功","模型发布失败"];
  taskStatusArr2:any[]=["请选择任务状态","未启动","运行","停止","完成","异常","模型发布中","模型发布成功","模型发布失败"];
  taskStatus:string='';
  chainName:string='';
  allAuthority:any[]=[];
  runJobAuthority:boolean = false;
  operateJobAuthority:boolean = false;
  lookChainsAuthority:boolean = false;
  editChainsAuthority:boolean = false;
  deductionAuthority:boolean = false;
  lookDatasetsAuthority:boolean = false;
  failReason:any[]=[];
  showFailReason:any[]=[];
  intervalFailReason: any;
  showMore:boolean = true;
  showHtml:string='true';
  constructor(private sceneService: SceneService, private jobService: JobService, private  modelService: modelService, private algChainService: AlgChainService, private pluginService: PluginService, private userService: UserService, private router: Router, private route: ActivatedRoute, private toastyService: ToastyService, private toastyConfig: ToastyConfig, private datasetsService: DatasetsService, private location: Location,private resourcesService: ResourcesService) {
    this.username = localStorage['username'];
    this.allAuthority = JSON.parse(localStorage['allAuthority']);
    for(let i=0;i<this.allAuthority.length;i++){
      if(this.allAuthority[i].basAuthority.id=='13'){
        for(let j=0;j<this.allAuthority[i].childAuthorityTreeDtos.length;j++){
          if(this.allAuthority[i].childAuthorityTreeDtos[j].basAuthority.id=='14'&&this.allAuthority[i].childAuthorityTreeDtos[j].hasAuthority){
            this.operateJobAuthority = true;
          }
          if(this.allAuthority[i].childAuthorityTreeDtos[j].basAuthority.id=='15'&&this.allAuthority[i].childAuthorityTreeDtos[j].hasAuthority){
            this.runJobAuthority = true;
          }
          if(this.allAuthority[i].childAuthorityTreeDtos[j].basAuthority.id=='17'&&this.allAuthority[i].childAuthorityTreeDtos[j].hasAuthority){
            this.lookChainsAuthority = true;
          }
          if(this.allAuthority[i].childAuthorityTreeDtos[j].basAuthority.id=='18'&&this.allAuthority[i].childAuthorityTreeDtos[j].hasAuthority){
            this.editChainsAuthority = true;
          }
          if(this.allAuthority[i].childAuthorityTreeDtos[j].basAuthority.id=='19'&&this.allAuthority[i].childAuthorityTreeDtos[j].hasAuthority){
            this.deductionAuthority = true;
          }
          if(this.allAuthority[i].childAuthorityTreeDtos[j].basAuthority.id=='16'&&this.allAuthority[i].childAuthorityTreeDtos[j].hasAuthority){
            this.lookDatasetsAuthority = true;
          }
        }
      }
    }
    this.taskStatus = this.taskStatusArr[0];
    this.getFailReason();
    this.intervalFailReason = setInterval(() =>this.getFailReason(), 10000);
    pluginService.getLayerDict()
      .subscribe(dictionary => this.getDictionary(dictionary));
    this.pluginService.getTranParamTypes()
      .subscribe(editable_params => this.getTranParamTypes(editable_params));
  }
  toggle(){
    if(this.showMore){
      this.showFailReason = this.failReason;
    }else{
      this.showFailReason = this.failReason.slice(0,2);
    }
    this.showMore = !this.showMore;
    sessionStorage['show'] = this.showMore;
    this.showHtml = sessionStorage['show'];
  }
  getFailReason(){
    this.jobService.getFailReason()
      .subscribe(result=>{
        this.failReason = result;
        if(sessionStorage['show']!=undefined){
          if(sessionStorage['show']=='true'){
            this.showFailReason = this.failReason.slice(0,2);
          }else{
            this.showFailReason = this.failReason;
          }
        }else{
          if(this.failReason.length>2){
            this.showMore = true;
            this.showHtml = 'true';
            this.showFailReason = this.failReason.slice(0,2);
          }else{
            this.showFailReason = this.failReason;
          }
        }
      })
  }
  close(id){
    this.jobService.updateFailReason(id)
      .subscribe(result=>{
        if(result.text()=='true'){
            this.getFailReason();
        }
      })
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params['page']!=undefined){
        this.pageNumber = params['page'];
      }
    });
  }
  ngOnDestroy() {
    // 退出时停止更新
    clearInterval(this.interval);
    clearInterval(this.intervalFailReason);
    sessionStorage.removeItem('show');
  }
  searchLeft(){
    this.focus=1;
    this.blur=1;
  }
  searchBlur(){
    if(this.jobName){
      this.focus=1;
    }else{
      this.focus=0;
    }
    this.blur=0;
  }
  getTranParamTypes(editable_params) {
    // editable_params为参数字典
    this.editable_params = editable_params;
  }

  output(statu) {
    if (statu == 1) {
      return "是";
    } else if (statu == 0) {
      return "否";
    }
  }

  // createJob
  createJob() {
    this.router.navigate(['../createjob']);
  }
  sceneReadOnly(){
    if(this.student==11||this.student==15){
      document.getElementById('train').setAttribute('readonly', 'true');
      document.getElementById('valid').setAttribute('readonly', 'true');
      document.getElementById('test').setAttribute('readonly', 'true');
    }else{
      document.getElementById('train').removeAttribute('readonly');
      document.getElementById('valid').removeAttribute('readonly');
      document.getElementById('test').removeAttribute('readonly');
    }
  }

  goHistory() {
    this.jobPageStatus = 'manage';
    this.jobName='';
  }

  viewDetail(id, name) {
    this.item = id;
    this.creator = name;
    this.router.navigate(['../algchains'], {queryParams: {"chain_id": this.item, "creator": this.creator}});
  }

  getDictionary(dictionary) {
    $('#layer_dictionary').val(JSON.stringify(dictionary));
  }

  createJob_getScene(scenes) {
    this.jobPageStatus = "createJob";
    this.scenes = scenes;
    if (scenes[0]) {
      this.chosenSceneId = scenes[0].id;
    }
    nextTick(() => {
      calc_height(document.getElementsByClassName('allContent')[0]);
    })
  }

  nameChange() {
    if (this.jobName) {
      this.name_validation = true;
      this.s_error_show = false;
    } else {
      this.name_validation = false;
    }

    //this.judgeClick();
  }

  /**
   * 是否可以点击创建
   * */
/*  judgeClick() {
    if (this.name_validation && this.plugin_validation && this.data_validation) {
      this.createBtn = 1;
    } else {
      this.createBtn = 0;
    }
  }*/
  showTipChange(event){
    this.showTip = false;
  }
  nooperate(event){
    this.showTip = true;
    this.tipWidth = "100%";
    this.tipType = "error";
    this.tipContent = "测试版本下最多同时运行五个任务！";
    this.tipMargin = "0 auto";
  }
  nodeClicked() {
    // 改变右侧显示的内容--显示node
    this.rightBox_node = 1;
  }


  saveJobNormalPlugin(response, plugin_id) {
    if (response.status == 200) {
      //console.info("plugins -- " + plugin_id + "save ok");
    } else {
      //console.warn("save failed");
    }
  }

/*
  create() {
    this.jobService.runJob(this.createdJob.jobPath)
      .subscribe(reply => this.runJobResult(reply, this.createdJob.jobPath));
  }
*/

  runJobResult(reply, jobPath) {
    // 成功运行
    if (reply.status == 200) {
      // 重新获取所有Job
      // this.jobService.getAllJobs(this.page-1,this.pageMaxItem);
      // 前往详情界面
      this.router.navigate(['/jobDetail', jobPath]);
    } else {
      // 运行失败报错
    }
  }


  getTotals(num) {
    if (this.PluginInfo.length % num == 0) {
      this.result = Math.floor(this.PluginInfo.length / num);
    } else {
      this.result = Math.floor(this.PluginInfo.length / num) + 1;
    }
  }

  maxItemChange(num) {
    this.page = 1;
    this.arr = this.PluginInfo.slice(0, num);
    this.getTotals(num);
  }

  set2dArray(parameter: Parameter, i1: number, j1: number, value: string) {
    if ((parameter.d_type == 'int' || parameter.d_type == 'float') && Number(value) + "" == NaN + "") {
      // alert('输入必须为数值!');
      addWarningToast(this.toastyService, "输入必须为数值");
    } else {
      parameter.set_value[i1][j1] = Number(value);
    }
  }

  set3dArray(parameter: Parameter, i1: number, j1: number, z1: number, value: string) {
    if ((parameter.d_type == 'int' || parameter.d_type == 'float') && Number(value) + "" == NaN + "") {
      // alert('输入必须为数值!');
      addWarningToast(this.toastyService, "输入必须为数值");
    } else {
      parameter.set_value[i1][j1][z1] = Number(value);
    }
  }

  $scene_select_change(name) {
    //console.log(this.firstSceneId);
    for (let i in this.PluginInfo) {
      if (name == this.PluginInfo[i].chain_name) {
        this.firstChainId = this.PluginInfo[i].id;
        this.chainName = this.PluginInfo[i].chain_name;
      }
    }
    if (name == '--请选择--') {
      //document.getElementById('data').setAttribute('disabled', 'disabled');
      document.getElementById('train').setAttribute('readonly', 'true');
      document.getElementById('valid').setAttribute('readonly', 'true');
      document.getElementById('test').setAttribute('readonly', 'true');
      this.firstChainId = '';
      this.plugin_validation = false;
      return false;
    }
    if(this.firstChainId) {
      //document.getElementById('data').removeAttribute('disabled');
      document.getElementById('train').removeAttribute('readonly');
      document.getElementById('valid').removeAttribute('readonly');
      document.getElementById('test').removeAttribute('readonly');
      this.plugin_validation = true;
    } else {
      this.plugin_validation = false;
    }
    if(this.student==15||this.student==11){
      //document.getElementById('data').setAttribute('disabled', 'disabled');
      document.getElementById('train').setAttribute('readonly', 'true');
      document.getElementById('valid').setAttribute('readonly', 'true');
      document.getElementById('test').setAttribute('readonly', 'true');
      return
    }
    if (this.firstSceneId) {
      this.s_error_show = false;
    }
  }
  chooseTrain(){
    this.isTrain = !this.isTrain;
    if(this.isTrain==false && this.notTrain == true){
      this.taskStatusArr = this.taskStatusArr1;
      if(this.taskStatusArr1.indexOf(this.taskStatus)<0){
        this.taskStatus = '请选择任务状态';
      }
    }else{
      this.taskStatusArr = this.taskStatusArr2;
    }
  }
  chooseTuiyan(){
    this.notTrain = !this.notTrain;
    if(this.notTrain==false){
      this.taskStatusArr =this.taskStatusArr2;
    }else if(this.isTrain==false){
      this.taskStatusArr =this.taskStatusArr1;
      if(this.taskStatusArr1.indexOf(this.taskStatus)<0){
        this.taskStatus = '请选择任务状态';
      }
    }
  }
}
