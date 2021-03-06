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

  ngStyle() {
    if (this.level == 'error') {
      return {
        background: '#f9e8e4',
        border: '1px solid #ee8059'
      }
    } else {
      return {
        background: '#fcdbca',
        border: 'border: 1px solid #ff7c35'
      }
    }
  }
}
