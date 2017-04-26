import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { SceneService } from '../../common/services/scene.service'
import { PluginService } from '../../common/services/plugin.service'
import { SceneInfo,PluginInfo } from "../../common/defs/resources";
import { TrainingNetwork } from "../../common/defs/parameter";
declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'network',
  styleUrls: ['./css/network.component.css'],
  templateUrl: './templates/network.html',
  providers: [SceneService,PluginService]
})
export class NetworkComponent{

    // scene_id: string;
    // scene: SceneInfo = new SceneInfo();
    // sceneArray: SceneInfo[];
    // pluginArr: PluginInfo[] = [];
    chosenPluginId: string;
    plugin_id: string;
    plugin: PluginInfo = new PluginInfo();
    constructor(private sceneService: SceneService, private pluginService: PluginService, private location: Location){
        if (this.location.path(false).indexOf('/network/')!=-1){
            let id = this.location.path(false).split('/network/')[1];
            if(id){
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

    getPlugin(plugin){
        this.plugin = plugin;
        let training_network_json = plugin.model;
        $('#plugin_storage').val(JSON.stringify(training_network_json));
        this.pluginService.getLayerDict()
        .subscribe(dictionary => this.getDictionary(dictionary));
    }

    getDictionary(dictionary){
        $('#layer_dictionary').val(JSON.stringify(dictionary));
        $("#hideBtn").click();
    }

    backup(){
        window.location.href = "/algpluginDetail/"+this.plugin_id;
    }

    save(){
        $('#saveBtn').click();
        let json = $('#plugin_storage').val();
        console.log(this.plugin.model);
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
    forkResult(response){
        if(response.status==200){
            console.log("saved!");
        }else{
            console.log("save plugin failed");
        }
    }
    // saveSysPlugin(plugin){
    //     this.pluginService.copyPlugin(plugin.id)
    //         .subscribe(response => this.forkSysPlugin(response, plugin));
    // }
    // forkSysPlugin(response, plugin){
    //     let id = response.id;
    //     this.pluginService.getPlugin(id)
    //         .subscribe(response => this.forkSysPlugin2(response, plugin));;
    // }
    // forkSysPlugin2(response, plugin){
    //     response.train_params = plugin.train_params;
    //     response.model = plugin.model;
    //     this.pluginService.savePlugin(response)
    //         .subscribe(msg => this.forkResult(msg));
    // }

}
