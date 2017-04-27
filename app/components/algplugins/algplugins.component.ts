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
    page: number = 1;
    pageMaxItem: number = 10;
    constructor(private pluginService: PluginService) {
        if(sessionStorage.showSystemPlugin){
            this.showSystemPlugin = sessionStorage.showSystemPlugin;
        }else{
            sessionStorage.showSystemPlugin = 1;
        }
        if (sessionStorage.algpluginsStorage){
            let plugins = JSON.parse(sessionStorage.algpluginsStorage);
            this.plugins = plugins;
            pluginService.getAllPlugins()
                .subscribe(plugins => this.ifNew(plugins));
        }else{
            pluginService.getAllPlugins()
                .subscribe(plugins => this.plugins = plugins);
            // console.log(this.showSystemPlugin);
        }
    }
    ifNew(plugins: PluginInfo[]){
        if (JSON.stringify(this.plugins)!=JSON.stringify(plugins)){
            this.plugins = plugins;
        }
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
/*    maxItemChange(){
        this.page=1;
        this.getHistory(this.page-1,this.pageMaxItem)
    }
    nextPage(){
        this.page++;
        this.getHistory(this.page-1,this.pageMaxItem)

    }
    previousPage(){
        if (this.page>1){
            this.page--;
            this.getHistory(this.page-1,this.pageMaxItem)
        }else{
            alert('已经是首页');
        }
    }*/
}
