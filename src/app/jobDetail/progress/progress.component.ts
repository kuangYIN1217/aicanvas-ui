import {Component, EventEmitter, Input, Output} from "@angular/core";
import {WebSocketService} from "../../web-socket.service";
declare var $: any;

@Component({
  selector: 'ele-progress',
  styleUrls: ['./progress.component.css'],
  templateUrl: './progress.component.html',
  providers: [WebSocketService]
})
export class ProgressComponent {
  @Input() show: boolean = false;
  @Output() showChange: EventEmitter<any> = new EventEmitter();
  constructor (private webSocketService: WebSocketService) {

    /*this.webSocketService.connect().then(()=>{
      this.webSocketService.subscribe('/job/',(data)=>{
        console.log(data);
      });
    })*/

  }
  width: string = '32%';
  $hide_click() {
    this.show = false;
    this.showChange.emit(this.show);
  }

}
