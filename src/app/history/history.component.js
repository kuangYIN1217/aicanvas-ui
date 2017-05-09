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
const scene_service_1 = require("../../common/services/scene.service");
const router_1 = require("@angular/router");
let HistoryComponent = class HistoryComponent {
    constructor(modelService, location, sceneService, route, router) {
        this.modelService = modelService;
        this.location = location;
        this.sceneService = sceneService;
        this.route = route;
        this.router = router;
        this.historyInfo = new resources_1.HistoryInfo();
        this.page = 1;
        this.pageMaxItem = 10;
        this.getHistory(this.page - 1, this.pageMaxItem);
    }
    getHistory(page, size) {
        this.modelService.getHistory(page, size).subscribe(history => {
            this.result = history.content;
            this.historyInfo = history;
        });
    }
    output(percent) {
        if (percent == 100) {
            return parseInt(percent) + "%";
        }
        else {
            return parseFloat(percent).toFixed(2) + "%";
        }
    }
    maxItemChange() {
        this.page = 1;
        this.getHistory(this.page - 1, this.pageMaxItem);
    }
    nextPage() {
        this.page++;
        this.getHistory(this.page - 1, this.pageMaxItem);
    }
    previousPage() {
        if (this.page > 1) {
            this.page--;
            this.getHistory(this.page - 1, this.pageMaxItem);
        }
        else {
            alert('已经是首页');
        }
    }
    viewDetail(num) {
        this.router.navigate(['../historyDetail'], { queryParams: { "runId": this.result[num].id } });
        console.log(this.result[num].id);
    }
};
HistoryComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'history',
        styleUrls: ['./css/history.component.css'],
        templateUrl: './templates/history.html',
        providers: [resources_service_1.ResourcesService, model_service_1.modelService]
    }),
    __metadata("design:paramtypes", [model_service_1.modelService, common_1.Location, scene_service_1.SceneService, router_1.ActivatedRoute, router_1.Router])
], HistoryComponent);
exports.HistoryComponent = HistoryComponent;
//# sourceMappingURL=history.component.js.map