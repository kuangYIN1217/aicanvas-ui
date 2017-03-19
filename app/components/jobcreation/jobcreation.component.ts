import { Component } from '@angular/core';
import { ResourcesService } from '../../common/services/resources.service'

import { JobInfo } from "../../common/defs/resources";

@Component({
    moduleId: module.id,
    selector: 'jobcreation',
    styleUrls: ['./css/jobcreation.component.css'],
    templateUrl: './templates/jobcreation.html',
    providers: [ResourcesService]
})
export class JobCreationComponent {
    // record the current step
    stepNumber: number = 1;
    // "manage"/"createJob"/"jobDetail"
    jobPageStatus: string = "manage";
    Jobs: JobInfo[] = [];
    Jobs_current: JobInfo[] = [];
    // 显示第几页的job
    page: number = 1;
    // 一页最多放几个job
    pageMaxItem: number = 10;
    // store search content
    search_input: string = "";

    constructor(private resourcesService: ResourcesService) {
        resourcesService.getJobs()
        .subscribe(Jobs => this.Jobs = Jobs);
        resourcesService.getJobs()
        .subscribe(Jobs_current => this.Jobs_current = Jobs_current);
    }
    inputchange(){
        this.Jobs_current = [];
        for (let job of this.Jobs){
            if (this.jobContains(job)){
                this.Jobs_current.push(job);
            }
        }
    }
    //table operations
    showManage(){
        this.jobPageStatus = "manage";
    }
    nextPage(){
        if (this.page*this.pageMaxItem>=this.Jobs_current.length){
            alert('已经是最后一页');
        }else{
            this.page++;
        }
    }
    previousPage(){
        if (this.page>1){
            this.page--;
        }else{
            alert('已经是首页');
        }
    }

    CSV(){

    }
    XLS(){

    }
    jobContains(job: JobInfo){
        if ((job.job_id+"").toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        }else if (job.job_name.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        }else if (job.job_createTime.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        }else if (job.job_scene.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        }else if (((job.job_progress+"%").toUpperCase()).indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        }else if (job.job_status.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        }else{
            return false;
        }
    }
    // createJob
    createJob(){
        this.jobPageStatus = "createJob";
    }
    toStep(dest:number){
        this.stepNumber = dest;
    }

    nextStep(){
        this.stepNumber = this.stepNumber + 1;
    }
    create(){
        // console.log('ts-createjob');
        var json  ={
            "train_params":{
                "batch_size":32,
                "SBO":true,
                "loss":"categorical_crossentropy",
                "metrics":"accuracy",
                "optimizer":"Adam",
                "epochs":2,
                "learning_rate":0.00001
            },
            "dataset":{},
            "plugin":{}
        }
        this.resourcesService.createJob(json);
    }
}
