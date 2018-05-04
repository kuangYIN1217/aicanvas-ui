import { Component, OnInit } from '@angular/core';
import {calc_height} from "../common/ts/calc_height";
import {SceneService} from "../common/services/scene.service";
import {PluginInfo, SceneInfo} from "../common/defs/resources";
import {DatasetsService} from "../common/services/datasets.service";
import {JobService} from "../common/services/job.service";
import {Router} from "@angular/router";
declare var $:any
@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css'],
  providers:[SceneService,DatasetsService,JobService]
})
export class CreateJobComponent{
  jobName: string="";
  name_validation: boolean = false;
  s_error_show: boolean = false;
  s_error_message: string = '';
  s_error_level: string = 'error';
  scenes: SceneInfo[] = [];
  showScene:any[]=[];
  sceneIndex:number=0;
  datasetsType:any[]=[];
  gpus:any[]=[];
  PluginInfo: PluginInfo[] = [];
  arr: any[] = [];
  username:string='';
  d_dataSets: any = [];
  dataId: number=-1;
  fileCount:number=0;
  jobPriority:string='-1';
  firstSceneId:string='-1';
  gpuorder:any='-1';
  priorityArr:any[]=["1","2","3","4","5","6","7","8","9","10"];
  gpu:number=0;
  dataFirst:number=null;
  dataSecond:number=null;
  dataThird:number=null;
  student: number;
  dataKeyword:string='';
  click_flag: boolean = true;
  firstChainId: string="";
  datasetBackupName:string="";
  scenes_match_dataset:any[]=[{"scenesId":"3","dataSetId":1},{"scenesId":"20","dataSetId":1},{"scenesId":"4","dataSetId":1},{"scenesId":"1","dataSetId":1},{"scenesId":"2","dataSetId":1},{"scenesId":"12","dataSetId":1},{"scenesId":"5","dataSetId":3},{"scenesId":"9","dataSetId":3},{"scenesId":"6","dataSetId":3},{"scenesId":"7","dataSetId":3},{"scenesId":"10","dataSetId":3},{"scenesId":"8","dataSetId":3}]
  datasetType:number;
  constructor(private sceneService: SceneService,private datasetsService: DatasetsService,private jobService: JobService,private router:Router) {
    this.username = localStorage['username'];
    this.sceneService.getAllScenes(-1)
      .subscribe(scenes => {
        this.scenes = scenes;
        let arr:any[]=[];
        for(let i=0;i<this.scenes.length;i++){
          if((i+1)%5==0){
            arr.push(this.scenes[i]);
            this.showScene.push(arr);
            arr=[];
          }else{
            arr.push(this.scenes[i]);
          }
        }
        let num = this.scenes.length%5;
        arr=[];
        for(let i=num;i>0;i--){
          arr.push(this.scenes[this.scenes.length-i]);
        }
        this.showScene.push(arr);
      });
        this.datasetsService.getDataSetType()
          .subscribe(result=>{
            this.datasetsType = result;
          });
    this.jobService.getAllGpu()
      .subscribe(result=>{
        this.gpus = result;
        let temp:any={'id':-1,'totalGlobalMem': 0};
        this.gpus.unshift(temp);
      });
    this.getDataSets(1,this.username);
  }
  getDataSets(type,creator){
    this.datasetsService.createJobGetDatasets(type,'')
      .subscribe(result=>{
        this.d_dataSets = result.content;
        //this.fileCount = this.d_dataSets[0].fileCount;
      });
  }
  dataChange(){
    for(let i in this.d_dataSets){
      if(this.dataId==this.d_dataSets[i].dataId){
        this.fileCount = this.d_dataSets[i].selfTypeFileCount;
        document.getElementById("backup_dataset").innerHTML = this.d_dataSets[i].dataName+"_"+this.getDateFormat();
        this.datasetBackupName = this.d_dataSets[i].dataName+"_"+this.getDateFormat();
      }
    }
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
  getDateFormat = () => {
    let date = new Date();
    let dateStr = date.getFullYear() + "" + this.leftPad0((date.getMonth() + 1), 2) + "" + this.leftPad0(date.getDate(), 2);
    dateStr = dateStr + this.leftPad0(date.getHours(), 2) + this.leftPad0(date.getMinutes(), 2) + this.leftPad0(date.getSeconds(), 2);
    return dateStr;
  }

  leftPad0 = (str, num) => {
    str = "" + str;
    if(str.length >=num) return str;
    for(let i = 0; i< num-str.length; i++){
      str = "0" + str;
    }
    return str;
  }
  preScene(){
    if(this.sceneIndex==0){
      return false
    }else{
      this.sceneIndex--;
    }
  }
  nextScene(){
    if(this.sceneIndex==this.showScene.length-1){
      return false
    }else{
      this.sceneIndex++;
    }
  }
  chooseScene(index,sceneIndex,scene){
    for(let i=0;i<this.showScene.length;i++){
      for(let j=0;j<this.showScene[i].length;j++){
        this.showScene[i][j].selected = false;
      }
    }
    this.showScene[sceneIndex][index].selected = true;
    this.student = scene.id;
    this.sceneService.getChainByScene(scene.id)
     .subscribe(results => {
     this.PluginInfo = results;
     this.arr = results;
     });
    for(let i=0;i<this.scenes_match_dataset.length;i++){
      if(this.scenes_match_dataset[i].scenesId==scene.id){
        this.datasetType = this.scenes_match_dataset[i].dataSetId;
        $(".classification img").eq(this.datasetType-1).click();
        break;
      }
    }
    this.getDataSets(this.datasetType,this.username);
    document.getElementById("dataKeyword").removeAttribute("readonly");
    this.sceneReadOnly();
  }
  chooseImg(item){
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
  ngOnInit() {
    calc_height(document.getElementsByClassName('allContent')[0]);
  }
  nameChange() {
    if (this.jobName) {
      this.name_validation = true;
      this.s_error_show = false;
    } else {
      this.name_validation = false;
    }
  }
  dataset(){
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
  }
  onlyNum(e) {
    let ev = event||e;
    if(!(ev.keyCode==46)&&!(ev.keyCode==8)&&!(ev.keyCode==37)&&!(ev.keyCode==39))
      if(!((ev.keyCode>=48&&ev.keyCode<=57)||(ev.keyCode>=96&&ev.keyCode<=105)))
        ev.returnValue=false;
  }
  tips(){
    this.s_error_show = true;
    this.s_error_message = '训练/验证/测试集比例之和必须等于100%！';
    this.s_error_level = "error";
    return false;
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
    this.datasetsService.searchDatasets(type,name,'')
      .subscribe(result=>{
        this.d_dataSets = result.content;
      });
  }
  sceneReadOnly(){
    if(this.student==11||this.student==15){
      this.dataFirst=null;
      this.dataSecond=null;
      this.dataThird=null;
      document.getElementById('train').setAttribute('readonly', 'true');
      document.getElementById('valid').setAttribute('readonly', 'true');
      document.getElementById('test').setAttribute('readonly', 'true');
    }else{
      document.getElementById('train').removeAttribute('readonly');
      document.getElementById('valid').removeAttribute('readonly');
      document.getElementById('test').removeAttribute('readonly');
    }
  }
  $scene_select_change(name) {
    for (let i in this.PluginInfo) {
      if (name == this.PluginInfo[i].chain_name) {
        this.firstChainId = this.PluginInfo[i].id;
      }
    }
  }
  nextStep() {
    this.createJobBySenceId(this.student, this.firstChainId, this.dataId);
  }
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
    if (!dataId || dataId == -1) {
      // alert("请选择算法链");
      this.s_error_show = true;
      this.s_error_message = '请选择数据集';
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
    if (!this.jobPriority || this.jobPriority == "-1") {
      // alert("请选择算法链");
      this.s_error_show = true;
      this.s_error_message = '请设置优先级';
      this.s_error_level = "error";
      this.click_flag = true;
      return false;
    }
    this.jobService.createJob(chainId, dataId, this.jobName, chosenSceneId,0,0,0,this.gpuorder,this.dataFirst,this.dataSecond,this.dataThird,this.datasetBackupName,this.jobPriority)
      .subscribe(
        (createdJob) => {
          this.router.navigate(['/login'])
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
}
