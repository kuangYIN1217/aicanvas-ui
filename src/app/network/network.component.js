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
const scene_service_1 = require("../../common/services/scene.service");
const plugin_service_1 = require("../../common/services/plugin.service");
const resources_1 = require("../../common/defs/resources");
let NetworkComponent = class NetworkComponent {
    constructor(sceneService, pluginService, location) {
        this.sceneService = sceneService;
        this.pluginService = pluginService;
        this.location = location;
        this.plugin = new resources_1.PluginInfo();
        if (this.location.path(false).indexOf('/network/') != -1) {
            let id = this.location.path(false).split('/network/')[1];
            if (id) {
                this.plugin_id = id;
                pluginService.getPlugin(id)
                    .subscribe(plugin => this.getPlugin(plugin));
            }
        }
    }
    // getSceneArray(sceneArray: SceneInfo[]){
    //     this.sceneArray = sceneArray;
    //     for (let scene of this.sceneArray){
    //         // console.log(scene.scene_id);
    //         if(scene.id==this.scene_id){
    //             this.scene = scene;
    //             this.sceneService.getChainByScene(Number(scene.id))
    //             .subscribe(pluginArr => this.getPluginArray(pluginArr));
    //             break;
    //         }
    //     }
    // }
    // getPluginArray(pluginArr: PluginInfo[]){
    //     console.log(pluginArr);
    //     this.pluginArr = pluginArr;
    //     this.changeChosenPlugin(this.pluginArr[0].id);
    // }
    // changeChosenPlugin(id:string){
    //     if(!this.chosenPluginId){
    //         this.chosenPluginId = id;
    //         let training_network_json = this.findPluginById(this.chosenPluginId).model;
    //         console.log(training_network_json);
    //         $('#plugin_storage').val(JSON.stringify(training_network_json));
    //         $('#hideBtn').click();
    //     }else{
    //         this.savePluginChange();
    //         this.chosenPluginId = id;
    //         let training_network_json = this.findPluginById(this.chosenPluginId).model;
    //         console.log(training_network_json);
    //         $('#plugin_storage').val(JSON.stringify(training_network_json));
    //         $('#loadBtn').click();
    //     }
    // }
    // savePluginChange(){
    //     let id = this.chosenPluginId;
    //     let json = $('#plugin_storage').val();
    //     let jsonData = JSON.parse(json);
    //     this.findPluginById(id).model = jsonData;
    // }
    // findPluginById(id:string){
    //     for (let plugin of this.pluginArr){
    //         if (plugin.id == id){
    //             return plugin;
    //         }
    //     }
    // }
    getPlugin(plugin) {
        this.plugin = plugin;
        let training_network_json = plugin.model;
        $('#plugin_storage').val(JSON.stringify(training_network_json));
        this.pluginService.getLayerDict()
            .subscribe(dictionary => this.getDictionary(dictionary));
    }
    getDictionary(dictionary) {
        $('#layer_dictionary').val(JSON.stringify(dictionary));
        $("#hideBtn").click();
    }
    backup() {
        window.location.href = "/algpluginDetail/" + this.plugin_id;
    }
    save() {
        $('#saveBtn2').click(); //save
        // $('#saveBtn').click(); //--saveParam
        let json = $('#plugin_storage').val();
        console.log(this.plugin.model);
        console.log(JSON.stringify(this.plugin.model));
        this.plugin.model = JSON.parse(json);
        console.log(this.plugin.model);
        // console.log(this.plugin);
        // if(this.plugin.creator!="general"){
        this.pluginService.savePlugin(this.plugin)
            .subscribe(msg => this.forkResult(msg));
        // }else{
        //     this.saveSysPlugin(this.plugin);
        // }
    }
    forkResult(response) {
        if (response.status == 200) {
            console.log("saved!");
        }
        else {
            console.log("save plugin failed");
        }
    }
};
NetworkComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'network',
        styleUrls: ['./css/network.component.css'],
        templateUrl: './templates/network.html',
        providers: [scene_service_1.SceneService, plugin_service_1.PluginService]
    }),
    __metadata("design:paramtypes", [scene_service_1.SceneService, plugin_service_1.PluginService, common_1.Location])
], NetworkComponent);
exports.NetworkComponent = NetworkComponent;
//# sourceMappingURL=network.component.js.map