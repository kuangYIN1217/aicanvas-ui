/**
 * Created by Administrator on 2017/7/12 0012.
 */
import {Component, Input} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
import {calc_size} from '../calc-size';
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'cpt-publicdata',
  styleUrls: ['./publicdata.component.css'],
  templateUrl: './publicdata.component.html',
  providers: [DatasetsService]
})
export class PublicDataComponent{
  @Input() d_tableData: any = [];
  look_detail:boolean = false;
  dataList:any={};
  constructor (private datasetservice: DatasetsService,private route: ActivatedRoute ,private router: Router) {
    // 获取datasetType
  }
  look_dataSet(item){
    this.router.navigate(['../publicdataset'],{queryParams:{"dataId":item.dataId,"parentPath":item.dataPath,"dataset":true}});
/*    this.look_detail = true;
    this.dataList = item;*/
  }
  calc_size = calc_size;
}
