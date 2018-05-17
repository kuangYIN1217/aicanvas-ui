/**
 * Created by Administrator on 2017/7/13 0013.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {SERVER_URL} from "../../app.constants";
import {FileUploader, FileItem} from "ng2-file-upload";
import {ToastyService} from "ng2-toasty";
import {addSuccessToast} from "app/common/ts/toast";
@Component({
  selector: 'cpt-sence',
  styleUrls: ['./sence.css'],
  templateUrl: './sence.html'
})
export class SenceComponent {
  SERVER_URL = SERVER_URL;
  uploadShow:number;
  progress:number=0;
  importPath:string;
  showTip:boolean = false;
  tipWidth:string='';
  tipContent:string='';
  tipType:string='';
  tipMargin:string='';
  @Output() uploadShowChange: EventEmitter<any> = new EventEmitter();
  constructor (private toastyService:ToastyService) {

  }
  public uploader:FileUploader = new FileUploader({
    url: SERVER_URL+"/api/sence/upload?user=admin",
    method: "POST",
    itemAlias: "file",
    Authorization: 'Bearer '+ localStorage['authenticationToken']
  });
  selectedFileOnChanged(event:any) {
    //console.log(event.target.value);
    this.upload(event);
  }
  upload(event){
    this.uploader.queue[0].upload(); // 开始上传
    this.uploader.onProgressItem=(fileItem: FileItem, progress: any)=>{
      this.progress=0;
      if(progress==100){
        this.showTip = true;
        this.tipMargin = "20px auto -20px";
        this.tipWidth = "754px";
        this.tipType = "success";
        this.tipContent = "算法链上传成功！";
        /*addSuccessToast(this.toastyService , "算法链上传成功");*/
        setTimeout(()=>{
          this.uploadShow = 0;
          this.uploader.queue=[];
          this.uploadShowChange.emit(this.uploadShow);
        }, 3000);
      }
    };
    this.uploader.queue[0].onSuccess = (response: any, status: any, headers: any) => {
      event.target.value = '';
      this.importPath = response;
    }
  }
  hide_click(){
    this.showTip = false;
    this.uploadShow = 0;
    this.uploadShowChange.emit(this.uploadShow);
  }
}
