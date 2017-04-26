import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { PluginService } from '../../common/services/plugin.service'
import { SceneService } from '../../common/services/scene.service'
import {ActivatedRoute, Router} from "@angular/router";
import {AlgChainService} from "../../common/services/algchain.service";
import {PluginInfo} from "../../common/defs/resources";
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
    PluginInfo:PluginInfo[]=[];
    item:string;
    constructor(private algchainService: AlgChainService,private sceneService: SceneService, private pluginService: PluginService , private location: Location,private route: ActivatedRoute ,private router: Router){

    }
    ngOnInit(){
        this.route.queryParams.subscribe(params => {
            this.sceneId = params['sceneId'];
        });
        this.sceneService.getChainByScene(this.sceneId)
            .subscribe(plugin=>this.PluginInfo=plugin);
    }
    output(pub){
        if(pub==1){
            return "是"
        }else if(pub==0){
            return "否"
        }
    }
    clickChain(id){
        this.item = id;
        this.router.navigate(['../algchains'],{queryParams:{"chain_id":this.item,"scene_id":this.sceneId}});
    }
}
