/**
 * Created by Administrator on 2017/7/17 0017.
 */

/* confirm 确认弹出框*/
import {Component, Input, Output , EventEmitter} from '@angular/core';

@Component({
  selector: 'ele-confirm',
  styleUrls: ['./confirm.component.css'],
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent{
  @Input() title: string = '消息提示';
  @Input() content: string = 'what do you want to do?';
  @Input() show: boolean = false;
  @Output() showChange: EventEmitter<any> = new EventEmitter();

  @Output() sure: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  $hide_click () {
    this.show = false;
    // this.once_click = false;
    this.showChange.emit(this.show);
  }

  $cancel_click() {
    this.cancel.emit();
  }

  $sure_click() {
    this.sure.emit();
  }
}





