import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'
import { modelService} from "../../common/services/model.service";
import {inferenceResult, ModelInfo, PercentInfo} from "../../common/defs/resources";
import {ActivatedRoute, Router} from "@angular/router";
import {FileUploader, FileUploaderOptions} from "ng2-file-upload";
import {SERVER_URL} from "../../app.constants";

@Component({
    moduleId: module.id,
    selector: 'historyDetail',
    styleUrls: ['./css/historyDetail.component.css'],
    templateUrl: './templates/historyDetail.html',
    providers: [ResourcesService,modelService]
})
export class HistoryDetailComponent {
    SERVER_URL = SERVER_URL
    model_id:number=-1;
    model_pre:number=-1;
    file:any;
    interval: any;
    PercentInfo:PercentInfo=new PercentInfo;
    items:any[]=['top1','top2','top3'];
    item:string;
    outputArr:any[]=[];
    id:string;
    result:inferenceResult[]=[];
    resultP:inferenceResult[]=[];
    page: number = 1;
    pageMaxItem: number = 10;
    constructor(private modelService: modelService, private location: Location, private route: ActivatedRoute ,private router: Router) {
        this.route.queryParams.subscribe(params => {
            this.model_id = params['runId'];
        });
        this.model_pre = this.model_id;
        this.interval = setInterval(() => this.getResult(this.model_id,this.page-1,this.pageMaxItem), 500);
        this.modelService.getPercent(this.model_id)
            .subscribe(percent => this.PercentInfo=percent);
        this.item = this.items[0];
        this.changeValue();
    }
    ngOnDestroy() {
        // 退出时停止更新
        clearInterval(this.interval);
    }
    getResult(modelId:number,page,size){
        this.modelService.getResult(modelId,page,size).subscribe(result=>{
            if (result.content.length!=0) {
                clearInterval(this.interval);
                this.result = result.content;
                this.resultP = result;
            }
        })
    }
    changeValue(){
        this.id = this.item.substring(3);
    }
    output(input){
        this.outputArr = input.substring(1,input.length-1).split(",");
        if(this.id=="1"){
            return this.outputArr.slice(0,1);
        }else if(this.id=="2"){
            return this.outputArr.slice(0,2);
        }else if(this.id=="3"){
            return this.outputArr.slice(0,3);
        }
        return ""
    }
    maxItemChange(){
        this.page=1;
        this.getResult(this.model_pre,this.page-1,this.pageMaxItem)
    }
    nextPage(){
        this.page++;
        this.getResult(this.model_pre,this.page-1,this.pageMaxItem)

    }
    previousPage(){
        if (this.page>1){
            this.page--;
            this.getResult(this.model_pre,this.page-1,this.pageMaxItem)
        }else{
            alert('已经是首页');
        }
    }

}
