import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'
import {modelService} from "../../common/services/model.service";
import {JobInfo, ModelInfo, SceneInfo} from "../../common/defs/resources";
import {SceneService} from "../../common/services/scene.service";
import {ActivatedRoute, Router} from "@angular/router";

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
    selected:number=0;
    item:number=0;
    constructor(private modelService: modelService, private location: Location,private sceneService: SceneService, private route: ActivatedRoute ,private router: Router){
        this.sceneService.getAllScenes()
            .subscribe(scenes => this.SceneInfo=scenes);
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
                .subscribe(model =>this.ModelInfo=model);

    }
    clickStatus(statu,model_id){
        this.selected= statu;
        this.item=model_id;
    }
    clickBtn(){
        //this.router.navigate(['../modelDetail'],{queryParams:{"model_id":this.item}});
        console.log(this.ModelInfo.length);
        if(this.ModelInfo.length>0){
            this.router.navigate(['../modelDetail'],{queryParams:{"model_id":this.item}});
        }else{
            return false
        }

    }
}


