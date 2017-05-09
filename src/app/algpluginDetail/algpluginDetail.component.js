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
// import { ActivatedRoute,Params} from '@angular/router';
const plugin_service_1 = require("../../common/services/plugin.service");
const resources_1 = require("../../common/defs/resources");
let AlgpluginDetailComponent = class AlgpluginDetailComponent {
    constructor(pluginService, location) {
        this.pluginService = pluginService;
        this.location = location;
        this.plugin_id = "";
        this.plugin = new resources_1.PluginInfo();
        this.editable_params = [];
        this.editable_parameters = [];
        if (this.location.path(false).indexOf('/algpluginDetail/') != -1) {
            let id = this.location.path(false).split('/algpluginDetail/')[1];
            if (id) {
                this.pluginService.getPlugin(id)
                    .subscribe(plugin => this.getPlugin(plugin));
                this.plugin_id = id;
            }
        }
    }
    getPlugin(plugin) {
        this.plugin = plugin;
        this.pluginService.getTranParamTypes()
            .subscribe(editable_params => this.getTranParamTypes(editable_params, plugin));
    }
    // 得到参数列表后
    getTranParamTypes(editable_params, plugin) {
        // editable_params为参数字典
        this.editable_params = editable_params;
        let editable_parameters = [];
        // train_params为plugin的可修改参数信息
        let params = this.plugin.train_params;
        for (var param in params) {
            for (let editable_parameter of this.editable_params) {
                if (editable_parameter.path == param) {
                    editable_parameter.editable_param.set_value = params[param];
                    editable_parameters.push(editable_parameter);
                    break;
                }
            }
        }
        this.editable_parameters = editable_parameters;
    }
    matchParams() {
        let params = this.plugin.train_params;
        for (var key in params) {
            for (let dict of this.editable_params) {
                if (key == dict.path) {
                    params[key] = dict.editable_param.set_value;
                }
            }
        }
        this.plugin.train_params = params;
        // console.log(this.plugin.train_params);
    }
    fork() {
        this.matchParams();
        let pluginMeta = this.plugin;
        if (this.plugin.creator != "general") {
            this.pluginService.savePlugin(pluginMeta)
                .subscribe(response => this.forkResult(response));
        }
        else {
            console.log("copying system plugin");
            this.saveSysPlugin(pluginMeta);
        }
    }
    forkResult(response) {
        if (response.status == 200) {
            console.log("saved!");
        }
        else {
            console.log("save plugin failed");
        }
    }
    saveSysPlugin(plugin) {
        this.pluginService.copyPlugin(plugin.id)
            .subscribe(response => this.forkSysPlugin(response, plugin));
    }
    forkSysPlugin(response, plugin) {
        console.log(response);
        let id = response.id;
        this.pluginService.getPlugin(id)
            .subscribe(response => this.forkSysPlugin2(response, plugin));
        ;
    }
    forkSysPlugin2(response, plugin) {
        response.train_params = plugin.train_params;
        response.model = plugin.model;
        this.pluginService.savePlugin(response)
            .subscribe(msg => this.forkResult(msg));
    }
    isArray(object) {
        return (object.indexOf('[') != -1);
    }
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
AlgpluginDetailComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'pluginDetail',
        styleUrls: ['./css/algpluginDetail.component.css'],
        templateUrl: './templates/algpluginDetail.html',
        providers: [plugin_service_1.PluginService]
    }),
    __metadata("design:paramtypes", [plugin_service_1.PluginService, common_1.Location])
], AlgpluginDetailComponent);
exports.AlgpluginDetailComponent = AlgpluginDetailComponent;
//# sourceMappingURL=algpluginDetail.component.js.map