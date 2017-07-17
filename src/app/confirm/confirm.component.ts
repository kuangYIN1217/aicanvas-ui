/**
 * Created by Administrator on 2017/7/17 0017.
 */
import {Component, Input, Output , EventEmitter} from '@angular/core';

@Component({
  selector: 'ele-confirm',
  styleUrls: ['./confirm.component.css'],
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent{
  @Input() show: boolean = false;
  @Output() showChange: EventEmitter<any> = new EventEmitter();
}





