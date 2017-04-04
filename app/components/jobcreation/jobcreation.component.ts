import { Component } from '@angular/core';
import { JobService } from '../../common/services/job.service'
import { UserService } from '../../common/services/user.service'
import { SceneService } from '../../common/services/scene.service'
import { RouterModule, Routes, Router } from '@angular/router';
import { JobInfo, UserInfo,SceneInfo,PluginInfo } from "../../common/defs/resources";
import { plainToClass } from "class-transformer";
@Component({
    moduleId: module.id,
    selector: 'jobcreation',
    styleUrls: ['./css/jobcreation.component.css'],
    templateUrl: './templates/jobcreation.html',
    providers: [UserService,JobService,SceneService]
})
export class JobCreationComponent {
    // 是否已经创建了新的
    created: number = 0;
    //
    scenes: SceneInfo[] = [];
    chosenSceneId: number;
    chosen_scene: SceneInfo = new SceneInfo();
    pluginArr: PluginInfo[] = [];
    createdJob: JobInfo = new JobInfo();
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

    constructor(private sceneService: SceneService,private jobService: JobService, private userService: UserService, private router: Router) {
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
    updatePage(){
        this.jobService.getAllJobs()
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
        if ((job.id+"").toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        }else if (job.jobName.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        }else if (job.createTime.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        }else if (job.sences.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        // }else if (((job.progress+"%").toUpperCase()).indexOf(this.search_input.toUpperCase())!=-1){
        //     return true;
        }else if (job.status.toUpperCase().indexOf(this.search_input.toUpperCase())!=-1){
            return true;
        }else{
            return false;
        }
    }
    changeChosenSceneId(id){
        this.chosenSceneId = id;
        for (let scene of this.scenes){
            if(scene.id == id){
                this.chosen_scene = scene;
                break;
            }
        }
    }
    // createJob
    createJob(){
        this.sceneService.getAllScenes()
        .subscribe(scenes => this.createJob_getScene(scenes));
    }
    createJob_getScene(scenes){
        this.scenes = scenes;
        if(scenes[0]){
            this.chosenSceneId = scenes[0].id;
        }
        this.jobPageStatus = "createJob";
    }

    toStep(dest:number){
        this.stepNumber = dest;
    }

    nextStep(){
        if(this.stepNumber==1&&this.created==0){
            this.created = 1;
            this.createJobBySenceId(this.chosenSceneId);
        }else{
            this.stepNumber = this.stepNumber + 1;
        }
    }
    createJobBySenceId(chosenSceneId){
        this.jobService.createJob(chosenSceneId)
        .subscribe(createdJob => this.createJobBySenceId2(createdJob));
    }
    createJobBySenceId2(createdJob){
        this.createdJob = createdJob;
        // console.log(this.createdJob);
        this.sceneService.getChainByScene(Number(this.chosenSceneId))
        .subscribe(pluginArr => this.createJobBySenceId3(pluginArr));
    }
    createJobBySenceId3(pluginArr: PluginInfo[]){
        console.log(pluginArr);
        this.stepNumber = this.stepNumber + 1;
    }
    create(){
        this.jobService.runJob(this.createdJob.jobPath)
            .subscribe(reply => this.runJobResult(reply,this.createdJob.jobPath));
    }
    runJobResult(reply,jobPath){
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
    maxItemChange(maxItemNum){
        this.page=1;
        this.pageMaxItem=maxItemNum;
        sessionStorage.pageMaxItem = maxItemNum;
    }
}
