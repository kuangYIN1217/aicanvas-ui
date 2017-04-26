import { Component } from '@angular/core';
import { Location } from '@angular/common'
// import { ActivatedRoute,Params} from '@angular/router';
import { PluginService } from '../../common/services/plugin.service'
// import { ResourcesService } from '../../common/services/resources.service'

import { plainToClass } from "class-transformer";
import { PluginInfo } from "../../common/defs/resources";
import { Parameter,TrainingNetwork,Editable_param } from "../../common/defs/parameter";
declare var $:any;
@Component({
    moduleId: module.id,
    selector: 'pluginDetail',
    styleUrls: ['./css/algpluginDetail.component.css'],
    templateUrl: './templates/algpluginDetail.html',
    providers: [PluginService]
})
export class AlgpluginDetailComponent {
    plugin_id: string= "";
    plugin: PluginInfo = new PluginInfo();
    editable_params: Editable_param[] = [];
    editable_parameters: Editable_param[] = [];
    constructor(private pluginService: PluginService, private location: Location){
        if (this.location.path(false).indexOf('/algpluginDetail/')!=-1){
            let id = this.location.path(false).split('/algpluginDetail/')[1];
            if(id){
                this.pluginService.getPlugin(id)
                    .subscribe(plugin => this.getPlugin(plugin));
                this.plugin_id = id;
            }
        }
    }

    getPlugin(plugin){
        this.plugin = plugin;
        this.pluginService.getTranParamTypes()
            .subscribe(editable_params => this.getTranParamTypes(editable_params,plugin));
    }
    // 得到参数列表后
    getTranParamTypes(editable_params,plugin){
        // editable_params为参数字典
        this.editable_params = editable_params;
        let editable_parameters: Editable_param[] = [];
        // train_params为plugin的可修改参数信息
        let params: any = this.plugin.train_params;
        for(var param in params){
            for (let editable_parameter of this.editable_params){
                if (editable_parameter.path == param){
                    editable_parameter.editable_param.set_value = params[param];
                    editable_parameters.push(editable_parameter);
                    break;
                }
            }
        }
        this.editable_parameters = editable_parameters;
    }
    matchParams(){
        let params: any = this.plugin.train_params;
        for (var key in params){
            for (let dict of this.editable_params){
                if (key == dict.path){
                    params[key] = dict.editable_param.set_value;
                }
            }
        }
        this.plugin.train_params = params;
        // console.log(this.plugin.train_params);
    }
    fork(){
        this.matchParams();
        let pluginMeta = this.plugin;
        if(this.plugin.creator!="general"){
            this.pluginService.savePlugin(pluginMeta)
                .subscribe(response => this.forkResult(response));
        }else{
            console.log("copying system plugin");
            this.saveSysPlugin(pluginMeta);
        }
    }
    forkResult(response){
        if(response.status==200){
            console.log("saved!");
        }else{
            console.log("save plugin failed");
        }
    }
    saveSysPlugin(plugin: PluginInfo){
        this.pluginService.copyPlugin(plugin.id)
            .subscribe(response => this.forkSysPlugin(response, plugin));
    }
    forkSysPlugin(response, plugin){
        console.log(response);
        let id = response.id;
        this.pluginService.getPlugin(id)
            .subscribe(response => this.forkSysPlugin2(response, plugin));;
    }
    forkSysPlugin2(response, plugin: PluginInfo){
        response.train_params = plugin.train_params;
        response.model = plugin.model;
        this.pluginService.savePlugin(response)
            .subscribe(msg => this.forkResult(msg));
    }

    isArray(object: string){
        return (object.indexOf('[')!=-1);
    }

    setValue(parameter: Parameter,value: string){
        if (parameter.type=='string'){
            parameter.set_value = value;
        }else if(parameter.type=='boolean'){
            // 当作string
            parameter.set_value = value;
        }else if(parameter.type=='int'||parameter.type=='float'){
            if (Number(value)+""==NaN+""){
                alert('输入必须为数值!');
            }else{
                let condition: number = 1;
                if(parameter.has_min){
                    if(+value<parameter.min_value){
                        condition = -1;
                        alert("Can't lower than min_value:"+parameter.min_value+"!  Back to default...");
                    }
                }
                if(parameter.has_max){
                    if(+value>parameter.max_value){
                        condition = -2;
                        alert("Can't higher than max_value:"+parameter.max_value+"!  Back to default...");
                    }
                }
                if(condition==1){
                    parameter.set_value = +value;
                }else{
                    parameter.set_value = parameter.default_value;
                }
            }
        }
    }

    set2dArray(parameter: Parameter,i1: number,j1: number,value: string){
        if ((parameter.d_type=='int'||parameter.d_type=='float')&&Number(value)+""==NaN+""){
            alert('输入必须为数值!');
        }else{
            parameter.set_value[i1][j1] = Number(value);
        }
    }

    set3dArray(parameter: Parameter,i1: number,j1: number,z1: number,value: string){
        if ((parameter.d_type=='int'||parameter.d_type=='float')&&Number(value)+""==NaN+""){
            alert('输入必须为数值!');
        }else{
            parameter.set_value[i1][j1][z1] = Number(value);
        }
    }
}
