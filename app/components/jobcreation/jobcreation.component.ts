import { Component } from '@angular/core';
import { JobService } from '../../common/services/job.service'
import { UserService } from '../../common/services/user.service'
import { RouterModule, Routes, Router } from '@angular/router';
import { JobInfo, UserInfo } from "../../common/defs/resources";

@Component({
    moduleId: module.id,
    selector: 'jobcreation',
    styleUrls: ['./css/jobcreation.component.css'],
    templateUrl: './templates/jobcreation.html',
    providers: [UserService,JobService]
})
export class JobCreationComponent {
    // record the current step
    stepNumber: number = 1;
    // "manage"/"createJob"
    jobPageStatus: string = "manage";
    Jobs: JobInfo[] = [];
    Jobs_current: JobInfo[] = [];
    // 显示第几页的job
    page: number = 1;
    // 一页最多放几个job
    pageMaxItem: number = 10;
    // store search content
    search_input: string = "";

    constructor(private jobService: JobService, private userService: UserService, private router: Router) {
        jobService.getAllJobs()
            .subscribe(Jobs => this.initialJobArray(Jobs));
        if(sessionStorage.pageMaxItem){
            this.pageMaxItem = sessionStorage.pageMaxItem;
        }
        if(sessionStorage.page){
            this.page = sessionStorage.page;
        }
        if(sessionStorage.search_input){
            this.search_input = sessionStorage.search_input;
        }
    }
    initialJobArray(Jobs){
        this.Jobs = Jobs;
        this.Jobs_current = Jobs;
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
    //table operations
    showManage(){
        this.jobPageStatus = "manage";
    }
    nextPage(){
        if (this.page*this.pageMaxItem>=this.Jobs_current.length){
            alert('已经是最后一页');
        }else{
            this.page++;
            sessionStorage.page = this.page;
        }
    }
    previousPage(){
        if (this.page>1){
            this.page--;
            sessionStorage.page = this.page;
        }else{
            alert('已经是首页');
        }
    }

    CSV(){

    }
    XLS(){

    }
    jobContains(job: JobInfo){
        // if ((job.id+"").toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
        //     return true;
        // }else if (job.job_name.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
        //     return true;
        // }else if (job.createTime.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
        //     return true;
        // }else if (job.job_scene.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
        //     return true;
        // }else if (((job.job_progress+"%").toUpperCase()).indexOf(this.search_input.toUpperCase())!=-1){
        //     return true;
        // }else if (job.job_status.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
        //     return true;
        // }else{
        //     return false;
        // }
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
        this.userService.getUser(sessionStorage.username)
            .subscribe(returnUserInfo => this.createJob2(returnUserInfo[0]));
    }
    createJob2(returnUserInfo: UserInfo){
        // console.log(returnUserInfo);
        let job = new JobInfo();
        job.createTime = "2017-03-21T14:36:57.640Z";
        job.dataSet="dataset1";
        job.id = 1;
        job.jobPath = "";
        job.sences = "sences";
        job.user = returnUserInfo;
        this.jobService.createJob(job)
            .subscribe(msg => this.createJob3(msg));
        //
        // 弹出消息框，告知创建成功


    }
    createJob3(msg){
        // console.log(msg);
        // console.log(msg.jobPath);
        // 运行Job
        this.jobService.runJob(msg.jobPath)
            .subscribe(reply => this.createJob4(reply,msg.jobPath));
    }
    createJob4(reply,jobPath){
        console.log(reply.status);
        // 成功运行
        if(reply.status==200){
            // 重新获取所有Job
            this.jobService.getAllJobs()
                .subscribe(Jobs => this.initialJobArray(Jobs));
            // 前往详情界面
            this.router.navigate(['/jobDetail', jobPath]);
        }else{
            // 运行失败报错
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
    }
    pause(jobPath: string){

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
    }
    maxItemChange(maxItemNum){
        this.page=1;
        this.pageMaxItem=maxItemNum;
        sessionStorage.pageMaxItem = maxItemNum;
    }
}
