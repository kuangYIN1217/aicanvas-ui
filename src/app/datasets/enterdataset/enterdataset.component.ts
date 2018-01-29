import {Component,Input,Output,EventEmitter} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
import {ActivatedRoute, Router} from "@angular/router";


import {SERVER_URL_DATASETS} from "app/app.constants";
import {FileItem, FileUploader} from "ng2-file-upload";

import {calc_height} from '../../common/ts/calc_height'
declare var $: any;
@Component({
  selector: 'enter-dataset',
  styleUrls: ['./enterdataset.component.css'],
  templateUrl: './enterdataset.component.html',
  providers:[DatasetsService]
})
export class EnterDatasetComponent {
  s_select_name: any = '';
  focus:number=0;
  blur:number=0;
  d_dataTypes: any = [];
  s_select_datasetType: any = 'all';
  createfile:boolean = false;
  file:string='file';
  dataId:string;
  parentPath:string;
  d_tableData:any[]=[];
  filePath:any[]=[];
  tempname:any;
  temptype:any;
  searchBool:boolean = false;
  uploadShow:boolean = false;
  searchFile:boolean = false;
  filepath:any[]=[];

  fileType:string;
  url:string;
  showUpload:any[]=[];
  showName:any[]=[];
  progress:number=0;
  public uploader:FileUploader;
  markPhoto:any[]=[];
  constructor(private datasetservice: DatasetsService,private route: ActivatedRoute, private router: Router){
    this.getDataSetsTypes();
  }

  ngOnInit() {
    calc_height(document.getElementById("filecontent"));
    this.route.queryParams.subscribe(params => {
      this.dataId = params['dataId'];
      this.parentPath = params['parentPath'];
      if(params['filePath']==undefined){

      }else if(params['filePath']!="[]"){
        this.filepath = JSON.parse(params['filePath']);
        this.filePath = this.filepath;
        this.searchFile = true;
      }
      this.dynamicSearch();
      this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname);
      //this.url =  SERVER_URL_DATASETS+"/api/uploadInDataSet?path="+this.parentPath+"&dataId="+this.dataId+"&fileType="+this.fileType;
      this.uploader = new FileUploader({
        url:this.url,
        method: "POST",
        itemAlias: "file",
      });
    });
  }
  $upload_click(){
    this.uploadShow = true;
    //this.url = SERVER_URL_DATASETS+"/api/uploadInDataSet?path="+this.parentPath+"&dataId="+this.dataId+"&fileType="+this.fileType;

    //console.log(this.url);
  }
  getResult(event){
    this.dynamicSearch();
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname);
  }
  deleteResult(event){
    this.dynamicSearch();
    this.searchFile = true;
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname);
  }
  getType(id){
    if(id==1){
      return '图片文件';
    }else if(id==2){
      return '音频文件';
    }else if(id==3){
      return '文本文件';
    }else if(id==4){
      return '视频文件';
    }else if(id==5){
      return '其他文件';
    }
  }
  createMethod(event){
    this.createfile = event;
  }
  getDataSetsTypes() {
    this.datasetservice.getDataSetType().subscribe(rep => {
      this.d_dataTypes = rep;
      //console.log(this.d_dataTypes);
    })
  }
  searchLeft(){
    this.focus=1;
    this.blur=1;
  }
  searchBlur(){
    if(this.s_select_name){
      this.focus=1;
    }else{
      this.focus=0;
    }
    this.blur=0;
  }
  home(){
    this.router.navigate(['../datasets']);
  }
  search(index){
    this.searchBool = true;
    this.filePath.splice(index+1,this.filePath.length-1);
    this.parentPath = this.filePath[this.filePath.length-1].path1;
    console.log(this.filePath);
    this.dynamicSearch();
    this.getAllFile(this.dataId,this.filePath[this.filePath.length-1].path1,this.temptype,this.tempname);
  }
  getAllFile(dataId,parentPath,fileType,fileName){
    this.datasetservice.enterDataset(dataId,encodeURI(parentPath),fileType,fileName)
      .subscribe(result=>{
        this.d_tableData = result;
        if(!this.searchBool&&!this.searchFile){
          let path:any;
          path = parentPath.split("/");
          let obj:any={};
          obj.path1 = parentPath;
          obj.showpath = path[path.length-1];
          this.filePath.push(obj);
        }
        this.searchBool = false;
        this.searchFile = false;
        console.log(result);
      })
  }
  $mark_click(){
    for(let i=0;i<this.d_tableData.length;i++){
      if(this.d_tableData[i].checked&&this.d_tableData[i].fileType=='文件夹'){
          alert("您选择的内容中包含不可标注文件！");
          this.markPhoto=[];
          return false;
      }else if(this.d_tableData[i].checked&&this.d_tableData[i].fileType!='图片文件'&&this.d_tableData[i].fileType!='文件夹'){
          alert("您选择的文件格式暂不支持数据标注！/请上传3个以内的文件！");
          this.markPhoto=[];
          return false;
      }else if(this.d_tableData[i].checked&&this.d_tableData[i].fileType=='图片文件'){
          this.markPhoto.push(this.d_tableData[i]);
      }
    }
    if(this.markPhoto.length==0){
      for(let i=0;i<this.d_tableData.length;i++){
        if(this.d_tableData[i].fileType=='图片文件'){
          this.markPhoto.push(this.d_tableData[i]);
        }
      }
      this.router.navigate(['../mark'],{queryParams:{"filePath":JSON.stringify(this.filePath),"markPhoto":JSON.stringify(this.markPhoto),"dataId":this.dataId}});
    }else{
      this.router.navigate(['../mark'],{queryParams:{"filePath":JSON.stringify(this.filePath),"markPhoto":JSON.stringify(this.markPhoto),"dataId":this.dataId}});
    }
    console.log(this.markPhoto);
  }
  $select_change(){
    this.searchFile = true;
    this.dynamicSearch();
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname);
  }
  dynamicSearch(){
    if(this.s_select_name == ''){
      this.tempname = null;
    }else{
      this.tempname = this.s_select_name;
    }
    if(this.s_select_datasetType == 'all'){
      this.temptype = null;
    }else{
      this.temptype = this.getType(this.s_select_datasetType);
    }
  }
  $create_click(){
    this.datasetservice.createFile(this.dataId,encodeURI(this.parentPath))
      .subscribe(result=>{
        if(result=='文件夹创建成功'){
          this.dynamicSearch();
          this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname);
        }
      })
  }

  selectedFileOnChanged(event:any){
        for(let j=0;j<this.uploader.queue.length;j++){
          if(Number(j)>2){
            this.uploader.queue[3].remove();
            j-=1;
            continue;
          }else{
            let bool = this.isInArray(this.showUpload,this.uploader.queue[j]);
            console.log(bool);
            if(bool==false){
              let obj:any={};
              obj.name = this.uploader.queue[j].file.name;
              obj.type = this.uploader.queue[j].file.type;
              this.showUpload.push(obj);
              this.fileType = this.judgeType(this.showUpload[j]);
              let element = this.uploader.queue[j];
              // element.alias = "photo";
              element.url = SERVER_URL_DATASETS+"/api/uploadInDataSet?path="+this.parentPath+"&dataId="+this.dataId+"&fileType="+this.fileType;
              //console.log(this.fileType);
              //console.log(element.url);
              this.getProgress(j);
            }else{
              continue;
            }
          }
        }
    console.log(this.uploader.queue);
    console.log(this.showUpload);
  }
  isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
      if(value.file.name == arr[i].name&&value.file.type==arr[i].type){
        return true;
      }
    }
    return false;
  }
  getProgress(j){
    if(j>2){
      this.showUpload.splice(3,1);
      return
    }else{
      this.uploader.onProgressItem=(fileItem: FileItem, progress: any)=>{
        this.progress=0;
        if(progress==100){
          //this.showUpload[j].status = "上传成功";
        }else if(progress<100){
          this.showUpload[j].status = "上传中";
          this.showUpload[j].progress = progress;
        }
      };
      this.uploader.queue[j].onSuccess = (response: any, status: any, headers: any) => {
        this.showUpload[j].status = "上传成功";
      };
      this.uploader.queue[j].onError = (response: any, status: any, headers: any) => {
        this.showUpload[j].status = "上传失败";
      };
      this.uploader.onBuildItemForm = (item, form) => {
        form.append("fileType", this.fileType);
        //form.append(key2, value2);
      };
      //this.uploader.uploadAll();
      this.searchFile = true;
      this.uploader.queue[j].upload();
    }
  }
  uploadStatus(item){
    if(item.status=='上传成功'){
      return 'assets/datasets/upload/tc_cg.png';
    }else if(item.status=='上传失败'){
      return 'assets/datasets/upload/tc_sb.png';
    }else if(item.status=='上传中'){
      return 'assets/datasets/upload/tc_sc.png';
    }
  }
  getName(item){
    return item.name;
  }
  judgeType(item){
    let type = item.type.split('/')[0];
    if(type=="video"){
      return '视频文件';
    }else if(type=="audio"){
      return '音频文件';
    }else if(type=="text"){
      return '文本文件';
    }else if(type=="image"){
      return '图片文件';
    }else if(type=='application'){
      return '文件夹';
    }
  }
  judgeIcon(item){
    let type = item.type.split('/')[0];
    if(type=="video"){
      return 'assets/datasets/file/sp-upload.png';
    }else if(type=="audio"){
      return 'assets/datasets/file/sy-upload.png';
    }else if(type=="text"){
      return 'assets/datasets/file/wb-upload.png';
    }else if(type=="image"){
      return 'assets/datasets/file/tp-upload.png';
    }else if(type=='application'){
      return 'assets/datasets/file/tc_wjj.png';
    }
  }
  close(){
    this.uploadShow = false;
    this.uploader.queue=[];
    this.showUpload=[];
    this.dynamicSearch();
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname);
  }
}
