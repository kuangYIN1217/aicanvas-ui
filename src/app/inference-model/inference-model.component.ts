import { Component, OnInit } from '@angular/core';
import {SceneService} from "../common/services/scene.service";
import {modelService} from "../common/services/model.service";
import {Page} from "../common/defs/resources";
import {calc_height} from "app/common/ts/calc_height";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-inference-model',
  templateUrl: './inference-model.component.html',
  styleUrls: ['./inference-model.component.css'],
  providers: [SceneService,modelService]
})
export class InferenceModelComponent{
  dataIndex:number=0;
  sceneInfo: any[] = [];
  chainInfo: any[] = [];
  scene:number;
  chain:string;
  page: number = 1;
  pageMaxItem: number = 10;
  pageParams=new Page();
  totalPage:number = 0;
  curPage:number = 1;
  pageNow:number;
  modelList:any[]=[];
  showModel:boolean = false;
  chainId:number;
  s_nav_selected:number=1;
  searchName:string='';
  senseName:string='';
  jobId:number=0;
  senceName:string='';
  jobName:string='';
  sence:any=-1;
  job:any=-1;
  tipWidth:string='';
  tipContent:string='';
  tipType:string='';
  showTip:boolean = false;
  tipMargin:string='';
  isPublic:boolean;
  lookFailReason:any[]=[];
  saveShowFail:any[]=[];
  showMore:boolean = true;
  failReason:any[]=[];
  showFailReason:any[]=[];
  showIndex:number=0;
  constructor(private sceneService: SceneService,private modelService: modelService,private route: ActivatedRoute , private router: Router) {

  }
  ngOnInit() {
    calc_height(document.getElementById('table_section'));
    this.route.params.subscribe(params => {
      if(JSON.stringify(params) != "{}"){
        this.isPublic = Boolean(params["isPublic"]);
        //console.log(this.isPublic,this.jobId);
        if(this.isPublic==true){
          this.s_nav_selected = 0;
        }else{
          this.s_nav_selected = 1;
        }
        this.jobId = params["jobId"];
      }
    });
  }
  toggle(){
    if(this.showMore){
      this.showFailReason = this.failReason;
    }else{
      this.showFailReason = this.failReason.slice(0,2);
    }
    this.showMore = !this.showMore;
  }
  showFailReasonArrChange(event){
    this.saveShowFail = JSON.parse(event);
  }
  showFailReasonChange(event){
    let result = JSON.parse(event);
    if(result.list.length>0){
      this.lookFailReason = result.list;
    }
    for(let i=0;i<this.lookFailReason.length;i++){
      if(this.lookFailReason[i].id==result.id){
        this.lookFailReason[i].selected = true;
      }
    }
      this.saveShowFail = this.lookFailReason;
      this.failReason=[];
      this.showFailReason=[];
    for(let i=0;i<this.saveShowFail.length;i++){
      if(this.saveShowFail[i].selected){
          this.failReason.push(this.saveShowFail[i]);
      }
    }
    if(this.failReason.length>2){
      this.showMore = true;
      this.showFailReason = this.failReason.slice(0,2);
    }else{
      this.showFailReason = this.failReason;
    }
  }
  close(id){
    for(let i=0;i<this.saveShowFail.length;i++){
      if(this.saveShowFail[i].id==id){
        this.saveShowFail[i].selected = false;
      }
    }
    for(let i=0;i<this.failReason.length;i++) {
      if (this.failReason[i].id == id) {
        this.failReason.splice(i, 1);
      }
    }
      for(let i=0;i<this.showFailReason.length;i++){
        if(this.showFailReason[i].id==id){
          this.showFailReason.splice(i,1);
        }
    }
    if(this.failReason.length>2){
      this.showMore = true;
      this.showFailReason = this.failReason.slice(0,2);
    }else{
      this.showFailReason = this.failReason;
    }
  }
  $nav_click(index) {
    this.s_nav_selected = index;
    this.saveShowFail=[];
  }
  $search_change(){
    this.judgeJob();
    this.judgeSence();
  }
  judgeJob(){
    if(this.jobName==''){
      this.job = -1;
    }else{
      this.job = this.jobName;
    }
  }
  judgeSence(){
    if(this.senceName==''){
      this.sence = -1;
    }else{
      this.sence = this.senceName;
    }
  }
}
