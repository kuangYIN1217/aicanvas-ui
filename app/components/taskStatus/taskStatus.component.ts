import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'
import {modelService} from "../../common/services/model.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PluginService} from "../../common/services/plugin.service";
import {AlgorithmInfo, JobInfo, JobCollection} from "../../common/defs/resources";
import {JobService} from "../../common/services/job.service";
@Component({
    moduleId: module.id,
    selector: 'taskStatus',
    styleUrls: ['./css/taskStatus.component.css'],
    templateUrl: './templates/taskStatus.html',
    providers: [ResourcesService,modelService,PluginService]
})
export class TaskStatusComponent{
    page: number = 1;
    pageMaxItem: number = 10;
    // store search content
    search_input: string = "";
    interval: any;
    JobCollection: JobCollection = new JobCollection();
    Jobs: JobInfo[] = [];
    Jobs_current: JobInfo[] = [];
    constructor(private  modelService:modelService,private jobService: JobService, private location: Location, private route: ActivatedRoute ,private router: Router){
       if(sessionStorage.pageMaxItem){
           this.pageMaxItem = sessionStorage.pageMaxItem;
       }
       if(sessionStorage.page){
           this.page = sessionStorage.page;
       }
       if(sessionStorage.search_input){
           this.search_input = sessionStorage.search_input;
       }
       this.updatePage();

       this.interval = setInterval (() => {
           this.updatePage();
       }, 500);
    }
    getAlljobs(page,size){
        sessionStorage.pageMaxItem = this.pageMaxItem;
        sessionStorage.page = this.page;

        this.jobService.getAllJobs(page,size)
            .subscribe(jobCollections => {
                // console.log(jobCollections);
                let collection: any = jobCollections;
                this.JobCollection = collection;
                this.Jobs = collection.content;
                this.Jobs_current = collection.content;
                // console.log(this.JobCollection.totalPages);
            });
    }
    updatePage(){
        this.getAlljobs(this.page-1,this.pageMaxItem);
    }
    ngOnDestroy(){
        // 退出时停止更新
        clearInterval(this.interval);
    }
    checkStatus(status,sence , jobPath){
        if(status=='Finished'){
            this.modelService.getStatue(jobPath).subscribe(data=>{
                this.router.navigate(['../model'],{queryParams: { sence: sence }});
            });
            //TODO if success give alert

        }else{
            return false;
        }
    }
    start(jobPath: string){
        this.jobService.runJob(jobPath)
            .subscribe(reply => this.start_reply(reply));
    }
    start_reply(reply){
        if(reply.status==200){
            console.info("Start Successfully!");
        }else{
            console.warn("Start Failed!");
        }
        this.updatePage();
    }
    stop(jobPath: string){
        this.jobService.stopJob(jobPath)
            .subscribe(reply => this.stop_reply(reply));
    }
    stop_reply(reply){
        if(reply.status==200){
            console.info("Stoped Successfully!");
        }else{
            console.warn("Stop Failed!");
        }
        this.updatePage();
    }
    maxItemChange(){
        this.page=1;
        this.getAlljobs(this.page-1,this.pageMaxItem);
        // console.log(this.JobCollection);
    }
    nextPage(){
        this.page++;

        this.getAlljobs(this.page-1,this.pageMaxItem);
        // console.log(this.JobCollection);
    }
    previousPage(){
        if (this.page>1){
            this.page--;
            this.getAlljobs(this.page-1,this.pageMaxItem);
        }else{
            alert('已经是首页');
        }
    }
    output(percent){
        // 控制小数点位数
        let floatDigit = 2;

        if(percent==100){
            return parseInt(percent)+"%";
        }else{
            return percent.toFixed(floatDigit)+"%";
        }
    }
    inputchange(){
        this.Jobs_current = [];
        for (let job of this.Jobs){
            if (this.jobContains(job)){
                this.Jobs_current.push(job);
            }
        }
        sessionStorage.search_input = this.search_input;
    }
    jobContains(job: JobInfo){
        if ((job.id+"").toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        }else if (job.jobName.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        }else if (job.createTime.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        }
        // else if ((job.sences+"").indexOf(this.search_input.toUpperCase())!=-1){
        //     return true;
        // // }else if (((job.progress+"%").toUpperCase()).indexOf(this.search_input.toUpperCase())!=-1){
        // //     return true;
        // }
        else if (job.status.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        }else{
            return false;
        }
    }
}
