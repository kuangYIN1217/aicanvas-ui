import { Component } from '@angular/core';
import { Location } from '@angular/common'
// import { ActivatedRoute,Params} from '@angular/router';
import { ResourcesService } from '../../common/services/resources.service'

import { SceneInfo } from "../../common/defs/resources";
@Component({
  moduleId: module.id,
  selector: 'algchainDetail',
  styleUrls: ['./css/algchainDetail.component.css'],
  templateUrl: './templates/algchainDetail.html',
  providers: [ResourcesService]
})
export class AlgchainDetailComponent {
    scene: SceneInfo = new SceneInfo();
    constructor(private resourcesService: ResourcesService, private location: Location){}
    ngOnInit(){
        // let test=this.route.params
        // .switchMap((params: Params) => params['scene_id']);
        // console.log(test);
        if (this.location.path(false).indexOf('/algchainDetail/')!=-1){
            let id = this.location.path(false).split('/algchainDetail/')[1];
            if(id){
                // console.log(id);
                this.resourcesService.getSceneById(Number(id))
                    .subscribe(scene => this.scene = scene);
            }
        }
    }
    ngDoCheck(){
        // console.log("check");
        if (this.location.path(false).indexOf('/algchainDetail/')!=-1){
            let id = this.location.path(false).split('/algchainDetail/')[1];
            if(Number(id)!=this.scene.scene_id){
                // console.log(Number(id));
                this.resourcesService.getSceneById(Number(id))
                    .subscribe(scene => this.scene = scene);
            }
        }
    }
}
