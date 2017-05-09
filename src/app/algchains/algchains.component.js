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
const plugin_service_1 = require("../../common/services/plugin.service");
const scene_service_1 = require("../../common/services/scene.service");
const router_1 = require("@angular/router");
const algchain_service_1 = require("../../common/services/algchain.service");
let AlgChainsComponent = class AlgChainsComponent {
    constructor(algchainService, sceneService, pluginService, location, route, router) {
        this.algchainService = algchainService;
        this.sceneService = sceneService;
        this.pluginService = pluginService;
        this.location = location;
        this.route = route;
        this.router = router;
        this.sceneArray = [];
        this.ifShowNetwork = 0;
        this.chosen_scene = [];
        this.pluginArr = [];
        this.haveModel = 0;
        // 字典
        this.editable_params = [];
        // 被选中plugin的参数组合（结合了字典）
        this.editable_parameters = [];
        // 右侧是否显示node参数，0--显示plugin参数 ， 1--显示node参数
        this.rightBox_node = 0;
        sceneService.getAllScenes()
            .subscribe(sceneArray => this.getSceneArray(sceneArray));
        pluginService.getLayerDict()
            .subscribe(dictionary => this.getDictionary(dictionary));
        pluginService.getTranParamTypes()
            .subscribe(editable_params => this.editable_params = editable_params);
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.chainId = params['chain_id'];
            this.sceneId = params['scene_id'];
            this.creator = params['creator'];
            if (this.chainId) {
                this.ifShowNetwork = 1;
                this.algchainService.getChainById(this.chainId)
                    .subscribe(plugin => {
                    this.pluginArr = plugin;
                    console.log(this.pluginArr[0]);
                    this.changeChosenPlugin(this.pluginArr[0].id);
                });
            }
        });
        // if(this.chainId){
        //     this.ifShowNetwork = 1;
        //     this.algchainService.getChainById(this.chainId)
        //         .subscribe(plugin=>{
        //             this.pluginArr=plugin;
        //             this.changeChosenPlugin(this.pluginArr[0].id);
        //         });
        // }
    }
    getDictionary(dictionary) {
        $('#layer_dictionary').val(JSON.stringify(dictionary));
    }
    getSceneArray(sceneArray) {
        this.sceneArray = sceneArray;
        console.log(this.sceneArray);
        for (let i = 0; i < this.sceneArray.length; i++) {
            if (this.sceneId == this.sceneArray[i].id) {
                this.chosen_scene = this.sceneArray[i];
            }
        }
        if (sessionStorage.algChain_scene && sessionStorage.algChain_scene != -1) {
            this.showNetwork(sessionStorage.algChain_scene);
        }
    }
    hideNetwork() {
        window.history.back();
        if (this.sceneId) {
            //this.router.navigate(['../algorithmChain'],{queryParams: { sceneId: this.sceneId}});
            sessionStorage.algChain_scene = -1;
        }
        else {
            //this.router.navigate(['../algchainAlone'],{queryParams: { creator: this.creator}});
            sessionStorage.algChain_scene = -1;
        }
    }
    save() {
        $('#saveBtn').click();
        let json = $('#plugin_storage').val();
        this.pluginArr[0].model = JSON.parse(json);
        // if(this.plugin.creator!="general"){
        this.pluginService.savePlugin(this.pluginArr[0])
            .subscribe(msg => this.forkResult(msg));
    }
    forkResult(response) {
        if (response.status == 200) {
            console.log("saved!");
        }
        else {
            console.log("save plugin failed");
        }
    }
    showNetwork(sceneId) {
        this.router.navigate(['../algorithmChain'], { queryParams: { sceneId: sceneId } });
        /*      this.ifShowNetwork = 1;
                sessionStorage.algChain_scene = sceneId;
                for (let scene of this.sceneArray){
                    // console.log(scene.scene_id);
                    if(scene.id==sceneId){
                        this.chosen_scene = scene;
                        // console.log(scene.id);
                        this.sceneService.getChainByScene(Number(scene.id))
                        .subscribe(pluginArr => this.getPluginArray(pluginArr));
                        break;
                    }
                }*/
    }
    /*
        getPluginArray(pluginArr: PluginInfo[]){
            // console.log(pluginArr);
            this.pluginArr = pluginArr;
            this.changeChosenPlugin(this.pluginArr[0].id);
        }
    */
    changeChosenPlugin(id) {
        if (!this.chosenPluginId) {
            this.chosenPluginId = id;
            let training_network_json = this.findPluginById(this.chosenPluginId).model;
            // 有网络层
            if (training_network_json) {
                this.haveModel = 1;
                // console.log(this.findPluginById(this.chosenPluginId));
                // console.log(training_network_json);
                $('#plugin_storage').val(JSON.stringify(training_network_json));
                $('#hideBtn').click();
            }
            // 无网络层则无需任何操作
        }
        else {
            // this.savePluginChange();
            this.chosenPluginId = id;
            let training_network_json = this.findPluginById(this.chosenPluginId).model;
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
    /*     savePluginChange(){
             let id = this.chosenPluginId;
             let json = $('#plugin_storage').val();
             let jsonData = JSON.parse(json);
             // console.log(id);
             this.findPluginById(id).model = jsonData;
        }*/
    findPluginById(id) {
        for (let plugin of this.pluginArr) {
            if (plugin.id == id) {
                return plugin;
            }
        }
    }
    pluginClicked() {
        let editable_parameters = [];
        let params = this.findPluginById(this.chosenPluginId).train_params;
        // console.log(params);
        for (var param in params) {
            // console.log(param);
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
AlgChainsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'algchains',
        styleUrls: ['./css/algchains.component.css'],
        templateUrl: './templates/algchains.html',
        providers: [scene_service_1.SceneService, plugin_service_1.PluginService, algchain_service_1.AlgChainService]
    }),
    __metadata("design:paramtypes", [algchain_service_1.AlgChainService, scene_service_1.SceneService, plugin_service_1.PluginService, common_1.Location, router_1.ActivatedRoute, router_1.Router])
], AlgChainsComponent);
exports.AlgChainsComponent = AlgChainsComponent;
//# sourceMappingURL=algchains.component.js.map