/**
 * Created by Administrator on 2017/7/21 0021.
 */
import {Component , Input} from "@angular/core";

@Component({
  selector: 'cpt-nodata',
  styleUrls: ['./nodata.component.css'],
  templateUrl: './nodata.component.html'
})
export class NodataComponent {
  @Input() colspan: number = 1;
  @Input() content: string = '暂时没有相关数据'
}
