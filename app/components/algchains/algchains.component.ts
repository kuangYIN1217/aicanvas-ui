import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { SceneService } from '../../common/services/scene.service'
import { SceneInfo } from "../../common/defs/resources";
declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'algchains',
  styleUrls: ['./css/algchains.component.css'],
  templateUrl: './templates/algchains.html',
  providers: [SceneService]
})
export class AlgChainsComponent{
    sceneArray: SceneInfo[];
    constructor(private sceneService: SceneService, private location: Location){
        sceneService.getAllScenes()
            .subscribe(sceneArray => this.sceneArray = sceneArray);
    }
}
