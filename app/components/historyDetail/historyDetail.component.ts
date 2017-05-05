import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Location} from "@angular/common";
import {ResourcesService} from "../../common/services/resources.service";
import {modelService} from "../../common/services/model.service";
import {inferenceResult, PercentInfo} from "../../common/defs/resources";
import {ActivatedRoute, Router} from "@angular/router";
import {SERVER_URL} from "../../app.constants";

@Component({
    moduleId: module.id,
    selector: 'historyDetail',
    styleUrls: ['./css/historyDetail.component.css'],
    templateUrl: './templates/historyDetail.html',
    providers: [ResourcesService,modelService]
})
export class HistoryDetailComponent {
    SERVER_URL = SERVER_URL;
    @Input() model_id:number=-1;
    model_pre:number=-1;
    file:any;
    interval: any;
    PercentInfo:PercentInfo = new PercentInfo;
    items:any[]=['top1','top2','top3','All'];
    item:string;
    outputArr:any[]=[];
    id:number;
    result:inferenceResult[]=[];
    resultP:inferenceResult[]=[];
    page: number = 1;
    pageMaxItem: number = 10;
    constructor(private modelService: modelService, private location: Location, private route: ActivatedRoute ,private router: Router) {
        this.route.queryParams.subscribe(params => {
            this.model_id = params['runId'];
            if(this.model_id&&this.model_id!=-1){
                this.model_pre = this.model_id;
                this.interval = setInterval(() => this.getResult(this.model_id,this.page-1,this.pageMaxItem), 500);
            }
        });
        this.item = this.items[0];
        this.changeValue();
    }

    ngOnChanges(...args: any[]) {
        for (let obj=0; obj < args.length;obj++) {
            if(args[obj]['model_id']["currentValue"]){
                this.model_pre = this.model_id;
                //console.log(this.model_id);
                this.interval = setInterval(() => this.getResult(this.model_id,this.page-1,this.pageMaxItem), 500);
            }
            this.modelService.getPercent(this.model_id)
                .subscribe(percent => {
                    this.PercentInfo = percent;
                });
        }
    }
    ngOnDestroy() {
        // 退出时停止更新
        clearInterval(this.interval);
    }

    queryResult(runId){
        this.model_id = runId;
        this.model_pre = this.model_id;
        this.interval = setInterval(() => this.getResult(this.model_id,this.page-1,this.pageMaxItem), 500);
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
        if(this.item=='All')
            this.id=10;
        else
        this.id = Number(this.item.substring(3));
    }
    output(input){
        this.outputArr = input.substring(1,input.length-1).split(",");
        return this.outputArr.slice(0,this.id);
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
