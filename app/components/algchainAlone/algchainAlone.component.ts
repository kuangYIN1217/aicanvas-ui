import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { PluginService } from '../../common/services/plugin.service'
import { SceneService } from '../../common/services/scene.service'
import {ActivatedRoute, Router} from "@angular/router";
import {AlgChainService} from "../../common/services/algchain.service";
import {AlgorithmInfo, PluginInfo} from "../../common/defs/resources";
declare var $:any;
@Component({
    moduleId: module.id,
    selector: 'algchainAlone',
    styleUrls: ['./css/algchainAlone.component.css'],
    templateUrl: './templates/algchainAlone.html',
    providers: [SceneService,PluginService,AlgChainService]
})
export class AlgchainAloneComponent{
    sceneId:number;
    AlgorithmInfo: AlgorithmInfo[]=[];
    item:string;
    modalTab:any []=[];
    selfTab:any []=[];
    showSystemPlugin: number = 1;
    creator:string;
    name:string;
    constructor(private algchainService: AlgChainService,private sceneService: SceneService, private pluginService: PluginService , private location: Location,private route: ActivatedRoute ,private router: Router){
        this.pluginService.getAlgorithmChain()
            .subscribe(algorithm => {
                this.AlgorithmInfo=algorithm;
                for(let i=0;i<this.AlgorithmInfo.length;i++){
                    if(this.AlgorithmInfo[i].creator=='general'){
                        this.modalTab.push(this.AlgorithmInfo[i]);
                    }else{
                        this.selfTab.push(this.AlgorithmInfo[i]);
                    }
                }
            });
    }
    ngOnInit(){
        this.route.queryParams.subscribe(params => {
            this.name = params['creator'];
        });
        if(this.name=="general"){
            this.showSystemPlugin=1;
        }else{
            this.showSystemPlugin=0;
        }
    }
/*    ngOnInit(){
        this.route.queryParams.subscribe(params => {
            this.sceneId = params['sceneId'];
        });
        this.sceneService.getChainByScene(this.sceneId)
            .subscribe(plugin=>this.PluginInfo=plugin);
    }*/
    output(pub){
        if(pub==1){
            return "是"
        }else if(pub==0){
            return "否"
        }
    }

     viewDetail(id,name){
     this.item = id;
     this.creator = name;
     this.router.navigate(['../algchains'],{queryParams:{"chain_id":this.item,"creator":this.creator}});
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
