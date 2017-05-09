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
const job_service_1 = require("../../common/services/job.service");
const user_service_1 = require("../../common/services/user.service");
const scene_service_1 = require("../../common/services/scene.service");
const plugin_service_1 = require("../../common/services/plugin.service");
const algchain_service_1 = require("../../common/services/algchain.service");
const router_1 = require("@angular/router");
const resources_1 = require("../../common/defs/resources");
const model_service_1 = require("../../common/services/model.service");
let JobCreationComponent = class JobCreationComponent {
    constructor(sceneService, jobService, modelService, algChainService, pluginService, userService, router, route) {
        this.sceneService = sceneService;
        this.jobService = jobService;
        this.modelService = modelService;
        this.algChainService = algChainService;
        this.pluginService = pluginService;
        this.userService = userService;
        this.router = router;
        this.route = route;
        this.editable_params = [];
        // 被选中plugin的参数组合（结合了字典）
        this.editable_parameters = [];
        // 是否已经创建了新的
        this.created = 0;
        //
        this.scenes = [];
        this.chosen_scene = new resources_1.SceneInfo();
        this.pluginArr = [];
        this.PluginInfo = [];
        this.createdJob = new resources_1.JobInfo();
        this.pluginIds = [];
        // record the current step
        this.stepNumber = 1;
        // "manage"/"createJob"
        this.jobPageStatus = "manage";
        this.Jobs = [];
        this.Jobs_current = [];
        this.page = 1;
        this.pageMaxItem = 10;
        // 右侧是否显示node参数，0--显示plugin参数 ， 1--显示node参数
        this.rightBox_node = 0;
        this.selected = 0;
        this.item = 0;
        this.ChainInfo = [];
        this.arr = [];
        this.result = 1;
        this.haveModel = 0;
        this.statuss = '';
        pluginService.getLayerDict()
            .subscribe(dictionary => this.getDictionary(dictionary));
        this.pluginService.getTranParamTypes()
            .subscribe(editable_params => this.getTranParamTypes(editable_params));
    }
    ngOnDestroy() {
        // 退出时停止更新
        clearInterval(this.interval);
    }
    getTranParamTypes(editable_params) {
        // editable_params为参数字典
        this.editable_params = editable_params;
    }
    initialJobArray(Jobs) {
        console.log(Jobs);
        this.Jobs = Jobs;
        this.Jobs_current = Jobs;
    }
    //table operations
    showManage() {
        this.jobPageStatus = "manage";
    }
    CSV() {
    }
    XLS() {
    }
    changeChosenSceneId() {
        let id = this.student;
        console.log(id);
        this.chosenSceneId = id;
        this.sceneService.getChainByScene(id)
            .subscribe(results => {
            this.PluginInfo = results;
            this.firstChainId = this.PluginInfo[0].id;
            console.log(this.firstChainId);
            this.arr = this.PluginInfo.slice(0, 10);
            this.data = Math.floor(this.PluginInfo.length / this.pageMaxItem) + 1;
            this.length = this.PluginInfo.length;
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
        });
        //console.log(this.PluginInfo[0]);
        /*this.sceneService.getChainWithLoss(id)
            .subscribe(result=>this.ChainInfo=result);*/
        this.pageMaxItem = 10;
        for (let scene of this.scenes) {
            if (scene.id == id) {
                this.chosen_scene = scene;
                break;
            }
        }
    }
    clickStatus(statu, id) {
        this.selected = statu;
        this.item = id;
        //console.log(id)
    }
    output(statu) {
        if (statu == 1) {
            return "是";
        }
        else if (statu == 0) {
            return "否";
        }
    }
    // createJob
    createJob() {
        this.sceneService.getAllScenes()
            .subscribe(scenes => {
            this.createJob_getScene(scenes);
            this.student = scenes[0].id;
            this.firstSceneId = this.student;
            //console.log(this.firstSceneId);
            this.sceneService.getChainByScene(this.student)
                .subscribe(result => {
                this.PluginInfo = result;
                this.firstChainId = this.PluginInfo[0].id;
                //console.log(this.firstChainId);
                this.arr = result;
                this.arr = this.PluginInfo.slice(0, 10);
            });
        });
        //console.log(this.student);
    }
    viewDetail(id, name) {
        this.item = id;
        this.creator = name;
        this.router.navigate(['../algchains'], { queryParams: { "chain_id": this.item, "creator": this.creator } });
    }
    getDictionary(dictionary) {
        $('#layer_dictionary').val(JSON.stringify(dictionary));
    }
    createJob_getScene(scenes) {
        this.scenes = scenes;
        if (scenes[0]) {
            this.chosenSceneId = scenes[0].id;
        }
        this.jobPageStatus = "createJob";
    }
    toStep(dest) {
        this.stepNumber = dest;
    }
    nextStep() {
        if (this.stepNumber == 1 && this.created == 0) {
            this.created = 1;
            if (this.chosenSceneId == 0 || this.item == 0) {
                this.chosenSceneId = this.firstSceneId;
                this.item = this.firstChainId;
            }
            this.createJobBySenceId(this.chosenSceneId, this.item);
        }
        else if (this.stepNumber == 2) {
            this.saveJob();
        }
    }
    // 第一次点击下一步时，创建job，存储下来
    createJobBySenceId(chosenSceneId, chainId) {
        this.jobService.createJob(chosenSceneId, chainId)
            .subscribe(createdJob => {
            //let job: any = createdJob;
            //this.createdJob = job;
            this.createdJob = createdJob;
            console.log(this.createdJob.chainId);
            this.createJobBySenceId2(this.createdJob.chainId);
        });
    }
    // 根据chainId得到算法链,保存后进入下一页面
    createJobBySenceId2(chainId) {
        // console.log(this.createdJob);
        console.log(chainId);
        this.algChainService.getChainById(chainId)
            .subscribe(pluginArr => {
            this.pluginArr = pluginArr;
            this.changeChosenPlugin(this.pluginArr[0].id);
            this.stepNumber = this.stepNumber + 1;
        });
    }
    changeChosenPlugin(id) {
        if (!this.chosenPluginId) {
            this.chosenPluginId = id;
            let training_network_json = this.findPluginById(this.chosenPluginId).model;
            // console.log(training_network_json);
            if (training_network_json) {
                this.haveModel = 1;
                // console.log(this.findPluginById(this.chosenPluginId));
                // console.log(training_network_json);
                $('#plugin_storage').val(JSON.stringify(training_network_json));
                $('#hideBtn').click();
            }
        }
        else {
            this.savePluginChange();
            this.chosenPluginId = id;
            let training_network_json = this.findPluginById(this.chosenPluginId).model;
            //console.log(training_network_json);
            if (training_network_json) {
                // console.log(training_network_json);
                let inited = false;
                if ($('#plugin_storage').val() && $('#plugin_storage').val() !== "") {
                    inited = true;
                }
                $('#plugin_storage').val(JSON.stringify(training_network_json));
                if (inited) {
                    $('#loadBtn').click();
                    // 等待动画效果结束后再展示，否则会闪烁一下
                    setTimeout(() => {
                        this.haveModel = 1;
                    }, 50);
                }
                else {
                    $('#hideBtn').click();
                    this.haveModel = 1;
                }
            }
            else {
                // 无网络层则将网络层隐藏
                this.haveModel = 0;
            }
        }
        this.pluginClicked();
    }
    savePluginChange() {
        let id = this.chosenPluginId;
        // let originJson = JSON.stringify(this.findPluginById(id).model);
        let json = $('#plugin_storage').val();
        if (json != "") {
            let jsonData = JSON.parse(json);
            this.findPluginById(id).model = jsonData;
            let params = this.findPluginById(this.chosenPluginId).train_params;
            for (var key in params) {
                for (let editable_parameter of this.editable_params) {
                    if (editable_parameter.path == key) {
                        this.findPluginById(this.chosenPluginId).train_params[key] = editable_parameter.editable_param.set_value;
                    }
                }
            }
        }
        else {
            console.log("Without the network layer");
        }
    }
    pluginClicked() {
        let editable_parameters = [];
        let params = this.findPluginById(this.chosenPluginId).train_params;
        for (var param in params) {
            for (let editable_parameter of this.editable_params) {
                if (editable_parameter.path == param) {
                    editable_parameter.editable_param.set_value = params[param];
                    editable_parameters.push(editable_parameter);
                    break;
                }
            }
        }
        // 更新变量
        this.editable_parameters = editable_parameters;
        // 改变右侧显示的内容--显示plugin
        this.rightBox_node = 0;
    }
    nodeClicked() {
        // 改变右侧显示的内容--显示node
        this.rightBox_node = 1;
    }
    savePluginParams() {
    }
    findPluginById(id) {
        for (let plugin of this.pluginArr) {
            if (plugin.id == id) {
                return plugin;
            }
        }
    }
    saveJob() {
        console.log("saveJob...");
        this.savePluginChange();
        for (let plugin of this.pluginArr) {
            this.pluginService.savePlugin(plugin)
                .subscribe(response => this.saveJobNormalPlugin(response, plugin.id));
        }
        this.stepNumber = this.stepNumber + 1;
    }
    saveJobNormalPlugin(response, plugin_id) {
        if (response.status == 200) {
            console.info("plugins -- " + plugin_id + "save ok");
        }
        else {
            console.warn("save failed");
        }
    }
    create() {
        this.jobService.runJob(this.createdJob.jobPath)
            .subscribe(reply => this.runJobResult(reply, this.createdJob.jobPath));
    }
    runJobResult(reply, jobPath) {
        // 成功运行
        if (reply.status == 200) {
            // 重新获取所有Job
            // this.jobService.getAllJobs(this.page-1,this.pageMaxItem);
            // 前往详情界面
            this.router.navigate(['/jobDetail', jobPath]);
        }
        else {
            // 运行失败报错
        }
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
    getTotals(num) {
        if (this.PluginInfo.length % num == 0) {
            this.result = Math.floor(this.PluginInfo.length / num);
        }
        else {
            this.result = Math.floor(this.PluginInfo.length / num) + 1;
        }
    }
    maxItemChange(num) {
        this.page = 1;
        this.arr = this.PluginInfo.slice(0, num);
        this.getTotals(num);
    }
    nextPage(num) {
        this.remainder = this.PluginInfo.length % num;
        if (this.remainder == 0) {
            this.result = Math.floor(this.PluginInfo.length / num);
            //console.log(this.result);
            this.lastPage(num, this.result);
        }
        else {
            this.result = Math.floor(this.PluginInfo.length / num) + 1;
            this.lastPage(num, this.result);
            //console.log(this.result);
        }
    }
    lastPage(num, result) {
        if (this.page < result) {
            this.page++;
            this.arr = this.PluginInfo.slice(num * this.page - num, num * this.page);
        }
        else {
            alert('已经是最后一页');
        }
    }
    previousPage(num) {
        if (this.page > 1) {
            this.page--;
            this.arr = this.PluginInfo.slice(num * this.page - num, num * this.page);
            console.log(this.arr);
        }
        else {
            alert('已经是首页');
        }
    }
    // 修改参数
    setValue(parameter, value) {
        if (parameter.type == 'string') {
            parameter.set_value = value;
        }
        else if (parameter.type == 'boolean') {
            // 当作string
            parameter.set_value = value;
        }
        else if (parameter.type == 'int' || parameter.type == 'float') {
            if (Number(value) + "" == NaN + "") {
                alert('输入必须为数值!');
            }
            else {
                let condition = 1;
                if (parameter.has_min) {
                    if (+value < parameter.min_value) {
                        condition = -1;
                        alert("Can't lower than min_value:" + parameter.min_value + "!  Back to default...");
                    }
                }
                if (parameter.has_max) {
                    if (+value > parameter.max_value) {
                        condition = -2;
                        alert("Can't higher than max_value:" + parameter.max_value + "!  Back to default...");
                    }
                }
                if (condition == 1) {
                    parameter.set_value = +value;
                }
                else {
                    parameter.set_value = parameter.default_value;
                }
            }
        }
    }
    set2dArray(parameter, i1, j1, value) {
        if ((parameter.d_type == 'int' || parameter.d_type == 'float') && Number(value) + "" == NaN + "") {
            alert('输入必须为数值!');
        }
        else {
            parameter.set_value[i1][j1] = Number(value);
        }
    }
    set3dArray(parameter, i1, j1, z1, value) {
        if ((parameter.d_type == 'int' || parameter.d_type == 'float') && Number(value) + "" == NaN + "") {
            alert('输入必须为数值!');
        }
        else {
            parameter.set_value[i1][j1][z1] = Number(value);
        }
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], JobCreationComponent.prototype, "statuss", void 0);
JobCreationComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'jobcreation',
        styleUrls: ['./css/jobcreation.component.css'],
        templateUrl: './templates/jobcreation.html',
        providers: [user_service_1.UserService, job_service_1.JobService, scene_service_1.SceneService, plugin_service_1.PluginService, model_service_1.modelService, algchain_service_1.AlgChainService]
    }),
    __metadata("design:paramtypes", [scene_service_1.SceneService, job_service_1.JobService, model_service_1.modelService, algchain_service_1.AlgChainService, plugin_service_1.PluginService, user_service_1.UserService, router_1.Router, router_1.ActivatedRoute])
], JobCreationComponent);
exports.JobCreationComponent = JobCreationComponent;
//# sourceMappingURL=jobcreation.component.js.map