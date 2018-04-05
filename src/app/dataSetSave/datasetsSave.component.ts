import {Component,Input,Output,EventEmitter} from "@angular/core";
import {DatasetsService} from "../common/services/datasets.service";
import {calc_height} from '../common/ts/calc_height'
import {DatasaveService} from "../common/services/datasave.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Observable } from 'rxjs';
declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'datasets-save',
  styleUrls: ['./css/datasetsSave.component.css'],
  templateUrl: './templates/datasetsSave.html',
  providers: [DatasaveService]
})
export class DatasetsSaveComponent{
  dataSave:any={};
  total:number;
  dataset:number;
  scence:number;
  model:number;
  other:number;
  d:number;
  s:number;
  m:number;
  o:number;
  allWidth:number;
  constructor(private datasaveService:DatasaveService,private route: ActivatedRoute, private router: Router){
    this.datasaveService.getAllSave()
      .subscribe(result=>{
        this.dataSave = result;
        this.getData();
      })
  }
  getData(){
    this.allWidth = parseFloat($("#dataset_count").width());
    this.total = this.getSize(this.dataSave.diskSpace);
    this.getDataset();
    this.getScence();
    this.getModel();
    this.getOther();
  }
  getDataset(){
    this.dataset = this.getSize(this.dataSave.datasetSpace);
    //console.log(this.dataset,this.total);
    this.d = Math.floor((this.dataset/this.total)*this.allWidth);
    $(".dataset").css("width",Math.floor((this.dataset/this.total)*this.allWidth));
/*    return {
      "width":Math.floor((this.dataset/this.total)*this.allWidth)
    }*/
  }
  getScence(){
    this.scence = this.getSize(this.dataSave.chainSpace);
    //console.log(this.d);
    this.s = Math.floor((this.scence/this.total)*this.allWidth);
    $(".sence").css("width",Math.floor((this.scence/this.total)*this.allWidth));
    $(".sence").css("left",this.d);
/*      return {
        "width":Math.floor((this.scence/this.total)*this.allWidth),
        "left":this.d
    }*/
  }
  getModel(){
    this.model = this.getSize(this.dataSave.modelSpace);
    this.m = Math.floor((this.model/this.total)*this.allWidth);
    //console.log(this.d+this.s);
    //console.log(this.m);
    $(".model").css("width",Math.floor((this.scence/this.total)*this.allWidth));
    $(".model").css("left",this.d+this.s);
    // return {
    //   "width":Math.floor((this.scence/this.total)*this.allWidth),
    //   "left":this.d+this.s
    // }
  }
  getOther(){
    this.other = this.getSize(this.dataSave.otherSpace);
    this.o = Math.floor((this.other/this.total)*this.allWidth);
    //console.log(this.d+this.s+this.m);
    $(".other").css("width",Math.floor((this.other/this.total)*this.allWidth));
    $(".other").css("left",this.d+this.s+this.m);
/*    return {
      "width":Math.floor((this.other/this.total)*this.allWidth),
      "left":this.d+this.s+this.m
    }*/
  }
  getSize(num){
    if(num){
      let em = num.replace(/[0-9]/ig,"");
      let en:string;
      if(em.length>=3){
        en = em.substring(1);
      }else{
        en = em;
      }
      let value = parseFloat(num);
      if(value>=0){
        if(en=='TB'){
          return value*1024*1024*1024*1024;
        }else if(en=='GB'){
          return value*1024*1024*1024;
        }else if(en=='MB'){
          return value*1024*1024;
        }else if(en=='KB'){
          return value*1024;
        }else if(en=='B'){
          return value;
        }
      }
    }
  }
  enterDatasets(){
    this.router.navigate(['../datasets']);
  }
  enterSence(){
    this.router.navigate(['../algchains']);
  }
  enterModel(){
    //this.router.navigate(['../algchains']);
  }
  ngOnInit() {
    calc_height(document.getElementById('datasetssave'));
    Observable.fromEvent(window, 'resize')
    // .debounceTime(100) // 以免频繁处理
      .subscribe((event) => {
        this.getData();
      })
  }
}
