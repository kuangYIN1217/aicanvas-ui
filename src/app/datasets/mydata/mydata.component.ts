/**
 * Created by Administrator on 2017/7/12 0012.
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
import {calc_size} from '../calc-size'
@Component({
  selector: 'cpt-mydata',
  styleUrls: ['./mydata.component.css'],
  templateUrl: './mydata.component.html',
  providers: [DatasetsService]
})
export class MyDataComponent{
  @Input() s_sort_type: any;
  @Output() s_sort_typeChange: EventEmitter<any> = new EventEmitter();
  @Input() d_tableData: any = [];
  @Output() d_tableDataChange: EventEmitter<any> = new EventEmitter();

  @Input() dataSetType: any;
  @Input() s_select_datasetType: any = 'all'; // type
  @Input() s_select_name: any = ''; // name
  @Input() s_page: any;
  @Input() s_size: any;
  constructor (private datasetservice: DatasetsService) {
    // 获取datasetType
    /*this.datasetservice.getDataSets(null , null , null , null, 1 , 10 ).subscribe(rep =>{
      console.log(rep);
    })*/
  }

  $remove_dataSet(id , index) {
    this.datasetservice.deleteDataSet(id).subscribe(rep => {
      if (rep.ok) {
        this.d_tableData.splice(index , 1);
        this.d_tableDataChange.emit(this.d_tableData);
      }
    })
  }

  $sort_click () {
    console.log('click sort')
    if (this.s_sort_type === 'createTime,asc') {
      this.s_sort_type = 'createTime,desc'
    } else {
      this.s_sort_type = 'createTime,asc'
    }
    this.s_sort_typeChange.emit(this.s_sort_type);
    // 重新获取数据
    this.datasetservice.getDataSets(sessionStorage['username'] , this.dataSetType , this.s_select_name , this.s_sort_type, this.s_page , this.s_size ).subscribe(rep =>{
      this.d_tableData = rep.content;
      console.log(this.d_tableData)
      this.d_tableDataChange.emit(this.d_tableData);
    })
  }
  calc_size = calc_size;
}
