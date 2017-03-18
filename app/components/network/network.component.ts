import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'

import { SceneInfo } from "../../common/defs/resources";
declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'network',
  styleUrls: ['./css/network.component.css'],
  templateUrl: './templates/network.html',
  providers: [ResourcesService]
})
export class NetworkComponent{
    scene_id: number;
    scene: SceneInfo = new SceneInfo;
    sceneArray: SceneInfo[];
    constructor(private resourcesService: ResourcesService, private location: Location){
        if (this.location.path(false).indexOf('/network/')!=-1){
            let id = this.location.path(false).split('/network/')[1];
            if(id){
                this.scene_id = Number(id);
            }
            resourcesService.getScenes()
                .subscribe(sceneArray => this.sceneArray = sceneArray);
            if(!this.sceneArray){
                this.authenticate_loop();
            }else{
                this.insertData();
            }
        }
    }
    private authenticate_loop() {
        setTimeout (() => {
            //console.log("Hello from setTimeout");
            if(!this.sceneArray){
                this.authenticate_loop();
            }else{
                //console.log("Data received");
                for (let scene of this.sceneArray){
                    // console.log(scene.scene_id);
                    if(scene.scene_id==this.scene_id){
                        this.scene = scene;
                        // console.log(this.scene_current);
                        break;
                    }
                }
                this.insertData();
            }
        }, 50);
    }
    insertData(){
        $('#scene_name').html(this.scene.scene_name);
        $('#scene_description').html("场景描述:<br>"+this.scene.scene_description);
        $('.alg_name').html('AlgPlug1');
        $('.layer_name').html('Input_1');
    }
}
