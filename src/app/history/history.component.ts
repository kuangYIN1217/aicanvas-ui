import { Component } from '@angular/core';
import { Location } from '@angular/common'
import {ActivatedRoute, Router} from "@angular/router";
import {ResourcesService} from "../common/services/resources.service";
import {modelService} from "../common/services/model.service";
import {HistoryInfo, inferenceResult} from "../common/defs/resources";
import {SceneService} from "../common/services/scene.service";

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
    data:inferenceResult[]=[];
    page: number = 1;
    pageMaxItem: number = 10;
    type:string;
    interval: any;
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
      this.modelService.getResult(this.result[num].id)
        .subscribe(data=>{
          if (data.content.length!=0) {
            clearInterval(this.interval);
            this.data = data.content;
            this.type = this.data[0].resultType;
            console.log(this.type);
            if(this.type=='raw_text'){
              this.router.navigate(['../historyDetail'],{queryParams:{"runId":this.result[num].id}});
            }else if(this.type=='multiple_labeled_images'){
              this.router.navigate(['../showImage'],{queryParams:{"runId":this.result[num].id}});
            }else{
              this.router.navigate(['../historyDetail'],{queryParams:{"runId":this.result[num].id}});
            }
          }
        })

        //console.log(this.result[num].id);
    }
}


