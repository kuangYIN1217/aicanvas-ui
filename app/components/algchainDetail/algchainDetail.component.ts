import { Component } from '@angular/core';
import { Location } from '@angular/common'
// import { ActivatedRoute,Params} from '@angular/router';
import { SceneService } from '../../common/services/scene.service'

import { SceneInfo } from "../../common/defs/resources";
@Component({
  moduleId: module.id,
  selector: 'algchainDetail',
  styleUrls: ['./css/algchainDetail.component.css'],
  templateUrl: './templates/algchainDetail.html',
  providers: [SceneService]
})
export class AlgchainDetailComponent {
    scene: SceneInfo = new SceneInfo();
    constructor(private sceneService: SceneService, private location: Location){}
    ngOnInit(){
        // let test=this.route.params
        // .switchMap((params: Params) => params['scene_id']);
        // console.log(test);
        if (this.location.path(false).indexOf('/algchainDetail/')!=-1){
            let id = this.location.path(false).split('/algchainDetail/')[1];
            if(id){
                // console.log(id);
                this.sceneService.getSceneById(id)
                    .subscribe(scene => this.scene = scene);
            }
        }
    }
    ngDoCheck(){
        // console.log("check");
        if (this.location.path(false).indexOf('/algchainDetail/')!=-1){
            let id = this.location.path(false).split('/algchainDetail/')[1];
            if(id!=this.scene.id){
                this.sceneService.getSceneById(id)
                    .subscribe(scene => this.scene = scene);
            }
        }
    }
}
