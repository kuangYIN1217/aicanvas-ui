import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'
import {modelService} from "../../common/services/model.service";
import {JobInfo, ModelInfo, SceneInfo} from "../../common/defs/resources";
import {SceneService} from "../../common/services/scene.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'model',
  styleUrls: ['./css/model.component.css'],
  templateUrl: './templates/model.html',
  providers: [ResourcesService,modelService]
})
export class ModelComponent{
    SceneInfo:SceneInfo[] = [];
    JobInfo:JobInfo[] = [];
    ModelInfo:ModelInfo[] = [];
    student:number=0;
    constructor(private modelService: modelService, private location: Location,private sceneService: SceneService, private route: ActivatedRoute){
        if (location.path(false).indexOf('/model/')!=-1){
            let jobPath = location.path(false).split('/model/')[1];
            if(jobPath){
               /* modelService.getStatue().subscribe(jobs => this.selectJob(jobs,jobPath));*/
               this.modelService.getStatue(jobPath).subscribe(jobs=>JobInfo=jobs);
            }
        }



        this.sceneService.getAllScenes()
            .subscribe(scenes => this.SceneInfo=scenes);
       /*this.modelService.getScene()
           .subscribe(scene=>this.SceneInfo=scene);*/

    }

    ngOnInit(){
        this.route.queryParams.subscribe(params => {
            this.student = params['sence'];
            this.selectChange();
        });


    }

    selectChange(){
        let id=this.student;
        this.modelService.getModel(id)
            .subscribe(model => this.ModelInfo=model);
    }
}

