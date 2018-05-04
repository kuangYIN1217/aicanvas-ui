import { Component, OnInit } from '@angular/core';
import {calc_height} from "../common/ts/calc_height";
import {SceneService} from "../common/services/scene.service";
import {PluginInfo, SceneInfo} from "../common/defs/resources";
import {DatasetsService} from "../common/services/datasets.service";
import {JobService} from "../common/services/job.service";

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css'],
  providers:[SceneService,DatasetsService,JobService]
})
export class CreateJobComponent{
  jobName: string="";
  name_validation: boolean = false;
  plugin_validation: boolean = false;
  data_validation: boolean = false;
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
  dataId: any="-1";
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
  constructor(private sceneService: SceneService,private datasetsService: DatasetsService,private jobService: JobService) {
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
     })
    this.getDataSets(1,this.username);
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
}
