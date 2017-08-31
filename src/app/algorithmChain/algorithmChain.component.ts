import { Component } from '@angular/core';
import { Location } from '@angular/common'
import {ResourcesService} from "../common/services/resources.service";
import {modelService} from "../common/services/model.service";
import {PluginService} from "../common/services/plugin.service";
import {SceneService} from "../common/services/scene.service";
import {Page, PluginInfo, SceneInfo} from "../common/defs/resources";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastyService, ToastyConfig} from 'ng2-toasty';
import {addInfoToast} from '../common/ts/toast';

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
    SceneInfo:SceneInfo[] = [];
    creator:string;
    page: number = 1;
    pageParams=new Page();
    pageMaxItem: number = 10;
    arr:any[]=[];
    arr2:any[]=[];
    temporary:any[]=[];
    result:number=1;
    id:number;
    student:number=0;
    dataIndex:number;
    remainder:number;
    params:any; // 保存页面url参数
    totalNum:number = 0; // 总数据条数
    pageSize:number = 20;// 每页数据条数
    totalPage:number = 0;// 总页数
    curPage:number = 1;// 当前页码
    constructor(private sceneService: SceneService,private pluginService: PluginService, private location: Location, private route: ActivatedRoute ,private router: Router, private toastyService:ToastyService, private toastyConfig: ToastyConfig){
      this.sceneService.getAllScenes(-1)
        .subscribe(scenes => this.SceneInfo=scenes);
    }

    ngOnInit(){
        this.route.queryParams.subscribe(params => {
            this.sceneId = params['sceneId'];
            this.student = this.sceneId;
        });
        this.sceneService.getChainByScene(this.sceneId)
            .subscribe(plugin=>{
              this.PluginInfo=plugin;
              this.changPage(plugin);


/*                for(let i=0;i<this.PluginInfo.length;i++){
                    if(this.PluginInfo[i].creator=='general'){
                        this.modalTab.push(this.PluginInfo[i]);
                    }else{
                        this.selfTab.push(this.PluginInfo[i]);
                    }
                }
                this.arr = this.modalTab.slice(0,10);
                this.arr2 = this.selfTab.slice(0,10);
                this.getInit();*/
            });
    }
    changPage(plugin){
      if(plugin.length>0){
        this.dataIndex=1;
      this.arr = plugin.slice(0,10);
      this.totalNum = plugin.length;
      if(plugin.length%this.pageMaxItem==0){
        this.totalPage = plugin.length/this.pageMaxItem;
      }else{
        this.totalPage = Math.floor(plugin.length/this.pageMaxItem)+1;
      }
      let page = new Page();
      page.pageMaxItem = this.pageMaxItem;
      page.curPage = this.curPage;
      page.totalPage = this.totalPage;
      page.totalNum = this.totalNum;
      this.pageParams=page;
      //console.log(page.pageMaxItem);
      //console.log(this.pageParams);
    }else{
        this.dataIndex=0;
      }
    }
  selectChange(){
    this.id=this.student;
    this.sceneService.getChainByScene(this.id)
      .subscribe(plugin=>{
        this.PluginInfo=plugin;
        this.changPage(plugin);
      });
    //this.arr = this.ModelInfo.slice(0,9);
    //console.log(this.arr);
  }
  goback(){
    window.history.back();
  }
  getPageData(paraParam) {
    this.arr = this.PluginInfo.slice(paraParam.pageMaxItem*paraParam.curPage-paraParam.pageMaxItem,paraParam.pageMaxItem*paraParam.curPage-1);
    //this.getAlljobs(this.statuss,paraParam.curPage-1,paraParam.pageMaxItem,this.sceneId);
   console.log('触发', paraParam);

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
              addInfoToast(this.toastyService , "已经是最后一页");
            }
        }else if(this.showSystemPlugin==0){
            if(this.page<result){
                this.page++;
                this.arr2 = this.selfTab.slice(num*this.page-num,num*this.page);
            }else{
               // alert('已经是最后一页');
              addInfoToast(this.toastyService, "已经是最后一页" );

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
               // alert('已经是首页');
              addInfoToast(this.toastyService, "已经是首页" );
            }
        }else if(this.showSystemPlugin==0){
            if (this.page>1){
                this.page--;
                this.arr2 = this.selfTab.slice(num*this.page-num,num*this.page);
                console.log(this.arr);
            }else{
               // alert('已经是首页');
              addInfoToast(this.toastyService, "已经是首页" );
            }
        }

    }
}
