import {Component, Input,Output,EventEmitter} from "@angular/core";
import {Location} from "@angular/common";
import {ResourcesService} from "../common/services/resources.service";
import {modelService} from "../common/services/model.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PluginService} from "../common/services/plugin.service";
import {JobInfo, ModelInfo, Page, SceneInfo} from "../common/defs/resources";
import {JobService} from "../common/services/job.service";
import {SceneService} from "../common/services/scene.service";
import {addErrorToast, addSuccessToast, addWarningToast} from '../common/ts/toast';
import {ToastyService, ToastyConfig} from 'ng2-toasty';
import {calc_height} from '../common/ts/calc_height'
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
    interval1: any;
    taskStatusArr:any[]=["未启动","运行","停止","完成","异常"];
    dataIndex:number=1;
    Jobs: JobInfo[] = [];
    pageParams=new Page();
    Jobs_current: JobInfo[] = [];
    SceneInfo:SceneInfo[] = [];
    ModelInfo:ModelInfo[] = [];
    createdJob: JobInfo = new JobInfo();
    scene_id:number;
    historyId:number;
    gpu_show:boolean=false;
    runPath:string;
    gpuNum:any;
    params:any; // 保存页面url参数
    totalNum:number = 0; // 总数据条数
    pageSize:number = 20;// 每页数据条数
    totalPage:number = 0;// 总页数
    curPage:number = 1;// 当前页码
    pageNow:number=0;
    pageChange:number;
    pageMax:number=10;
    trainable:number;
    showDelete:boolean = false;
    content:string='';
    type:string='';
    deleteId:number=0;
    s_sort_type:string="createTime,desc";
    canRun:boolean = false;
    @Input() statuss:string;
    @Input() sceneId:number;
    @Input() jobName:string = null;
    @Input() pageNumber:number=0;
    @Input() isTrain:boolean = false;
    @Input() notTrain:boolean = false;
    @Input() operateJobAuthority:boolean = false;
    @Input() runJobAuthority:boolean = false;
    @Input() deductionAuthority:boolean = false;

    @Output() nooperate: EventEmitter<any> = new EventEmitter();
    currentJobPath:string='';
    constructor(private sceneService: SceneService,private  modelService:modelService,private jobService: JobService, private location: Location, private route: ActivatedRoute ,private router: Router, private toastyService: ToastyService, private toastyConfig: ToastyConfig){


    }
    getPageData(paraParam) {
      clearInterval(this.interval);
      clearInterval(this.interval1);
      this.getAlljobs(this.statuss,paraParam.curPage-1,paraParam.pageMaxItem,this.sceneId);
      this.interval = setInterval(() =>this.getAlljobs(this.statuss,paraParam.curPage-1,paraParam.pageMaxItem,this.sceneId), 10000);
      this.pageNow=paraParam.curPage-1;
      this.pageMax=paraParam.pageMaxItem;
      this.getPage();
    }
  getPage(){
      sessionStorage['curPage'] = this.pageNow;
      sessionStorage['curMax'] = this.pageMax;
  }
   ngOnInit(){
     calc_height(document.getElementsByClassName('taskStatusContainer')[0]);
         if(this.pageNumber!=0||this.pageMax!=10){
           this.getAlljobs(this.statuss,this.pageNumber,this.pageMax,this.sceneId);
           clearInterval(this.interval1);
           this.interval = setInterval(() =>this.getAlljobs(this.statuss,this.pageNumber,this.pageMax,this.sceneId), 10000);
         }else{
           //this.interval = setInterval(() =>this.updatePage(), 4000);
           clearInterval(this.interval1);
           this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,this.sceneId);
           this.interval = setInterval(() =>this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,this.sceneId), 10000);
         }
   }
  sortTime(){
    if (this.s_sort_type == 'createTime,desc') {
      this.s_sort_type = 'createTime,asc';
      document.getElementById("timeSort").setAttribute("src","assets/taskStatus/up.png");
    } else {
      this.s_sort_type = 'createTime,desc';
      document.getElementById("timeSort").setAttribute("src","assets/taskStatus/down.png");
    }
    this.getAlljobs(this.statuss,this.pageNow,this.pageMax,this.sceneId);
  }
/*  sortTime(){
    document.getElementById("jobPrioritySort").setAttribute("src","assets/taskStatus/taskStatusSort.png");
    if (this.s_sort_type == 'createTime,desc') {
      this.s_sort_type = 'createTime,asc';
      document.getElementById("timeSort").setAttribute("src","assets/taskStatus/up.png");
    } else {
      this.s_sort_type = 'createTime,desc';
      document.getElementById("timeSort").setAttribute("src","assets/taskStatus/down.png");
    }
    this.getAlljobs(this.statuss,this.pageNow,this.pageMax,this.sceneId);
  }*/
  sortPriority(){
    document.getElementById("timeSort").setAttribute("src","assets/taskStatus/taskStatusSort.png");
    if (this.s_sort_type == 'jobPriority,desc') {
      this.s_sort_type = 'jobPriority,asc';
      document.getElementById("jobPrioritySort").setAttribute("src","assets/taskStatus/up.png");
    } else {
      this.s_sort_type = 'jobPriority,desc';
      document.getElementById("jobPrioritySort").setAttribute("src","assets/taskStatus/down.png");
    }
    this.getAlljobs(this.statuss,this.pageNow,this.pageMax,this.sceneId);
  }
  ngOnChanges(...args: any[]){
       this.getSceneId();
       this.chooseTrainMethod();
       this.pageChange = this.pageNumber;
       sessionStorage['curPage'] = this.pageNumber;
       sessionStorage['curMax'] = this.pageMax;
       clearInterval(this.interval);
       clearInterval(this.interval1);
       if((this.jobName!=null||this.jobName!=''||this.jobName!=undefined)&&this.pageNumber){
         this.getAlljobs(this.statuss,this.pageNumber,this.pageMax,this.sceneId);
         //this.interval = setInterval(() =>this.getAlljobs(this.statuss,this.pageNumber,this.pageMax,this.sceneId), 10000);
       }else{
         this.getAlljobs(this.statuss,this.page-1,this.pageMax,this.sceneId);
         this.interval1 = setInterval(() =>this.getAlljobs(this.statuss,this.page-1,this.pageMax,this.sceneId), 10000);
       }
   }
  chooseTrainMethod(){
    if(!this.isTrain&&this.notTrain){
        this.trainable = 0;
    }else if(this.isTrain&&!this.notTrain){
       this.trainable = 1;
    }else{
      this.trainable = null;
    }
  }
   getSceneId(){
     if(this.sceneId==0){
       //this.interval1 = setInterval(() =>this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,' '),3000);
     }else{
       this.historyId = this.sceneId;
       // this.interval1 = setInterval(() =>this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,this.sceneId),3000);
     }
   }
    updatePage(){
      this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,this.sceneId);
    }
    lookDetail(job){
      this.router.navigate(['../jobDetail'], {queryParams: {"job": JSON.stringify(job),"page": this.pageNow==0?this.pageNumber:this.pageNow}});
      /*routerLinkActive="active" routerLink="/jobDetail/{{jobInfo.jobPath}}/{{pageNow==0?pageNumber:pageNow}}/{{JSON.stringify(jobInfo)}}"*/
    }

    editJob(job){
      job.edit = true;
      this.router.navigate(['../createjob'], {queryParams: {"job": JSON.stringify(job),"page": this.pageNow}});
    }
    deleteJob(id,name){
        this.deleteId = id;
        this.showDelete = true;
        this.type = "delete";
        this.content = "是否确定删除该训练任务"+name+"?"
    }
    deleteChange(event){
      this.jobService.deleteJob(this.deleteId)
        .subscribe(result=>{
          if(result=="true"){
            this.getAlljobs(this.statuss,this.page-1,this.pageMax,this.sceneId);
          }
        })
    }
    getAlljobs(status,page,size,sceneId){
      if(this.taskStatusArr.indexOf(status)>=0) this.trainable = 1;
        this.jobService.getAllJobs(status,page,size,sceneId,this.jobName,this.trainable,this.s_sort_type)
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
/*    findModel(item){
      this.router.navigate(['../inferenceModel'],{queryParams: {'isPublic':item.ifPublicSence,"jobId":item.id}});
    }*/
    ngOnDestroy(){
        // 退出时停止更新
      clearInterval(this.interval);
      clearInterval(this.interval1);
      sessionStorage.removeItem('curPage');
      sessionStorage.removeItem('curMax');
    }
    runChange(event){
      this.runPath = this.currentJobPath;
      this.jobService.runJob(this.runPath)
        .subscribe(reply => this.start_reply(reply));

    }
    start(jobPath: string){
      // todo 判断当前运行job数量 > 5 不允许
      this.currentJobPath = jobPath;
      this.jobService.getAllJobs('运行', null , null , null , null,null,this.s_sort_type ).subscribe(rep => {
        if (rep.totalElements >= 5) {
          this.showDelete = true;
          this.content = "当前仅支持5个任务并行，是否中断第5个任务运行，优先运行该任务？";
          this.type="run";
          return false
          //this.nooperate.emit(false);
          //addWarningToast(this.toastyService , '当前仅支持5个任务并行，是否中断第5个任务运行，优先运行该任务？');
        } else {
          this.runPath = jobPath;
          this.jobService.runJob(jobPath)
            .subscribe(reply => this.start_reply(reply));
        }
      })
    }
    start_reply(reply){
        if(reply==200){

        }else{

        }
      this.getAlljobs(this.statuss,sessionStorage['curPage'],sessionStorage['curMax'],this.sceneId);
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
      this.getAlljobs(this.statuss,sessionStorage['curPage'],sessionStorage['curMax'],this.sceneId);
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
  deployNav(){
    document.getElementById('dataStorage').setAttribute('style','display: inline;');
  }
}
