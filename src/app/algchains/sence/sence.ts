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
  @Output() uploadShowChange: EventEmitter<any> = new EventEmitter();
  constructor (private toastyService:ToastyService) {

  }
  public uploader:FileUploader = new FileUploader({
    url: SERVER_URL+"/api/sence/upload",
    method: "POST",
    itemAlias: "file",
  });
  selectedFileOnChanged(event:any) {
    console.log(event.target.value);
    this.upload();
  }
  upload(){
    this.uploader.queue[0].upload(); // 开始上传
    this.uploader.onProgressItem=(fileItem: FileItem, progress: any)=>{
      this.progress=0;
      if(progress==100){
        addSuccessToast(this.toastyService , "数据集上传成功");
/*        setTimeout(()=>{
          this.uploadShow = 0;
          this.uploadShowChange.emit(this.uploadShow);
        }, 5000);*/

      }
    };
    this.uploader.queue[0].onSuccess = (response: any, status: any, headers: any) => {
      this.importPath = response;
    }
  }
  hide_click(){
    this.uploadShow = 0;
    this.uploadShowChange.emit(this.uploadShow);
  }
}
