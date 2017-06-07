import {Component, Input} from "@angular/core";
import {Location} from "@angular/common";
import {ResourcesService} from "../common/services/resources.service";
import {modelService} from "../common/services/model.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PluginService} from "../common/services/plugin.service";
import {JobInfo, ModelInfo, Page, SceneInfo} from "../common/defs/resources";
import {JobService} from "../common/services/job.service";
import {SceneService} from "../common/services/scene.service";

@Component({
    moduleId: module.id,
    selector: 'taskStatus',
    styleUrls: ['./css/taskStatus.component.css'],
    templateUrl: './templates/taskStatus.html',
    providers: [ResourcesService,modelService,PluginService,JobService]
})
export class TaskStatusComponent{
    page: number = 1;
    pageMaxItem: number = 10;
    student:number=0;
    id:number;
    interval: any;
    dataIndex:number=1;
    Jobs: JobInfo[] = [];
    pageParams=new Page();
    Jobs_current: JobInfo[] = [];
    SceneInfo:SceneInfo[] = [];
    ModelInfo:ModelInfo[] = [];
    createdJob: JobInfo = new JobInfo();
    scene_id:number;
    historyId:number;
    params:any; // 保存页面url参数
    totalNum:number = 0; // 总数据条数
    pageSize:number = 20;// 每页数据条数
    totalPage:number = 0;// 总页数
    curPage:number = 1;// 当前页码
    @Input() statuss:string;
    @Input() sceneId:number;
    @Input() jobName:string = null;

    constructor(private sceneService: SceneService,private  modelService:modelService,private jobService: JobService, private location: Location, private route: ActivatedRoute ,private router: Router){

    }
    getPageData(paraParam) {
      this.getAlljobs(this.statuss,paraParam.curPage-1,paraParam.pageMaxItem,this.sceneId);
      //console.log('触发', paraParam);
    }
   ngOnInit(){
      this.interval = setInterval(() =>this.updatePage(), 500);
      this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,null);
    //this.getSceneId();
   }

  ngOnChanges(...args: any[]) {
     //console.log(this.sceneId);
     //console.log(this.jobName);
    if(this.sceneId==0){
      this.sceneId = this.historyId;
    }
     this.getSceneId();

   }
   getSceneId(){
     if(this.sceneId==0){
     this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,this.sceneId);
     }else{
       this.historyId = this.sceneId;
       this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,this.sceneId);
     }
   }
    updatePage(){
       //console.log(this.statuss);
       this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,this.sceneId);
    }
    getAlljobs(status,page,size,sceneId){
        this.jobService.getAllJobs(status,page,size,sceneId,this.jobName)
            .subscribe(Jobs => {
                this.Jobs = Jobs.content;
                this.Jobs_current = Jobs.content;
                if(this.Jobs_current.length>0){
                  clearInterval(this.interval);
                  this.dataIndex = 1;
                }else{
                  this.dataIndex = 0;
                }
                this.createdJob = Jobs;
                let page = new Page();
                page.pageMaxItem = Jobs.size;
                page.curPage = Jobs.number+1;
                page.totalPage = Jobs.totalPages;
                page.totalNum = Jobs.totalElements;
                this.pageParams = page;

               // console.log(this.pageParams);
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
        this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,this.sceneId);
        //console.log(this.createdJob);
    }
    nextPage(){
        this.page++;
        this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,this.sceneId);
        //console.log(this.createdJob);
    }
    previousPage(){
        if (this.page>1){
            this.page--;
            this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,this.sceneId);
        }else{
            alert('已经是首页');
        }
    }
    output(percent){
        if(percent==100){
            return parseInt(percent)+"%";
        }else{
            return percent.toFixed(2)+"%";
        }
    }
}
