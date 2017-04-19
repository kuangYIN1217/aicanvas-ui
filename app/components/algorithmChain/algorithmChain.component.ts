import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'
import {modelService} from "../../common/services/model.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PluginService} from "../../common/services/plugin.service";
import {AlgorithmInfo} from "../../common/defs/resources";
@Component({
    moduleId: module.id,
    selector: 'algorithmChain',
    styleUrls: ['./css/algorithmChain.component.css'],
    templateUrl: './templates/algorithmChain.html',
    providers: [ResourcesService,modelService,PluginService]
})
export class AlgorithmChainComponent{
    AlgorithmInfo: AlgorithmInfo[]=[];
    constructor(private pluginService: PluginService, private location: Location, private route: ActivatedRoute ,private router: Router){
        this.pluginService.getAlgorithmChain()
            .subscribe(algorithm => this.AlgorithmInfo=algorithm);
    }
    output(statu){
        if(statu==1){
            return "true";
        }else if(statu==0){
            return "false";
        }
    }
}