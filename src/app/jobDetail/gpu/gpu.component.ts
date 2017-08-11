/**
 * Created by Administrator on 2017/7/17 0017.
 */

/* confirm 确认弹出框*/
import {Component, Input, Output , EventEmitter} from '@angular/core';

@Component({
  selector: 'app-gpu',
  styleUrls: ['./css/gpu.component.css'],
  templateUrl: './templates/gpu.html'
})
export class GpuComponent{
  gpuNum:number;
  @Input() show: boolean = false;
  @Output() showChange: EventEmitter<any> = new EventEmitter();

  @Output() sure: EventEmitter<number> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  $hide_click () {
    this.show = false;
    // this.once_click = false;
    this.showChange.emit(this.show);
  }

  cancelClick() {
    this.show = false;
    this.showChange.emit(this.show);
  }
  sureClick() {
    this.show = false;
    this.showChange.emit(this.show);
    this.sure.emit(this.gpuNum);
  }
}






