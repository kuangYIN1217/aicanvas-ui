/**
 * Created by Administrator on 2017/7/13 0013.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import Resumable from './resumable'
import {calc_size} from '../calc-size'
import {ToastyService, ToastyConfig} from 'ng2-toasty';
import {addSuccessToast , addWarningToast} from '../../common/ts/toast';
declare var $: any;
import {SERVER_URL_DATASETS} from "../../app.constants";
import {DatasetsService} from "app/common/services/datasets.service";

import {FileItem, FileUploader} from "ng2-file-upload";

@Component({
  selector: 'cpt-popup',
  styleUrls: ['./popup.component.css'],
  templateUrl: './popup.component.html',
  providers:[DatasetsService]
})
export class PopupComponent {
  @Output() reflashPage = new EventEmitter();
  SERVER_URL = SERVER_URL_DATASETS;
  @Input() d_dataTypes: any;
  s_select_datasetType: any; // type
  s_name: any;
  // 上传地址GET /api/dataSetUpload
  url: string = this.SERVER_URL + '/api/upload';
  // 分割文件大小
  chunkSize: number = 1*1024*1024;
  // 同时上传文件数量
  simultaneousUploads: number =3;
  // 最大上传文件数量 undefined 不限
  maxFiles: any = 3;
  resumable: any;
  s_error_show: boolean = false;
  s_error_message: string = '';
  s_error_level: string = 'error'; // warning

  s_uploading: boolean = false;// 是否正在上传
  s_form_show: boolean = true;

  s_progress_show: boolean = false;
  s_progress_name: string ;
  s_progress_size: any;
  s_progress_ratio: any = 50;
  s_progress_success: boolean = false;
  s_progress_file:any[]=[];
  once_click: boolean = false;
  @Input() show: boolean = false;
  @Output() showChange: EventEmitter<any> = new EventEmitter();
  datasetsType:any[]=[];
  clickOne:boolean = true;
  singleRadio:any;
  showFile:any[]=[];


  //file-upload
  showUpload:any[]=[];
  public uploader:FileUploader;
  fileType:string;
  url1:string;
  progress:number=0;
  dataType:number;
  constructor (private toastyService:ToastyService, private toastyConfig: ToastyConfig,private datasetsService:DatasetsService) {
    this.datasetsService.getDataSetType()
      .subscribe(result=>{
        this.datasetsType = result;
        this.datasetsType[0].flag = 1;
      });
  }
  getImage(item){
    if(item.id==1){
      if(item.flag==undefined||item.flag==2)
        return 'assets/datasets/createfile/tp_hui.png';
      else{
        this.s_select_datasetType = item.id;
        return 'assets/datasets/createfile/tp_lv.png';
      }
    }else if(item.id==2){
      if(item.flag==undefined||item.flag==2)
        return 'assets/datasets/createfile/yp_hui.png';
      else{
        this.s_select_datasetType = item.id;
        return 'assets/datasets/createfile/yp_lv.png';
      }
    }else if(item.id==3){
      if(item.flag==undefined||item.flag==2)
        return 'assets/datasets/createfile/wb_hui.png';
      else{
        this.s_select_datasetType = item.id;
        return 'assets/datasets/createfile/wb_lv.png';
      }
    }else if(item.id==4){
      if(item.flag==undefined||item.flag==2)
        return 'assets/datasets/createfile/sp_hui.png';
      else{
        this.s_select_datasetType = item.id;
        return 'assets/datasets/createfile/sp_lv.png';
      }
    }else if(item.id==5){
      if(item.flag==undefined||item.flag==2)
        return 'assets/datasets/createfile/qt_hui.png';
      else{
        this.s_select_datasetType = item.id;
        return 'assets/datasets/createfile/qt_lv.png';
      }
    }
  }
  chooseImg(item){
    if(item.flag != 1){
      for(let i=0;i<this.datasetsType.length;i++){
        this.datasetsType[i].flag = 2;
      }
      item.flag = 1;
      this.getImage(item);
    }
  }
  upload_init_flag: boolean = false;

  ngAfterViewChecked() {
    if (!this.s_select_datasetType && this.d_dataTypes.length > 0) {
      this.s_select_datasetType = this.d_dataTypes[0].id;
    }
  }
  initUpload () {
    this.resumable = new Resumable({
      target: this.url,
      //每个上传的数据块的大小（以字节为单位）
      chunkSize: this.chunkSize,
      // 同时上传文件数量
      simultaneousUploads: this.simultaneousUploads,
      //如果在服务器端实施，即使在浏览器崩溃或者甚至电脑重启之后，这也将允许上传恢复。
      testChunks: true,
      throttleProgressCallbacks:1,
      //发送数据块时，服务器（使用方法multipart或octet）
      method: "octet",
      //指示在单个会话中可以上载多少个文件。有效值是任何正整数，undefined没有限制。
      maxFiles: this.maxFiles,
      //用数据包含在多部分请求中的额外参数。这可以是一个对象或一个功能。如果一个函数，它会被传递一个ResumableFile和ResumableChunk对象（缺省：{}）
      query: {
        //name: 123,
        type: this.s_select_datasetType,
        creator: localStorage['username']
      }
    });
    if(!this.resumable.support) {
      addWarningToast(this.toastyService , '浏览器版本过低');
    } else {
      this.resumable.assignBrowse(document.querySelectorAll('.resumable-browse')[0]);
    }
    let $this = this;
    //console.log(this.resumable);
    this.resumable.on('fileAdded', function(file){
      console.log('into');
      if (file.length && file.length > 0) {
        $this.s_progress_file = file;
/*        if($this.s_progress_file.length>3){
          $this.s_progress_file.slice(0,3);
          console.log($this.s_progress_file);
          $this.resumable.file = $this.s_progress_file.slice(0,3);
          console.log($this.resumable);
        }*/
        $this.resumable.upload();
        //file = file[0];

      }else{
        if (file.file.fileName.match(/^.*(\.zip|\.ZIP)$/)){
          $this.s_progress_success = false;
          $this.s_uploading = true;
          //$this.s_form_show = false;
          //$this.s_progress_show = true;
          /*if (file.length && file.length > 0) {
            $this.s_progress_name = file[0].fileName;
            $this.s_progress_size = calc_size(file[0].size);
          } else {*/
            //$this.s_progress_name = file.fileName;
            //$this.s_progress_size = calc_size(file.size);
          //}
          // $this.once_click = false;
          //console.log($this.resumable);
          $this.resumable.upload();
        } else {
          $this.toastyService.clearAll();
          addWarningToast($this.toastyService , "文件格式不正确，请上传ZIP格式文件");
        }
      }
    });
    this.resumable.on('fileSuccess', function(file,message){

    });
    this.resumable.on('complete', function(file,message){
      // 上传成功
      // $this.s_form_show = true;
      console.log(this.resumable);
      $this.s_uploading = false;
      $this.s_progress_success = true;
      let $$this = $this;
      //addSuccessToast($this.toastyService , "数据集上传成功");
      //setTimeout(function() {
       // $$this.$hide_click();
        $$this.reflashPage.emit(true);
      //} , 2000)
    });
    this.resumable.on('fileError', function(file, message){
      $this.s_uploading = false;
      $this.s_error_show = true;
      $this.resumable.pause();
      $this.resumable.cancel();
      $this.s_error_level = "info";
      $this.s_error_message = '文件解压失败';
      file.abc[99];
    });
    this.resumable.on('fileProgress', function(file){
      let ratio =  Math.floor($this.resumable.progress()*100);
      console.log(ratio);
      $this.singleRadio = Math.floor(file.progress()*100);
      $this.s_progress_ratio = ( ratio > 100 ? 100 : ratio )+ '%';
    });
  }
  $hide_click () {
    this.show = false;
    this.clickOne = true;
    // this.once_click = false;
    this.uploader.queue=[];
    this.showUpload=[];
    this.showChange.emit(this.show);
    this.reflashPage.emit(true);
/*    if (!this.s_uploading) {
      this.s_name = '';
      //this.s_progress_show = false;
      this.s_error_show = false;
      //this.s_form_show = true;
      this.s_select_datasetType = this.d_dataTypes[0].id;
      this.s_progress_file =[];
    }*/
  }
  $upload_click (event) {
    if(this.clickOne){
      //this.initUpload();
      this.clickOne = false;
    }
    //this.initUpload();
    /*      event = event || window.event;

    // this.initUpload();
      if (!this.s_name) {
      this.s_error_show = true;
      this.s_error_message = '请先填写数据集名称';
      this.s_error_level = "error";
      // $('.resumable-browse input').remove();
    }  else {
      this.s_error_show = false;
      this.initUpload();
    }*/
    /* else {
      if (this.once_click) {
        event.preventDefault();
        return;
      }
      this.once_click = true;
    } */
  }
  $name_change () {
    if (this.s_name) {
      this.s_error_show = false;
      this.initUpload();
    } else {
      $('.resumable-browse input').remove();
    }
  }
  getIcon(status){
    if(status=='上传成功'){
      return 'assets/datasets/upload/tc_cg.png';
    }else if(status=='上传中'){
      return 'assets/datasets/upload/tc_sc.png';
    }else if(status=='上传失败'){
      return 'assets/datasets/upload/tc_sb.png';
    }
  }
  $remove_click() {
    this.s_error_show = false;
    this.s_uploading = false;
    //this.s_form_show = true;
    //this.s_progress_show = false;
    this.resumable.pause();
    this.resumable.cancel();
    addWarningToast(this.toastyService , "上传已中断");
    let $this = this;
    setTimeout(function() {
      $this.$hide_click();
    } , 2000)
  }

  ngOnInit(){
    this.uploader = new FileUploader({
      url:this.url1,
      method: "POST",
      itemAlias: "file",
    });
  }
  selectedFileOnChanged(event:any){
    for(let j=0;j<this.uploader.queue.length;j++){
      if(Number(j)>2){
        this.uploader.queue[3].remove();
        j-=1;
        continue;
      }else{
        if (this.uploader.queue[j].file.name.match(/^.*(\.zip|\.ZIP)$/)){
          let bool = this.isInArray(this.showUpload,this.uploader.queue[j]);
          console.log(bool);
          if(bool==false){
            let obj:any={};
            obj.name = this.uploader.queue[j].file.name;
            obj.type = this.uploader.queue[j].file.type;
            for(let k=0;k<this.datasetsType.length;k++){
              if(this.datasetsType[k].flag==1){
                this.dataType = this.datasetsType[k].id;
                break;
              }
            }
            //obj.type = this.uploader.queue[j].file.type;
            this.showUpload.push(obj);
            //this.fileType = this.judgeType(this.showUpload[j]);
            let element = this.uploader.queue[j];
            // element.alias = "photo";
            element.url = SERVER_URL_DATASETS+"/api/uploadDataSetZip?creator="+localStorage['username']+"&typeId="+this.dataType;
            //console.log(this.fileType);
            //console.log(element.url);
            this.getProgress(j);
          }else{
            continue;
          }
        }else{

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
}
