import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {calc_height} from "app/common/ts/calc_height";
declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'app-canvas',
  styleUrls: ['./canvas.css'],
  templateUrl: './canvas.html',
  providers: [],
})
export class CanvasComponent{
  @ViewChild('content') content;
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
  constructor(private route: ActivatedRoute, private router: Router){
  }
  startMark(){
    this.start = true;
  }
  enter(){
    $("#content").css('cursor','crosshair');
    this.ox = $("<div id='ox'></div>");
    this.oy = $("<div id='oy'></div>");
    this.top = $("#content").offset().top;
    this.left = $("#content").offset().left;
    console.log(this.top);
    console.log(this.left);
  }
  move(event:any){
    //console.log(this.flag);
    var e = e || event;
    if(this.flag==1){
      $('#ox').css('width','100%');
      $('#ox').css('height','1px');
      $('#ox').css('backgroundColor','#fff');
      $('#ox').css('position','absolute');
      $('#ox').css('z-index','100');
      $('#ox').css('left',0);
      $('#oy').css('width','1px');
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
  leave(){
    $('#ox').remove();
    $('#oy').remove();
  }
  down(event:any){
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
    $(this.rect).css("border","1px solid red");
    $(this.rect).css("z-index",111);
    $(this.rect).css("position","absolute");
    $(this.rect).css("left",this.startX);
    $(this.rect).css("top",this.startY);
    $(this.rect).css("width",'0px');
    $(this.rect).css("height",'0px');
    this.endX = 0;
    this.endY = 0;

  }
  up(event:any){
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
    console.log(this.markleft,this.marktop);
  }
}
