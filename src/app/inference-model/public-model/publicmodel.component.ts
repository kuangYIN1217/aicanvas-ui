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
  @Output() showIdChange: EventEmitter<any> = new EventEmitter();
  @Output() failChange: EventEmitter<any> = new EventEmitter();
  dataIndex:number=0;
  modelList:any[]=[];
  page: number = 1;
  pageMaxItem: number = 10;
  pageParams=new Page();
  totalPage:number = 0;
  curPage:number = 1;
  pageNow:number;
  constructor(private sceneService: SceneService,private modelService: modelService){

  }
  ngOnChanges(...args: any[]) {
    this.getAllModel(this.jobName,this.senceName,this.s_nav_selected,this.jobId,this.page-1,this.pageMaxItem);
  }
  getPageData(paraParam){
    this.getAllModel(this.jobName,this.senceName,this.s_nav_selected,this.jobId,paraParam.curPage-1,paraParam.pageMaxItem);
    this.pageNow=paraParam.curPage;
  }
  getAllModel(jobName,senceName,number,jobId,page,size){
    this.modelService.getAllModel(jobName,senceName,number,jobId,page,size)
      .subscribe(result=>{
        if(result&&result.content.length>0){
          this.dataIndex=1;
          this.modelList = result.content;
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
  publishFail(failReason){
    this.failChange.emit(failReason);
  }
}
