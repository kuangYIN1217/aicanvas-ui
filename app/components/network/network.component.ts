import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'
import { PluginService } from '../../common/services/plugin.service'
import { SceneInfo,PluginInfo } from "../../common/defs/resources";
import { TrainingNetwork } from "../../common/defs/parameter";
declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'network',
  styleUrls: ['./css/network.component.css'],
  templateUrl: './templates/network.html',
  providers: [ResourcesService,PluginService]
})
export class NetworkComponent{
    type: string = "";

    scene_id: number;
    scene: SceneInfo = new SceneInfo();
    sceneArray: SceneInfo[];

    plugin_id: string;
    plugin: PluginInfo = new PluginInfo();
    constructor(private resourcesService: ResourcesService, private pluginService: PluginService, private location: Location){
        if (this.location.path(false).indexOf('/network/')!=-1){
            let id = this.location.path(false).split('/network/')[1];
            if(id){
                if((Number(id)+"")!=NaN+""){
                    this.scene_id = Number(id);
                    this.type = "scene";
                    resourcesService.getScenes()
                        .subscribe(sceneArray => this.sceneArray = sceneArray);
                    if(!this.sceneArray){
                        this.authenticate_loop();
                    }else{
                        this.insertData();
                        $("#hideBtn").click();
                    }
                }else{
                    this.plugin_id = id;
                    this.type = "plugin";
                    pluginService.getPlugin(id)
                    .subscribe(plugin => this.getPlugin(plugin));
                }
            }
        }
    }

    private authenticate_loop() {
        setTimeout (() => {
            //console.log("Hello from setTimeout");
            if(!this.sceneArray){
                this.authenticate_loop();
            }else{
                //console.log("Data received");
                for (let scene of this.sceneArray){
                    // console.log(scene.scene_id);
                    if(scene.scene_id==this.scene_id){
                        this.scene = scene;
                        $("#hideBtn").click();
                        // console.log(this.scene_current);
                        break;
                    }
                }
                this.insertData();
            }
        }, 50);
    }

    insertData(){
        $('#scene_name').html(this.scene.scene_name);
        $('#scene_description').html("场景描述:<br>"+this.scene.scene_description);
        $('.alg_name').html('AlgPlug1');
        // $('.layer_name').html('Input_1');
    }

    getPlugin(plugin){
        let training_network_json = plugin.training_network;
        let training_network: TrainingNetwork = JSON.parse(training_network_json);
        plugin.training_network = training_network;
        $('#json_storage').val(JSON.stringify(plugin.training_network));
        // console.log(plugin.training_network);
        this.plugin = plugin;
        $("#hideBtn").click();
    }

    backup(){
        if(this.type=="scene"){
            window.location.href = "/algchains/"+this.scene_id;
        }else{
            window.location.href = "/algpluginDetail/"+this.plugin_id;
        }
    }

    save(){
        let json = $('#json_storage').val();
        let training_network: TrainingNetwork = JSON.parse(json);
        console.log(training_network);
        this.plugin.training_network = training_network;
        if(this.plugin.plugin_id[0]!='p'){
            this.pluginService.savePlugin(this.plugin)
                .subscribe(msg => this.forkResult(msg));
        }else{
            this.saveSysPlugin(this.plugin);
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
}
