import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { SceneService } from '../../common/services/scene.service'
import { SceneInfo,PluginInfo } from "../../common/defs/resources";
declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'algchains',
  styleUrls: ['./css/algchains.component.css'],
  templateUrl: './templates/algchains.html',
  providers: [SceneService,PluginInfo]
})
export class AlgChainsComponent{
    sceneArray: SceneInfo[];
    ifShowNetwork:number = 0;
    chosenSceneId: number;
    chosen_scene: SceneInfo = new SceneInfo();
    pluginArr: PluginInfo[] = [];
    chosenPluginId: string;
    constructor(private sceneService: SceneService, private location: Location){
        sceneService.getAllScenes()
            .subscribe(sceneArray => this.sceneArray = sceneArray);
    }
    hideNetwork(){
        this.ifShowNetwork = 0;
    }
    showNetwork(sceneId){
        this.ifShowNetwork = 1;
        for (let scene of this.sceneArray){
            // console.log(scene.scene_id);
            if(scene.id==sceneId){
                this.chosen_scene = scene;
                console.log(scene.id);
                this.sceneService.getChainByScene(Number(scene.id))
                .subscribe(pluginArr => this.getPluginArray(pluginArr));
                break;
            }
        }
    }
    getPluginArray(pluginArr: PluginInfo[]){
        console.log(pluginArr);
        this.pluginArr = pluginArr;
        this.changeChosenPlugin(this.pluginArr[0].id);
    }

    changeChosenPlugin(id:string){
        if(!this.chosenPluginId){
            this.chosenPluginId = id;
            let training_network_json = this.findPluginById(this.chosenPluginId).model;
            console.log(training_network_json);
            $('#plugin_storage').val(JSON.stringify(training_network_json));
            $('#hideBtn').click();
        }else{
            this.savePluginChange();
            this.chosenPluginId = id;
            let training_network_json = this.findPluginById(this.chosenPluginId).model;
            console.log(training_network_json);
            $('#plugin_storage').val(JSON.stringify(training_network_json));
            $('#loadBtn').click();
        }
    }

    savePluginChange(){
        let id = this.chosenPluginId;
        let json = $('#plugin_storage').val();
        let jsonData = JSON.parse(json);
        this.findPluginById(id).model = jsonData;
    }

    findPluginById(id:string){
        for (let plugin of this.pluginArr){
            if (plugin.id == id){
                return plugin;
            }
        }
    }

}
