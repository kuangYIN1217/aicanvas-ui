import {Component,Input,Output,EventEmitter} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
declare var $: any;
@Component({
  selector: 'create-file',
  styleUrls: ['./createfile.component.css'],
  templateUrl: './createfile.component.html',
  providers:[DatasetsService]
})
export class CreateFileComponent {
  imgType:string='tp';
  filename:string='';
  datasetsType:any[]=[];
  username:string;
  createfile:boolean = false;
  createsucess:boolean = true;
  show:boolean = false;
  content:string='';
  @Output() createMethod: EventEmitter<any> = new EventEmitter();
  constructor(private datasetsService:DatasetsService){
    this.username = localStorage['username'];
    this.datasetsService.getDataSetType()
      .subscribe(result=>{
        this.datasetsType = result;
        this.datasetsType[0].flag = 1;
      })
  }
  create(){
    let dataType:number;
    let dataTypeName:string;
    if(this.filename==''){
      return false;
    }
    if(!this.createsucess) {
      return;
    }
    this.createsucess = false;
    for(let i=0;i<this.datasetsType.length;i++){
      if(this.datasetsType[i].flag == 1){
        dataType = this.datasetsType[i].id;
        dataTypeName = this.datasetsType[i].typeName;
      }
    }
    this.datasetsService.createDataSet(this.username,this.filename,dataType,dataTypeName)
      .subscribe(
        (result)=>{
        this.createsucess = true;
        this.cancel();
      },
        (error)=>{
          this.show = true;
          this.content = "文件夹已存在！";
          this.createsucess = true;
        }
      )
  }
  cancel(){
    this.createMethod.emit(this.createfile);
  }
  getImage(item){
    if(item.id==1){
      if(item.flag==undefined||item.flag==2)
        return 'assets/datasets/createfile/tp_hui.png';
      else
        return 'assets/datasets/createfile/tp_lv.png';
    }else if(item.id==2){
      if(item.flag==undefined||item.flag==2)
        return 'assets/datasets/createfile/yp_hui.png';
      else
        return 'assets/datasets/createfile/yp_lv.png';
    }else if(item.id==3){
      if(item.flag==undefined||item.flag==2)
        return 'assets/datasets/createfile/wb_hui.png';
      else
        return 'assets/datasets/createfile/wb_lv.png';
    }else if(item.id==4){
      if(item.flag==undefined||item.flag==2)
        return 'assets/datasets/createfile/sp_hui.png';
      else
        return 'assets/datasets/createfile/sp_lv.png';
    }else if(item.id==5){
      if(item.flag==undefined||item.flag==2)
        return 'assets/datasets/createfile/qt_hui.png';
      else
        return 'assets/datasets/createfile/qt_lv.png';
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
}
