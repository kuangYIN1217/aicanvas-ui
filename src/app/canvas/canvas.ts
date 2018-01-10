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
  constructor(private route: ActivatedRoute, private router: Router) {

  }
  enter(){
    console.log(1);
    //this.content.style.cursor='pointer';
    $("#content").css('cursor','crosshair');
    console.log($("#content").offset().top);
    console.log($("#content").offset().left);

  }
  move(event:any){
    let ox = $("<div id='ox'></div>");
    let oy = $("<div id='oy'></div>");
    $('#ox').css('width','100%');
    $('#ox').css('height','1px');
    $('#ox').css('backgroundColor','#ddd');
    $('#oy').css('width','1px');
    $('#oy').css('height','100%');
    $('#oy').css('backgroundColor','#ddd');
    $("#content").append($("#ox"));
    $("#content").append($("#oy"));
  }
  leave(){

  }
}
