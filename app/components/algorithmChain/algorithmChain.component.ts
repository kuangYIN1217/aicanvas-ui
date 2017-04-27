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
    page: number = 1;
    pageMaxItem: number = 10;
    pageMaxItem2: number = 10;
    arr:any[]=[];
    arr2:any[]=[];
    temporary:any[]=[];
    result:number;
    remainder:number;
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
    maxItemChange(num){
        this.page=1;
        if(this.showSystemPlugin==1){
            this.temporary = this.modalTab;
            this.temporaryArray(num,this.temporary);
        }else if(this.showSystemPlugin==0){
            this.temporary = this.selfTab;
            this.temporaryArray(num,this.temporary);
        }
    }
    temporaryArray(num,temporary){
        if(num==10){
            this.arr = temporary.slice(0,10);
        }else if(num==20){
            this.arr = temporary.slice(0,20);
        }
        else if(num==50){
            this.arr = temporary.slice(0,50);
        }
    }

    nextPage(num){
        if(this.showSystemPlugin==1){
            this.remainder = this.modalTab.length%num;
            if(this.remainder == 0){
                this.result = Math.floor(this.modalTab.length/num);
                this.lastPage(num,this.result);
            }else{
                this.result = Math.floor(this.modalTab.length/num)+1;
                this.lastPage(num,this.result);
            }
        }
        else if(this.showSystemPlugin==0){
            this.remainder = this.selfTab.length%num;
            if(this.remainder == 0){
                this.result = Math.floor(this.selfTab.length/num);
                this.lastPage(num,this.result);
            }else{
                this.result = Math.floor(this.selfTab.length/num)+1;
                this.lastPage(num,this.result);
            }
        }
    }
    lastPage(num,result){
        if(this.showSystemPlugin==1){
            if(this.page<result){
                this.page++;
                this.arr = this.modalTab.slice(num*this.page-num,num*this.page);
            }else{
                alert('已经是最后一页');
            }
        }else if(this.showSystemPlugin==0){
            if(this.page<result){
                this.page++;
                this.arr = this.selfTab.slice(num*this.page-num,num*this.page);
            }else{
                alert('已经是最后一页');
            }
        }

    }
    previousPage(num){
        if(this.showSystemPlugin==1){
            if (this.page>1){
                this.page--;
                this.arr = this.modalTab.slice(num*this.page-num,num*this.page);
                console.log(this.arr);
            }else{
                alert('已经是首页');
            }
        }else if(this.showSystemPlugin==0){
            if (this.page>1){
                this.page--;
                this.arr = this.selfTab.slice(num*this.page-num,num*this.page);
                console.log(this.arr);
            }else{
                alert('已经是首页');
            }
        }

    }
}