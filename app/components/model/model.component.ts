import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'
import {modelService} from "../../common/services/model.service";
import {JobInfo, ModelInfo, SceneInfo} from "../../common/defs/resources";
import {SceneService} from "../../common/services/scene.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'model',
  styleUrls: ['./css/model.component.css'],
  templateUrl: './templates/model.html',
  providers: [ResourcesService,modelService]
})
export class ModelComponent{
    SceneInfo:SceneInfo[] = [];
    JobInfo:JobInfo[] = [];
    ModelInfo:ModelInfo[] = [];
    student:number=0;
    selected:number=0;
    item:number=0;
    job_path: string;
    page: number = 1;
    pageMaxItem: number = 10;
    arr:any[]=[];
    result:number=1;
    remainder:number;
    data:number;
    length:number;
    constructor(private modelService: modelService, private location: Location,private sceneService: SceneService, private route: ActivatedRoute ,private router: Router){
        this.sceneService.getAllScenes()
            .subscribe(scenes => this.SceneInfo=scenes);

    }

        ngOnInit(){
        this.route.queryParams.subscribe(params => {
            this.student = params['sence'];
            this.selectChange();
        });
    }
   selectChange(){
        let id=this.student;
       this.pageMaxItem=10;
            this.modelService.getModel(id)
                .subscribe(model =>{
                    this.ModelInfo=model;
                    this.arr = this.ModelInfo.slice(0,10);
                    this.getInit();
                });

           //this.arr = this.ModelInfo.slice(0,9);
           //console.log(this.arr);
    }
    getInit(){
        this.data = Math.floor(this.ModelInfo.length/this.pageMaxItem)+1;
        this.length = this.ModelInfo.length;
        if(this.result&&this.length!=0){
            if(this.length%this.pageMaxItem==0){
                this.result = this.length/this.pageMaxItem;
            }else{
                this.result = Math.floor(this.length/this.pageMaxItem)+1;
            }
        }else if(this.length==0){
            this.result=1;
        }
    }
    clickStatus(statu,model_id,job_path){
        this.selected= statu;
        this.item=model_id;
        this.job_path = job_path;
    }
    clickBtn(){
        //this.router.navigate(['../modelDetail'],{queryParams:{"model_id":this.item}});
        console.log(this.ModelInfo.length);
        if(this.ModelInfo.length>0){
            this.router.navigate(['../modelDetail'],{queryParams:{"model_id":this.item,"job_path":this.job_path}});
        }else{
            return false
        }
    }
    getTotals(num){
        if(this.ModelInfo.length%num == 0){
            this.result = Math.floor(this.ModelInfo.length/num);
        }else{
            this.result = Math.floor(this.ModelInfo.length/num)+1;
        }
    }
    maxItemChange(num){
        this.page=1;
        if(num==10){
            this.arr = this.ModelInfo.slice(0,10);
            this.getTotals(num);
        }else if(num==20){
            this.arr = this.ModelInfo.slice(0,20);
            this.getTotals(num);
        }
        else if(num==50){
            this.arr = this.ModelInfo.slice(0,50);
            this.getTotals(num);
        }
    }
    nextPage(num){
        this.remainder = this.ModelInfo.length%num;
        if(this.remainder == 0){
            this.result = Math.floor(this.ModelInfo.length/num);
            //console.log(this.result);
            this.lastPage(num,this.result);
        }else{
            this.result = Math.floor(this.ModelInfo.length/num)+1;
            this.lastPage(num,this.result);
            //console.log(this.result);
        }
    }
    lastPage(num,result){
        if(this.page<result){
            this.page++;
            this.arr = this.ModelInfo.slice(num*this.page-num,num*this.page);
        }else{
            alert('已经是最后一页');
        }
    }
    previousPage(num){
        if (this.page>1){
            this.page--;
            this.arr = this.ModelInfo.slice(num*this.page-num,num*this.page);
            console.log(this.arr);
        }else{
            alert('已经是首页');
        }
    }
}


