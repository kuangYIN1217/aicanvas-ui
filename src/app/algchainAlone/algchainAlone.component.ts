import { Component } from '@angular/core';
import { Location } from '@angular/common'
import {SceneService} from "../common/services/scene.service";
import {PluginService} from "../common/services/plugin.service";
import {AlgChainService} from "../common/services/algChain.service";
import {AlgorithmInfo} from "../common/defs/resources";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastyService, ToastyConfig} from 'ng2-toasty';
import {addInfoToast} from '../common/ts/toast';

declare var $:any;
@Component({
    moduleId: module.id,
    selector: 'algchainAlone',
    styleUrls: ['./css/algchainAlone.component.css'],
    templateUrl: './templates/algchainAlone.html',
    providers: [SceneService,PluginService,AlgChainService]
})
export class AlgchainAloneComponent{
    //sceneId:number;
    showSystemPlugin: number = 1;
    AlgorithmInfo: AlgorithmInfo[]=[];
    item:string;
    modalTab:any []=[];
    selfTab:any []=[];
    creator:string;
    name:string;
    page: number = 1;
    pageMaxItem: number = 10;
    arr:any[]=[];
    arr2:any[]=[];
    result:number=1;
    remainder:number;
    constructor(private algchainService: AlgChainService,private sceneService: SceneService, private pluginService: PluginService , private location: Location,private route: ActivatedRoute ,private router: Router, private toastyService:ToastyService, private toastyConfig: ToastyConfig){
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
                this.arr = this.modalTab.slice(0,10);
                this.arr2 = this.selfTab.slice(0,10);
                this.getInit();

            });
    }

    getInit(){
        if(this.result){
            if(this.showSystemPlugin==1){
                if(this.modalTab.length%this.pageMaxItem==0){
                    this.result = this.modalTab.length/this.pageMaxItem;
                }else{
                    this.result = Math.floor(this.modalTab.length/this.pageMaxItem)+1;
                }
            }else if(this.showSystemPlugin==0){
                if(this.selfTab.length%this.pageMaxItem==0){
                    this.result = this.selfTab.length/this.pageMaxItem;
                }else{
                    this.result = Math.floor(this.selfTab.length/this.pageMaxItem)+1;
                }
            }
        }
    }
    ngOnInit(){
        // this.route.queryParams.subscribe(params => {
        //     this.name = params['creator'];
        // });
        // debugger
        // if(this.name=="general"){
        //     this.showSystemPlugin=1;
        // }else{
        //     this.showSystemPlugin=0;
        // }
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
        sessionStorage['showSystemPlugin ']= 1;
        this.pageMaxItem=10;
        this.result = this.modalTab.length%this.pageMaxItem==0?this.modalTab.length/this.pageMaxItem:Math.floor(this.modalTab.length/this.pageMaxItem)+1;
        this.arr = this.modalTab.slice(0,10);
    }
    selfTemplateClick(){
        this.showSystemPlugin = 0;
        sessionStorage['showSystemPlugin ']= 0;
        this.pageMaxItem=10;
        this.result = this.selfTab.length%this.pageMaxItem==0?this.selfTab.length/this.pageMaxItem:Math.floor(this.selfTab.length/this.pageMaxItem)+1;
        this.arr2 = this.selfTab.slice(0,10);
    }


    changeValue(num){
        if(this.showSystemPlugin==1){
            this.arr = this.modalTab.slice(0,num);
            this.getTotals(num,this.modalTab);
        }else{
            this.arr2 = this.selfTab.slice(0,num);
            this.getTotals(num,this.selfTab);
        }
    }
    getTotals(num,obj){
        if(obj.length%num==0){
            this.result =obj.length/num;
        }else{
            this.result = Math.floor(obj.length/num)+1;
        }
    }
    maxItemChange(num){
        this.page=1;
        this.changeValue(num);
    }
    nextPage(num){
        if(this.showSystemPlugin==1){
            this.next(num,this.modalTab);
        }
        else if(this.showSystemPlugin==0){
            this.next(num,this.selfTab);
        }
    }
    next(num,obj){
        this.result = (obj.length%num == 0)?(obj.length/num):(Math.floor(obj.length/num)+1);
        this.lastPage(num,this.result);
    }
    lastPage(num,result){
        if(this.showSystemPlugin==1){
            if(this.page<result){
                this.page++;
                this.arr = this.modalTab.slice(num*this.page-num,num*this.page);
            }else{
               // alert('已经是最后一页');
              addInfoToast(this.toastyService , "已经是最后一页" );
            }
        }else if(this.showSystemPlugin==0){
            if(this.page<result){
                this.page++;
                this.arr2 = this.selfTab.slice(num*this.page-num,num*this.page);
            }else{
               // alert('已经是最后一页');
              addInfoToast(this.toastyService , "已经是最后一页" );
            }
        }

    }

    previousPage(num){
        if(this.showSystemPlugin==1){
            if (this.page>1){
                this.page--;
                this.arr = this.modalTab.slice(num*this.page-num,num*this.page);
               // console.log(this.arr);
            }else{
               // alert('已经是首页');
              addInfoToast(this.toastyService , "已经是首页" );
            }
        }else if(this.showSystemPlugin==0){
            if (this.page>1){
                this.page--;
                this.arr2 = this.selfTab.slice(num*this.page-num,num*this.page);
                //console.log(this.arr2);
            }else{
               // alert('已经是首页');
              addInfoToast(this.toastyService , "已经是首页" );
            }
        }

    }

}
