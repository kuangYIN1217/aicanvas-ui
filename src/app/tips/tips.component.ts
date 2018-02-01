import { Component,Input, Output,EventEmitter} from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.css']
})
export class TipsComponent{
  @Input() title:string = '系统提示';
  @Input() content:string;
  @Input() show:boolean;
  @Output() showChange: EventEmitter<any> = new EventEmitter();
  deleted:number=0;
  constructor() {

  }
  cancel(){
    this.show = false;
    this.showChange.emit(this.show);
  }
}
