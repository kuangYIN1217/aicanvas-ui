/**
 * Created by Administrator on 2017/7/17 0017.
 */

/* confirm 确认弹出框*/
import {Component, Input, Output , EventEmitter} from '@angular/core';
import {SceneService} from "../../common/services/scene.service";

@Component({
  selector: 'del-confirm',
  styleUrls: ['./delConfirm.component.css'],
  templateUrl: './delConfirm.component.html',
  providers: [SceneService]
})
export class DelConfirmComponent{
  @Input() title: string = '消息提示';
  @Input() content: string = 'what do you want to do?';
  @Input() show: boolean = false;
  @Input() deleteId: number;
  @Output() showChange: EventEmitter<any> = new EventEmitter();

  @Output() sure: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  constructor(private sceneService:SceneService ){
    window.scrollTo(0,0);
  }
  ngOnChanges(...args: any[]) {

  }
  $hide_click () {
    this.show = false;
    // this.once_click = false;
    this.showChange.emit(this.show);
  }
  $cancel_click() {
    this.cancel.emit();
  }

  $sure_click(id) {
    this.sceneService.deleteScene(id)
      .subscribe(result=>{
        this.sure.emit();
      })
  }
}





