import {Component,Input,Output,EventEmitter} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'app-text',
  styleUrls: ['./css/showTxt.component.css'],
  templateUrl: './templates/showTxt.html',
  providers: []
})
export class ShowTxtComponent{
  @Input() txtShow:boolean;
  @Input() txtContent:string;
  @Output() txtShowChange: EventEmitter<any> = new EventEmitter();
  constructor(){

  }
  ngOnChanges(...args: any[]) {
    console.log(this.txtShow);
  }
  close(){
    this.txtShow = false;
    this.txtShowChange.emit(this.txtShow);
  }
}
