import {Component, Input,Output,EventEmitter} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {calc_height} from "../../../common/ts/calc_height";
import {DatasetsService} from "../../../common/services/datasets.service";
declare var $: any;
@Component({
  selector: 'add-mark',
  styleUrls: ['./addmark.css'],
  templateUrl: './addmark.html',
  providers: [DatasetsService]
})
export class AddMarkComponent{
  @Input() markleft:number;
  @Input() marktop:number;
  @Input() markImage:any;
  @Input() markName:string='';
  @Input() xMax:number;
  @Input() yMax:number;
  @Input() xMin:number;
  @Input() yMin:number;
  @Input() fileId:number;
  @Input() coordinateId:number;
  @Input() singleDiv:any;
  @Input() dataId:number;
  mx:number;
  my:number;
  dx:number;
  dy:number;
  isDraging:boolean = false;
  topTag:any[]=[];
  markCoordinateSet1:any[]=[];
  obj:any={};
  username:string;
  @Output() showChange: EventEmitter<any> = new EventEmitter();
  @Output() markCoordinateSetChange: EventEmitter<any> = new EventEmitter();
  @Output() imagePathChange: EventEmitter<any> = new EventEmitter();
  xmlPath:any[]=[];
  tip:boolean = false;
  constructor(private datasetservice: DatasetsService){
    this.username = localStorage['username'];
    this.datasetservice.getHistoryTag(this.username)
      .subscribe(result=>{
        if(result.length>0){
          this.topTag = result;
        }
        console.log(this.topTag);
      })
  }
  ngOnChanges(...args: any[]) {
    console.log(this.coordinateId);
    console.log(this.markName);
  }
  markdown(event:any){
    this.isDraging = true;
    var e = e || event;
    this.mx = e.pageX;
    this.my = e.pageY;
    this.dx = $(".add_mark").offset().left;
    this.dy = $(".add_mark").offset().top;
  }
  markmove(event:any) {
    var e = e || window.event;
    let x = e.pageX;      //移动时鼠标X坐标
    let y = e.pageY;      //移动时鼠标Y坐标
    if (this.isDraging) {        //判断对话框能否拖动
      let moveX = this.dx + x - this.mx;      //移动后对话框新的left值
      let moveY = this.dy + y - this.my;      //移动后对话框新的top值
      $(".add_mark").css("left", moveX + 'px');       //重新设置对话框的left
      $(".add_mark").css("top", moveY + 'px');     //重新设置对话框的top
    }
  }
  markup(event:any){
    this.isDraging = false;
  }
  ngOnInit(){

  }
  close(){
    if(this.coordinateId==0){
      this.showChange.emit('false');
    }else{
      this.showChange.emit('true');
    }
  }
  choose(item){
    console.log(item.markName);
    if(this.singleDiv&&this.singleDiv!=''){
      this.singleDiv.markName = item.markName;
    }else{
      this.obj.markName = item.markName;
    }
    this.setXML();
  }
  isName(){
    if(this.markName==''){
      this.tip = true;
    }else{
      this.tip = false;
    }
  }
  sure(){
    if(this.markName==''){
      this.tip = true;
      return false;
    }else{
      this.tip = false;
      if(this.singleDiv&&this.singleDiv!=''){
        this.singleDiv.markName = this.markName;
      }else{
      this.obj.markName = this.markName;
      }
      this.setXML();
    }
  }
  setXML(){
    if(this.coordinateId==0){
      this.markCoordinateSet1 = this.markImage.markCoordinateSet;
      this.obj.createPerson = this.username;
      this.obj.xMax = this.xMax;
      this.obj.yMax = this.yMax;
      this.obj.xMin = this.xMin;
      this.obj.yMin = this.yMin;
      this.markCoordinateSet1.push(this.obj);
      this.markImage.markCoordinateSet = this.markCoordinateSet1;
      //console.log(this.markCoordinateSet1);
      //console.log(this.markImage);
      this.datasetservice.mark(this.markImage)
        .subscribe(result=>{
          console.log(result);
          this.setSign();
          this.xmlPath.push(result.xmlPath);
          this.createXML(this.xmlPath,this.dataId);
          this.markCoordinateSetChange.emit(this.markCoordinateSet1);
          this.imagePathChange.emit(this.markImage.imagePath);
          this.showChange.emit('true');
          //console.log(result);
        })
    }else{
      //console.log(this.markImage);
      this.markCoordinateSet1 = this.singleDiv;
      this.datasetservice.updateMark(this.singleDiv)
        .subscribe(result=>{
          this.setSign();
          this.xmlPath.push(result.xmlPath);
          this.createXML(this.xmlPath,this.dataId);
          this.markCoordinateSetChange.emit(this.markCoordinateSet1);
          this.imagePathChange.emit(this.markImage.imagePath);
          this.showChange.emit('true');
          console.log(result);
        })
    }

  }
  createXML(arr,dataId){
    this.datasetservice.createXML(arr,dataId)
      .subscribe(result=>{
        console.log(result);
      })
  }
  setSign(){
    this.datasetservice.setSign(this.fileId)
      .subscribe(result=>{
        console.log(result);
      })
  }
}
