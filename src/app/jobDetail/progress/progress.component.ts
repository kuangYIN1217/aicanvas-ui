import {Component, EventEmitter, Input, Output} from "@angular/core";
declare var $: any;

@Component({
  selector: 'ele-progress',
  styleUrls: ['./progress.component.css'],
  templateUrl: './progress.component.html'
})
export class ProgressComponent {
  @Input() show: boolean = false;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() log: any = {
    percent: 0,
    step: '正在初始化'
  };
  @Input() logs: any = [];

  $hide_click() {
    this.close.emit();
  }
  getPercent() {
    if (this.log.percent == 1) {
      this.$hide_click();
      return;
    }
    return Math.floor(this.log.percent * 100);
  }
}
