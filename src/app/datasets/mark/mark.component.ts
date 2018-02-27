/**
 * Created by Administrator on 2017/7/12 0012.
 */
import {Component, EventEmitter, Input, Output,ViewChild} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
import {calc_height} from '../../common/ts/calc_height'
import {SERVER_URL} from "../../app.constants";
import {ActivatedRoute, Router} from "@angular/router";
import { Observable } from 'rxjs';
declare var $:any;
declare var jQuery:any;
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
  realWidth:number;
  realHeight:number;
  image:any;
  proportion:number;
  bool:boolean = false;
  sign:boolean = false;
  parentPath:string;
  constructor(private datasetservice: DatasetsService,private route: ActivatedRoute, private router: Router){
    this.username = localStorage['username'];
    this.dataName = sessionStorage.getItem("dataName");
    //console.log(this);
    //console.log(this.dataName);
  }
  home(){
    this.router.navigate(['../datasets']);
  }
  ngOnInit(){
    calc_height(document.getElementById('mark-content'));
    this.route.queryParams.subscribe(params => {
      //$("#content").find("div").remove();
      this.dataId = params['dataId'];
      this.filePath = JSON.parse(params['filePath']);
      this.markPhoto = JSON.parse(params['markPhoto']);
      console.log(this.markPhoto);
      if(sessionStorage.getItem("showPhoto")){
        this.showPhoto = JSON.parse(sessionStorage.getItem("showPhoto"));
      }else{
        this.showPhoto = this.markPhoto[0];
      }
      this.fileId = this.showPhoto.fileId;
      this.parentPath = this.showPhoto.dataSetFileDirectoryPath.parentPath;
      sessionStorage.setItem("showPhoto",JSON.stringify(this.showPhoto));
      this.addPhotoPath();
      this.path = this.filePath[this.filePath.length-1].path1;
      this.fileId = this.showPhoto.fileId;
      this.getSize(this.fileId);
    });
    Observable.fromEvent(window, 'resize')
      // .debounceTime(100) // 以免频繁处理
      .subscribe((event) => {
        // 这里处理页面变化时的操作
        //let bool:boolean = false;
        $("#mark-content").css("min-height","auto");
        if(this.bool){
          let divHeight = parseFloat($("#content").height());
          let divWidth = parseFloat($("#content").width());
          //console.log(window.innerHeight-240);
          $("#mark-content").css("height",(window.innerHeight-240)+'px');
          let boxh = window.innerHeight-280;
          let boxw = parseFloat($("#content").width());
          let width1 = parseFloat($("#showImg").width());
          let height1 = parseFloat($("#showImg").height());
          let proportion = width1/height1;

          if(Math.abs(height1-divHeight)<4){
            $("#markDiv").css("height",boxh+'px');
            $("#markDiv").css("width",parseFloat($("#markDiv").height())*proportion+'px');
            $("#showImg").css("height",boxh+'px');
            $("#showImg").css("width",parseFloat($("#markDiv").height())*proportion+'px');
            $("#markDiv").css("left","0px");
            $("#markDiv").css("right","0px");
            $("#showImg").css("left","0px");
            $("#showImg").css("right","0px");
            let widthRadio = width1/(parseFloat($("#markDiv").height())*proportion);
            let heightRadio = height1/boxh;
            this.drawDiv(width1,height1,widthRadio,heightRadio,boxh,proportion);
          }else if(Math.abs(width1-divWidth)<4){
            $("#markDiv").css("width",$("#content").width());
            $("#markDiv").css("height",parseFloat($("#content").width())/proportion+'px');
            $("#showImg").css("width",$("#content").width());
            $("#showImg").css("height",parseFloat($("#content").width())/proportion+'px');
            $("#markDiv").css("top","0px");
            $("#markDiv").css("bottom","0px");
            $("#showImg").css("top","0px");
            $("#showImg").css("bottom","0px");
            let widthRadio = width1/(parseFloat($("#content").width()));
            let heightRadio = height1/(parseFloat($("#content").width())/proportion);
            this.drawDiv(width1,height1,widthRadio,heightRadio,boxh,proportion);
          }
          this.bool = false;
        }else{
          this.bool = true;
        }
      });
  }
  drawDiv(width1,height1,widthRadio,heightRadio,boxh,proportion){
    if(typeof this.markImage.markCoordinateSet!="number"){
      for(let i=0;i<this.markImage.markCoordinateSet.length;i++){
        let rectedId = $("#rectedId"+i);
        if(rectedId.length>0){
          let width = parseFloat(rectedId.width());
          let height = parseFloat(rectedId.height());
          let top = parseFloat(rectedId.css("top"));
          let left = parseFloat(rectedId.css("left"));
          let topRadio = top/width1;
          let leftRadio = left/height1;
          rectedId.css("width",width/widthRadio+'px');
          rectedId.css("height",height/heightRadio+'px');
          rectedId.css("top",topRadio*boxh+'px');
          rectedId.css("left",leftRadio*parseFloat($("#markDiv").height())*proportion+'px');
        }
      }
    }
  }
  getSize(fileId){
    this.datasetservice.getMarkInfo(fileId)
      .subscribe(result=>{
        if(result==1){
          this.sign = false;
        }else{
          this.sign = true;
          this.markImage = result;
          $("#markDiv").css("width",result.showWidth);
          $("#markDiv").css("height",result.showHigth);
          this.proportion = result.showWidth/result.showHigth;
          if(parseInt(result.showWidth)>parseInt(result.showHigth)){
            $("#markDiv").css("top","0");
            $("#markDiv").css("bottom","0");
          }else if(parseInt(result.showWidth)<=parseInt(result.showHigth)){
            $("#markDiv").css("left","0");
            $("#markDiv").css("right","0");
          }
          this.markCoordinateSet = result.markCoordinateSet;
          this.draw(result.markCoordinateSet);
        }
      })
  }
  draw(arr){
    //$("#content").find("div").not("#markDiv").remove();
    $("#markDiv").find("div").remove();
    let $this = this;
    this.top = $("#markDiv").offset().top;
    this.left = $("#markDiv").offset().left;
    $("#showImg").css("height",$("#markDiv").height());
    $("#showImg").css("width",$("#markDiv").width());
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
      $(image).attr("src","assets/datasets/file/delete-mark.png");
      $(image).css("position","absolute");
      $(image).css("z-index",112);
      $(image).css("right","-13px");
      $(image).css("top","-13px");
      $(image).css("cursor","pointer");
      $(image).css("display","none");
      $(this.rected).append(image);
      $("#markDiv").append(this.rected);
      (function(index) {
        $("#rectedId"+index).click(function(){
          if(!$this.start){
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
          }
        });
        $("#rectedId"+index).mouseenter(function(){
          if(!$this.start){
            $("#imageId"+index).css("display","block");
          }
        });
        $("#rectedId"+index).mouseleave(function(){
          if(!$this.start){
            $("#imageId"+index).css("display","none");
          }
        });
        $("#imageId"+index).click(function(e:any){
          let oev = e || event;
          oev.preventDefault();
          oev.stopPropagation();
          $this.datasetservice.deleteMark(arr[index],$this.dataId,$this.fileId)
            .subscribe(result=>{
              //console.log(result);
              $("#rectedId"+index).remove();
              $this.getSize($this.fileId);
            })
        });
      })(i);
    }
  }
  ngOnDestroy(){
    sessionStorage.removeItem('showPhoto');
    sessionStorage.removeItem("showPhotoIndex");
  }
  imagePathChange(event:any){
    console.log(event);
    $("#markDiv").find("div").remove();
    this.getSize(event);
  }
  search(index){
    if(index!=this.filePath.length-1){
      let filePath = this.filePath.slice(0,index+1);
      this.router.navigate(['../enterdataset'],{queryParams:{"parentPath":this.filePath[index].path1,"dataId":this.dataId,"filePath":JSON.stringify(filePath),"dataset":true}});
    }else{
      return false;
    }
  }
  addPhotoPath(){
    // let path = this.showPhoto.path.split('/');
    let obj:any={};
    obj.path1 = this.showPhoto.dataSetFileDirectoryPath.parentPath+"/"+this.showPhoto.fileName;
    obj.showpath = this.showPhoto.fileName;
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
  markCoordinateSetChange(event:any){
    console.log(event);
    this.markCoordinateSet = event;
  }
  startMark(){
    this.start = true;
    this.load();
  }
  enter(){
    if(this.start){
      $("#content").css('cursor','crosshair');
      this.ox = $("<div id='ox'></div>");
      this.oy = $("<div id='oy'></div>");
      this.top = $("#markDiv").offset().top;
      this.left = $("#markDiv").offset().left;
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
      let isGray:number;
      if(this.isGray){
        isGray = 1;
      }else{
        isGray = 3;
      }
      this.markImage = {
        "createPerson": this.username,
        "dataBase": this.dataName,
        "fileName": fileName,
        "imageDepth": isGray,
        "imageFileId":this.fileId,
        "imageHighth": $("#img").width(),
        "imageName": imageName,
        "imagePath": this.filePath[this.filePath.length-1].path1,
        "imageWidth": $("#img").width(),
        "markCoordinateSet":this.markCoordinateSet,
        "segmented": "0",
        "showHigth": $("#markDiv").height(),
        "showWidth": $("#markDiv").width()
      }
      this.fileId = this.showPhoto.fileId;
      this.markName = '';
      this.singleDiv = '';
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
        $('#oy').css('height',$("#markDiv img").height());
        $('#oy').css('backgroundColor','#fff');
        $('#oy').css('position','absolute');
        $('#oy').css('z-index','100');
        $('#oy').css('top',0);
        $("#markDiv").append(this.ox);
        $("#markDiv").append(this.oy);
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
        $("#markDiv").append(this.rect);
      }
    }
  }
  load(){
    this.canvas=document.getElementById("canvas");
    this.img = document.getElementById("showImg");
    this.cxt = this.canvas.getContext("2d");
    let $this = this;
    this.img.onload = function(e) {
      $this.cxt.drawImage($this.img, 0, 0,500,300);
      $this.imgData = $this.cxt.getImageData(0,0,500,300);
      $this.isGray = true;
      for(let i=0;i<$this.imgData.data.length;i+=4){
        var R = $this.imgData.data[i]; //R(0-255)
        var G = $this.imgData.data[i+1]; //G(0-255)
        var B = $this.imgData.data[i+2]; //G(0-255)
        var differ=Math.abs(R-G)<=$this.differVal&&Math.abs(R-B)<=$this.differVal&&Math.abs(B-G)<=$this.differVal;
        if(R!=G||R!=B||G!=B){
          if(!differ){
            $this.isGray = false;
          }
        }
      }
      //console.log(R,G,B);
      console.log($this.isGray);
      $this.cxt.putImageData($this.imgData,0,0);
    };
    this.img.crossOrigin = 'anonymous';
    this.img.src = `${SERVER_URL}/download/${(this.showPhoto.dataSetFileDirectoryPath.parentPath+"/"+this.showPhoto.fileName).slice(26)}`;
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
      this.markCoordinateSet = [];
      sessionStorage.setItem("showPhotoIndex",String(this.showPhotoIndex));
      $("#img").remove();
      this.initDiv();
      //this.getMaxHeight();
    }
  }
  next(){
    if(this.markPhoto.length==1||(this.showPhoto.fileId==this.markPhoto[this.markPhoto.length-1].fileId)){
      return false
    }else{
      if(sessionStorage.getItem("showPhotoIndex")){
        this.showPhotoIndex = Number(sessionStorage.getItem("showPhotoIndex"));
        this.showPhotoIndex++;
      }else{
        this.showPhotoIndex++;
      }
      this.markCoordinateSet = [];
      sessionStorage.setItem("showPhotoIndex",String(this.showPhotoIndex));
      $("#img").remove();
      this.initDiv();
    }
  }
  initDiv(){
    $("#markDiv").find("div").remove();
    this.showPhoto = this.markPhoto[this.showPhotoIndex];
    this.fileId = this.showPhoto.fileId;
    this.parentPath = this.showPhoto.dataSetFileDirectoryPath.parentPath;
    sessionStorage.setItem("showPhoto",JSON.stringify(this.showPhoto));
    //console.log(this.showPhoto);
    this.filePath[this.filePath.length-1].path1 = this.showPhoto.dataSetFileDirectoryPath.parentPath+"/"+this.showPhoto.fileName;
    //let temp = this.showPhoto.path.split('/');
    this.filePath[this.filePath.length-1].showpath = this.showPhoto.fileName;
    this.path = this.filePath[this.filePath.length-1].path1;
    this.getSize(this.fileId);
  }
  getSrc(item){
    let path = item.dataSetFileDirectoryPath.parentPath+"/"+item.fileName;
    console.log(path);
    return `${SERVER_URL}/download/${path.slice(26)}`;
  }
  getMarkDiv(){
    let height = $("#mark-content").height();
    let width = $("#mark-content").width();
    return{
      "height":parseInt(height)-40+'px',
      "width":parseInt(width)-40+'px'
    }
  }
  loadImg(){
    if(!this.sign){
      let widthD = $("#content").width();
      let heightD = $("#content").height();
      let proportion:number;
      let widthI:string;
      let heightI:string;
      widthI=$("#img").width();
      heightI=$("#img").height();
      proportion = parseInt(widthI)/parseInt(heightI);
      if(parseInt(widthI)>parseInt(heightI)){
        $("#showImg").css("width",widthD);
        $("#showImg").css("height",parseInt(widthD)/proportion);
        if(parseInt($("#showImg").height())>parseInt(heightD)){
          $("#showImg").css("height",heightD);
          $("#showImg").css("width",proportion*parseInt(heightD));
          $("#markDiv").css("left","0");
          $("#markDiv").css("right","0");
          $("#markDiv").css("left","0");
          $("#markDiv").css("right","0");
        }else{
          $("#markDiv").css("top","0");
          $("#markDiv").css("bottom","0");
          $("#markDiv").css("top","0");
          $("#markDiv").css("bottom","0");
        }
      }else if(parseInt(widthI)<=parseInt(heightI)){
        $("#showImg").css("height",heightD);
        $("#showImg").css("width",proportion*parseInt(heightD));
        if(parseInt($("#showImg").width())>parseInt(widthD)){
          $("#showImg").css("width",widthD);
          $("#showImg").css("height",parseInt(widthD)/proportion);
          $("#markDiv").css("top","0");
          $("#markDiv").css("bottom","0");
          $("#markDiv").css("top","0");
          $("#markDiv").css("bottom","0");
        }else{
          $("#markDiv").css("left","0");
          $("#markDiv").css("right","0");
          $("#markDiv").css("left","0");
          $("#markDiv").css("right","0");
        }
      }
      $("#markDiv").css("width",$("#showImg").width());
      $("#markDiv").css("height",$("#showImg").height());
    }
  }
  getMaxHeight(){
    if($("#img").length>0){
      return
    }else{
      let imgObj = new Image();
      imgObj.src = $("#showImg").attr("src");
      imgObj.id = "img";
      $("#content").append(imgObj);
      imgObj.addEventListener("load",this.loadImg);
      $("#img").css("display","none");
    }
  }
  filterName(name){
    if(name.match(/^\d{13}_/)){
      return name.substring(14);
    }else{
      return name;
    }
  }
}

