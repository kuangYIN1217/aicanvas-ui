import {Component, Input, Output, EventEmitter, HostListener} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
import {ActivatedRoute, Router} from "@angular/router";

import {SERVER_URL_DATASETS,SERVER_URL} from "app/app.constants";
import {FileItem, FileUploader} from "ng2-file-upload";
import {calc_height} from '../../common/ts/calc_height';
import {Page} from "../../common/defs/resources";
import {Observable} from "rxjs/Observable";
declare var $: any;
@Component({
  selector: 'enter-dataset',
  styleUrls: ['./enterdataset.component.css'],
  templateUrl: './enterdataset.component.html',
  providers:[DatasetsService]
})
export class EnterDatasetComponent {
  SERVER_URL = SERVER_URL;
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
  d_tableData_page:any={};
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
  dataset:string = "";
  currentName:string="";
  saveLoad:any[]=[];
  tipWidth:string='';
  tipContent:string='';
  tipType:string='';
  showTip:boolean = false;
  tipMargin:string='';
  backup:any[]=[];
  downloadPath:string='';
  pageParams=new Page();
  page: number = 0;
  pageMaxItem: number = 30;
  pageNow:number = 0;
  dataLineNum: number =0;
  windowWidth: number;
  loading:boolean = false;
  allAuthority:any[]=[];
  dataBackUP:boolean = false;
  dataMark:boolean = false;
  constructor(private datasetservice: DatasetsService,private route: ActivatedRoute, private router: Router){
    this.allAuthority = JSON.parse(localStorage['allAuthority']);
    for(let i=0;i<this.allAuthority.length;i++){
      if(this.allAuthority[i].basAuthority.id=='5'){
        for(let j=0;j<this.allAuthority[i].childAuthorityTreeDtos.length;j++){
          if(this.allAuthority[i].childAuthorityTreeDtos[j].basAuthority.id=='9'&&this.allAuthority[i].childAuthorityTreeDtos[j].hasAuthority){
            this.dataBackUP = true;
          }
          if(this.allAuthority[i].childAuthorityTreeDtos[j].basAuthority.id=='8'&&this.allAuthority[i].childAuthorityTreeDtos[j].hasAuthority){
            this.dataMark = true;
          }
        }
      }
    }
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
      if(this.dataId===null||this.dataId===undefined) {
        this.dataId = params['dataId'];
        this.parentPath = params['parentPath'];
        this.dataset = params['dataset'];
      }
      //this.currentName = params['currentName'];
      if(params['filePath']==undefined){

      }else if(params['filePath']!="[]"){
        this.filepath = JSON.parse(params['filePath']);
        this.filePath = this.filepath;
        this.searchFile = true;
      }
      this.dynamicSearch();
      this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName,this.page,this.pageMaxItem);
      //this.url =  SERVER_URL_DATASETS+"/api/uploadInDataSet?path="+this.parentPath+"&dataId="+this.dataId+"&fileType="+this.fileType;
      this.uploader = new FileUploader({
        url:this.url,
        method: "POST",
        itemAlias: "file",
      });
    });
  }
  getPageData(paraParam) {
    this.dynamicSearch();
    this.searchBool = true;
    this.page = paraParam.curPage-1;
    // let path = this.parentPath
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName,paraParam.curPage-1,paraParam.pageMaxItem);
  }
  enterChange(event){
    //console.log(event);
    this.dynamicSearch();
    this.dataset = event.dataset;
    this.currentName = event.currentName;
    this.dataId = event.dataId;
    this.parentPath = event.parentPath;
    if(event.fileType=="文件夹"){
      this.pageNow = event.page;
    }
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName,0,this.pageMaxItem);
  }
  $upload_click(){
    this.uploadShow = true;
    //this.url = SERVER_URL_DATASETS+"/api/uploadInDataSet?path="+this.parentPath+"&dataId="+this.dataId+"&fileType="+this.fileType;
    //console.log(this.url);
  }
  showTipChange(event){
    this.show = false;
    this.showTip = false;
  }
  noopearte(event){
    this.showTip = true;
    this.tipWidth = "100%";
    this.tipType = "warnning";
    this.tipMargin = "0 auto";
    if(event=='editname'){
      this.tipContent = "已有同名文件或文件夹，请重新操作！";
    }
  }
  getResult(event){
    this.searchBool = true;
    if(this.currentName==''||this.currentName==undefined){
      this.dataset = "true";
    }else{
      this.dataset = "false";
    }
    this.dynamicSearch();
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName,this.page,this.pageMaxItem);
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
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName,this.page,this.pageMaxItem);
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
    this.currentName='';
    this.dynamicSearch();
    if(this.pageNow>0){
      this.getAllFile(this.dataId,this.filePath[this.filePath.length-1].path1,this.temptype,this.tempname,this.currentName,this.pageNow,this.pageMaxItem);
    }else{
      this.getAllFile(this.dataId,this.filePath[this.filePath.length-1].path1,this.temptype,this.tempname,this.currentName,this.page,this.pageMaxItem);
    }
  }
  getAllFile(dataId,parentPath,fileType,fileName,currentName,page,size){
    let path:any;
    if(this.dataset=='true'){
      path = parentPath;
    }else if(this.dataset=='false'){
      path = parentPath+"/"+currentName;
    }
    let devWidth = document.getElementsByClassName('myfile-content')[0].scrollWidth;
    size = Math.floor(devWidth/130)*7;
    this.dataLineNum=7;
    this.datasetservice.enterDataset(dataId,encodeURI(path),fileType,fileName,0,size)
      .subscribe(result=>{
        console.log(result);
        if(result.text()!=''){
          let aviliableData = result.json().content;
          if(result.json().totalElements-result.json().content.length<0)return;
          let unloadingData = new Array(result.json().totalElements-result.json().content.length);
          this.d_tableData = aviliableData.concat(unloadingData);
          this.d_tableData_page = result.json();
          document.documentElement.scrollTop=0;
          // this.d_tableData = result.json().content;
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
          // let page = new Page();
          // page.pageMaxItem = this.d_tableData_page.size;
          // page.curPage = this.d_tableData_page.number+1;
          // page.totalPage = this.d_tableData_page.totalPages;
          // page.totalNum = this.d_tableData_page.totalElements;
          // this.pageParams = page;
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
/*    if(pa.length>5&&this.filePath.length==0){
      for(let i=4;i<pa.length-1;i++){
        let obj:any={};
        obj.path1 = pa.slice(0,i+1).join("/");
        obj.showpath = pa[i];
        this.filePath.push(obj);
      }
    }*/
  }
  $data_backup(){
    this.backup=[];
    for(let i=0;this.d_tableData[i]!=undefined;i++){
      if(this.d_tableData[i].checked){
        this.backup.push(this.d_tableData[i].dataSetFileDirectoryPath.parentPath+"/"+this.d_tableData[i].fileName);
      }
    }
    if(this.backup.length>0){
      this.loading = true;
      setTimeout(() => {
        if(this.downloadPath==""){
          this.loading = false;
        }
      }, 5000);
      this.datasetservice.backupDataset(this.backup)
        .subscribe((result)=>{
          this.loading = false;
          this.downloadPath = result.split('dataset')[1].substring(1);
          this.downloadBackup(this.downloadPath);
        },
          (error)=>{
            this.loading = false;
          })
    }else{
      this.showTip = true;
      this.tipWidth = "100%";
      this.tipType = "warnning";
      this.tipMargin = "0 auto 20px";
      this.tipContent = "请选择文件！";
    }
  }
  downloadBackup(path) {
    let url = SERVER_URL+"/download/"+path;
    location.href = url;
  }
  $mark_click(){
    for(let i=0;this.d_tableData[i]!=undefined;i++){
      if(this.d_tableData[i].checked&&this.d_tableData[i].fileType=='文件夹'){
          this.judgeMark();
          this.markPhoto=[];
          return false;
      }else if(this.d_tableData[i].checked&&this.d_tableData[i].fileType!='图片文件'&&this.d_tableData[i].fileType!='文件夹'){
          this.judgeMark();
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
      if(this.markPhoto.length==0){
        this.judgeMark();
        return false;
      }
      this.router.navigate(['../mark'],{queryParams:{"filePath":JSON.stringify(this.filePath),"markPhoto":JSON.stringify(this.markPhoto),"dataId":this.dataId}});
    }else{
      this.router.navigate(['../mark'],{queryParams:{"filePath":JSON.stringify(this.filePath),"markPhoto":JSON.stringify(this.markPhoto),"dataId":this.dataId}});
    }
    //console.log(this.markPhoto);
  }
  judgeMark(){
    this.showTip = true;
    this.tipType = "warnning";
    this.tipWidth = "100%";
    this.tipContent = "您选择的文件格式暂不支持数据标注！";
  }
  $select_change(){
    this.searchFile = true;
    if(this.currentName==''||this.currentName==undefined){
      this.dataset = "true";
    }else{
      this.dataset = "false";
    }
    this.dynamicSearch();
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName,this.page,this.pageMaxItem);
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
    let path:any;
    if(this.currentName==''||this.currentName==undefined){
      path = this.parentPath;
      this.dataset = "true";
    }else{
      path = this.parentPath+"/"+this.currentName;
      this.dataset = "false";
    }
    this.datasetservice.createFile(this.dataId,encodeURI(path))
      .subscribe(result=>{
        if(result=='文件夹创建成功'){
          this.searchBool = true;
          this.dynamicSearch();
          this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName,this.page,this.pageMaxItem);
        }
      })
  }
  selectedFileOnChanged(event:any){
    let datasetType = sessionStorage.getItem("dataTypeName");

    if((this.uploader.queue.length-this.saveLoad.length)>5){
      this.show = true;
      this.tipType = "warnning";
      this.tipWidth = "426px";
      this.tipContent = "请上传5个以内的文件！";
      let a = this.uploader.queue.length;
      for(let k=this.saveLoad.length;k<a;k++){
        this.uploader.queue[this.saveLoad.length].remove();
      }
      return false;
    }else{
      for(let j=0;j<this.uploader.queue.length;j++){
        if(Number(j)>4){
          this.uploader.queue[5].remove();
          this.show = true;
          this.tipWidth = "426px";
          this.tipType = "warnning";
          this.tipContent = "请上传5个以内的文件！";
          j-=1;
          continue;
        }else{
          let bool = this.isInArray(this.showUpload,this.uploader.queue[j]);
          if(bool==false){
            this.saveLoad.push(this.uploader.queue[j]);
            this.showUpload.push(this.uploader.queue[j]);
            if(this.showUpload.length-1<j){
              this.showUpload[this.showUpload.length-1].status = "上传中";
            }else{
              this.showUpload[j].status = "上传中";
            }
            let show:any;
            if(this.showUpload.length-1<j){
              show = this.showUpload[this.showUpload.length-1];
            }else{
              show = this.showUpload[j];
            }
            this.fileType = this.judgeType(show,datasetType);
            if(this.fileType=="no support"){
              this.show = true;
              this.tipWidth = "426px";
              this.tipType = "warnning";
              this.tipContent = "您上传的文件格式暂不支持！";
              this.showUpload.splice(j,1);
              this.uploader.queue[j].remove();
              return
            }else{
              let element = this.uploader.queue[j];
              // element.alias = "photo";
              if(this.currentName==''||this.currentName==undefined){
                element.url = SERVER_URL_DATASETS+"/api/uploadInDataSet?path="+this.parentPath+"&dataId="+this.dataId+"&fileType="+this.fileType;
              }else{
                let parent = this.parentPath+"/"+this.currentName;
                element.url = SERVER_URL_DATASETS+"/api/uploadInDataSet?path="+parent+"&dataId="+this.dataId+"&fileType="+this.fileType;
              }
              this.getProgress(j);
            }
          }else{
            continue;
          }
        }
      }
    }
  }
  isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
      if(value.file.name == arr[i].file.name&&value.file.type==arr[i].file.type){
        return true;
      }
    }
    return false;
  }
  getProgress(j){
    if(j>4){
      this.showUpload.splice(5,1);
      return
    }else{
      this.uploader.onProgressItem=(fileItem: FileItem, progress: any)=>{
        this.progress=0;
        if(progress==100){
        }else if(progress<100){
        }
      };
/*      this.uploader.queue[j].onBeforeUpload = () => {
        this.uploader.queue[j].cancel();
      };*/
      this.uploader.queue[j].onSuccess = (response: any, status: any, headers: any) => {
        if(this.showUpload.length-1<j){
          this.showUpload[this.showUpload.length-1].status = "上传成功";
        }else{
          this.showUpload[j].status = "上传成功";
        }
      };
      this.uploader.queue[j].onError = (response: any, status: any, headers: any) => {
        if(this.showUpload.length-1<j){
          this.showUpload[this.showUpload.length-1].status = "上传失败";
        }else{
          this.showUpload[j].status = "上传失败";
        }
        if(status=="400"){
          this.show = true;
          this.tipType = "warnning";
          this.tipContent = "已有同名文件或文件夹，请重新上传！";
        }
      };
      this.uploader.onBuildItemForm = (item, form) => {
        form.append("fileType", this.fileType);
        //form.append(key2, value2);
      };
      //this.uploader.uploadAll();
      this.searchFile = true;

      this.datasetservice.deleteRepeatName(this.uploader.queue[j].file.name,this.parentPath)
        .subscribe(result=>{
          //console.log(result);
          for(var key in result[0]){
            if(result[0][key]=="exist"){
              this.show = true;
              this.tipType = "warnning";
              this.tipContent = "已有同名文件或文件夹，请重新上传！";
              if(this.showUpload.length-1<j){
                this.showUpload[this.showUpload.length-1].status = "上传失败";
              }else{
                this.showUpload[j].status = "上传失败";
              }
              return false
            }else{
              this.uploader.queue[j].upload();
            }
          }
        })
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
  judgeType(item,type){
    let name = item.file.name;
    if(this.filePath.length==1){
      if(name.match(/^.*(\.zip|\.ZIP)$/)){
        return '文件夹';
      }else{
        return 'no support'
      }
    }else if(this.filePath.length==2){
      if((type=='视频文件'||type=='视频分类')&&(name.match(/^.*(\.flv|\.FLV)$/)||name.match(/^.*(\.avi|\.AVI)$/)||name.match(/^.*(\.mp4|\.MP4)$/))){
        return '视频文件';
      }else if((type=='音频文件'||type=='音频分类')&&(name.match(/^.*(\.wav|\.WAV)$/)||name.match(/^.*(\.mp3|\.MP3)$/))){
        return '音频文件';
      }else if((type=='文本文件'||type=='文本分类')&&(name.match(/^.*(\.txt|\.TXT)$/)||name.match(/^.*(\.csv|\.CSV)$/))){
        return '文本文件';
      }else if((type=='图片文件'||type=='图片分类')&&(name.match(/^.*(\.jpg|\.JPG)$/)||name.match(/^.*(\.png|\.PNG)$/)||name.match(/^.*(\.bmg|\.BMG)$/)||name.match(/^.*(\.gif|\.GIF)$/)||name.match(/^.*(\.jpeg|\.JPEG)$/))){
        return '图片文件';
      }else if(type=='自定义分类'||type=='配置文件'){
        if(name.match(/^.*(\.flv|\.FLV)$/)||name.match(/^.*(\.avi|\.AVI)$/)||name.match(/^.*(\.mp4|\.MP4)$/)){
          return '视频文件';
        }else if(name.match(/^.*(\.wav|\.WAV)$/)||name.match(/^.*(\.mp3|\.MP3)$/)){
          return '音频文件';
        }else if(name.match(/^.*(\.txt|\.TXT)$/)||name.match(/^.*(\.csv|\.CSV)$/)){
          return '文本文件';
        }else if(name.match(/^.*(\.jpg|\.JPG)$/)||name.match(/^.*(\.png|\.PNG)$/)||name.match(/^.*(\.bmg|\.BMG)$/)||name.match(/^.*(\.gif|\.GIF)$/)||name.match(/^.*(\.jpeg|\.JPEG)$/)){
          return '图片文件';
        }else{
          return '配置文件';
        }
      }else{
        return 'no support'
      }
    }
  }
  judgeIcon(item){
    let name = item.file.name;
    if(name.match(/^.*(\.zip|\.ZIP)$/)){
      return 'assets/datasets/file/tc_wjj.png';
    }else if(name.match(/^.*(\.flv|\.FLV)$/)||name.match(/^.*(\.avi|\.AVI)$/)||name.match(/^.*(\.mp4|\.MP4)$/)){
      return 'assets/datasets/file/sp-upload.png';
    }else if(name.match(/^.*(\.wav|\.WAV)$/)||name.match(/^.*(\.mp3|\.MP3)$/)){
      return 'assets/datasets/file/sy-upload.png';
    }else if(name.match(/^.*(\.txt|\.TXT)$/)||name.match(/^.*(\.csv|\.CSV)$/)){
      return 'assets/datasets/file/wb-upload.png';
    }else if(name.match(/^.*(\.jpg|\.JPG)$/)||name.match(/^.*(\.png|\.PNG)$/)||name.match(/^.*(\.bmg|\.BMG)$/)||name.match(/^.*(\.gif|\.GIF)$/)||name.match(/^.*(\.jpeg|\.JPEG)$/)){
      return 'assets/datasets/file/tp-upload.png';
    }
/*    let type = item.file.type.split('/')[0];
    if(type=="video"){
      return 'assets/datasets/file/sp-upload.png';
    }else if(type=="audio"){
      return 'assets/datasets/file/sy-upload.png';
    }else if(type=="text"||item.file.type=="application/pdf"||item.file.type=="application/msword"||item.file.type=="application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
      return 'assets/datasets/file/wb-upload.png';
    }else if(type=="image"){
      return 'assets/datasets/file/tp-upload.png';
    }else if(type=='application'){
      return 'assets/datasets/file/tc_wjj.png';
    }*/
  }
  close(){
    this.uploadShow = false;
    this.show = false;
    this.uploader.queue=[];
    this.showUpload=[];
    this.searchBool = true;
    if(this.filePath.length==1){
      this.currentName='';
    }
    if(this.currentName==''||this.currentName==undefined){
      this.dataset = "true";
    }else{
      this.dataset = "false";
    }
    this.dynamicSearch();
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName,this.page,this.pageMaxItem);
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
    if(document.getElementsByClassName('myfile-content').length<=0)return;
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



