import {Component, Input} from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'
import {modelService} from "../../common/services/model.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PluginService} from "../../common/services/plugin.service";
import {AlgorithmInfo, JobInfo} from "../../common/defs/resources";
import {JobService} from "../../common/services/job.service";
import {bindDirectiveInputs} from "@angular/compiler/src/view_compiler/property_binder";
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
    interval: any;
    Jobs: JobInfo[] = [];
    Jobs_current: JobInfo[] = [];
    createdJob: JobInfo = new JobInfo();
    @Input() statuss:string='Finished';

    constructor(private  modelService:modelService,private jobService: JobService, private location: Location, private route: ActivatedRoute ,private router: Router){
        //this.interval = setInterval (() => {this.updatePage()}, 500);
        this.updatePage();
    }

    updatePage(){
            this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem);
    }
    getAlljobs(page,size){
        this.jobService.getAllJobs(page,size)
            .subscribe(Jobs => {
                this.Jobs = Jobs.content;
                this.Jobs_current = Jobs.content;
                this.createdJob = Jobs;
            });
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
            console.log("Start Successfully!");
        }else{
            console.log("Start Failed!");
        }
        this.updatePage();
    }
    stop(jobPath: string){
        this.jobService.stopJob(jobPath)
            .subscribe(reply => this.stop_reply(reply));
    }
    stop_reply(reply){
        if(reply.status==200){
            console.log("Stoped!");
        }else{
            console.log("Stop Failed!");
        }
        this.updatePage();
    }
    maxItemChange(){
        this.page=1;
        this.getAlljobs(this.page-1,this.pageMaxItem);
        console.log(this.createdJob);
    }
    nextPage(){
        this.page++;
        this.getAlljobs(this.page-1,this.pageMaxItem);
        console.log(this.createdJob);
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
        if(percent==100){
            return parseInt(percent)+"%";
        }else{
            return percent+"%";
        }
    }
}
