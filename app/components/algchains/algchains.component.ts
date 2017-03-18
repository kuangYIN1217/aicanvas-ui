import { Component, OnInit } from '@angular/core';
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
export class AlgChainsComponent implements OnInit{
    sceneArray: SceneInfo[];
    scene_current:SceneInfo  = new SceneInfo();
    current_scene_id: number = 0;
    showManageDiv = 1;
    constructor(private resourcesService: ResourcesService, private location: Location){
        resourcesService.getScenes()
            .subscribe(sceneArray => this.sceneArray = sceneArray);
    }
    ngOnInit() {
       // console.log('ngOnInit');
       if (this.location.path(false).indexOf('/algchains/')!=-1){
           let id = this.location.path(false).split('/algchains/')[1];
           if(id){
               this.showManageDiv = 0;
               this.current_scene_id = Number(id);
               // console.log("current_id:"+this.current_scene_id);
               // console.log(this.sceneArray);
               if(!this.sceneArray){
                   this.authenticate_loop();
               }else{
                   this.insertData();
               }
           }
           this.lisenUrl();
       }
   }
   private lisenUrl(){
       //console.log("lisen Url...");
       setTimeout (() => {
           if (this.location.path(false).indexOf('/algchains/')!=-1){
               let id = this.location.path(false).split('/algchains/')[1];
               if (Number(id)!=this.current_scene_id){
                   this.current_scene_id=Number(id);
                   this.insertData();
               }
           }
           this.lisenUrl();
       }, 200);
   }
    private authenticate_loop() {
        setTimeout (() => {
            //console.log("Hello from setTimeout");
            if(!this.sceneArray){
                this.authenticate_loop();
            }else{
                //console.log("Data received");
                this.insertData();
            }
        }, 50);
    }

    insertData(){
        // find scene
        // console.log("insert");
        for (let scene of this.sceneArray){
            // console.log(scene.scene_id);
            if(scene.scene_id==this.current_scene_id){
                this.scene_current = scene;
                // console.log(this.scene_current);
                break;
            }
        }
        // console.log(this.scene_current.scene_name);
        $('#scene_name').html(this.scene_current.scene_name);
        $('#scene_description').html("场景描述: "+this.scene_current.scene_description);




        //
        
    }
}
