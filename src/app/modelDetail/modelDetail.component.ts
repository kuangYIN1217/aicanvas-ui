import {Component} from "@angular/core";
import {Location} from "@angular/common";
import {ResourcesService} from "../common/services/resources.service";
import {modelService} from "../common/services/model.service";
import {inferenceResult} from "../common/defs/resources";
import {ActivatedRoute, Router} from "@angular/router";
import {FileUploader} from "ng2-file-upload";
import {SERVER_URL} from "../app.constants";
import {Headers} from "@angular/http";

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
    job_path:string;
    modelName:string;
    result:inferenceResult[]=[];
    //PercentInfo:PercentInfo=new PercentInfo;
    runId: number;
    tabIndex:number=0;
    type:string;
    scene:number;
    interval: any;
    constructor(private modelService: modelService, private location: Location,private route: ActivatedRoute ,private router: Router){

    }
    Headers:Headers = this.modelService.getHeaders();
    public uploader:FileUploader = new FileUploader({
        url: SERVER_URL+"/api/model/upload",
        method: "POST",
        itemAlias: "file",
    });
    ngOnInit(){
        this.route.queryParams.subscribe(params => {
            this.model_id = params['model_id'];
            this.job_path = params['job_path'];
            //this.scene = params['scene'];
        });
    }
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
        //this.tabIndex=this.scene;
    }
    getResult(modelId:number){
        this.modelService.getResult(modelId).subscribe(result=>{
            if (result.content.length!=0) {
                clearInterval(this.interval);
                this.result = result.content;
                this.type = this.result[0].resultType;
            }
        })
    }
    saveModelAndUpload(filePath:string){
        this.modelService.saveModelAndUpload(this.modelName,this.model_id,filePath).subscribe(result=>{
            this.runId = result.id;
            this.interval = setInterval(() => this.getResult(this.runId), 500);
            this.modelService.runInference(result.id,this.job_path).subscribe(data=>{
            })
            //this.router.navigate(['../modelDetail'],{queryParams:{"runId":result.id}});
        })
    }
}

