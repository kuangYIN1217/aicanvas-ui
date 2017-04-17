import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'
import { modelService} from "../../common/services/model.service";
import {inferenceResult, ModelInfo, PercentInfo} from "../../common/defs/resources";
import {ActivatedRoute} from "@angular/router";
import {FileUploader, FileUploaderOptions} from "ng2-file-upload";
import {SERVER_URL} from "../../app.constants";

@Component({
    moduleId: module.id,
    selector: 'modelDetail',
    styleUrls: ['./css/modelDetail.component.css'],
    templateUrl: './templates/modelDetail.html',
    providers: [ResourcesService,modelService]
})

export class ModelDetailComponent{
    model_id:number=-1;
    modelName:string;
    file:any;
    interval: any;
    result:inferenceResult[]=[];
    PercentInfo:PercentInfo=new PercentInfo;
    items:string[]=['top1','top2','top3'];
    item:string;
    constructor(private modelService: modelService, private location: Location, private route: ActivatedRoute ){

    }

    Headers:Headers = this.modelService.getHeaders();
    public uploader:FileUploader = new FileUploader({
        url: SERVER_URL+"/api/model/upload",
        method: "POST",
        itemAlias: "file",
    });
    // C: 定义事件，选择文件
    selectedFileOnChanged(event:any) {
        // 打印文件选择名称
        console.log(event.target.value);
    }

    // D: 定义事件，上传文件
    uploadFile() {
        this.uploader.queue[0].onSuccess = (response: any, status: any, headers: any) => {
            var responsePath = response;
            this.saveModelAndUpload(responsePath);
        }

        this.uploader.queue[0].upload(); // 开始上传
    }

    ngOnInit(){
        this.route.queryParams.subscribe(params => {
            this.model_id = params['model_id'];
        });
    }

    saveModelAndUpload(filePath:string){
        this.modelService.saveModelAndUpload(this.modelName,this.model_id,filePath).subscribe(result=>{
            this.modelService.runInference(result.id).subscribe(data=>{
                 this.interval = setInterval(() => this.getResult(result.id), 500);
                  this.modelService.getPercent(result.id)
                      .subscribe(percent => this.PercentInfo=percent);
        })
    })
    }
    getResult(modelId:number){
         this.modelService.getResult(modelId).subscribe(result=>{
             if (result.length!=0) {
                 clearInterval(this.interval);
                 this.result = result;
             }
         })
    }
    changeValue(){

    }

}

