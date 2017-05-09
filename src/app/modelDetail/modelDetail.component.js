"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const resources_service_1 = require("../../common/services/resources.service");
const model_service_1 = require("../../common/services/model.service");
const router_1 = require("@angular/router");
const ng2_file_upload_1 = require("ng2-file-upload");
const app_constants_1 = require("../../app.constants");
let ModelDetailComponent = class ModelDetailComponent {
    constructor(modelService, location, route, router) {
        this.modelService = modelService;
        this.location = location;
        this.route = route;
        this.router = router;
        this.SERVER_URL = app_constants_1.SERVER_URL;
        this.model_id = -1;
        this.result = [];
        this.tabIndex = 0;
        this.Headers = this.modelService.getHeaders();
        this.uploader = new ng2_file_upload_1.FileUploader({
            url: app_constants_1.SERVER_URL + "/api/model/upload",
            method: "POST",
            itemAlias: "file",
        });
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.model_id = params['model_id'];
            this.job_path = params['job_path'];
            //this.scene = params['scene'];
        });
    }
    // C: 定义事件，选择文件
    selectedFileOnChanged(event) {
        // 打印文件选择名称
        console.log(event.target.value);
    }
    // D: 定义事件，上传文件
    uploadFile() {
        this.uploader.queue[0].onSuccess = (response, status, headers) => {
            this.uploader.queue[0].remove();
            var responsePath = response;
            this.saveModelAndUpload(responsePath);
        };
        this.uploader.queue[0].upload(); // 开始上传
        //this.tabIndex=this.scene;
    }
    getResult(modelId) {
        this.modelService.getResult(modelId).subscribe(result => {
            if (result.content.length != 0) {
                clearInterval(this.interval);
                this.result = result.content;
                this.type = this.result[0].resultType;
            }
        });
    }
    saveModelAndUpload(filePath) {
        this.modelService.saveModelAndUpload(this.modelName, this.model_id, filePath).subscribe(result => {
            this.runId = result.id;
            this.interval = setInterval(() => this.getResult(this.runId), 500);
            this.modelService.runInference(result.id, this.job_path).subscribe(data => {
            });
            //this.router.navigate(['../modelDetail'],{queryParams:{"runId":result.id}});
        });
    }
};
ModelDetailComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'modelDetail',
        styleUrls: ['./css/modelDetail.component.css'],
        templateUrl: './templates/modelDetail.html',
        providers: [resources_service_1.ResourcesService, model_service_1.modelService]
    }),
    __metadata("design:paramtypes", [model_service_1.modelService, common_1.Location, router_1.ActivatedRoute, router_1.Router])
], ModelDetailComponent);
exports.ModelDetailComponent = ModelDetailComponent;
//# sourceMappingURL=modelDetail.component.js.map