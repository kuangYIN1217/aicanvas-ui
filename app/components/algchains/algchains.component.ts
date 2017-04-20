import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { PluginService } from '../../common/services/plugin.service'
import { SceneService } from '../../common/services/scene.service'
import { SceneInfo,PluginInfo } from "../../common/defs/resources";
import { Editable_param, Parameter } from "../../common/defs/parameter"
declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'algchains',
  styleUrls: ['./css/algchains.component.css'],
  templateUrl: './templates/algchains.html',
  providers: [SceneService,PluginService]
})
export class AlgChainsComponent{
    sceneArray: SceneInfo[];
    ifShowNetwork:number = 0;
    chosenSceneId: number;
    chosen_scene: SceneInfo = new SceneInfo();
    pluginArr: PluginInfo[] = [];
    chosenPluginId: string;
    // 字典
    editable_params: Editable_param[] = [];
    // 被选中plugin的参数组合（结合了字典）
    editable_parameters: Editable_param[] = [];
    // 右侧是否显示node参数，0--显示plugin参数 ， 1--显示node参数
    rightBox_node = 0;
    constructor(private sceneService: SceneService, private pluginService: PluginService , private location: Location){
        sceneService.getAllScenes()
            .subscribe(sceneArray => this.getSceneArray(sceneArray));
        pluginService.getLayerDict()
            .subscribe(dictionary => this.getDictionary(dictionary));
        pluginService.getTranParamTypes()
            .subscribe(editable_params => this.editable_params = editable_params);
    }
    getDictionary(dictionary){
        $('#layer_dictionary').val(JSON.stringify(dictionary));
    }
    getSceneArray(sceneArray: SceneInfo[]){
        this.sceneArray = sceneArray;
        if(sessionStorage.algChain_scene&&sessionStorage.algChain_scene!=-1){
            this.showNetwork(sessionStorage.algChain_scene);
        }
    }
    hideNetwork(){
        this.ifShowNetwork = 0;
        sessionStorage.algChain_scene = -1;
    }
    showNetwork(sceneId){
        this.ifShowNetwork = 1;
        sessionStorage.algChain_scene = sceneId;
        for (let scene of this.sceneArray){
            // console.log(scene.scene_id);
            if(scene.id==sceneId){
                this.chosen_scene = scene;
                // console.log(scene.id);
                this.sceneService.getChainByScene(Number(scene.id))
                .subscribe(pluginArr => this.getPluginArray(pluginArr));
                break;
            }
        }
    }
    getPluginArray(pluginArr: PluginInfo[]){
        // console.log(pluginArr);
        this.pluginArr = pluginArr;
        this.changeChosenPlugin(this.pluginArr[0].id);
    }

    changeChosenPlugin(id:string){
        if(!this.chosenPluginId){
            this.chosenPluginId = id;
            let training_network_json = this.findPluginById(this.chosenPluginId).model;
            // console.log(training_network_json);
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
        this.pluginClicked();
    }

    savePluginChange(){
        let id = this.chosenPluginId;
        let json = $('#plugin_storage').val();
        let jsonData = JSON.parse(json);
        // console.log(id);
        this.findPluginById(id).model = jsonData;
    }

    findPluginById(id:string){
        for (let plugin of this.pluginArr){
            if (plugin.id == id){
                return plugin;
            }
        }
    }

    pluginClicked(){
        let editable_parameters: Editable_param[] = [];
        let params: any = this.findPluginById(this.chosenPluginId).train_params;
        // console.log(params);
        for(var param in params){
            // console.log(param);
            for (let editable_parameter of this.editable_params){
                if (editable_parameter.path == param){
                    editable_parameter.editable_param.set_value = params[param];
                    editable_parameters.push(editable_parameter);
                    break;
                }
            }
        }
        // 更新变量
        this.editable_parameters = editable_parameters;

        // 改变右侧显示的内容--显示plugin
        this.rightBox_node = 0;
    }

    nodeClicked(){
        // 改变右侧显示的内容--显示node
        this.rightBox_node = 1;
    }

    // 修改参数
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
