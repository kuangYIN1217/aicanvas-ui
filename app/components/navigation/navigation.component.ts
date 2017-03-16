import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'

import { SceneInfo } from "../../common/defs/resources";

@Component({
  moduleId: module.id,
  selector: 'navigation',
  styleUrls: ['./css/navigation.component.css'],
  templateUrl: './templates/navigation.html',
  providers: [ResourcesService]
})
export class NavigationComponent {
    needhide = 0;
    focusTab: number;
    collapse: number = 0;
    sceneArray: SceneInfo[] = [];
    focusCollapse: string = "0";
    changeCollapse(){
        this.collapse = 1 - this.collapse;
    }
    changeTab(nextFocus: number){
        this.focusTab = nextFocus;
    }
    constructor(private location: Location, private resourcesService: ResourcesService){
        console.log("navigation initial");
        resourcesService.getScenes()
            .subscribe(sceneArray => this.sceneArray = sceneArray);

        if (this.location.isCurrentPathEqualTo('/login')||this.location.isCurrentPathEqualTo('')){
            this.focusTab = 0;
            this.needhide = 0;
        }else if (this.location.isCurrentPathEqualTo('/overview')){
            this.focusTab = 1;
            this.needhide = 0;
        }else if (this.location.isCurrentPathEqualTo('/algchains')){
            this.focusTab = 2;
            this.needhide = 0;
        }else if (this.location.path(false).indexOf('/algchains/')!=-1){
            this.collapse = 1;
            let scene_id_str = this.location.path(false).split('/algchains/')[1];
            //console.log(scene_id_str);
            this.focusCollapse = scene_id_str;
            this.focusTab = 2;
            this.needhide = 0;
        }else if (this.location.path(false).indexOf('/network/')!=-1){
            this.needhide = 1;
        }else if (this.location.isCurrentPathEqualTo('/jobcreation')){
            this.focusTab = 3;
            this.needhide = 0;
        }else if (this.location.isCurrentPathEqualTo('/datasets')){
            this.focusTab = 4;
            this.needhide = 0;
        }else if (this.location.isCurrentPathEqualTo('/model')){
            this.focusTab = 5;
            this.needhide = 0;
        }else if (this.location.isCurrentPathEqualTo('/algplugins')){
            this.focusTab = 6;
            this.needhide = 0;
        }
    }
}
