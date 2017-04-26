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
    historyInfo:HistoryInfo=new HistoryInfo();
    result:HistoryInfo[];
    page: number = 1;
    pageMaxItem: number = 10;
    constructor(private modelService: modelService, private location: Location,private sceneService: SceneService,private route: ActivatedRoute ,private router: Router){
        this.getHistory(this.page-1,this.pageMaxItem);
    }
    getHistory(page,size){
        this.modelService.getHistory(page,size).subscribe(history => {
            this.result=history.content;
            this.historyInfo = history;

        });
    }
    output(percent){
        if(percent==100){
            return parseInt(percent)+"%";
        }else{
            return parseFloat(percent).toFixed(2) +"%";
        }
    }
    maxItemChange(){
        this.page=1;
        this.getHistory(this.page-1,this.pageMaxItem)
    }
    nextPage(){
        this.page++;
        this.getHistory(this.page-1,this.pageMaxItem)

    }
    previousPage(){
        if (this.page>1){
            this.page--;
            this.getHistory(this.page-1,this.pageMaxItem)
        }else{
            alert('已经是首页');
        }
    }
    viewDetail(num){
        this.router.navigate(['../historyDetail'],{queryParams:{"runId":this.result[num].id}});
        console.log(this.result[num].id);
    }
}


