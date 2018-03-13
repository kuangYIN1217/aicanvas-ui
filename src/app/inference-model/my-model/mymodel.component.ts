import { Component,EventEmitter, OnInit,Input,Output } from '@angular/core';
/*import {Page} from "../common/defs/resources";*/
import {calc_height} from "app/common/ts/calc_height";
import {SceneService} from "../../common/services/scene.service";
import {modelService} from "../../common/services/model.service";

@Component({
  selector: 'my-model',
  templateUrl: './mymodel.component.html',
  styleUrls: ['./mymodel.component.css'],
  providers: [SceneService,modelService]
})
export class MyModelComponent{
  @Input() modelList:any[]=[];
  @Input() dataIndex:number;
  @Output() showIdChange: EventEmitter<any> = new EventEmitter();
  constructor(private sceneService: SceneService,private modelService: modelService){

  }
  getWidth(){
    //if(this.dataIndex==0){
     // return{
      //  "width":"100%"
     // }
    //}else{
      return{
        "width":"2200px"
      }
    //}
  }
  getScroll(){
/*    if(this.dataIndex==0){
      return{
        "overflow-x":"none"
      }
    }else{*/
      return{
        "overflow-x":"scroll"
      }
    //}
  }
  delete(modelId){
    this.showIdChange.emit(modelId);
  }
}
