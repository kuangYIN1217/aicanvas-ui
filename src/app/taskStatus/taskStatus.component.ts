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
    interval1:any;
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
    pageNow:number;
    pageChange:number;
    @Input() statuss:string;
    @Input() sceneId:number;
    @Input() jobName:string = null;
    @Input() pageNumber:number=1;
    constructor(private sceneService: SceneService,private  modelService:modelService,private jobService: JobService, private location: Location, private route: ActivatedRoute ,private router: Router){

    }
    getPageData(paraParam) {
      clearInterval(this.interval);
      clearInterval(this.interval1);
      this.getAlljobs(this.statuss,paraParam.curPage-1,paraParam.pageMaxItem,this.sceneId)
      this.interval1 = setInterval(() =>this.getAlljobs(this.statuss,paraParam.curPage-1,paraParam.pageMaxItem,this.sceneId), 3000);
      this.pageNow=paraParam.curPage;
      //console.log('触发', paraParam);
    }
  getPage(){
      sessionStorage['curPage'] = this.pageNow;
      console.log(sessionStorage['curPage']);
  }
   ngOnInit(){
/*     this.route.queryParams.subscribe(params =>{
       this.pageNumber = params['pageNumber'];
       this.getAlljobs(this.statuss,this.pageNumber,this.pageMaxItem,null);
       console.log(this.pageNumber);
     });*/
         if(this.pageNumber!=undefined){
           this.getAlljobs(this.statuss,this.pageNumber-1,this.pageMaxItem,this.sceneId);
         }else{
           this.interval = setInterval(() =>this.updatePage(), 3000);
           this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,null);
         }
    //this.getSceneId();
   }
  ngOnChanges(...args: any[]){
     this.getSceneId();
     this.pageChange = this.pageNumber;
   }
   getSceneId(){
     if(this.sceneId==0){
       this.interval1 = setInterval(() =>this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,' '),3000);
     }else{
       this.historyId = this.sceneId;
       this.interval1 = setInterval(() =>this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,this.sceneId),3000);
     }
   }
    updatePage(){
      this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,this.sceneId);

    }
    getAlljobs(status,page,size,sceneId){
        this.jobService.getAllJobs(status,page,size,sceneId,this.jobName)
            .subscribe(Jobs => {
                this.Jobs = Jobs.content;
                this.Jobs_current = Jobs.content;
                if(this.Jobs_current.length>0){
                  //clearInterval(this.interval);
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
        clearInterval(this.interval1);
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
      this.getAlljobs(this.statuss,this.pageNow-1,this.pageMaxItem,this.sceneId);
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
      this.getAlljobs(this.statuss,this.pageNow-1,this.pageMaxItem,this.sceneId);
    }

    output(percent){
        if(percent==100){
            return parseInt(percent)+"%";
        }else{
            return percent.toFixed(2)+"%";
        }
    }

  goModel(id){
    this.router.navigate(['/model'],{queryParams: {'job_id': id }})
  }
}
