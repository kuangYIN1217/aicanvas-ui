import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'

import { SceneInfo } from "../../common/defs/resources";
// declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'network',
  styleUrls: ['./css/network.component.css'],
  templateUrl: './templates/network.html',
  providers: [ResourcesService]
})
export class NetworkComponent{
    scene_id: number;
    constructor(private resourcesService: ResourcesService, private location: Location){
        if (this.location.path(false).indexOf('/network/')!=-1){
            let id = this.location.path(false).split('/network/')[1];
            if(id){
                this.scene_id = Number(id);
            }
        }
    }
}
