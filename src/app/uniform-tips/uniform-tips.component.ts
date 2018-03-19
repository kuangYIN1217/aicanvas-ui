import { Component, OnInit,Input,Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'uniform-tips',
  templateUrl: './uniform-tips.component.html',
  styleUrls: ['./uniform-tips.component.css']
})
export class UniformTipsComponent{
@Input() tipType:string='';
@Input() tipContent:any;
@Input() tipWidth:string='';
@Input() content:string='';
@Input() tipMargin:string='';
@Output() showTipChange: EventEmitter<any> = new EventEmitter();
  constructor() { }
  ngOnChanges(...args: any[]) {
    if(this.tipType=='warnning'){
      setTimeout(()=>{
        this.showTipChange.emit(false);
      },3000)
    }
  }
  ngStyle() {
    if (this.tipType == 'success') {
      return {
        margin:this.tipMargin,
        width:this.tipWidth,
        background: '#c3eee0',
        border: '1px solid #52a683'
      }
    } else if (this.tipType == 'warnning'){
      return {
        margin:this.tipMargin,
        width:this.tipWidth,
        background: '#fbf0e5',
        border: '1px solid #f3ad5f'
      }
    }else if (this.tipType == 'error'){
      return {
        margin:this.tipMargin,
        width:this.tipWidth,
        background: '#f9e8e4',
        border: '1px solid #ee8059'
      }
    }
  }
  getTipType(){
    if(this.tipType=='success'){
      return 'assets/uniform-tips/queren.png'
    }else if(this.tipType=='warnning'){
      return 'assets/uniform-tips/tishi.png'
    }else if(this.tipType=='error'){
      return 'assets/uniform-tips/cuowu.png'
    }
  }
  close(){
    this.showTipChange.emit(false);
  }
}