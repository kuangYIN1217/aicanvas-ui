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
import {addSuccessToast, addInfoToast, addErrorToast,addWarningToast} from '../common/ts/toast';
import {calc_height} from '../common/ts/calc_height';
declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'model',
  styleUrls: ['./css/model.component.css'],
  templateUrl: './templates/model.html',
  providers: [ResourcesService, modelService,JobService]
})
export class ModelComponent {
  SERVER_URL = SERVER_URL;
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
  container1:any[]=[];
  responsePath:any[] = [];
  perInterval:any;
  upload_click_flag: boolean = true;
  uploadName:any[]=[];
  showTip:boolean = false;
  show:boolean = false;
  jobPath:string;
  test:string;
  dataSetPath:string;
  modelPredictionIds:any[]=[];
  publishStatus:string='';
  tipContent:string='';
  tipType:string='';
  tipWidth:string='';
  tipMargin:string='';
  showShort:boolean = false;
  showType:string='';
  jobId:number=0;
  isPublic:boolean = false;
  allAuthority:any[]=[];
  publishModelAuthority:boolean = false;
  saveTips:any[]=[];
  constructor(private modelService: modelService, private route: ActivatedRoute, private router: Router, private _location: Location,private jobService:JobService, private toastyService:ToastyService, private toastyConfig: ToastyConfig) {
    this.allAuthority = JSON.parse(localStorage['allAuthority']);
    for(let i=0;i<this.allAuthority.length;i++){
      if(this.allAuthority[i].basAuthority.id=='11'){
        for(let j=0;j<this.allAuthority[i].childAuthorityTreeDtos.length;j++){
          if(this.allAuthority[i].childAuthorityTreeDtos[j].basAuthority.id=='17'&&this.allAuthority[i].childAuthorityTreeDtos[j].hasAuthority){
            this.publishModelAuthority = true;
          }
        }
      }
    }
  }
  Headers:Headers = this.modelService.getHeaders();
  public uploader:FileUploader = new FileUploader({
    url: SERVER_URL+"/api/model/upload",
    method: "POST",
    itemAlias: "file",
  });
  ngOnInit() {
    let init_flag = true;
    this.route.queryParams.subscribe(params => {
      if(init_flag) {
        this.job_id = params['job_id'];
        this.selectChange(this.job_id);
        this.getJobDetail(this.job_id);
        init_flag = false;
      }
    });
  }
  // C: 定义事件，选择文件
  selectedFileOnChanged(event:any){
    this.times = 0;
    for(let i in this.uploader.queue){
      this.times++;
      this.fileName=[];
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
/*       let type = this.fileName[0].split('.').pop().toLowerCase();
        if(type == "zip"||type == "rar") {
          this.container.push("/home/deepthinker/dataset/typeImages/yasuo2.png");
        }else if(type == "txt"||type == "csv"){
          this.container.push("/home/deepthinker/dataset/typeImages/txt.png");
        }*/
/*        else{
          let file = this.uploader.queue[this.times-1]._file;
          //console.log(file);
          let container1 = this.container;
          let reader  = new FileReader();
          reader.addEventListener("load", function (){
            container1.push(reader.result);
          }, false);
          if (file) {
            reader.readAsDataURL(file);
          }
    }*/
    this.uploader.queue[this.times-1].onSuccess = (response: any, status: any, headers: any) => {
      this.showType = response.split('.').pop().toLowerCase();
      if(this.showType == "zip"||this.showType == "rar") {
        this.container1.push("../assets/model/yasuo2.png");
      }else if(this.showType == "txt"||this.showType == "csv"){
        this.container1.push("../assets/model/txt.png");
      }else{
        this.container1.push(response);
      }
      this.container.push(response);
      //console.log(this.container);
      //console.log(this.container1);
      /*        if( this.responsePath.length==this.uploader.queue.length){
       console.log( this.responsePath);
       this.saveModelAndUpload( this.responsePath);
       }*/
    };
    this.uploader.queue[this.times-1].onError = (response: any, status: any, headers: any) => {
      if(status==417){
        this.showTip = true;
        this.tipType = 'warnning';
        this.tipWidth = "100%";
        this.tipMargin = "20px auto 0";
        this.tipContent = "上传的文件中内容为空!";
      }
    }
    this.uploader.queue[this.times-1].upload(); // 开始上传
    //console.log(this.container);
  }
  getDataSetPath(event){
    for(var key in event){
      let temp = event[key].split('$');
      let type = temp[0];
    if(key.indexOf("image")!=-1){
      this.showType = 'png';
      this.container.push(type);
      this.container1.push(type);
    }else if(key.indexOf("txt")!=-1){
      this.showType = 'txt';
      this.container.push(type);
      this.container1.push('assets/model/txt.png');
    }
    }
    //console.log(this.container);
  }
  outputImg(item){
    let arr = item.split('/');
    let path = arr.slice(4).join('/');
    //console.log(path);
    return path;
  }
  // D: 定义事件，上传文件
    uploadFile() {
      if(!this.upload_click_flag) {
        return;
      }
      this.upload_click_flag = false;
      //console.log(this.uploader.queue);
      if(this.container.length>0){
        //console.log(this.container);
        this.saveModelAndUpload(this.container);
        this.container = [];
       /*for(let i in this.uploader.queue){
          this.uploadName.push(this.uploader.queue[i].file.name);
        }
        console.log(this.uploadName);
        this.responsePath=[];
      }else if(this.dataSetPath.length>0){
        */
      }else{
        this.showShort = true;
        this.tipType = 'warnning';
        this.tipWidth = "50%";
        this.tipMargin = "20px 0 -20px 30px";
        this.tipContent = "请上传推演文件!";
        /*addErrorToast(this.toastyService , "请上传推演文件!" );*/
        this.upload_click_flag = true;
        return false;
      }
   }
  saveModelAndUpload(filePath: any[]) {
    this.modelService.saveModelAndUpload(this.modelName, this.job_id, filePath).subscribe(result =>{
      // this.runId = result.id;
      // this.interval = setInterval(() => this.getResult(this.runId), 500);
      //console.log(result.id, this.job.jobPath);
      this.modelService.runInference(result.id, this.job.jobPath).subscribe(data => {
        // alert("创建成功,可以在推演成功后查看!");
        this.type=null;
        //console.log(data);
        this.showTip = true;
        this.tipType = 'success';
        this.tipWidth = "100%";
        this.tipMargin = "20px auto 0";
        this.tipContent = "创建成功,可以在推演成功后查看!";
        /*addSuccessToast(this.toastyService , "创建成功,可以在推演成功后查看!" );*/
        this.selChange(this.job_id);
        this.showAdd =false;
        this.upload_click_flag = true;
      })
      //this.router.navigate(['../modelDetail'],{queryParams:{"runId":result.id}});
    })
  }
  getResult(modelId:number){
    this.modelService.getResult(modelId)
      .subscribe(result=>{
      if(result.content.length!=0) {
        if (result.content[0].success!=true) {
          this.showTip = true;
          this.tipType = 'error';
          this.tipWidth = "100%";
          this.tipMargin = "20px auto 0";
          this.tipContent = "推演结果异常!";
          //addErrorToast(this.toastyService, '推演结果异常！');
          //console.log(result.content[0].percent);
         // clearInterval(this.interval);
        }
        clearInterval(this.interval);
        this.result = result.content;
        this.type = this.result[0].resultType;
        //console.log(this.type);
        this.runId=modelId;
        //console.log(this.type);
        //console.log(this.result);
        //console.log(this.runId);
      }
    })
  }
  getJobDetail(job_id){
    this.jobService.getJobDetailById(job_id)
      .subscribe(jobDetail => {
        this.isPublic = jobDetail.ifPublicSence;
        this.job = jobDetail;
        let number:number=0;
        if(Number(this.job.sences)<100){
          number = 0;
        }else{
          number = 1;
        }
        this.modelService.getAllModel(this.job.jobName,this.job.sencesName,number,this.job.id)
          .subscribe(result=>{
            for(let i=0;i<result.content.length;i++){
              if(result.content[i].ifShowFailReason){
                let obj:any={};
                obj.jobName = this.job.jobName;
                obj.modelId = result.content[i].id;
                obj.version = result.content[i].version;
                obj.failReason = result.content[i].failReason;
                this.saveTips.push(obj);
              }
            }
            console.log(this.saveTips);
          })
    });
  }
  getDataset(){
    this.show = true;
    this.test = 'test';
    this.jobPath = this.job.jobPath;
  }
  publish(){
    this.modelPredictionIds=[];
    if(this.ModelInfo.length>0){
      for(let i=0;i<this.ModelInfo.length;i++){
        this.modelPredictionIds.push(this.ModelInfo[i].id);
      }
    }
    //console.log(this.modelPredictionIds);
    this.modelService.publishModel(this.job_id,this.modelPredictionIds)
      .subscribe(
        (result)=>{
         this.showTip = true;
         this.tipType = 'success';
         this.tipWidth = "100%";
         this.tipMargin = "20px auto 0";
         this.tipContent = "模型已开始发布！详情可查看：";
        },
        (error)=>{
          if(error.status==417){
            let obj:any={};
            obj.jobName = this.job.jobName;
            obj.failReason = error.text();
            this.saveTips.push(obj);
          }
        }
      )
  }
  showTipChange(event){
    this.showTip = event;
    this.showShort = event;
  }
  ngOnDestroy() {
    // 退出时停止更新
    clearInterval(this.interval);
    clearInterval(this.perInterval);
  }
  selChange(job_id){
    this.id = 1;
    this.perInterval = setInterval(() => this.getData(job_id,this.page-1,this.pageMaxItem), 500);
  }
  selectChange(job_id) {
    this.id = 1;
    this.getData(job_id,this.page-1,this.pageMaxItem);
  }
  getData(job_id,page,size){
    //console.log(job_id);
    this.modelService.getModelPredictionByJob(job_id,page,size)
      .subscribe(model => {
        if(model.content.length>0){
          this.ModelInfo = model.content;
          if(this.ModelInfo[0].percent==1) {
            clearInterval(this.perInterval);
          }
        }
        let page = new Page();
        page.job_id = this.job_id;
        page.pageMaxItem = model.size;
        page.curPage = model.number + 1;
        page.totalPage = model.totalPages;
        page.totalNum = model.totalElements;
        this.pageParams = page;
        //console.log(this.pageParams);
      });
  }
  close(modelId,id){
      this.modelService.updateIfShowFailReason(modelId)
        .subscribe(result=>{
          if(result.text()=='true'){
            for(let i=0;i<this.saveTips.length;i++){
              if(this.saveTips[i].id==id){
                this.saveTips.splice(i,1);
              }
            }
          }
        })
  }
  getPageData(paraParam){
    this.getData(paraParam.job_id,paraParam.curPage-1,paraParam.pageMaxItem);
  }
  clickStatus(statu, model_id, job_path) {
    this.selected = statu;
    this.item = model_id;
    this.job_path = job_path;
  }
  delPhoto(index){
    // if(this.uploader.queue&&this.uploader.queue.length>0){
    //   this.uploader.queue[index].remove();
    // }else{
    //   this.dataSetPath.splice(index,1);
    // }
    this.container.splice(index,1);
    this.container1.splice(index,1);
    // console.log(this.container);
    // console.log(this.uploader.queue);
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
  deduction(){
    this.showAdd=true;
    this.currentId=-1;
    this.modelName='';
    this.container=[];
    this.container1=[];
    this.uploader.queue=[];

  }
  getModelHeight(){
    let height = window.innerHeight;
    let tableH = Number($(".tableContainer").height());
    if((height-322-tableH)<410){
      return{
        "min-height":'41px'
      }
    }else{
      return{
        "min-height":height-322-tableH+'px'
      }
    }
  }
  showDetail(id){
    this.showAdd=false;
    clearInterval(this.interval);
    this.currentId=id;
    this.interval = setInterval(() => this.getResult(id), 500);
  }
}
