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
  @Input() statuss: string = '';
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
  constructor(private sceneService: SceneService, private jobService: JobService, private  modelService: modelService, private algChainService: AlgChainService, private pluginService: PluginService, private userService: UserService, private router: Router, private route: ActivatedRoute, private toastyService: ToastyService, private toastyConfig: ToastyConfig, private datasetsService: DatasetsService, private location: Location,private resourcesService: ResourcesService) {
    this.username = localStorage['username'];
    pluginService.getLayerDict()
      .subscribe(dictionary => this.getDictionary(dictionary));
    this.pluginService.getTranParamTypes()
      .subscribe(editable_params => this.getTranParamTypes(editable_params));
    this.resourcesService.getCpuInfo()
      .subscribe(result=>{
        this.cpu = (Math.ceil(result.tot_memory/1024/1024/1024/8))*8;
        this.core = result.cores;
        $("#cpu").attr('placeholder',`1-${this.core}`);
        $("#memory").attr('placeholder',`1-${this.cpu}`);
      })
    this.getDataSets(1,this.username);
    // if (location.path(false).indexOf('/jobcreation/') != -1) {
    //   this.pageNo = location.path(false).split('/jobcreation/')[1];
    //   if(this.pageNo){
    //     console.log(this.pageNo);
    //   }
    // }
    this.datasetsService.getDataSetType()
      .subscribe(result=>{
        this.datasetsType = result;
        this.datasetsType[0].flag = 1;
        //console.log(this.datasetsType);
      })
  }
  dataKeywordChange(){
    let type:number;
    for(let i=0;i<this.datasetsType.length;i++){
      if(this.datasetsType[i].flag==1){
        type = this.datasetsType[i].id;
      }
    }
    this.searchDataSets(type,this.dataKeyword,this.username);
  }
  searchDataSets(type,name,creator){
    this.datasetsService.searchDatasets(type,name,creator)
      .subscribe(result=>{
        this.d_dataSets = result.content;
        if(this.d_dataSets.length>0){
          this.dataId = this.d_dataSets[0].dataId;
        }
        //console.log(result);
      });
  }
  getDataSets(type,creator){
    this.datasetsService.createJobGetDatasets(type,creator)
      .subscribe(result=>{
        this.d_dataSets = result.content;
        this.dataId = this.d_dataSets[0].dataId;
        this.fileCount = this.d_dataSets[0].fileCount;
      });
  }
  getImage(item){
    if(item.id==1){
      if(item.flag==undefined||item.flag==2){
        return 'assets/datasets/createfile/tp_hui.png';
      }
      else
        return 'assets/datasets/createfile/tp_lv.png';
    }else if(item.id==2){
      if(item.flag==undefined||item.flag==2)
        return 'assets/datasets/createfile/yp_hui.png';
      else
        return 'assets/datasets/createfile/yp_lv.png';
    }else if(item.id==3){
      if(item.flag==undefined||item.flag==2)
        return 'assets/datasets/createfile/wb_hui.png';
      else
        return 'assets/datasets/createfile/wb_lv.png';
    }else if(item.id==4){
      if(item.flag==undefined||item.flag==2)
        return 'assets/datasets/createfile/sp_hui.png';
      else
        return 'assets/datasets/createfile/sp_lv.png';
    }else if(item.id==5){
      if(item.flag==undefined||item.flag==2)
        return 'assets/datasets/createfile/qt_hui.png';
      else
        return 'assets/datasets/createfile/qt_lv.png';
    }
  }
  chooseImg(item){
    //console.log(item);
    if(item.flag != 1){
      for(let i=0;i<this.datasetsType.length;i++){
        this.datasetsType[i].flag = 2;
      }
      item.flag = 1;
      this.getImage(item);
      if(this.dataKeyword==''){
        this.getDataSets(item.id,this.username);
      }else{
        this.searchDataSets(item.id,this.dataKeyword,this.username);
      }
    }
  }
  getCore(){
    let reg=new RegExp(/^[1-9]\d*$|^0$/);
    if(Number(this.auditing)>this.core){
      this.s_error_show = true;
      this.s_error_message = '核数不能超过'+this.core;
      this.s_error_level = "error";
    }else if(!reg.test(this.auditing)&&this.auditing!=''&&this.auditing!=null){
      this.s_error_show = true;
      this.s_error_message = '核数格式错误';
      this.s_error_level = "error";
    }else if(this.auditing==0){
      this.s_error_show = true;
      this.s_error_message = '核数必须大于0';
      this.s_error_level = "error";
    }else{
      this.s_error_show = false;
    }
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params['page']!=undefined){
        this.pageNumber = params['page'];
      }
      //console.log(this.pageNumber);
    });
    //this.router.navigate(['../taskStatus'],{queryParams: { pageNumber: this.pageNumber}});
  }

  /*ngAfterViewChecked(){
   console.log(this.name_validation,this.plugin_validation,this.data_validation);
   if(this.name_validation&&this.plugin_validation&&this.data_validation){
   this.createBtn=1;
   }
   }*/
  ngOnDestroy() {
    // 退出时停止更新
    clearInterval(this.interval);
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

  changeChosenSceneId() {
/*    if(this.student==15||this.student==11){
      document.getElementById('data').setAttribute('disabled', 'disabled');
    }*/
    this.fileCount=0;
    let id = this.student;
    //console.log(id);
    this.chosenSceneId = id;
    this.firstChainId = null;
    //this.dataId = null;
    this.auditing=null;
    this.gpuorder='';
    // this.gmemory=null;
    this.cmemory=null;
    this.dataFirst=null;
    this.dataSecond=null;
    this.dataThird=null;
    this.sceneService.getChainByScene(id)
      .subscribe(results => {
        this.PluginInfo = results;
        this.arr = results;
        this.data = Math.floor(this.PluginInfo.length / this.pageMaxItem) + 1;
        this.length = this.PluginInfo.length;
        if (this.result && this.length != 0) {
          if (this.length % this.pageMaxItem == 0) {
            this.result = this.length / this.pageMaxItem;
          } else {
            this.result = Math.floor(this.length / this.pageMaxItem) + 1;
          }
        } else if (this.length == 0) {
          this.result = 1;
        }
      });
    //console.log(this.PluginInfo[0]);
    /*this.sceneService.getChainWithLoss(id)
     .subscribe(result=>this.ChainInfo=result);*/
    this.pageMaxItem = 10;
    for (let scene of this.scenes) {
      if (scene.id == id) {
        this.chosen_scene = scene;
        break;
      }
    }
  }

  dataChange(event?:any) {
    for(let i in this.d_dataSets){
      if(this.dataId==this.d_dataSets[i].dataId){
        this.fileCount = this.d_dataSets[i].selfTypeFileCount;
      }
    }
    //console.log(this.fileCount);
    if (this.dataId) {
      this.s_error_show = false;
      this.data_validation = true;
    } else {
      this.data_validation = false;
    }

    //this.judgeClick();
  }
  clickStatus(statu, id) {
    this.selected = statu;
    this.item = id;
    //console.log(id)
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
    this.jobName = null;
    this.auditing = null;
    this.cmemory = null;
    // this.gmemory = null;
    this.dataFirst = null;
    this.dataSecond = null;
    this.dataThird = null;
    this.sceneService.getAllScenes(-1)
      .subscribe(scenes => {
        this.createJob_getScene(scenes);
        this.student = scenes[0].id;
        //this.firstSceneId = this.student;
        //console.log(this.firstSceneId);
        this.sceneService.getChainByScene(this.student)
          .subscribe(result => {
            //console.log(result);
            this.PluginInfo = result;
            // this.firstChainId = this.PluginInfo[0].id;
            // this.firstSceneId = this.PluginInfo[0].chain_name;
            this.arr = result;
            this.arr = this.PluginInfo.slice(0, 10);
            //this.$scene_select_change(name);
          })
      });
    this.jobService.getAllGpu()
      .subscribe(result=>{
          this.gpus = result;
          let temp:any={'id':-1,'totalGlobalMem': 0};
          this.gpus.unshift(temp);
          //console.log(this.gpus);
          //this.gpuorder = this.gpus[0].id;
      });

    //console.log(this.student);
  }
  gpuChange(){
    //console.log(this.gpuorder);
    for(let i=0;i<this.gpus.length;i++){
      if(this.gpuorder==this.gpus[i].id+1){
        this.gpu = Math.ceil(this.gpus[i].totalGlobalMem/1024/1024/1024);
        //console.log(this.gpu);
      }
    }
  }
  onlyNum(e) {
    let ev = event||e;
    if(!(ev.keyCode==46)&&!(ev.keyCode==8)&&!(ev.keyCode==37)&&!(ev.keyCode==39))
      if(!((ev.keyCode>=48&&ev.keyCode<=57)||(ev.keyCode>=96&&ev.keyCode<=105)))
        ev.returnValue=false;
  }
  memory(){
    let reg=new RegExp(/^[1-9]\d*$|^0$/);
    if(Number(this.cmemory)>this.cpu){
      this.s_error_show = true;
      this.s_error_message = '内存不能超过'+this.cpu+'GB';
      this.s_error_level = "error";
    }else if(!reg.test(this.cmemory)&&this.cmemory!=''&&this.cmemory!=null){
      this.s_error_show = true;
      this.s_error_message = '内存格式错误';
      this.s_error_level = "error";
    }else if(this.cmemory==0){
      this.s_error_show = true;
      this.s_error_message = '内存必须大于0';
      this.s_error_level = "error";
    }else{
      this.s_error_show = false;
    }
  }
  memoryg(){
    if(Number(this.gmemory)>this.gpu){
      this.s_error_show = true;
      this.s_error_message = '内存不能超过'+this.gpu+'GB';
      this.s_error_level = "error";
    }else{
      this.s_error_show = false;
    }
  }
  tips(){
    this.s_error_show = true;
    this.s_error_message = '训练/验证/测试集比例之和必须等于100%！';
    this.s_error_level = "error";
    return false;
  }
  dataset(){
    //console.log(this.dataFirst,this.dataSecond,this.dataThird);
    if(Number(this.dataFirst)>=100){
      this.tips();
    };
    if(Number(this.dataSecond)>=100){
      this.tips();
    };
    if(Number(this.dataThird)>=100){
      this.tips();
    };
    if((Number(this.dataFirst)+Number(this.dataSecond)+Number(this.dataThird))>100){
      this.tips();
    }else if((Number(this.dataFirst)+Number(this.dataSecond))>=100){
      this.tips();
    }else if((Number(this.dataFirst)+Number(this.dataThird))>=100){
      this.tips();
    }
    else if((Number(this.dataSecond)+Number(this.dataThird))>=100){
      this.tips();
    }else{
      this.s_error_show = false;
      if(Number(this.dataFirst)>0&&Number(this.dataSecond)>0&&(Number(this.dataFirst)+Number(this.dataSecond)<100)){
        this.dataThird = 100-Number(this.dataFirst)-Number(this.dataSecond);
      };
      if(Number(this.dataFirst)>0&&Number(this.dataThird)>0&&(Number(this.dataFirst)+Number(this.dataThird)<100)){
        this.dataSecond = 100-Number(this.dataFirst)-Number(this.dataThird);
      };
      if(Number(this.dataSecond)>0&&Number(this.dataThird)>0&&(Number(this.dataSecond)+Number(this.dataThird)<100)){
        this.dataFirst = 100-Number(this.dataSecond)-Number(this.dataThird);
      };
    }
    let reg=new RegExp(/^[1-9]\d*$|^0$/);
    if(!reg.test(this.auditing)){
        this.s_error_show = true;
        this.s_error_message = '数据集格式错误';
        this.s_error_level = "error";
      }
  }
  getPluginName(name) {

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

  nextStep() {
    this.createJobBySenceId(this.chosenSceneId, this.firstChainId, this.dataId);
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

  // 第一次点击下一步时，创建job，存储下来
  createJobBySenceId(chosenSceneId, chainId, dataId) {
    if (!this.click_flag) {
      return;
    }
    this.click_flag = false;
    if (!this.jobName) {
      // alert("请输入任务名称")
      this.s_error_show = true;
      this.s_error_message = '请输入任务名称';
      this.s_error_level = "error";
      //addWarningToast(this.toastyService , "请输入任务名称" );
      this.click_flag = true;
      return false;
    }
    if (!chainId || this.firstSceneId == '-1') {
      // alert("请选择算法链");
      this.s_error_show = true;
      this.s_error_message = '请选择算法链';
      this.s_error_level = "error";
      //addWarningToast(this.toastyService , "请选择算法链" );
      this.click_flag = true;
      return false;
    }
    if ((!dataId || dataId == -1)&&(this.student!=15)&&(this.student!=11)) {
      // alert("请选择算法链");
      this.s_error_show = true;
      this.s_error_message = '请选择数据集';
      this.s_error_level = "error";
      //addWarningToast(this.toastyService , "请选择数据集" );
      this.click_flag = true;
      return false;
    }
    //this.createBtn = 1;
    if(!this.auditing){
      this.s_error_show = true;
      this.s_error_message = '请输入CPU核数';
      this.s_error_level = "error";
      //addWarningToast(this.toastyService , "请选择数据集" );
      this.click_flag = true;
      return false;
    }
    if(!this.cmemory){
      this.s_error_show = true;
      this.s_error_message = '请输入内存';
      this.s_error_level = "error";
      //addWarningToast(this.toastyService , "请选择数据集" );
      this.click_flag = true;
      return false;
    }
    if(!this.gpuorder||this.gpuorder==-1){
      this.s_error_show = true;
      this.s_error_message = '请选择GPU编号';
      this.s_error_level = "error";
      //addWarningToast(this.toastyService , "请选择数据集" );
      this.click_flag = true;
      return false;
    }
/*    if(!this.gmemory){
      this.s_error_show = true;
      this.s_error_message = '请输入GPU内存';
      this.s_error_level = "error";
      //addWarningToast(this.toastyService , "请选择数据集" );
      this.click_flag = true;
      return false;
    }*/
    if(!this.dataFirst){
      if(this.student==15||this.student==11){

      }else{
        this.s_error_show = true;
        this.s_error_message = '请输入训练集比例';
        this.s_error_level = "error";
        //addWarningToast(this.toastyService , "请选择数据集" );
        this.click_flag = true;
        return false;
      }
    }
    if(!this.dataSecond){
      if(this.student==15||this.student==11){

      }else {
        this.s_error_show = true;
        this.s_error_message = '请输入验证集比例';
        this.s_error_level = "error";
        //addWarningToast(this.toastyService , "请选择数据集" );
        this.click_flag = true;
        return false;
      }
    }
    if(!this.dataThird){
      if(this.student==15||this.student==11){

      }else {
        this.s_error_show = true;
        this.s_error_message = '请输入测试集比例';
        this.s_error_level = "error";
        //addWarningToast(this.toastyService , "请选择数据集" );
        this.click_flag = true;
        return false;
      }
    }
    this.dataset();
    if(this.student==15||this.student==11){

    }else{
      if(((Number(this.dataFirst)+Number(this.dataSecond)+Number(this.dataThird))>100)||Number(this.dataFirst)<=0||Number(this.dataSecond)<=0||Number(this.dataThird)<=0){
        this.tips();
        this.click_flag = true;
        return false
      }
    }
    this.jobService.createJob(chainId, dataId, this.jobName, chosenSceneId,this.auditing,this.cmemory,0,this.gpuorder,this.dataFirst,this.dataSecond,this.dataThird)
      .subscribe(
        (createdJob) => {
          //let job: any = createdJob;
          //this.createdJob = job;
          this.createdJob = createdJob;
          // alert("任务创建成功");
          //addSuccessToast(this.toastyService, "任务创建成功", '消息提示', 800);
          location.reload();
          // this.jobPageStatus='jobPageStatus';
          //console.log(this.createdJob.chainId);
          // this.createJobBySenceId2(this.createdJob.chainId);
          this.click_flag = true;
          this.jobName = null;
        },
        (error) =>{
          if(error.status==417){
            this.s_error_show = true;
            this.s_error_message = error.text();
            this.s_error_level = "error";
            this.click_flag = true;
          }
        });
  }
  showTipChange(event){
    this.showTip = false;
  }
  nooperate(event){
    this.showTip = true;
    this.tipWidth = "100%";
    this.tipType = "error";
    this.tipContent = "测试版本下最多同时运行三个任务！";
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


  checkStatus(status, sence, jobPath) {
    if (status == 'Finished') {
      this.modelService.getStatue(jobPath).subscribe(data => {
        this.router.navigate(['../model'], {queryParams: {sence: sence}});
      });
      //TODO if success give alert

    } else {
      return false;
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
/*    this.algChainService.getChainDetailById(this.firstChainId).subscribe(rep => {
      this.datasetsService.getDataSets(null, rep.dataset_type, null, 'createTime,desc', null, null).subscribe(rep => {
        this.d_dataSets = rep.content;
        this.dataId = null;
        /!*if (this.d_dataSets) {
         this.dataId = this.d_dataSets[0].dataId
         }*!/
      })
    });*/
    if (this.firstSceneId) {
      this.s_error_show = false;
    }
    //this.judgeClick();
  }

}
