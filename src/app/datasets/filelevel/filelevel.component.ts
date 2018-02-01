/**
 * Created by Administrator on 2017/7/12 0012.
 */
import {Component, EventEmitter, Input, Output,ViewChild} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
import {calc_size} from '../calc-size'
import {SERVER_URL} from "../../app.constants";
import {ActivatedRoute, Router} from "@angular/router";
declare var $:any;
@Component({
  selector: 'file-level',
  styleUrls: ['./filelevel.component.css'],
  templateUrl: './filelevel.component.html',
  providers: [DatasetsService]
})
export class FileLevelComponent{
  SERVER_URL = SERVER_URL;
  @Input()  d_tableData:any;
  @Input()  dataName:string;
  @Output() getResult: EventEmitter<any> = new EventEmitter();
  @Output() deleteResult: EventEmitter<any> = new EventEmitter();
  fileName:string;
  textName:string;
  textShow:boolean = false;
  videoShow:boolean = false;
  audioShow:boolean = false;
  photoShow:boolean = false;
  textContent:string;
  videoSrc:string;
  audioSrc:string;
  image:string='';
  /*@ViewChild('video') video: any;*/
  constructor(private datasetsService:DatasetsService,private route: ActivatedRoute ,private router: Router){

  }
  ngOnChanges(...args: any[]) {
    console.log(this.d_tableData);
  }
  getImage(item){
    if(item.fileType=='文件夹'){
      return 'assets/datasets/file/sjxq_wjj.png';
    }else if(item.fileType=='文本文件'){
      return 'assets/datasets/file/wb.png';
    }else if(item.fileType=='图片文件'){
      let path = this.outputImg(item.path);
      return `${SERVER_URL}/download/${path}`;
    }else if(item.fileType=='视频文件'){
      return 'assets/datasets/file/sp.png';
    }else if(item.fileType=='音频文件'){
      return 'assets/datasets/file/yp.png';
    }else if(item.fileType=='其他文件'){
      return 'assets/datasets/file/qt.png';
    }
  }
  getTypeTop(item){
    if(item.fileType!="文件夹"&&item.sign==false){
      return {
        "top":"10px",
        "width":"60px",
        "height":"72px"
      };
    }else if(item.fileType!="文件夹"&&item.sign==true){
      return {
        "top":"10px",
        "width":"60px",
        "height":"72px",
         "border":"2px solid #23a880"
      };
    }
  }
  outputImg(item){
    return item.slice(26);
  }
  updateName(item){
    if(item.flag==undefined||item.flag!=1) {
      this.fileName = item.fileName;
      item.flag = 1;
    }
  }
  enterfile(item){
    item.enter = 1;
    item.show = true;
    if(item.checked){
      item.enter = 2;
    }
  }
  leavefile(item){
    item.enter = 2;
    item.show = false;
  }
  enterdelete(item){
    item.img = 1;
  }
  leavedelete(item){
    item.img = 2;
  }
  output1(item){
    return item.substring(26,item.length);
  }
/*  entercheck(item){
    item.checked = true;
  }*/
/*  leavecheck(item){
    item.enter = 1;
    item.show = false;
  }*/
/*  getImg(item){
    console.log(item);
    if(item.show){
      return 'assets/datasets/file/xz_hui.png';
    }else if(!item.show){
      return 'assets/datasets/file/xz_hui.png';
    }else if(item.checked){
      return 'assets/datasets/file/xz_lv.png';
    }else if(!item.checked){
      return 'assets/datasets/file/xz_hui.png';
    }
    //item.checked&&item.show?'assets/datasets/file/xz_lv.png':'assets/datasets/file/xz_hui.png'
  }*/
  checkFile(item){
    item.checked = !item.checked;
    console.log(item.checked);
    //this.getImg(item);
    if(item.checked){
      item.enter = 2;
      item.parent = 1;
    }else{
      item.enter = 1;
      item.parent = 2;
    }
  }
  saveName(item){
    console.log(item);
    this.datasetsService.updateFileName(item.fileId,this.fileName)
      .subscribe(result=>{
        if(result=='rename success'){
          item.flag = 2;
          this.getResult.emit('rename success');
        }
      })
  }
  enterDataset(item){
    console.log(item);
    if(item.fileType=='文件夹'){
      //this.datasetsService.enterDataset(item.dataId,encodeURI(item.path),null,null)
       // .subscribe(result=>{
          this.router.navigate(['../enterdataset'],{queryParams:{"dataId":item.dataId,"parentPath":item.path,"dataName":this.dataName}});
         // console.log(result);
       // })
    }else if(item.fileType=='文本文件'){
      this.textShow = true;
      this.textName = item.fileName;
      this.datasetsService.getTxt(item.path.substring(26))
        .subscribe(result=>{
          this.textContent = result.text();
          console.log(this.textContent);
        })
    }else if(item.fileType=='视频文件'){
      this.videoShow = true;
      this.videoSrc = item.path;
    }else if(item.fileType=='音频文件'){
      this.audioShow = true;
      this.audioSrc = item.path;
    }else if(item.fileType=='图片文件'){
      this.image = item.path.slice(26);
      this.photoShow = true;
    }
  }
  close(){
    this.textShow = false;
  }
  closeImg(){
    this.photoShow = false;
  }
  deleteFile(item){
    console.log(item);
    this.datasetsService.deleteFile(item.fileId,item.dataId,encodeURI(item.path))
      .subscribe(result=>{
        this.deleteResult.emit('delete success');
      })
  }
  enterchecked(item){
    item.sb = true;
  }
  leavechecked(item){
    item.sb = false;
  }
  filterName(name){
    if(name.match(/^\d{13}_/)){
      return name.substring(14);
    }else{
      return name;
    }
  }
  closeVideo(){
    this.videoShow = false;
    this.videoSrc = '';
  }
  closeAudio(){
    this.audioShow = false;
    this.audioSrc = '';
  }
  getWH(){
    let obj:any;
    obj = document.getElementById("image");
    obj.className = "";
    let img:any;
    img = document.getElementById("closeImage");
    let width = obj.offsetWidth;
    let height = obj.offsetHeight;
    let x = (970-parseInt(width))/2;
    let y = (545-parseInt(height))/2;
    if(parseInt(width)>970){
      obj.className = "show-imgW";
      img.style.right = '-17px';
      img.style.top = '-17px';
      return
    }else if(parseInt(height)>545){
      obj.className = "show-imgW";
      img.style.right = x-17+'px';
      img.style.top = '-17px';
      return
    }else{
      obj.className = "show-img";
      obj.style.position = "relative";
      obj.style.top = "50%";
      obj.style.left = "50%";
      obj.style.marginTop = -(height/2)+'px';
      obj.style.marginLeft = -(width/2)+'px';
      img.style.right = x-17+'px';
      img.style.top = y-17+'px';
    }
    /*$("#image").width();
    $("#image").height();*/
  }
}
