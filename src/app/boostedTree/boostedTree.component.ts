import {Component} from "@angular/core";
import {calc_height} from "../common/ts/calc_height";
declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'boostedTree',
  styleUrls: ['./boostedTree.component.css'],
  templateUrl: './boostedTree.component.html',
  providers: [],
})
export class BoostedTreeComponent{
  constructor(){
  }
  ngOnInit() {
    calc_height(document.getElementById("iframe"));
  }
}
