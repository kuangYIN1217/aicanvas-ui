import {Component,Input,Output,EventEmitter} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {calc_height} from "../common/ts/calc_height";
@Component({
  moduleId: module.id,
  selector: 'publish-model',
  styleUrls: ['./css/publishmodel.component.css'],
  templateUrl: './template/publishmodel.html',
  providers: [],
})
export class PublishModelComponent{
  @Input() showModel:boolean;
  @Input() publishStatus:string;
  @Input() errorInfo:string;
  @Output() showModelChange: EventEmitter<any> = new EventEmitter();
  constructor(private route: ActivatedRoute, private router: Router) {

  }
  close(){
    this.showModel = false;
    this.showModelChange.emit(this.showModel);
  }
  // ngOnInit() {
  //   calc_height(document.getElementById('api-field'));
  // }
}
