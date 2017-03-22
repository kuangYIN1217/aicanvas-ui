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
  providers: [ResourcesService,PluginService],
})
export class AlgPluginsComponent{
    // store data of Plugins
    plugins: PluginInfo[] = [];
    // show one of two different table
    showSystemPlugin: number = 1;
    constructor(private resourcesService: ResourcesService, private pluginService: PluginService) {
        let info = pluginService.getAllPlugin();
        console.log(info);
        resourcesService.getPlugins()
            .subscribe(plugins => this.plugins = plugins);
    }
    sysTemplateClick(){
        this.showSystemPlugin = 1;
    }

    selfTemplateClick(){
        this.showSystemPlugin = 0;
    }
}
