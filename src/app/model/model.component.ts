import {Component} from "@angular/core";
import {ResourcesService} from "../common/services/resources.service";
import {modelService} from "../common/services/model.service";
import {JobInfo, Page} from "../common/defs/resources";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from '@angular/common';
import {FileUploader} from "ng2-file-upload";
import {SERVER_URL} from "../app.constants";
import {JobService} from "../common/services/job.service";
import {Headers} from "@angular/http";
import {ToastyService, ToastyConfig} from 'ng2-toasty';
import {addSuccessToast , addInfoToast} from '../common/ts/toast';

declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'model',
  styleUrls: ['./css/model.component.css'],
  templateUrl: './templates/model.html',
  providers: [ResourcesService, modelService,JobService]
})
export class ModelComponent {
  ModelInfo: any[] = [];
  job_id: number = 0;
  modelName: string;
  selected: number = 0;
  item: number = 0;
  job_path: string;
  page: number = 1;
  pageMaxItem: number = 10;
  arr: any[] = [];
  result: number = 1;
  remainder: number;
  data: number;
  length: number;
  firstPath: string;
  firstId: number;
  id: number;
  showAdd: boolean = false;
  currentId:number=-1;
  pageParams = new Page();
  job:JobInfo= new JobInfo;
  interval:any;
  type:any;
  runId:number;
  path:string;
  times:number;
  fileName:any[]=[];
  container:any[]=[];
  constructor(private modelService: modelService, private route: ActivatedRoute, private router: Router, private _location: Location,private jobService:JobService, private toastyService:ToastyService, private toastyConfig: ToastyConfig) {

  }

  Headers:Headers = this.modelService.getHeaders();
  public uploader:FileUploader = new FileUploader({
    url: SERVER_URL+"/api/model/upload",
    method: "POST",
    itemAlias: "file",
  });
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.job_id = params['job_id'];
      console.log(this.job_id);
      this.selectChange(this.job_id);
      this.getJobDetail(this.job_id);
    });
  }
  // C: 定义事件，选择文件
  selectedFileOnChanged(event:any) {
    this.times = 0;
    for(let i in this.uploader.queue){
      this.times++;
      if(this.fileName.length>0){
        for(let n=0;n<this.fileName.length;n++){
          if(this.fileName[n]==this.uploader.queue[i].file.name){
            this.fileName.splice(n,1);
          }else{
            this.fileName.push(this.uploader.queue[i].file.name);
          }
        }
      }else{
        this.fileName.push(this.uploader.queue[i].file.name);
      }
    }
       let type = this.fileName[0].split('.').pop().toLowerCase();
        if(type == "zip"||type == "rar") {
          this.container.push("assets/model/yasuo2.png");
        }else{
          let file = this.uploader.queue[this.times-1]._file;
          console.log(file);
          let container1 = this.container;
          let reader  = new FileReader();
          reader.addEventListener("load", function () {
            container1.push(reader.result);
          }, false);
          if (file) {
            reader.readAsDataURL(file);
          }
      //console.log(this.container);
    }
  }
  // D: 定义事件，上传文件
    uploadFile() {
      var responsePath = [];
      console.log(this.container);
      for(var i=0;i<this.container.length;i++){
        this.uploader.queue[i].onSuccess = (response: any, status: any, headers: any) => {
          //this.uploader.queue[i].remove();
          responsePath.push(response);
          if(responsePath.length==this.uploader.queue.length){
            console.log(responsePath);
            this.saveModelAndUpload(responsePath);
          }
        }
       // console.log(responsePath);
        this.uploader.queue[i].upload(); // 开始上传
      }
   //this.tabIndex=this.scene;
   }
  saveModelAndUpload(filePath: any[]) {
    this.modelService.saveModelAndUpload(this.modelName, this.job_id, filePath).subscribe(result => {
      // this.runId = result.id;
      // this.interval = setInterval(() => this.getResult(this.runId), 500);
      this.modelService.runInference(result.id, this.job.jobPath).subscribe(data => {
        // alert("创建成功,可以在推演成功后查看!");
        addSuccessToast(this.toastyService , "创建成功,可以在推演成功后查看!" );
        this.selectChange(this.job_id);
        this.showAdd =false;
      })
      //this.router.navigate(['../modelDetail'],{queryParams:{"runId":result.id}});
    })
  }
  getResult(modelId:number){
    this.modelService.getResult(modelId).subscribe(result=>{
      if (result.content.length!=0) {
        clearInterval(this.interval);
        this.result = result.content;
        this.type = this.result[0].resultType;
        this.runId=modelId;
        console.log(this.runId);
      }
    })
  }
  getJobDetail(job_id){
    this.jobService.getJobDetailById(job_id).subscribe(jobDetail => {
      this.job = jobDetail;
    });
  }
  selectChange(job_id) {
    console.log(job_id);
    this.id = 1;
    this.getData(job_id,this.page-1,this.pageMaxItem);
  }
  getData(job_id,page,size){
    console.log(job_id);
    this.modelService.getModelPredictionByJob(job_id,page,size)
      .subscribe(model => {
        this.ModelInfo = model.content;
        console.log(this.ModelInfo);
        let page = new Page();
        page.pageMaxItem = model.size;
        page.curPage = model.number + 1;
        page.totalPage = model.totalPages;
        page.totalNum = model.totalElements;
        this.pageParams = page;
        console.log(this.pageParams);
      });
  }
  getPageData(paraParam) {
    console.log(this.job_id);
    this.getData(this.job_id,paraParam.curPage-1,paraParam.pageMaxItem);
  }
  clickStatus(statu, model_id, job_path) {
    this.selected = statu;
    this.item = model_id;
    this.job_path = job_path;
  }

  clickBtn() {
    //this.router.navigate(['../modelDetail'],{queryParams:{"model_id":this.item}});
    //console.log(this.ModelInfo.length);
    if (this.ModelInfo.length > 0) {
      if (this.item == 0 || this.job_path == 'undefined') {
        this.job_path = this.firstPath;
        this.item = this.firstId;
      }
      this.router.navigate(['../modelDetail'], {queryParams: {"model_id": this.item, "job_path": this.job_path}});
    } else {
      return false
    }
  }
  back() {
    this._location.back();
  }
  showDetail(id){
    this.showAdd=false;
    console.log(id);
    clearInterval(this.interval);
    this.currentId=id;
    this.interval = setInterval(() => this.getResult(id), 500);
  }
}
