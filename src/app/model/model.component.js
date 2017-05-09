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
const scene_service_1 = require("../../common/services/scene.service");
const router_1 = require("@angular/router");
let ModelComponent = class ModelComponent {
    constructor(modelService, location, sceneService, route, router) {
        this.modelService = modelService;
        this.location = location;
        this.sceneService = sceneService;
        this.route = route;
        this.router = router;
        this.SceneInfo = [];
        this.JobInfo = [];
        this.ModelInfo = [];
        this.student = 0;
        this.selected = 0;
        this.item = 0;
        this.page = 1;
        this.pageMaxItem = 10;
        this.arr = [];
        this.result = 1;
        this.sceneService.getAllScenes()
            .subscribe(scenes => this.SceneInfo = scenes);
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.student = params['sence'];
            this.selectChange();
        });
    }
    selectChange() {
        this.id = this.student;
        this.pageMaxItem = 10;
        this.modelService.getModel(this.id)
            .subscribe(model => {
            this.ModelInfo = model;
            this.firstPath = this.ModelInfo[0].job_path;
            this.firstId = this.ModelInfo[0].model_id;
            this.arr = this.ModelInfo.slice(0, 10);
            this.getInit();
        });
        //this.arr = this.ModelInfo.slice(0,9);
        //console.log(this.arr);
    }
    getInit() {
        this.data = Math.floor(this.ModelInfo.length / this.pageMaxItem) + 1;
        this.length = this.ModelInfo.length;
        if (this.result && this.length != 0) {
            if (this.length % this.pageMaxItem == 0) {
                this.result = this.length / this.pageMaxItem;
            }
            else {
                this.result = Math.floor(this.length / this.pageMaxItem) + 1;
            }
        }
        else if (this.length == 0) {
            this.result = 1;
        }
    }
    clickStatus(statu, model_id, job_path) {
        this.selected = statu;
        this.item = model_id;
        this.job_path = job_path;
    }
    clickBtn() {
        //this.router.navigate(['../modelDetail'],{queryParams:{"model_id":this.item}});
        //console.log(this.ModelInfo.length);
        if (this.ModelInfo.length > 0) {
            if (this.item == 0 || this.job_path == 'undefined') {
                this.job_path = this.firstPath;
                this.item = this.firstId;
            }
            this.router.navigate(['../modelDetail'], { queryParams: { "model_id": this.item, "job_path": this.job_path } });
        }
        else {
            return false;
        }
    }
    getTotals(num) {
        if (this.ModelInfo.length % num == 0) {
            this.result = Math.floor(this.ModelInfo.length / num);
        }
        else {
            this.result = Math.floor(this.ModelInfo.length / num) + 1;
        }
    }
    maxItemChange(num) {
        this.page = 1;
        if (num == 10) {
            this.arr = this.ModelInfo.slice(0, 10);
            this.getTotals(num);
        }
        else if (num == 20) {
            this.arr = this.ModelInfo.slice(0, 20);
            this.getTotals(num);
        }
        else if (num == 50) {
            this.arr = this.ModelInfo.slice(0, 50);
            this.getTotals(num);
        }
    }
    nextPage(num) {
        this.remainder = this.ModelInfo.length % num;
        if (this.remainder == 0) {
            this.result = Math.floor(this.ModelInfo.length / num);
            //console.log(this.result);
            this.lastPage(num, this.result);
        }
        else {
            this.result = Math.floor(this.ModelInfo.length / num) + 1;
            this.lastPage(num, this.result);
            //console.log(this.result);
        }
    }
    lastPage(num, result) {
        if (this.page < result) {
            this.page++;
            this.arr = this.ModelInfo.slice(num * this.page - num, num * this.page);
        }
        else {
            alert('已经是最后一页');
        }
    }
    previousPage(num) {
        if (this.page > 1) {
            this.page--;
            this.arr = this.ModelInfo.slice(num * this.page - num, num * this.page);
            console.log(this.arr);
        }
        else {
            alert('已经是首页');
        }
    }
};
ModelComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'model',
        styleUrls: ['./css/model.component.css'],
        templateUrl: './templates/model.html',
        providers: [resources_service_1.ResourcesService, model_service_1.modelService]
    }),
    __metadata("design:paramtypes", [model_service_1.modelService, common_1.Location, scene_service_1.SceneService, router_1.ActivatedRoute, router_1.Router])
], ModelComponent);
exports.ModelComponent = ModelComponent;
//# sourceMappingURL=model.component.js.map