import {Component,Input,Output,EventEmitter} from "@angular/core";
import {DatasetsService} from "../common/services/datasets.service";
import {calc_height} from '../common/ts/calc_height'
import {DatasaveService} from "../common/services/datasave.service";
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
  constructor(private datasaveService:DatasaveService){
    this.datasaveService.getAllSave()
      .subscribe(result=>{
        console.log(result);
        this.dataSave = result;
        this.total = this.getSize(this.dataSave.diskSpace);
        console.log(this.total);
        this.getDataset();
        this.getScence();
        this.getModel();
        this.getOther();
      })
  }
  getDataset(){
    this.dataset = this.getSize(this.dataSave.datasetSpace);
    //console.log(this.dataset,this.total);
    this.d = Math.floor((this.dataset/this.total)*868);
    $(".dataset").css("width",Math.floor((this.dataset/this.total)*868));
/*    return {
      "width":Math.floor((this.dataset/this.total)*868)
    }*/
  }
  getScence(){
    this.scence = this.getSize(this.dataSave.chainSpace);
    //console.log(this.d);
    this.s = Math.floor((this.scence/this.total)*868);
    $(".sence").css("width",Math.floor((this.scence/this.total)*868));
    $(".sence").css("left",this.d);
/*      return {
        "width":Math.floor((this.scence/this.total)*868),
        "left":this.d
    }*/
  }
  getModel(){
    this.model = this.getSize(this.dataSave.modelSpace);
    this.m = Math.floor((this.model/this.total)*868);
    //console.log(this.d+this.s);
    $(".model").css("width",Math.floor((this.scence/this.total)*868));
    $(".model").css("left",this.d+this.s);
    // return {
    //   "width":Math.floor((this.scence/this.total)*868),
    //   "left":this.d+this.s
    // }
  }
  getOther(){
    this.other = this.getSize(this.dataSave.otherSpace);
    this.o = Math.floor((this.other/this.total)*868);
    //console.log(this.d+this.s+this.m);
    $(".other").css("width",Math.floor((this.other/this.total)*868));
    $(".other").css("left",this.d+this.s+this.m);
/*    return {
      "width":Math.floor((this.other/this.total)*868),
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
      if(value>0){
        if(en=='TB'){
          return value*1024*1024*1024;
        }else if(en=='GB'){
          return value*1024*1024;
        }else if(en=='MB'){
          return value*1024;
        }else if(en=='KB'){
          return value;
        }
      }
    }

  }
  ngOnInit() {
    calc_height(document.getElementById('datasetssave'));
  }
}
