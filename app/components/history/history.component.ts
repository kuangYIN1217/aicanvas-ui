import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'
import {modelService} from "../../common/services/model.service";
import {HistoryInfo, ModelInfo, SceneInfo} from "../../common/defs/resources";
import {SceneService} from "../../common/services/scene.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: 'history',
    styleUrls: ['./css/history.component.css'],
    templateUrl: './templates/history.html',
    providers: [ResourcesService,modelService]
})
export class HistoryComponent{
    HistoryInfo:HistoryInfo[] = [];
    constructor(private modelService: modelService, private location: Location,private sceneService: SceneService){
        this.modelService.getHistory()
            .subscribe(history => this.HistoryInfo=history);
    }
}


