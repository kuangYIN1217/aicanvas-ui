import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'
import { modelService} from "../../common/services/model.service";
import {ModelInfo} from "../../common/defs/resources";
import {ActivatedRoute} from "@angular/router";
import {FileUploader} from "ng2-file-upload";

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
    constructor(private modelService: modelService, private location: Location, private route: ActivatedRoute ){

    }

    public uploader:FileUploader = new FileUploader({
        url: "http://10.165.33.20:8080/api/model/upload",
        method: "POST",
        itemAlias: "uploadedfile"

    });
    // C: 定义事件，选择文件
    selectedFileOnChanged(event:any) {
        // 打印文件选择名称
        console.log(event.target.value);
    }
    // D: 定义事件，上传文件
    uploadFile() {
        // 上传
        debugger;
        this.uploader.queue[0].onSuccess = function (response, status, headers) {
            debugger;
            // 上传文件成功
            if (status == 200) {
                // 上传文件后获取服务器返回的数据
                let tempRes = JSON.parse(response);
            } else {
                // 上传文件后获取服务器返回的数据错误
                alert("");
            }
        };
        this.uploader.queue[0].upload(); // 开始上传
    }

    ngOnInit(){
        this.route.queryParams.subscribe(params => {
            this.model_id = params['model_id'];
        });
    }


    saveModelAndUpload(){
        this.modelService.saveModelAndUpload(this.modelName,this.model_id,this.file)
    }
}

