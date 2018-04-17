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
    @Input() statuss:string;
    @Input() sceneId:number;
    @Input() jobName:string = null;
    @Input() pageNumber:number;
    @Output() nooperate: EventEmitter<any> = new EventEmitter();
    constructor(private sceneService: SceneService,private  modelService:modelService,private jobService: JobService, private location: Location, private route: ActivatedRoute ,private router: Router, private toastyService: ToastyService, private toastyConfig: ToastyConfig){

    }
    getPageData(paraParam) {
      clearInterval(this.interval);
      /*clearInterval(this.interval1);*/
      this.getAlljobs(this.statuss,paraParam.curPage-1,paraParam.pageMaxItem,this.sceneId);
      this.interval = setInterval(() =>this.getAlljobs(this.statuss,paraParam.curPage-1,paraParam.pageMaxItem,this.sceneId), 10000);
      this.pageNow=paraParam.curPage-1;
      this.pageMax=paraParam.pageMaxItem;
      //console.log('触发', paraParam);
      this.getPage();
    }
  getPage(){
      sessionStorage['curPage'] = this.pageNow;
      sessionStorage['curMax'] = this.pageMax;
  }
   ngOnInit(){
     calc_height(document.getElementsByClassName('taskStatusContainer')[0]);
/*     this.route.queryParams.subscribe(params =>{
       this.pageNumber = params['pageNumber'];
       this.getAlljobs(this.statuss,this.pageNumber,this.pageMaxItem,null);
       console.log(this.pageNumber);
     });*/
         if(this.pageNumber!=0||this.pageMax!=10){
           this.getAlljobs(this.statuss,this.pageNumber,this.pageMax,this.sceneId);
           this.interval = setInterval(() =>this.getAlljobs(this.statuss,this.pageNumber,this.pageMax,this.sceneId), 10000);
         }else{
           // this.interval = setInterval(() =>this.updatePage(), 3000);
           this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,null);
           this.interval = setInterval(() =>this.getAlljobs(this.statuss,this.page-1,this.pageMaxItem,null), 10000);
         }

    //this.getSceneId();
   }
  ngOnChanges(...args: any[]){
     this.getSceneId();
       this.pageChange = this.pageNumber;
       sessionStorage['curPage'] = this.pageNumber;
       sessionStorage['curMax'] = this.pageMax;
       if(this.jobName!=null||this.jobName!=''||this.jobName!=undefined){
         this.getAlljobs(this.statuss,this.pageNumber,this.pageMax,this.sceneId);
       }else{
         this.getAlljobs(this.statuss,this.page-1,this.pageMax,this.sceneId);
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
       /* clearInterval(this.interval);
        clearInterval(this.interval1);*/
      clearInterval(this.interval);
      sessionStorage.removeItem('curPage');
      sessionStorage.removeItem('curMax');
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
      // todo 判断当前运行job数量 > 3 不允许
      this.jobService.getAllJobs('运行', null , null , null , null ).subscribe(rep => {
        if (rep.totalElements >= 3) {
          this.nooperate.emit(false);
          //addWarningToast(this.toastyService , '测试版本下最多同时运行三个任务！');
          return;
        } else {
/*          this.gpuNum = null;
          this.gpu_show = true;*/
          this.runPath = jobPath;
          this.jobService.runJob(jobPath)
            .subscribe(reply => this.start_reply(reply));
        }
      })
    }
/*  sure(event){
    this.gpuNum = event;
    this.jobService.runJob(this.runPath,this.gpuNum)
      .then(result => {
        this.start_reply(true);
      }).catch((error) => {
        addErrorToast(this.toastyService,'输入的gpu编号不合法');
      });
  }
  showChange(event){
    this.gpu_show = event;
  }*/
    start_reply(reply){
        if(reply==200){
            console.log("Start Successfully!");
        }else{
            console.log("Start Failed!");
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
