import { Component, OnInit } from '@angular/core';
import {SceneService} from "../common/services/scene.service";
import {modelService} from "../common/services/model.service";

@Component({
  selector: 'app-inference-model',
  templateUrl: './inference-model.component.html',
  styleUrls: ['./inference-model.component.css'],
  providers: [SceneService,modelService]
})
export class InferenceModelComponent{
  dataIndex:number=0;
  sceneInfo: any[] = [];
  scene:string;
  page: number = 1;
  pageMaxItem: number = 10;
  modelList:any[]=[];
  constructor(private sceneService: SceneService,private modelService: modelService) {
    this.sceneService.getModelScenes(-1)
      .subscribe(sceneArray => {
        this.sceneInfo = sceneArray;
        this.sceneInfo.unshift({"id":-1,"translation": "全部"});
        if(this.sceneInfo.length>0){
          this.scene = this.sceneInfo[0].id;
          console.log(this.scene);
        }
      });
    this.modelService.getAllModel(-1,-1,this.page-1,this.pageMaxItem)
      .subscribe(result=>{
        console.log(result);
        this.modelList = result.content;
      })
  }
  getPageData(paraParam){

  }
  selectChange(){

  }
  ngOnInit() {
  }
}
