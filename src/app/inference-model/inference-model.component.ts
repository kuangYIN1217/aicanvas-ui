import { Component, OnInit } from '@angular/core';
import {SceneService} from "../common/services/scene.service";
import {modelService} from "../common/services/model.service";
import {Page} from "../common/defs/resources";

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
  constructor(private sceneService: SceneService,private modelService: modelService) {
    this.sceneService.getModelScenes(-1)
      .subscribe(sceneArray => {
        this.sceneInfo = sceneArray;
        this.sceneInfo.unshift({"id":-1,"translation": "全部"});
        if(this.sceneInfo.length>0){
          this.scene = this.sceneInfo[0].id;
          //console.log(this.scene);
          this.getAllChains(100000);
        }
      });
    this.getAllModel(-1,-1,this.page-1,this.pageMaxItem);
  }
  getAllChains(chainId){
    this.sceneService.getChainByScene(chainId)
      .subscribe(result=>{
        this.chainInfo = result;
        this.chainInfo.unshift({'chain_name':'全部'});
        if(this.chainInfo.length>0){
          this.chain = this.chainInfo[0].chain_name;
        }
      });
  }
  getAllModel(sceneId,chainId,page,size){
    this.modelService.getAllModel(sceneId,chainId,page,size)
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
  getPageData(paraParam){
    this.getScene();
    this.getId();
    this.getAllModel(this.scene,this.chainId,paraParam.curPage-1,paraParam.pageMaxItem);
    this.pageNow=paraParam.curPage;
  }
  getChainId(sceneId){
    this.sceneService.getChainByScene(sceneId)
      .subscribe(result=>{
        this.chainInfo = result;
        this.chainInfo.unshift({'chain_name':'全部'});
        //console.log(this.chainInfo);
      });
  }
  getScene(){
    if(this.scene==-1){
      this.getAllChains(100000);
    }else{
      this.getChainId(this.scene);
    }
  }
  selectSceneChange(){
    this.getScene();
    this.getAllModel(this.scene,-1,this.page-1,this.pageMaxItem);
  }
  selectChainChange(){
    this.getId();
    this.getAllModel(this.scene,this.chainId,this.page-1,this.pageMaxItem);
}
  getId(){
    for(let i=0;i<this.chainInfo.length;i++){
      if(this.chain == this.chainInfo[i].chain_name){
        this.chainId = this.chainInfo[i].id;
      }else{
        if(this.chain == '全部'){
          this.chainId = -1;
        }
      }
    }
  }
  lookapi(){
    //this.showModel = true;
  }
}
