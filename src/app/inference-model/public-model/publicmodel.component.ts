import { Component,EventEmitter, OnInit,Input,Output } from '@angular/core';
/*import {Page} from "../common/defs/resources";*/
import {calc_height} from "app/common/ts/calc_height";
import {SceneService} from "../../common/services/scene.service";
import {modelService} from "../../common/services/model.service";

@Component({
  selector: 'public-model',
  templateUrl: './publicmodel.component.html',
  styleUrls: ['./publicmodel.component.css'],
  providers: [SceneService,modelService]
})
export class PublicModelComponent{
  @Input() modelList:any[]=[];
  @Input() dataIndex:number;
  @Output() showIdChange: EventEmitter<any> = new EventEmitter();
  @Output() failChange: EventEmitter<any> = new EventEmitter();
  constructor(private sceneService: SceneService,private modelService: modelService){

  }
}
