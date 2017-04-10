import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'

// import { SceneInfo } from "../../common/defs/resources";
// declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'model',
  styleUrls: ['./css/model.component.css'],
  templateUrl: './templates/model.html',
  providers: [ResourcesService]
})
export class ModelComponent{
    constructor(private resourcesService: ResourcesService, private location: Location){

    }
}
