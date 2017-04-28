import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../common/services/resources.service'
import { PluginService } from '../../common/services/plugin.service'
import { PluginInfo } from "../../common/defs/resources";
import { Parameter, TrainingNetwork } from "../../common/defs/parameter";
declare var $:any;
declare var jsPlumb:any;
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
    page: number = 1;
    pageMaxItem: number = 10;
    arr:any[]=[];
    arr2:any[]=[];
    modalTab:any []=[];
    selfTab:any []=[];
    result:number=1;
    remainder:number;
    constructor(private pluginService: PluginService) {
        if(sessionStorage.showSystemPlugin){
            this.showSystemPlugin = sessionStorage.showSystemPlugin;
        }else{
            sessionStorage.showSystemPlugin = 1;
        }
        pluginService.getAllPlugins()
            .subscribe(plugins => {
                this.plugins = plugins;
                for(let i=0;i<this.plugins.length;i++){
                    if(this.plugins[i].creator=='general'){
                        this.modalTab.push(this.plugins[i]);
                    }else{
                        this.selfTab.push(this.plugins[i]);
                    }
                }
                this.arr = this.modalTab.slice(0,10);
                this.arr2 = this.selfTab.slice(0,10);
                this.getInit();
            });

        // console.log(this.showSystemPlugin);
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
    sysTemplateClick(){
        // console.log("to Sys");
        this.showSystemPlugin = 1;
        sessionStorage.showSystemPlugin = 1;
        // console.log(this.showSystemPlugin);
        // console.log(this.plugins);
    }

    selfTemplateClick(){
        // console.log("to Self");
        this.showSystemPlugin = 0;
        sessionStorage.showSystemPlugin = 0;
        // console.log(this.showSystemPlugin);
    }
    getTotals1(num){
        if(this.modalTab.length%num == 0){
            this.result = Math.floor(this.modalTab.length/num);
        }else{
            this.result = Math.floor(this.modalTab.length/num)+1;
        }
    }
    getTotals2(num){
        if(this.modalTab.length%num == 0){
            this.result = Math.floor(this.selfTab.length/num);
        }else{
            this.result = Math.floor(this.selfTab.length/num)+1;
        }
    }
    maxItemChange(num){
        this.page=1;
        if(num==10){
            if(this.showSystemPlugin==1){
                this.arr = this.modalTab.slice(0,10);
                this.getTotals1(num);
            }else if(this.showSystemPlugin==0){
                this.arr2 = this.selfTab.slice(0,10);
                this.getTotals2(num);
            }
        }else if(num==20){
            if(this.showSystemPlugin==1){
                this.arr = this.modalTab.slice(0,20);
                this.getTotals1(num);
            }else if(this.showSystemPlugin==0){
                this.arr2 = this.selfTab.slice(0,20);
                this.getTotals2(num);
            }
        } else if(num==50){
            if(this.showSystemPlugin==1){
                this.arr = this.modalTab.slice(0,50);
                this.getTotals1(num);
            }else if(this.showSystemPlugin==0){
                this.arr2 = this.selfTab.slice(0,50);
                this.getTotals2(num);
            }
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
                this.arr2 = this.selfTab.slice(num*this.page-num,num*this.page);
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
                // console.log(this.arr);
            }else{
                alert('已经是首页');
            }
        }else if(this.showSystemPlugin==0){
            if (this.page>1){
                this.page--;
                this.arr2 = this.selfTab.slice(num*this.page-num,num*this.page);
                //console.log(this.arr2);
            }else{
                alert('已经是首页');
            }
        }

    }
    previousPage(num){
        if(this.showSystemPlugin==1){
            if (this.page>1){
                this.page--;
                this.arr = this.modalTab.slice(num*this.page-num,num*this.page);
                //console.log(this.arr);
            }else{
                alert('已经是首页');
            }
        }else if(this.showSystemPlugin==0){
            if (this.page>1){
                this.page--;
                this.arr2 = this.selfTab.slice(num*this.page-num,num*this.page);
                //console.log(this.arr2);
            }else{
                alert('已经是首页');
            }
        }

    }
}
