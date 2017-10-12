/**
 * Created by Administrator on 2017/7/12 0012.
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
import {calc_size} from '../calc-size'
import {JobService} from "../../common/services/job.service";
import {ToastyService} from "ng2-toasty";
import {addErrorToast} from "../../common/ts/toast";
@Component({
  selector: 'cpt-mydata',
  styleUrls: ['./mydata.component.css'],
  templateUrl: './mydata.component.html',
  providers: [DatasetsService,JobService]
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
  @Input() s_totalNum: any;
  @Output() s_totalNumChange: EventEmitter<any> = new EventEmitter();
  @Output() s_sizeChange: EventEmitter<any> = new EventEmitter();
  s_remove_index;
  s_remove_id;
  s_remove: boolean = false;
  look_detail:boolean = false;
  dataList:any={};
  constructor (private datasetservice: DatasetsService,private jobService: JobService,private toastyService:ToastyService) {
    // 获取datasetType
    /*this.datasetservice.getDataSets(null , null , null , null, 1 , 10 ).subscribe(rep =>{
      console.log(rep);
    })*/
  }
  $remove_dataSet(id , index) {
    //console.log(this.s_totalNum);
    this.jobService.deletaDate(id).subscribe(data=>{
      if(data.length==0){
        console.log('delete');
        this.s_remove = true;
        this.s_remove_id = id;
        this.s_remove_index = index;
      }else{
        addErrorToast(this.toastyService, '该数据集下有挂载任务，不能删除！');
      }
    });
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
    this.datasetservice.getDataSets(localStorage['username'] , this.dataSetType , this.s_select_name , this.s_sort_type, this.s_page , this.s_size ).subscribe(rep =>{
      this.d_tableData = rep.content;
      //console.log(this.d_tableData)
      this.d_tableDataChange.emit(this.d_tableData);
    })
  }
  calc_size = calc_size;

  $confirm_sure () {
    this.datasetservice.deleteDataSet(this.s_remove_id).subscribe(rep => {
      if (rep.ok) {
        this.datasetservice.getDataSets(localStorage['username'] , this.dataSetType , this.s_select_name , this.s_sort_type, this.s_page , this.s_size ).subscribe(rep =>{
          this.s_totalNum = rep.totalElements;
          this.s_size = rep.size;
        });
        this.s_totalNumChange.emit(this.s_totalNum);
        this.s_sizeChange.emit(this.s_size);
        this.d_tableData.splice(this.s_remove_index , 1);
        this.d_tableDataChange.emit(this.d_tableData);
      }
    })
    this.s_remove = false;
  }
  $confirm_cancel() {
    this.s_remove = false;
  }
  look_dataSet(item){
    this.look_detail = true;
    this.dataList = item;
  }
}
