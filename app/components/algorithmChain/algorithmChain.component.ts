import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'
import {modelService} from "../../common/services/model.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PluginService} from "../../common/services/plugin.service";
import {AlgorithmInfo, PluginInfo} from "../../common/defs/resources";
import {SceneService} from "../../common/services/scene.service";
import {creator} from "d3-selection";
@Component({
    moduleId: module.id,
    selector: 'algorithmChain',
    styleUrls: ['./css/algorithmChain.component.css'],
    templateUrl: './templates/algorithmChain.html',
    providers: [ResourcesService,modelService,PluginService,SceneService]
})
export class AlgorithmChainComponent{
    //AlgorithmInfo: AlgorithmInfo[]=[];
    item:string;
    showSystemPlugin: number = 1;
    modalTab:any []=[];
    selfTab:any []=[];
    sceneId:number;
    PluginInfo:PluginInfo[]=[];
    creator:string;

    constructor(private sceneService: SceneService,private pluginService: PluginService, private location: Location, private route: ActivatedRoute ,private router: Router){

    }
    ngOnInit(){
        this.route.queryParams.subscribe(params => {
            this.sceneId = params['sceneId'];
        });
        this.sceneService.getChainByScene(this.sceneId)
            .subscribe(plugin=>{
                this.PluginInfo=plugin;
                for(let i=0;i<this.PluginInfo.length;i++){
                    if(this.PluginInfo[i].creator=='general'){
                        this.modalTab.push(this.PluginInfo[i]);
                    }else{
                        this.selfTab.push(this.PluginInfo[i]);
                    }
                }
            });

    }
    output(statu){
        if(statu==1){
            return "是";
        }else if(statu==0){
            return "否";
        }
    }

    clickChain(id,name){
        this.item = id;
        this.creator = name;
        this.router.navigate(['../algchains'],{queryParams:{"chain_id":this.item,"scene_id":this.sceneId,"creator":this.creator}});
    }
    sysTemplateClick(){
        this.showSystemPlugin = 1;
        sessionStorage.showSystemPlugin = 1;
    }
    selfTemplateClick(){
        this.showSystemPlugin = 0;
        sessionStorage.showSystemPlugin = 0;
    }
}