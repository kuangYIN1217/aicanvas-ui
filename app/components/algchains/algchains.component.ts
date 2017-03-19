import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'

import { SceneInfo } from "../../common/defs/resources";
declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'algchains',
  styleUrls: ['./css/algchains.component.css'],
  templateUrl: './templates/algchains.html',
  providers: [ResourcesService]
})
export class AlgChainsComponent{
    sceneArray: SceneInfo[];
    constructor(private resourcesService: ResourcesService, private location: Location){
        resourcesService.getScenes()
            .subscribe(sceneArray => this.sceneArray = sceneArray);
    }
}
