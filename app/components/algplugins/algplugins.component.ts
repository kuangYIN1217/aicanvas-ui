import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../common/services/resources.service'
import { PluginService } from '../../common/services/plugin.service'
import { PluginInfo } from "../../common/defs/resources";
import { Parameter, TrainingNetwork } from "../../common/defs/parameter";
declare var $:any;
declare var jsPlumb:any;
@Component({
  moduleId: module.id,
  selector: 'algplugins',
  styleUrls: ['./css/algplugins.component.css'],
  templateUrl: './templates/algplugins.html',
  providers: [PluginService],
})
export class AlgPluginsComponent{
    // store data of Plugins
    plugins: PluginInfo[] = [];
    // show one of two different table
    showSystemPlugin: number = 1;
    constructor(private pluginService: PluginService) {
        if(sessionStorage.showSystemPlugin){
            this.showSystemPlugin = sessionStorage.showSystemPlugin;
        }else{
            sessionStorage.showSystemPlugin = 1;
        }
        pluginService.getAllPlugins()
            .subscribe(plugins => this.plugins = plugins);
        // console.log(this.showSystemPlugin);
    }
    sysTemplateClick(){
        // console.log("to Sys");
        this.showSystemPlugin = 1;
        sessionStorage.showSystemPlugin = 1;
        // console.log(this.showSystemPlugin);
        // console.log(this.plugins);
    }

    selfTemplateClick(){
        // console.log("to Self");
        this.showSystemPlugin = 0;
        sessionStorage.showSystemPlugin = 0;
        // console.log(this.showSystemPlugin);
    }
}
