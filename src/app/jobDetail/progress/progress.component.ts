import {Component, EventEmitter, Input, Output} from "@angular/core";
declare var $: any;

@Component({
  selector: 'ele-progress',
  styleUrls: ['./progress.component.css'],
  templateUrl: './progress.component.html'
})
export class ProgressComponent {
  @Input() show: boolean = false;
  @Output() showChange: EventEmitter<any> = new EventEmitter();
  @Input() log: any = {
    percent: 0,
    step: '正在初始化'
  };
  @Output() logChange: EventEmitter<any> = new EventEmitter();
  @Input() logs: any = [];

  /*ngAfterViewChecked() {
    alert(this.log)
    if (this.log.percent == 1) {
      this.$hide_click();
    }
  }*/
  $hide_click() {
    this.show = false;
    this.showChange.emit(this.show);
  }
  getPercent() {
    let $this = this;
    if (this.log.percent == 1) {
      setTimeout(function () {
        $this.$hide_click();
        this.logs = [];
        this.log = {}
        // this.logChange.emit(this.log);
      } , 1000);
    }
    return Math.floor(this.log.percent * 100);
  }
}
