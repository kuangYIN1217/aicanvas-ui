import {Component,Input,Output,EventEmitter} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
import {ActivatedRoute, Router} from "@angular/router";


import {SERVER_URL_DATASETS,SERVER_URL} from "app/app.constants";
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
  constructor(private datasetservice: DatasetsService,private route: ActivatedRoute, private router: Router){
    this.getDataSetsTypes();
  }

  ngOnInit() {
    calc_height(document.getElementById("filecontent"));
    this.route.queryParams.subscribe(params => {
      this.dataId = params['dataId'];
      this.parentPath = params['parentPath'];
      this.dataset = params['dataset'];
      //this.currentName = params['currentName'];
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
      });
    });
  }
  enterChange(event){
    console.log(event);
    this.dynamicSearch();
    this.dataset = event.dataset;
    this.currentName = event.currentName;
    this.dataId = event.dataId;
    this.parentPath = event.parentPath;
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName);
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
      this.tipContent = "您修改的名称已存在！";
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
    this.datasetservice.enterDataset(dataId,encodeURI(path),fileType,fileName)
      .subscribe(result=>{
        console.log(result);
        if(result.text()!=''){
          this.d_tableData = result.json();
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
          this.searchBool = false;
          this.searchFile = false;
          console.log(result);
        }else{
          this.d_tableData=[];
        }
      })
  }
  getFilePath(path){
    let pa = path.split("/");
    if(pa.length>5&&this.filePath.length==0){
      for(let i=4;i<pa.length-1;i++){
        let obj:any={};
        obj.path1 = pa.slice(0,i+1).join("/");
        obj.showpath = pa[i];
        this.filePath.push(obj);
      }
    }
  }
  $data_backup(){
    this.backup=[];
    for(let i=0;i<this.d_tableData.length;i++){
      if(this.d_tableData[i].checked){
        this.backup.push(this.d_tableData[i].dataSetFileDirectoryPath.parentPath+"/"+this.d_tableData[i].fileName);
      }
    }
    if(this.backup.length>0){
      this.datasetservice.backupDataset(this.backup)
        .subscribe(result=>{
          this.downloadPath = result.substring(26);
          this.downloadBackup(this.downloadPath);
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
    for(let i=0;i<this.d_tableData.length;i++){
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
    console.log(this.markPhoto);
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
          this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName);
        }
      })
  }
  selectedFileOnChanged(event:any){
    let datasetType:string='';
    if(this.d_tableData.length>0){
      datasetType = this.d_tableData[0].fileType;
    }else{
      datasetType = sessionStorage.getItem("dataTypeName");
    }
    console.log(datasetType);
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
          console.log(bool);
          if(bool==false){
            this.showUpload.push(this.uploader.queue[j]);
            this.showUpload[j].status = "上传中";
            this.fileType = this.judgeType(this.showUpload[j],datasetType);
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
      this.uploader.queue[j].onSuccess = (response: any, status: any, headers: any) => {
        this.showUpload[j].status = "上传成功";
      };
      this.uploader.queue[j].onError = (response: any, status: any, headers: any) => {
        this.showUpload[j].status = "上传失败";
        this.show = true;
        this.tipType = "warnning";
        this.tipContent = response.split("$%")[0]+"已存在！";
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
    let type = item.file.type.split('/')[0];
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
    }
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
    this.getAllFile(this.dataId,this.parentPath,this.temptype,this.tempname,this.currentName);
  }
  filterName(name){
    if(name.match(/^\d{13}_/)){
      return name.substring(14);
    }else{
      return name;
    }
  }
}
