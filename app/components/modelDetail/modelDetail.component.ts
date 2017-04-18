import {Component, EventEmitter} from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'
import { modelService} from "../../common/services/model.service";
import {inferenceResult, ModelInfo, PercentInfo} from "../../common/defs/resources";
import {ActivatedRoute} from "@angular/router";
import {FileUploader, FileUploaderOptions} from "ng2-file-upload";
import {SERVER_URL} from "../../app.constants";
import {NgModule,Component,ElementRef,Input,Output,SimpleChange,EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'modelDetail',
    styleUrls: ['./css/modelDetail.component.css'],
    templateUrl: './templates/modelDetail.html',
    providers: [ResourcesService,modelService]
})

export class ModelDetailComponent{
    SERVER_URL = SERVER_URL
    model_id:number=-1;
    model_pre:number=-1;
    modelName:string;
    file:any;
    interval: any;
    result:inferenceResult[]=[];
    PercentInfo:PercentInfo=new PercentInfo;
    items:any[]=['top1','top2','top3'];
    item:string;
    outputArr:any[]=[];
    id:string;
    resultP:inferenceResult[]=[];
    page: number = 1;
    pageMaxItem: number = 10;

    constructor(private modelService: modelService, private location: Location, private route: ActivatedRoute ){
        this.item = this.items[0];
        this.changeValue();
    }

    ngOnDestroy() {
        // 退出时停止更新
        clearInterval(this.interval);
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
            this.uploader.queue[0].remove();
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
                this.model_pre = result.id;
                 this.interval = setInterval(() => this.getResult(result.id,this.page-1,this.pageMaxItem), 500);
                  this.modelService.getPercent(result.id)
                      .subscribe(percent => this.PercentInfo=percent);
        })
    })
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

