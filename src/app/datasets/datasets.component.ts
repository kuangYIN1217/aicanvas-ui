import {Component} from '@angular/core';
import {DatasetsService} from "../common/services/datasets.service";
import {Page} from "../common/defs/resources";
import {calc_height} from '../common/ts/calc_height'
@Component({
  selector: 'datasets',
  styleUrls: ['./datasets.component.css'],
  templateUrl: './datasets.html',
  providers: [DatasetsService]
})
export class DatasetsComponent{
  username: string = '';
  s_popup_show: boolean = false;
  d_dataTypes: any = [];
  d_tableData: any = [];
  // 筛选条件
  s_nav_selected: number = 0; // create
  s_select_datasetType: any = 'all'; // type
  s_select_name: any = ''; // name
  s_sort_type: any = 'createTime,desc';
  s_page: any = 1;
  s_size: any = 10;

  pageParams=new Page();
  constructor (private datasetservice: DatasetsService) {
    this.pageParams.pageMaxItem = this.s_size;
    this.pageParams.curPage = this.s_page;
    // 获取datasetType
    this.getDataSetsTypes();
    this.username = sessionStorage['username'];
    this.initTable();
  }

  ngOnInit() {
    calc_height(document.getElementsByClassName('content wrapper'));
  }

  // -----初始化数据 ------------------------------------------------
  getDataSetsTypes() {
    this.datasetservice.getDataSetType().subscribe(rep => {
      this.d_dataTypes = rep;
      console.log(this.d_dataTypes)
    })
  }
  initTable (init?) {
    if (init) {
      this.s_page = 1;
    }
    console.log('init table');
    let creator , dataSetType , name , sort, page , size;
    creator = this.s_nav_selected ;
    dataSetType = this.s_select_datasetType ;
    name = this.s_select_name ;
    sort = this.s_sort_type;
    page = this.s_page ;
    size = this.s_size;
    creator = creator === 1 ? 'system' : this.username;
    dataSetType = dataSetType === 'all' ? null : dataSetType;
    if (!name) {
      name = null;
    }
    if (!sort) {
      sort = null;
    }
    this.datasetservice.getDataSets(creator , dataSetType , name , sort, page , size ).subscribe(rep =>{
      this.d_tableData = rep.content;
      console.log(this.d_tableData)
      this.changePageParmas(rep);
    })
  }
  // -----初始化数据 end --------------------------------------------

  $nav_click(index) {
    this.s_select_datasetType = 'all'; // type
    this.s_nav_selected = index;
    this.initTable();
  }
  $upload_click () {
    if (!this.s_popup_show) {
      this.s_popup_show = true;
    }
  }

  $select_change() {
    console.log(this.s_select_datasetType)
    this.initTable ();
  }

  $name_change () {
    console.log(this.s_select_name);
    this.initTable();
  }

  changePageParmas(result) {
    console.log(result)
    let page = new Page();
    page.pageMaxItem = result.size;
    page.curPage = result.number+1;
    page.totalPage = result.totalPages;
    page.totalNum = result.totalElements;
    this.s_page = page.curPage;
    this.s_size = page.pageMaxItem;
    this.pageParams = page;
  }

  getPageData(paraParam) {
    this.s_page = paraParam.curPage;
    this.s_size = paraParam.pageMaxItem
    this.initTable();
    //console.log('触发', paraParam);
  }
}





