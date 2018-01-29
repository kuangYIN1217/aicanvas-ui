/**
 * Created by Administrator on 2017/7/12 0012.
 */
import {Component, EventEmitter, Input, Output,ViewChild} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
import {calc_height} from '../../common/ts/calc_height'
import {SERVER_URL} from "../../app.constants";
import {ActivatedRoute, Router} from "@angular/router";
declare var $:any;
@Component({
  selector: 'cpt-mark',
  styleUrls: ['./mark.component.css'],
  templateUrl: './mark.component.html',
  providers: [DatasetsService]
})
export class MarkComponent{
  SERVER_URL = SERVER_URL;
  filePath:any[]=[];
  markPhoto:any[]=[];
  showPhoto:any={};
  showPhotoIndex:number=0;
  dataId:number;

  ox:any;
  oy:any;
  top:number;
  left:number;
  flag:number=1;
  startX:number;
  startY:number;
  endX:number;
  endY:number;
  rect:any;
  index:number=0;
  rectId:string='rectId';
  rectLeft:number;
  rectTop:number;
  show:boolean=false;
  start:boolean=false;
  marktop:number;
  markleft:number;

  rected:any;
  indexed:number=0;
  rectedId:string='rectedId';


  canvas:any;
  cxt:any;
  img:any;
  isGray:boolean=true;//是否为灰度
  differVal:number=10;//允许的色差值
  imgData:any;
  imgWidth:number;
  imgHeight:number;
  diffX:number;
  diffY:number;
  markImage:any={};
  dataName:string;
  xMax:number;
  yMax:number;
  xMin:number;
  yMin:number;
  username:string;
  markCoordinateSet:any[]=[];
  markName:string='';
  fileId:number;
  path:string;
  addMark:boolean=false;
  coordinateId:number=0;
  singleDiv:any;
  imageLeft:string;
  constructor(private datasetservice: DatasetsService,private route: ActivatedRoute, private router: Router){
    this.username = localStorage['username'];
    this.dataName = sessionStorage.getItem("dataName");
    console.log(this.dataName);
  }
  home(){
    this.router.navigate(['../datasets']);
  }
  ngOnInit(){
    calc_height(document.getElementById('mark-content'));
    this.route.queryParams.subscribe(params => {
      $("#content").find("div").remove();
      this.dataId = params['dataId'];
      this.filePath = JSON.parse(params['filePath']);
      this.markPhoto = JSON.parse(params['markPhoto']);
      if(sessionStorage.getItem("showPhoto")){
        this.showPhoto = JSON.parse(sessionStorage.getItem("showPhoto"));
      }else{
        this.showPhoto = this.markPhoto[0];
      }
      sessionStorage.setItem("showPhoto",JSON.stringify(this.showPhoto));
      console.log(this.showPhoto);
/*      let image = this.getSrc(this.showPhoto);
      this.imgWidth = $(image).width();*/
/*      this.imgHeight = $(image).height();
      $("#content").width = this.imgWidth + "px";*/
      //$("#content").height = this.imgHeight + "px";
      this.addPhotoPath();
      this.path = this.filePath[this.filePath.length-1].path1;
      this.getSize(this.path);
    });
  }
  getSize(path){
    this.datasetservice.getMarkInfo(path)
      .subscribe(result=>{
        //console.log(result);
        this.markImage = result;
        this.markCoordinateSet = result.markCoordinateSet;
        this.draw(result.markCoordinateSet);
      })
  }
  draw(arr){
    let $this = this;
    this.top = $("#content").offset().top;
    this.left = $("#content").offset().left;
    this.imageLeft = $("#showImg").css("left");
    for(let i=0;i<arr.length;i++){
      this.rected = $("<div></div>");
      $(this.rected).attr("id","rectedId"+i);
      $(this.rected).css("position","absolute");
      $(this.rected).css("border","2px solid #fff");
      $(this.rected).css("z-index",111);
      $(this.rected).css("position","absolute");
      $(this.rected).css("left",(arr[i].xMin)+'px');
      $(this.rected).css("top",(arr[i].yMin)+'px');
      $(this.rected).css("width",(arr[i].xMax-arr[i].xMin)+'px');
      $(this.rected).css("height",(arr[i].yMax-arr[i].yMin)+'px');
      let image:any;
      image = $("<img/>");
      $(image).attr("id","imageId"+i);
      $(image).attr("src","assets/datasets/upload/tc_sb.png");
      $(image).css("position","absolute");
      $(image).css("z-index",112);
      $(image).css("right","-7px");
      $(image).css("top","-7px");
      $(image).css("cursor","pointer");
      $(image).css("display","none");
      $(this.rected).append(image);
      $("#content").append(this.rected);
      (function(index) {
        $("#rectedId"+index).click(function(){
          //console.log(arr[index]);
          $this.addMark = true;
          $this.show = true;
          $this.markName = arr[index].markName;
          $this.xMin = arr[index].xMin;
          $this.yMin = arr[index].yMin;
          $this.xMax = arr[index].xMax;
          $this.yMax = arr[index].yMax;
          $this.coordinateId = arr[index].coordinateId;
          $this.markleft = Number($this.xMax)+$this.left;
          $this.marktop = Number($this.yMax)+$this.top;
          $this.singleDiv = arr[index];
          //console.log($this.markleft,$this.marktop);
          $this.fileId = $this.showPhoto.fileId;
        });
        $("#rectedId"+index).mouseenter(function(){
          $("#imageId"+index).css("display","block");
        });
        $("#rectedId"+index).mouseleave(function(){
          $("#imageId"+index).css("display","none");
        });
        $("#imageId"+index).click(function(e:any){
          let oev = e || event;
          oev.preventDefault();
          oev.stopPropagation();
          $this.datasetservice.deleteMark(arr[index])
            .subscribe(result=>{
              console.log(result);
              $("#rectedId"+index).remove();
              //this.getSize(this.path);
            })
        });
      })(i);
    }
  }
  ngOnDestroy(){
    sessionStorage.removeItem('showPhoto');
    sessionStorage.removeItem("showPhotoIndex")
  }
  imagePathChange(event){
    this.getSize(event);
  }
  search(index){
    if(index!=this.filePath.length-1){
      let filePath = this.filePath.slice(0,index+1);
      this.router.navigate(['../enterdataset'],{queryParams:{"parentPath":this.filePath[index].path1,"dataId":this.dataId,"filePath":JSON.stringify(filePath)}});
    }else{
      return false;
    }
  }
  addPhotoPath(){
    let path = this.showPhoto.path.split('/');
    let obj:any={};
    obj.path1 = this.showPhoto.path;
    obj.showpath = path[path.length-1];
    this.filePath.push(obj);
    console.log(this.filePath);
  }
  showChange(event){
    if(event=='false'){
      this.rect.remove();
    }else if(event=='true'){

    }
    this.leave();
    $("#content").css('cursor','auto');
    this.addMark = false;
    this.show = false;
    this.start = false;
    this.coordinateId = 0;
  }
  markCoordinateSetChange(event){
    this.markCoordinateSet = event;
  }
  startMark(){
    this.start = true;
    this.getWH();
    //this.load();
  }
  enter(){
    if(this.start){
      $("#content").css('cursor','crosshair');
      this.ox = $("<div id='ox'></div>");
      this.oy = $("<div id='oy'></div>");
      this.top = $("#content").offset().top;
      this.left = $("#content").offset().left;
      //console.log(this.top);
      //console.log(this.left);
    }
  }
  leave(){
    if(this.start){
      $('#ox').remove();
      $('#oy').remove();
    }
  }
  down(event:any){
    if(this.start&&!this.addMark){
      var e = e || event;
      $('#ox').remove();
      $('#oy').remove();
      this.flag = 2;
      this.startX = e.pageX-this.left;
      this.startY = e.pageY-this.top;
      this.index++;
      this.rect = $("<div></div>");
      $(this.rect).attr("id",this.rectId+String(this.index));
      $(this.rect).css("position","absolute");
      $(this.rect).css("border","2px solid #fff");
      $(this.rect).css("z-index",111);
      $(this.rect).css("position","absolute");
      $(this.rect).css("left",this.startX);
      $(this.rect).css("top",this.startY);
      $(this.rect).css("width",'0px');
      $(this.rect).css("height",'0px');
      this.endX = 0;
      this.endY = 0;
    }
  }
  up(event:any){
    if(this.start&&!this.addMark){
      this.flag = 1;
      this.ox = $("<div id='ox'></div>");
      this.oy = $("<div id='oy'></div>");
      $(this.rect).css("left",this.rectLeft+'px');
      $(this.rect).css("top",this.rectTop+'px');
      $(this.rect).css("width",this.endX+'px');
      $(this.rect).css("height",this.endY+'px');
      this.show = true;
      this.markleft = this.rectLeft+this.left+this.endX;
      this.marktop = this.rectTop+this.top+this.endY;
/*      console.log(this.startX,this.startY);
      console.log(this.rectLeft+this.endX,this.rectTop+this.endY);*/
      if(this.diffX>0){
        this.xMax = this.startX;
        this.yMax = this.startY;
        this.xMin = this.startX-this.endX;
        this.yMin = this.startY-this.endY;
      }else{
        this.xMin = this.startX;
        this.yMin = this.startY;
        this.xMax = this.rectLeft+this.endX;
        this.yMax = this.rectTop+this.endY;
      }
      let nameArr:any[] = this.filePath[this.filePath.length-2].path1.split('/');
      let fileName = nameArr[nameArr.length-1];
      let imageArr:any[] = this.filePath[this.filePath.length-1].path1.split('/');
      let imageName = imageArr[imageArr.length-1];
      this.markImage = {
        "createPerson": this.username,
        "dataBase": this.dataName,
        "fileName": fileName,
        "imageDepth": 3,
        "imageHighth": this.endY,
        "imageName": imageName,
        "imagePath": this.filePath[this.filePath.length-1].path1,
        "imageWidth": this.endX,
        "markCoordinateSet":this.markCoordinateSet,
        "segmented": "0"
      }
      this.fileId = this.showPhoto.fileId;
      console.log(this.fileId);
      console.log(this.markImage);
      console.log(this.xMax,this.yMax,this.xMin,this.yMin);
    }
  }
  move(event:any){
    //console.log(this.flag);
    if(this.start&&!this.addMark){
      var e = e || event;
      if(this.flag==1){
        $('#ox').css('width','100%');
        $('#ox').css('height','2px');
        $('#ox').css('backgroundColor','#fff');
        $('#ox').css('position','absolute');
        $('#ox').css('z-index','100');
        $('#ox').css('left',0);
        $('#oy').css('width','2px');
        $('#oy').css('height',$("#content img").height());
        $('#oy').css('backgroundColor','#fff');
        $('#oy').css('position','absolute');
        $('#oy').css('z-index','100');
        $('#oy').css('top',0);
        $("#content").append(this.ox);
        $("#content").append(this.oy);
        var x = e.pageX-this.left;
        var y = e.pageY-this.top;
        $("#ox").css("top",y + 'px');
        $("#oy").css("left",x + 'px');
      }else if(this.flag==2){
        this.diffX = this.startX-(e.pageX-this.left);
        this.diffY = this.startY-(e.pageY-this.top);
        this.rectLeft = (this.startX-(e.pageX-this.left)>0?e.pageX-this.left:this.startX);
        this.rectTop = (this.startY-(e.pageY-this.top)>0?e.pageY-this.top:this.startY);
        this.endX = Math.abs(e.pageX-this.startX-this.left);
        this.endY = Math.abs(e.pageY-this.startY-this.top);
        $(this.rect).css("left",this.rectLeft+'px');
        $(this.rect).css("top",this.rectTop+'px');
        $(this.rect).css("width",this.endX+'px');
        $(this.rect).css("height",this.endY+'px');
        $("#content").append(this.rect);
      }
    }
  }
  load(){
    this.canvas=document.getElementById("canvas");
    this.img = document.getElementById("showImg");
    this.cxt = this.canvas.getContext("2d");
    //let a = this.getWH();
    this.canvas.width = parseInt($("#content").css("width"));
    this.canvas.height = parseInt($("#content").css("height"));
/*    console.log(this.canvas.width);
    console.log(this.canvas.height);*/
    this.cxt.drawImage(this.img,0,0,this.canvas.width,this.canvas.height);
    //this.img.crossOrigin = 'anonymous';
    //this.img.src = this.getSrc(this.showPhoto);
    //this.img.src = "assets/canvas/ww.jpg";
    this.imgData = this.cxt.getImageData(0,0,this.canvas.width,this.canvas.height);
    this.isGray = true;
    console.log(this.imgData);
    for(let i=0;i<this.imgData.data.length;i+=4){
      var R = this.imgData.data[i]; //R(0-255)
      var G = this.imgData.data[i+1]; //G(0-255)
      var B = this.imgData.data[i+2]; //G(0-255)
      var differ=Math.abs(R-G)<=this.differVal&&Math.abs(R-B)<=this.differVal&&Math.abs(B-G)<=this.differVal;
      if(R!=G||R!=B||G!=B){
        if(!differ){
          console.log(R,G,B,differ);
          this.isGray = false;
        }
      }
    }
    console.log(R,G,B);
    console.log(this.isGray);
    this.cxt.putImageData(this.imgData,0,0);
  }
  pre(){
    if(this.markPhoto.length==1||(this.showPhoto.fileId==this.markPhoto[0].fileId)){
      return false
    }else{
      if(sessionStorage.getItem("showPhotoIndex")){
        this.showPhotoIndex = Number(sessionStorage.getItem("showPhotoIndex"));
        this.showPhotoIndex--;
      }else{
        this.showPhotoIndex--;
      }
      sessionStorage.setItem("showPhotoIndex",String(this.showPhotoIndex));
      this.initDiv();
      //this.getMaxHeight();
    }
  }
  next(){
    console.log(this.showPhoto.fileId);
    console.log(this.markPhoto[this.markPhoto.length-1].fileId);
    if(this.markPhoto.length==1||(this.showPhoto.fileId==this.markPhoto[this.markPhoto.length-1].fileId)){
      return false
    }else{
      if(sessionStorage.getItem("showPhotoIndex")){
        this.showPhotoIndex = Number(sessionStorage.getItem("showPhotoIndex"));
        this.showPhotoIndex++;
      }else{
        this.showPhotoIndex++;
      }
      sessionStorage.setItem("showPhotoIndex",String(this.showPhotoIndex));

      this.initDiv();
      //this.getMaxHeight();
    }
  }
  initDiv(){
    $("#content").find("div").remove();
    this.showPhoto = this.markPhoto[this.showPhotoIndex];
    sessionStorage.setItem("showPhoto",JSON.stringify(this.showPhoto));
    this.filePath[this.filePath.length-1].path1 = this.showPhoto.path;
    let temp = this.showPhoto.path.split('/');
    this.filePath[this.filePath.length-1].showpath = temp[temp.length-1];
    this.path = this.filePath[this.filePath.length-1].path1;
    this.getSize(this.path);
  }
  getSrc(item){
    let path = item.path;
    return `${SERVER_URL}/download/${path.slice(26)}`;
  }
  getWH(){
    let imgWidth = $("#showImg").width();
    let height = $("#showImg").height();
/*    if(imgWidth>=width){
      $("#content").css("width",width-40+'px');
      $("#content").css("height",height+'px');
    }else{*/
    $("#content").css("width",imgWidth+'px');
    $("#content").css("height",height+'px');
    $("#showImg").css("left","0");
    //}
  }
  getMaxHeight(){
    let top = $("#mark-content").offset().top;
    let win_height = $(window).height();
    let width = $("#mark-content").width();
    let imgWidth = $("#showImg").width();
    console.log(imgWidth);
    if(imgWidth>=width){
      $("#showImg").css("width",width-40+'px');
      $("#showImg").css("left","20px");
      $("#showImg").css("max-height",win_height - top - 40 + 'px');
      //console.log(width-40);
/*      return {
        "width":width-40+'px',
        "left":"20px",
        "max-height": win_height - top - 40 + 'px',
      }*/
    }else{
      //console.log((width-imgWidth)/2);
      $("#showImg").css("left",(width-imgWidth)/2);
      $("#showImg").css("max-height",win_height - top - 40 + 'px');
/*      return {
        "left":(width-imgWidth)/2,
        "max-height": win_height - top - 40 + 'px',
      }*/
    }
    let imageHeight = $("#showImg").height();
    $("#content").css("width",imgWidth+'px');
    $("#content").css("height",imageHeight+'px');
    $("#showImg").css("left","0");
  }
}

