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
  @Output() deleteChange: EventEmitter<any> = new EventEmitter();
  delete:boolean = false;
  constructor() {

  }
  sure(){
    this.show = false;
    this.deleteChange.emit(true);
    this.showChange.emit(this.show);
  }
  cancel(){
    this.show = false;
    this.showChange.emit(this.show);
  }
}
