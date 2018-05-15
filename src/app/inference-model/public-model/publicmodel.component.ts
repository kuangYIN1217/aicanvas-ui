import { Component,EventEmitter, OnInit,Input,Output } from '@angular/core';
/*import {Page} from "../common/defs/resources";*/
import {calc_height} from "app/common/ts/calc_height";
import {SceneService} from "../../common/services/scene.service";
import {modelService} from "../../common/services/model.service";
import {Page} from "../../common/defs/resources";

@Component({
  selector: 'public-model',
  templateUrl: './publicmodel.component.html',
  styleUrls: ['./publicmodel.component.css'],
  providers: [SceneService,modelService]
})
export class PublicModelComponent{
  @Input() s_nav_selected:number;
  @Input() jobName:any='';
  @Input() senceName:any='';
  @Input() jobId:any=0;
  @Output() showFailReasonChange: EventEmitter<any> = new EventEmitter();
  dataIndex:number=0;
  modelList:any[]=[];
  page: number = 1;
  pageMaxItem: number = 10;
  pageParams=new Page();
  totalPage:number = 0;
  curPage:number = 1;
  pageNow:number;
  lookFailReason:any[]=[];
  constructor(private sceneService: SceneService,private modelService: modelService){

  }
  ngOnChanges(...args: any[]) {
    this.getAllModel(this.jobName,this.senceName,this.s_nav_selected,this.jobId,this.page-1,this.pageMaxItem);
  }
  getPageData(paraParam){
    this.getAllModel(this.jobName,this.senceName,this.s_nav_selected,this.jobId,paraParam.curPage-1,paraParam.pageMaxItem);
    this.pageNow=paraParam.curPage;
  }
  rePublish(item){
    this.modelService.rePublishModel(item.jobId,item.id)
      .subscribe(
        (result)=>{

      },
        (error)=>{
            if(error.status==417){
              let result = error.json();
              let obj:any={};
              obj.jobName = result.jobName;
              obj.modelId = result.id;
              obj.version = result.version;
              obj.failReason = result.failReason;
              obj.ifShowFailReason = result.ifShowFailReason;
              this.lookFailReason.push(obj);
              let obj1:any={};
              obj1.id = result.id;
              obj1.list = this.lookFailReason;
              this.showFailReasonChange.emit(JSON.stringify(obj1));
            }
        })
  }
  reStart(modelId){
    this.modelService.reStartModel(modelId)
      .subscribe(result=>{
        this.getAllModel(this.jobName,this.senceName,this.s_nav_selected,this.jobId,this.page-1,this.pageMaxItem);
      })
  }
  getAllModel(jobName,senceName,number,jobId,page,size){
    this.modelService.getAllModel(jobName,senceName,number,jobId,page,size)
      .subscribe(result=>{
        this.lookFailReason=[];
        if(result&&result.content.length>0){
          this.dataIndex=1;
          this.modelList = result.content;
          for(let i=0;i<this.modelList.length;i++){
              if(this.modelList[i].status=="发布失败"){
                let obj:any={};
                obj.id = this.modelList[i].id;
                obj.jobName = this.modelList[i].jobName;
                obj.version = this.modelList[i].version;
                obj.failReason = this.modelList[i].failReason;
                obj.ifShowFailReason = this.modelList[i].ifShowFailReason;
                this.lookFailReason.push(obj);
              }
          }
          let page = new Page();
          page.pageMaxItem = result.size;
          page.curPage = result.number+1;
          page.totalPage = result.totalPages;
          page.totalNum = result.totalElements;
          this.pageParams = page;
        }else{
          this.dataIndex=0;
        }
      })
  }
  getWidth(){
    return{
      "width":"2200px"
    }
  }
  getScroll(){
    return{
      "overflow-x":"scroll"
    }
  }
  delete(modelId){
    this.modelService.deleteModel(modelId)
      .subscribe(result=>{
        this.getAllModel(this.jobName,this.senceName,this.s_nav_selected,this.jobId,this.pageNow,this.pageMaxItem);
      })
  }
  publishFail(id){
    let obj:any={};
    obj.id = id;
    obj.list = this.lookFailReason;
    this.showFailReasonChange.emit(JSON.stringify(obj));
  }
}
