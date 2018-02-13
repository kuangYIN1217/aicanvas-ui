import {Component, EventEmitter, Input, Output,ViewChild} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
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
  @Output() enterChange: EventEmitter<any> = new EventEmitter();
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
  sameName:string='';
  show:boolean = false;
  content:string='';
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
      let path = this.outputImg(item.dataSetFileDirectoryPath.parentPath+"/"+item.fileName);
      return `${SERVER_URL}/download/${path}`;
    }else if(item.fileType=='视频文件'){
      return 'assets/datasets/file/sp.png';
    }else if(item.fileType=='音频文件'){
      return 'assets/datasets/file/yp.png';
    }else if(item.fileType=='其他文件'||item.fileType=='配置文件'){
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
  updateName(item,i){
    if(item.flag==undefined||item.flag!=1) {
      this.fileName = item.fileName;
      this.sameName = this.fileName;
      item.flag = 1;
    }
    setTimeout(()=>{
      $(`#${i}`).attr("id",i).focus();
    },300);

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
    this.fileName.replace(/(^\s*)|(\s*$)/g,"");
    if(this.sameName==this.fileName){
      item.flag = 2;
      return
    }else{
      this.datasetsService.updateFileName(item.fileId,this.fileName)
        .subscribe(
          (result)=>{
          if(result=='rename success'){
            item.flag = 2;
            this.getResult.emit('rename success');
          }
        },
          (error) => {
            this.fileName = this.sameName;
            item.flag = 2;
            this.show = true;
            this.content = "您修改的名称已存在！";
        })
    }
  }
  enterDataset(item){
    console.log(item);
    if(item.fileType=='文件夹'){
      //this.router.navigate(['../enterdataset'],{queryParams:{"dataId":item.dataId,"parentPath":item.dataSetFileDirectoryPath.parentPath,"dataset":false,"currentName":item.fileName}});
      let obj:any={};
      obj.dataId = item.dataId;
      obj.parentPath = item.dataSetFileDirectoryPath.parentPath;
      obj.dataset = "false";
      obj.currentName = item.fileName;
      this.enterChange.emit(obj);
    }else if(item.fileType=='文本文件'){
      this.textShow = true;
      this.textName = item.fileName;
      this.datasetsService.getTxt((item.dataSetFileDirectoryPath.parentPath+"/"+item.fileName).substring(26))
        .subscribe(result=>{
          this.textContent = result.text();
          //console.log(this.textContent);
        })
    }else if(item.fileType=='视频文件'){
      this.videoShow = true;
      this.videoSrc = item.dataSetFileDirectoryPath.parentPath+"/"+item.fileName;
    }else if(item.fileType=='音频文件'){
      this.audioShow = true;
      this.audioSrc = item.dataSetFileDirectoryPath.parentPath+"/"+item.fileName;
    }else if(item.fileType=='图片文件'){
      this.image = (item.dataSetFileDirectoryPath.parentPath+"/"+item.fileName).slice(26);
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
    this.datasetsService.deleteFile(item.fileId,item.dataId,encodeURI(item.dataSetFileDirectoryPath.parentPath+"/"+item.fileName))
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
  getImageStyle(obj,width,height,img,x,y){
    obj.className = "show-img";
    obj.style.position = "relative";
    obj.style.top = "50%";
    obj.style.left = "50%";
    obj.style.marginTop = -(height/2)+'px';
    obj.style.marginLeft = -(width/2)+'px';
    img.style.right = x-17+'px';
    img.style.top = y-17+'px';
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
    if(parseInt(width)>parseInt(height)){
      if(parseInt(width)>=970){
        obj.style.width = "970px";
        obj.style.position = "relative";
        obj.style.left = "0";
        obj.style.right = "0";
        obj.style.top = "50%";
        obj.style.marginTop = -(obj.offsetHeight/2)+'px';
        let y1 = (545-parseInt(obj.offsetHeight))/2;
        img.style.right = '-17px';
        img.style.top = y1-17+'px';
        return
      }else{
        this.getImageStyle(obj,width,height,img,x,y);
        return
      }
    }else if(parseInt(width)<=parseInt(height)){
      if(parseInt(height)>=545){
        obj.style.height = "545px";
        obj.style.position = "relative";
        obj.style.top = "0";
        obj.style.bottom = "0";
        obj.style.left = "50%";
        obj.style.marginLeft = -(obj.offsetWidth/2)+'px';
        let x1 = (970-parseInt(obj.offsetWidth))/2;
        img.style.right = x1-17+'px';
        img.style.top = '-17px';
        return
      }else{
        this.getImageStyle(obj,width,height,img,x,y);
        return
      }
    }
  }
}
