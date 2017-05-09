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
const plugin_service_1 = require("../../common/services/plugin.service");
const resources_1 = require("../../common/defs/resources");
const job_service_1 = require("../../common/services/job.service");
let TaskStatusComponent = class TaskStatusComponent {
    constructor(modelService, jobService, location, route, router) {
        //this.interval = setInterval (() => {this.updatePage()}, 500);
        this.modelService = modelService;
        this.jobService = jobService;
        this.location = location;
        this.route = route;
        this.router = router;
        this.page = 1;
        this.pageMaxItem = 10;
        this.Jobs = [];
        this.Jobs_current = [];
        this.createdJob = new resources_1.JobInfo();
    }
    ngOnInit() {
        this.updatePage();
    }
    updatePage() {
        this.getAlljobs(this.statuss, this.page - 1, this.pageMaxItem);
    }
    getAlljobs(status, page, size) {
        this.jobService.getAllJobs(status, page, size)
            .subscribe(Jobs => {
            this.Jobs = Jobs.content;
            this.Jobs_current = Jobs.content;
            this.createdJob = Jobs;
        });
    }
    ngOnDestroy() {
        // 退出时停止更新
        clearInterval(this.interval);
    }
    checkStatus(status, sence, jobPath) {
        if (status == 'Finished') {
            this.modelService.getStatue(jobPath).subscribe(data => {
                this.router.navigate(['../model'], { queryParams: { sence: sence } });
            });
            //TODO if success give alert
        }
        else {
            return false;
        }
    }
    start(jobPath) {
        this.jobService.runJob(jobPath)
            .subscribe(reply => this.start_reply(reply));
    }
    start_reply(reply) {
        if (reply.status == 200) {
            console.log("Start Successfully!");
        }
        else {
            console.log("Start Failed!");
        }
        this.updatePage();
    }
    stop(jobPath) {
        this.jobService.stopJob(jobPath)
            .subscribe(reply => this.stop_reply(reply));
    }
    stop_reply(reply) {
        if (reply.status == 200) {
            console.log("Stoped!");
        }
        else {
            console.log("Stop Failed!");
        }
        this.updatePage();
    }
    maxItemChange() {
        this.page = 1;
        this.getAlljobs(this.statuss, this.page - 1, this.pageMaxItem);
        //console.log(this.createdJob);
    }
    nextPage() {
        this.page++;
        this.getAlljobs(this.statuss, this.page - 1, this.pageMaxItem);
        console.log(this.createdJob);
    }
    previousPage() {
        if (this.page > 1) {
            this.page--;
            this.getAlljobs(this.statuss, this.page - 1, this.pageMaxItem);
        }
        else {
            alert('已经是首页');
        }
    }
    output(percent) {
        if (percent == 100) {
            return parseInt(percent) + "%";
        }
        else {
            return percent.toFixed(2) + "%";
        }
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TaskStatusComponent.prototype, "statuss", void 0);
TaskStatusComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'taskStatus',
        styleUrls: ['./css/taskStatus.component.css'],
        templateUrl: './templates/taskStatus.html',
        providers: [resources_service_1.ResourcesService, model_service_1.modelService, plugin_service_1.PluginService, job_service_1.JobService]
    }),
    __metadata("design:paramtypes", [model_service_1.modelService, job_service_1.JobService, common_1.Location, router_1.ActivatedRoute, router_1.Router])
], TaskStatusComponent);
exports.TaskStatusComponent = TaskStatusComponent;
//# sourceMappingURL=taskStatus.component.js.map