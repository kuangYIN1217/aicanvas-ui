/**
 * Created by Administrator on 2017/7/20 0020.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'cpt-error',
  styleUrls: ['./error.component.css'],
  templateUrl: './error.component.html'
})
export class ErrorComponent {
  @Input() show: boolean = false;
  @Input() level: any = 'error';
  @Input() message: any = '提示信息';
}
