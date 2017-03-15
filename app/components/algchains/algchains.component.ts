import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'

import { SceneInfo } from "../../common/defs/resources";
@Component({
  moduleId: module.id,
  selector: 'algchains',
  styleUrls: ['./css/algchains.component.css'],
  templateUrl: './templates/algchains.html',
  providers: [ResourcesService]
})
export class AlgChainsComponent{
    sceneArray: SceneInfo[] = [];
    scene_current: SceneInfo = new SceneInfo();
    showManageDiv = 1;
    constructor(private resourcesService: ResourcesService, private location: Location) {
        resourcesService.getScenes()
            .subscribe(sceneArray => this.sceneArray = sceneArray);
        let id = this.location.path(false).split('/algchains/')[1];
        if(id){
            this.scene_current = this.getCurrentScene(id);
            this.showManageDiv = 0;
        }
    }
    getCurrentScene(id:string): SceneInfo{
        for (let scene of this.sceneArray){
            if (scene.scene_id+""==id){
                return scene;
            }
        }
    }
}
