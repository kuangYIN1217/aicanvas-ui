import {Component} from "@angular/core";
import {PluginService} from "../common/services/plugin.service";
import {Page, PluginInfo} from "../common/defs/resources";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastyService, ToastyConfig} from 'ng2-toasty';
import {addInfoToast} from '../common/ts/toast';
import {calc_height} from '../common/ts/calc_height'
import {nextTick} from "q";
declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'algplugins',
  styleUrls: ['./css/algplugins.component.css'],
  templateUrl: './templates/algplugins.html',
  providers: [PluginService],
})
export class AlgPluginsComponent{
    // store data of Plugins
    plugins: PluginInfo[] = [];
    // show one of two different table
    showSystemPlugin: number = 1;
    DeliverValue:number;
    page: number = 1;
    pageMaxItem: number = 10;
    arr:any[]=[];
    arr2:any[]=[];
    modalTab:any []=[];
    selfTab:any []=[];
    result:number=1;
    dataIndex:number=1;
    pageParams=new Page();
    params:any; // 保存页面url参数
    totalNum:number = 0; // 总数据条数
    pageSize:number = 20;// 每页数据条数
    totalPage:number = 0;// 总页数
    curPage:number = 1;// 当前页码
    loading:number=2;
    constructor(private route: ActivatedRoute, private router: Router,private pluginService: PluginService, private toastyService:ToastyService, private toastyConfig: ToastyConfig) {
        if(sessionStorage['showSystemPlugin']){
            this.showSystemPlugin = sessionStorage['showSystemPlugin'];
        }else{
            sessionStorage['showSystemPlugin'] = 1;
        };
        this.loading=1;
        pluginService.getAllPlugins()
            .subscribe(plugins => {
              this.loading=2;
                this.plugins = plugins;
                this.changPage(plugins);
                //this.arr = this.modalTab.slice(0,10);
                //console.log(this.arr[0].id);
                //this.arr2 = this.selfTab.slice(0,10);
                //this.getInit();
            });
        // console.log(this.showSystemPlugin);
    }
  ngOnInit() {
    calc_height(document.getElementById('systemDiv'));
  }
  changPage(plugins){
      if(plugins.length>0){
        this.dataIndex =1;
        for(let i=0;i<plugins.length;i++){
          if(plugins[i].creator=='general'){
            this.modalTab.push(plugins[i]);
           }
           //else{
          //   this.selfTab.push(plugins[i]);
          // }
        }
        if(this.showSystemPlugin==1){
          this.getInit(this.modalTab);
         }
         //else if(this.showSystemPlugin==0){
        //   this.getInit(this.selfTab);
        // }
      }else{
        this.dataIndex =0;
      }
  }
  getInit(plugin){

    this.arr = this.modalTab.slice(0,10);
    //this.arr2 = this.selfTab.slice(0,10);
    if(plugin.length%this.pageMaxItem==0){
      this.totalPage = plugin.length/this.pageMaxItem;
    }else{
      this.totalPage = Math.floor(plugin.length/this.pageMaxItem)+1;
    }
    this.totalNum = plugin.length;
    let page = new Page();
    page.pageMaxItem = this.pageMaxItem;
    page.curPage = this.curPage;
    page.totalPage = this.totalPage;
    page.totalNum = this.totalNum;
    this.pageParams=page;
    //console.log(page.pageMaxItem);
   // console.log(this.pageParams);
  }
  getPageData(paraParam) {
    this.arr = this.modalTab.slice(paraParam.pageMaxItem*paraParam.curPage-paraParam.pageMaxItem,paraParam.pageMaxItem*paraParam.curPage);
    //this.arr2 = this.selfTab.slice(paraParam.pageMaxItem*paraParam.curPage-paraParam.pageMaxItem,paraParam.pageMaxItem*paraParam.curPage);
    console.log('触发', paraParam);
  }
/*    checkIndex(pluginId,showSystemPlugin){
    this.router.navigate(['../algpluginDetail'], {queryParams: {"showSystemPlugin": showSystemPlugin,"pluginId":pluginId}});
    }*/
    sysTemplateClick(){
        // console.log("to Sys");
        this.showSystemPlugin = 1;
        sessionStorage['showSystemPlugin']= 1;
        this.pageMaxItem=10;
        this.getInit(this.modalTab);
        this.arr = this.modalTab.slice(0,10);
        // console.log(this.showSystemPlugin);
        // console.log(this.plugins);
    }

    // selfTemplateClick(){
    //     // console.log("to Self");
    //     this.showSystemPlugin = 0;
    //     sessionStorage['showSystemPlugin'] = 0;
    //     this.pageMaxItem=10;
    //     this.getInit(this.selfTab);
    //     //this.result = this.selfTab.length%this.pageMaxItem==0?this.selfTab.length/this.pageMaxItem:Math.floor(this.selfTab.length/this.pageMaxItem)+1;
    //     this.arr2 = this.selfTab.slice(0,10);
    //     // console.log(this.showSystemPlugin);
    // }
    maxItemChange(num){
        this.page=1;
        this.changeValue(num);
    }
    changeValue(num){
        if(this.showSystemPlugin==1){
            this.arr = this.modalTab.slice(0,num);
            this.getTotals(num,this.modalTab);
        }
        // else{
        //     this.arr2 = this.selfTab.slice(0,num);
        //     this.getTotals(num,this.selfTab);
        // }
    }
    getTotals(num,obj){
        if(obj.length%num==0){
            this.result =obj.length/num;
        }else{
            this.result = Math.floor(obj.length/num)+1;
        }
    }

    nextPage(num){
        if(this.showSystemPlugin==1){
            this.next(num,this.modalTab);
        }
        // else if(this.showSystemPlugin==0){
        //     this.next(num,this.selfTab);
        // }
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
        }
        // else if(this.showSystemPlugin==0){
        //     if(this.page<result){
        //         this.page++;
        //         this.arr2 = this.selfTab.slice(num*this.page-num,num*this.page);
        //     }else{
        //         // alert('已经是最后一页');
        //       addInfoToast(this.toastyService , "已经是最后一页");
        //     }
        // }
    }
    previousPage(num){
        if(this.showSystemPlugin==1){
            if (this.page>1){
                this.page--;
                this.arr = this.modalTab.slice(num*this.page-num,num*this.page);
                // console.log(this.arr);
            }else{
              // alert('已经是首页');
              addInfoToast(this.toastyService , "已经是首页");
            }
        }
        // else if(this.showSystemPlugin==0){
        //     if (this.page>1){
        //         this.page--;
        //         this.arr2 = this.selfTab.slice(num*this.page-num,num*this.page);
        //         //console.log(this.arr2);
        //     }else{
        //        // alert('已经是首页');
        //       addInfoToast(this.toastyService , "已经是首页");
        //     }
        // }
    }
}
