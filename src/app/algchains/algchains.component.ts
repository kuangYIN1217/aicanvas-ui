import {Component, Directive} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {SceneService} from "../common/services/scene.service";
import {PluginService} from "../common/services/plugin.service";
import {AlgChainService} from "../common/services/algChain.service";
import {PluginInfo, SceneInfo} from "../common/defs/resources";
import {Editable_param, Parameter} from "../common/defs/parameter";
declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'algchains',
  styleUrls: ['./css/algchains.component.css'],
  templateUrl: './templates/algchains.html',
  providers: [SceneService,PluginService,AlgChainService]
})
@Directive({
  selector: '[symToggleRequired]'
})
export class AlgChainsComponent{
    sceneArrays: SceneInfo[]=[];
    ifShowNetwork:number = 0;
    chosenSceneId: number;
    chosen_scene: SceneInfo=new SceneInfo;
    pluginArr: PluginInfo[] = [];
    plugins: PluginInfo[] = [];
    chosenPluginId: string;
    ifEdit:number=0;
    haveModel: number;
    PluginInfo:PluginInfo[]=[];
    arrName:any[] =[];
    name:any[] =[];
    // 字典
    editable_params: Editable_param[] = [];
    // 被选中plugin的参数组合（结合了字典）
    editable_parameters: Editable_param[] = [];
    // 右侧是否显示node参数，0--显示plugin参数 ， 1--显示node参数
    rightBox_node = 0;
    chainId:string;
    sceneId:number;
    creator:string;
    flag:string="true";
    constructor(private algchainService: AlgChainService,private sceneService: SceneService, private pluginService: PluginService , private location: Location,private route: ActivatedRoute ,private router: Router){

    }
    ngOnInit(){
      this.sceneService.getAllScenes()
        .subscribe(sceneArray => this.getSceneArray(sceneArray));
      this.pluginService.getLayerDict()
        .subscribe(dictionary => this.getDictionary(dictionary));
      this.pluginService.getTranParamTypes()
        .subscribe(editable_params => this.editable_params = editable_params);
        this.route.queryParams.subscribe(params => {
            this.chainId = params['chain_id'];
            this.sceneId = params['scene_id'];
            this.creator = params['creator'];
            if(this.chainId){
                this.ifShowNetwork = 1;
                this.algchainService.getChainById(this.chainId)
                    .subscribe(plugin=>{
                        this.pluginArr=plugin;
                       // console.log(this.pluginArr[0]);
                        this.changeChosenPlugin(this.pluginArr[0].id);
                    });
            }
        });
        // if(this.chainId){
        //     this.ifShowNetwork = 1;
        //     this.algchainService.getChainById(this.chainId)
        //         .subscribe(plugin=>{
        //             this.pluginArr=plugin;
        //             this.changeChosenPlugin(this.pluginArr[0].id);
        //         });
        // }
    }
    getDictionary(dictionary){
        $('#layer_dictionary').val(JSON.stringify(dictionary));
    }
    getSceneArray(sceneArray: SceneInfo[]){
        this.sceneArrays = sceneArray;
        for(let i=0;i<this.sceneArrays.length;i++){
            if(this.sceneId==this.sceneArrays[i].id){
                this.chosen_scene = this.sceneArrays[i];
            }
           this.sceneService.getChainByScene(this.sceneArrays[i].id)
              .subscribe(plugin=>{
                this.PluginInfo=plugin;
                //console.log(this.PluginInfo[0].id);
                // this.name =
                if(plugin.length>0){
                  this.sceneArrays[i].arrName = this.getName(this.PluginInfo[0].id,i);
                  console.log(this.sceneArrays[i]);
                }
              })
        }
        if(sessionStorage.algChain_scene&&sessionStorage.algChain_scene!=-1){
            this.showNetwork(sessionStorage.algChain_scene);
        }
    }
    getName(id,index){
      this.algchainService.getChainById(id)
        .subscribe(plugin=>{
          this.plugins=plugin;
          this.arrName=[];
          for(let j=0;j<this.plugins.length;j++){
            this.arrName.push(this.plugins[j].alg_name);
          }
          this.sceneArrays[index].arrName=this.arrName
          // console.log(this.arrName);
          // return this.arrName;
        });

    }
    hideNetwork(){
      window.history.back();
      if(this.sceneId){
            //this.router.navigate(['../algorithmChain'],{queryParams: { sceneId: this.sceneId}});
            sessionStorage.algChain_scene = -1;
        }else{
            //this.router.navigate(['../algchainAlone'],{queryParams: { creator: this.creator}});
            sessionStorage.algChain_scene = -1;
        }

    }
    save(){
        $('#saveBtn').click();
        let json = $('#plugin_storage').val();
        this.pluginArr[0].model = JSON.parse(json);
        // if(this.plugin.creator!="general"){
        this.pluginService.savePlugin(this.pluginArr[0])
            .subscribe(msg => this.forkResult(msg));
    }
    forkResult(response){
        if(response.status==200){
            console.log("saved!");
        }else{
            console.log("save plugin failed");
        }
    }
    showNetwork(sceneId){
        this.router.navigate(['../algorithmChain'],{queryParams: { sceneId: sceneId }});
/*      this.ifShowNetwork = 1;
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
        }*/
    }
/*
    getPluginArray(pluginArr: PluginInfo[]){
        // console.log(pluginArr);
        this.pluginArr = pluginArr;
        this.changeChosenPlugin(this.pluginArr[0].id);
    }
*/

    changeChosenPlugin(id:string){
        if(!this.chosenPluginId){
            this.chosenPluginId = id;
            let training_network_json = this.findPluginById(this.chosenPluginId).model;
            // 有网络层
            if (training_network_json){
                this.haveModel = 1;
                // console.log(this.findPluginById(this.chosenPluginId));
                // console.log(training_network_json);
                $('#plugin_storage').val(JSON.stringify(training_network_json));
                $('#hideBtn').click();
            }
            // 无网络层则无需任何操作
        }else{
            // this.savePluginChange();
            this.chosenPluginId = id;
            let training_network_json = this.findPluginById(this.chosenPluginId).model;
            if(training_network_json){
                // console.log(training_network_json);
                let inited = false;
                if ($('#plugin_storage').val()&&$('#plugin_storage').val()!==""){
                    inited = true;
                }
                $('#plugin_storage').val(JSON.stringify(training_network_json));
                if(inited){
                    $('#loadBtn').click();
                    // 等待动画效果结束后再展示，否则会闪烁一下
                    setTimeout(() => {
                        this.haveModel = 1;
                    },50);
                }else{
                    $('#hideBtn').click();
                    this.haveModel = 1;
                }
            }else{
                // 无网络层则将网络层隐藏
                this.haveModel = 0;
            }
        }
        this.pluginClicked();
    }

/*     savePluginChange(){
         let id = this.chosenPluginId;
         let json = $('#plugin_storage').val();
         let jsonData = JSON.parse(json);
         // console.log(id);
         this.findPluginById(id).model = jsonData;
    }*/

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
  edit(){

      this.ifEdit = 1;
      this.flag="false";
      console.log($("#property").find("input").attr("readOnly","false"));
      //document.getElementById("property").getElementsByTagName("input")[0].setAttribute("readonly", "");

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
