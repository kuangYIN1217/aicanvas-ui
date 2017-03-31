import { Component } from '@angular/core';
import { Location } from '@angular/common'
// import { ActivatedRoute,Params} from '@angular/router';
import { PluginService } from '../../common/services/plugin.service'
// import { ResourcesService } from '../../common/services/resources.service'

import { plainToClass } from "class-transformer";
import { PluginInfo } from "../../common/defs/resources";
import { Parameter,TrainingNetwork } from "../../common/defs/parameter";
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
        let editable_param_list_json = plugin.editable_param_list;
        let editable_param_list:Parameter[] = JSON.parse(editable_param_list_json);
        plugin.editable_param_list = editable_param_list;
        this.plugin = plugin;
        for(let param of this.plugin.editable_param_list){
            param.set_value = param.default_value;
        }
    }

    fork(){
        let pluginMeta = this.plugin;
        if(this.plugin.plugin_id[0]!='p'){
            this.pluginService.savePlugin(pluginMeta)
                .subscribe(response => this.forkResult(response));
        }else{
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
    saveSysPlugin(plugin){
        this.pluginService.copyPlugin(plugin.plugin_id)
            .subscribe(response => this.forkSysPlugin(response, plugin));
    }
    forkSysPlugin(response, plugin){
        let id = response.id;
        this.pluginService.getPlugin(id)
            .subscribe(response => this.forkSysPlugin2(response, plugin));;
    }
    forkSysPlugin2(response, plugin){
        response.editable_param_list = plugin.editable_param_list;
        response.training_network = plugin.training_network;
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

    toNetwork(){
        window.location.href = "/network/"+this.plugin_id;
    }
}
