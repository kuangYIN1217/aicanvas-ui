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
const resources_1 = require("../../common/defs/resources");
const router_1 = require("@angular/router");
const app_constants_1 = require("../../app.constants");
let HistoryDetailComponent = class HistoryDetailComponent {
    constructor(modelService, location, route, router) {
        this.modelService = modelService;
        this.location = location;
        this.route = route;
        this.router = router;
        this.SERVER_URL = app_constants_1.SERVER_URL;
        this.model_id = -1;
        this.model_pre = -1;
        this.PercentInfo = new resources_1.PercentInfo;
        this.items = ['top1', 'top2', 'top3', 'All'];
        this.outputArr = [];
        this.result = [];
        this.resultP = [];
        this.page = 1;
        this.pageMaxItem = 10;
        this.route.queryParams.subscribe(params => {
            this.model_id = params['runId'];
            if (this.model_id && this.model_id != -1) {
                this.model_pre = this.model_id;
                this.interval = setInterval(() => this.getResult(this.model_id, this.page - 1, this.pageMaxItem), 500);
            }
        });
        this.item = this.items[0];
        this.changeValue();
    }
    ngOnChanges(...args) {
        for (let obj = 0; obj < args.length; obj++) {
            if (args[obj]['model_id']["currentValue"]) {
                this.model_pre = this.model_id;
                //console.log(this.model_id);
                this.interval = setInterval(() => this.getResult(this.model_id, this.page - 1, this.pageMaxItem), 500);
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
    queryResult(runId) {
        this.model_id = runId;
        this.model_pre = this.model_id;
        this.interval = setInterval(() => this.getResult(this.model_id, this.page - 1, this.pageMaxItem), 500);
    }
    getResult(modelId, page, size) {
        this.modelService.getResult(modelId, page, size).subscribe(result => {
            if (result.content.length != 0) {
                clearInterval(this.interval);
                this.result = result.content;
                this.resultP = result;
            }
        });
    }
    changeValue() {
        if (this.item == 'All')
            this.id = 10;
        else
            this.id = Number(this.item.substring(3));
    }
    output(input) {
        this.outputArr = input.substring(1, input.length - 1).split(",");
        return this.outputArr.slice(0, this.id);
    }
    maxItemChange() {
        this.page = 1;
        this.getResult(this.model_pre, this.page - 1, this.pageMaxItem);
    }
    nextPage() {
        this.page++;
        this.getResult(this.model_pre, this.page - 1, this.pageMaxItem);
    }
    previousPage() {
        if (this.page > 1) {
            this.page--;
            this.getResult(this.model_pre, this.page - 1, this.pageMaxItem);
        }
        else {
            alert('已经是首页');
        }
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], HistoryDetailComponent.prototype, "model_id", void 0);
HistoryDetailComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'historyDetail',
        styleUrls: ['./css/historyDetail.component.css'],
        templateUrl: './templates/historyDetail.html',
        providers: [resources_service_1.ResourcesService, model_service_1.modelService]
    }),
    __metadata("design:paramtypes", [model_service_1.modelService, common_1.Location, router_1.ActivatedRoute, router_1.Router])
], HistoryDetailComponent);
exports.HistoryDetailComponent = HistoryDetailComponent;
//# sourceMappingURL=historyDetail.component.js.map