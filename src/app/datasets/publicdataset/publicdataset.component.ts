import {Component,Input,Output,EventEmitter} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
import {ActivatedRoute, Router} from "@angular/router";


import {SERVER_URL_DATASETS} from "app/app.constants";
import {FileItem, FileUploader} from "ng2-file-upload";

import {calc_height} from '../../common/ts/calc_height'
import {Observable} from "rxjs/Observable";
declare var $: any;
@Component({
  selector: 'public-dataset',
  styleUrls: ['./publicdataset.component.css'],
  templateUrl: './publicdataset.component.html',
  providers:[DatasetsService]
})
export class PublicDatasetComponent {
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
  show:boolean = false;
  content:string='';
  currentName:string;
  dataset:string='';
  windowWidth: number;
  dataLineNum: number =0;
  constructor(private datasetservice: DatasetsService,private route: ActivatedRoute, private router: Router){
    this.getDataSetsTypes();
  }

  ngOnInit() {
    this.windowWidth=document.body.clientWidth;
    Observable.fromEvent(window, 'scroll').subscribe((event) => {
      this.loadLazyData();
    });
    Observable.fromEvent(window, 'resize').subscribe((event) => {
      this.resize(event);
    });
    calc_height(document.getElementById("filecontent"));
    this.route.queryParams.subscribe(params => {
      this.dataId = params['dataId'];
      this.parentPath = params['parentPath'];
      this.dataset = params['dataset'];
      this.currentName = params['currentName'];
      if(params['filePath']==undefined){

      }else if(params['filePath']!="[]"){
        this.filepath = JSON.parse(params['filePath']);
        this.filePath = this.filepath;
        this.searchFile = true;
      }
      this.dynamicSearch();
      this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName);
      //this.url =  SERVER_URL_DATASETS+"/api/uploadInDataSet?path="+this.parentPath+"&dataId="+this.dataId+"&fileType="+this.fileType;
      this.uploader = new FileUploader({
        url:this.url,
        method: "POST",
        itemAlias: "file",
        headers: [
          {name: "Authorization", value:'Bearer '+ localStorage['authenticationToken']}
        ]
      });
    });
  }
  $upload_click(){
    this.uploadShow = true;
    //this.url = SERVER_URL_DATASETS+"/api/uploadInDataSet?path="+this.parentPath+"&dataId="+this.dataId+"&fileType="+this.fileType;

    //console.log(this.url);
  }
  getResult(event){
    this.searchBool = true;
    if(this.currentName==''||this.currentName==undefined){
      this.dataset = "true";
    }else{
      this.dataset = "false";
    }
    this.dynamicSearch();
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName);
  }
  deleteResult(event){
    if(this.filePath.length==1){
      this.currentName='';
    }
    if(this.currentName==''||this.currentName==undefined){
      this.dataset = "true";
    }else{
      this.dataset = "false";
    }
    this.dynamicSearch();
    this.searchFile = true;
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName);
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
    this.dataset = "true";
    this.filePath.splice(index+1,this.filePath.length-1);
    this.parentPath = this.filePath[this.filePath.length-1].path1;
    //console.log(this.filePath);
    this.currentName='';
    this.dynamicSearch();
    this.getAllFile(this.dataId,this.filePath[this.filePath.length-1].path1,this.temptype,this.tempname,this.currentName);
  }
  getAllFile(dataId,parentPath,fileType,fileName,currentName){
    let path:any;
    if(this.dataset=='true'){
      path = parentPath;
    }else if(this.dataset=='false'){
      path = parentPath+"/"+currentName;
    }
    let devWidth = document.getElementsByClassName('myfile-content')[0].scrollWidth;
    let size = Math.floor(devWidth/130)*7;
    this.dataLineNum=7;
    this.datasetservice.enterDataset(dataId,encodeURI(path),fileType,fileName,0,size)
      .subscribe(result=>{
        if(result.text()!=''){
          let aviliableData = result.json().content;
          if(result.json().totalElements-result.json().content.length<0)return;
          let unloadingData = new Array(result.json().totalElements-result.json().content.length);
          this.d_tableData = aviliableData.concat(unloadingData);
          document.documentElement.scrollTop=0;
          if(!this.searchBool&&!this.searchFile){
            if(currentName==''||currentName==undefined){
              let path:any;
              path = parentPath.split("/");
              let obj:any={};
              obj.path1 = parentPath;
              obj.showpath = path[path.length-1];
              this.getFilePath(obj.path1);
              this.filePath.push(obj);
            }else{
              let obj:any={};
              obj.path1 = parentPath+"/"+currentName;
              obj.showpath = currentName;
              this.getFilePath(obj.path1);
              this.filePath.push(obj);
            }
          }
          for(let i=0;i<this.filePath.length-1;i++){
            for(let j=i+1;j<this.filePath.length;j++){
              if(this.filePath[i].path1===this.filePath[j].path1&&this.filePath[i].showpath===this.filePath[j].showpath)
                this.filePath.splice(j,1);
            }
          }
          this.searchBool = false;
          this.searchFile = false;
          //console.log(result);
        }else{
          this.d_tableData=[];
        }
      })
  }
  getFilePath(path){
    let pa = path.split("dataset");
    let show = pa[1].substring(1);
    if(show.length>0&&this.filePath.length==0){
      let obj:any={};
      obj.path1 = pa[0]+'dataset'+pa[1];
      obj.showpath = show;
      this.filePath.push(obj);
    }
/*    let pa = path.split("/");
    if(pa.length>5&&this.filePath.length==0){
      for(let i=4;i<pa.length-1;i++){
        let obj:any={};
        obj.path1 = pa.slice(0,i+1).join("/");
        obj.showpath = pa[i];
        this.filePath.push(obj);
      }
    }*/
  }
  $mark_click(){
    for(let i=0;this.d_tableData[1]!=undefined;i++){
      if(this.d_tableData[i].checked&&this.d_tableData[i].fileType=='文件夹'){
        this.show = true;
        this.content = "您选择的内容中包含不可标注文件！";
        this.markPhoto=[];
        return false;
      }else if(this.d_tableData[i].checked&&this.d_tableData[i].fileType!='图片文件'&&this.d_tableData[i].fileType!='文件夹'){
        this.show = true;
        this.content = "您选择的文件格式暂不支持数据标注！";
        this.markPhoto=[];
        return false;
      }else if(this.d_tableData[i].checked&&this.d_tableData[i].fileType=='图片文件'){
        this.markPhoto.push(this.d_tableData[i]);
      }
    }
    if(this.markPhoto.length==0){
      for(let i=0;this.d_tableData[1]!=undefined;i++){
        if(this.d_tableData[i].fileType=='图片文件'){
          this.markPhoto.push(this.d_tableData[i]);
        }
      }
      if(this.markPhoto.length==0){
        this.show = true;
        this.content = "您选择的文件格式暂不支持数据标注！";
        return false;
      }
      this.router.navigate(['../mark'],{queryParams:{"filePath":JSON.stringify(this.filePath),"markPhoto":JSON.stringify(this.markPhoto),"dataId":this.dataId}});
    }else{
      this.router.navigate(['../mark'],{queryParams:{"filePath":JSON.stringify(this.filePath),"markPhoto":JSON.stringify(this.markPhoto),"dataId":this.dataId}});
    }
    //console.log(this.markPhoto);
  }
  $select_change(){
    this.searchFile = true;
    if(this.currentName==''||this.currentName==undefined){
      this.dataset = "true";
    }else{
      this.dataset = "false";
    }
    this.dynamicSearch();
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName);
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
  filterName(name){
    if(name.match(/^\d{13}_/)){
      return name.substring(14);
    }else{
      return name;
    }
  }

  loadLazyData(){
    let devWidth = document.getElementsByClassName('myfile-content')[0].scrollWidth;

    let t= document.documentElement.scrollTop;

    let d = Math.ceil(t/150);
    if(d+7<=this.dataLineNum)return;
    let x = Math.ceil(d/3)*3;
    this.dataLineNum +=7;
    this.getScrollLazyFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName,this.dataLineNum/7-1,Math.floor(devWidth/130)*7);
  }
  getScrollLazyFile(dataId,parentPath,fileType,fileName,currentName,page,size){
    let path:any;
    if(this.dataset=='true'){
      path = parentPath;
    }else if(this.dataset=='false'){
      path = parentPath+"/"+currentName;
    }
    this.datasetservice.enterDataset(dataId,encodeURI(path),fileType,fileName,page,size)
      .subscribe(result=>{
        if(result.text()!=''){
          let aviliableData = result.json().content;
          for(let i=page*(size);(i<(page+1)*size)&&(i<this.d_tableData.length);i++){
            this.d_tableData[i]=aviliableData[i-size*page];
          }
        }else{
          this.d_tableData=[];
        }
      })
  }
  resize(event){
    let newWidth = document.body.clientWidth;
    if(this.windowWidth>newWidth){
      this.windowWidth=newWidth;
      return;
    }
    let t= document.documentElement.scrollTop;
    let devWidth = document.getElementsByClassName('myfile-content')[0].scrollWidth;
    let d =Math.ceil(t/150)+7;
    let lineNum =Math.floor(devWidth/130);
    let aviliableDataNum =0;
    for(let i=0;i<this.d_tableData.length;i++){
      if(this.d_tableData[i]===undefined)break;
      aviliableDataNum++;
    }

    for(let i=0;i<d;i++){
      if(i>=Math.floor(aviliableDataNum/(lineNum*7))&&i<=Math.ceil(d/7)){
        this.dataLineNum=(i+1)*7;
        this.getScrollLazyFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName,i,lineNum*7);
      }
    }
  }
}

