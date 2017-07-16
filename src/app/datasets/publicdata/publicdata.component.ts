/**
 * Created by Administrator on 2017/7/12 0012.
 */
import {Component, Input} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
import {calc_size} from '../calc-size'
@Component({
  selector: 'cpt-publicdata',
  styleUrls: ['./publicdata.component.css'],
  templateUrl: './publicdata.component.html',
  providers: [DatasetsService]
})
export class PublicDataComponent{
  @Input() d_tableData: any = [];
  constructor (private datasetservice: DatasetsService) {
    // 获取datasetType
  }
  calc_size = calc_size;
}
