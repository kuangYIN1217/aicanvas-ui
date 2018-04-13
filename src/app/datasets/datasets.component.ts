import {Component} from '@angular/core';
import {DatasetsService} from "../common/services/datasets.service";
import {Page} from "../common/defs/resources";
import {calc_height} from '../common/ts/calc_height';
import {SERVER_URL} from "../app.constants";
import {Observable} from "rxjs/Observable";
@Component({
  selector: 'datasets',
  styleUrls: ['./datasets.component.css'],
  templateUrl: './datasets.html',
  providers: [DatasetsService]
})
export class DatasetsComponent{
  SERVER_URL = SERVER_URL;
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
  s_totalNum:any=0;
  focus:number=0;
  blur:number=0;
  pageParams=new Page();
  icon:string='file';
  createfile:boolean=false;
  index:number=0;
  backup:any[]=[];
  downloadPath:string='';
  showTip:boolean = false;
  tipWidth:string='';
  tipContent:string='';
  tipType:string='';
  tipMargin:string='';
  loading:boolean = false;
  dataLineNum: number =0;
  windowWidth:number =0;
  rollFlag: number =0;
  constructor (private datasetservice: DatasetsService) {
    this.pageParams.pageMaxItem = this.s_size;
    this.pageParams.curPage = this.s_page;
    // 获取datasetType
    this.getDataSetsTypes();
    this.username = localStorage['username'];
    this.initTable();
  }

  ngOnInit() {
    calc_height(document.getElementsByClassName('content wrapper')[0]);
    this.windowWidth=document.body.clientWidth;
    Observable.fromEvent(window, 'scroll').subscribe((event) => {
      this.loadLazyData();
    });
    Observable.fromEvent(window, 'resize').subscribe((event) => {
      this.loadResizeData();
    });
  }

  // -----初始化数据 ------------------------------------------------
  getDataSetsTypes() {
    this.datasetservice.getDataSetType().subscribe(rep => {
      this.d_dataTypes = rep;
      //console.log(this.d_dataTypes);
    })
  }
  getResult(event){
    if(event=='rename success'||event=='success'){
      this.initTable();
    }
  }
  noopearte(event){
    this.showTip = true;
    this.tipWidth = "100%";
    this.tipType = "warnning";
    this.tipMargin = "0 auto 20px";
    if(event=='editname'){
      this.tipContent = "您修改的名称已存在！";
    }else if(event=='false'){
      this.tipContent = "该数据集已绑定训练任务！";
    }else if(event=='deletedataset'){
      this.tipContent = "该数据集下有挂载任务，不能删除！";
    }
  }
  showTipChange(event){
    this.showTip = false;
  }
  initTable (init?) {
    if (init) {
      this.s_page = 1;
    }
    this.d_tableData = [];
    let creator , dataSetType , name , sort, page , size;
    creator = this.s_nav_selected;
    dataSetType = this.s_select_datasetType;
    name = this.s_select_name;
    sort = this.s_sort_type;
    page = this.s_page;
    size = this.s_size;
    creator = creator === 1 ? 'system' : this.username;
    dataSetType = dataSetType === 'all' ? null : dataSetType;
    if (!name) {
      name = null;
    }
    if (!sort) {
      sort = null;
    }
    if(this.icon=='file'){
      let headWidth = document.getElementsByClassName('header')[0].scrollWidth;
      let navWidth = document.getElementsByClassName('nav-content')[0].clientWidth;
      let devWidth = headWidth-navWidth-120;
      size = Math.floor(devWidth/120)*7;
      this.dataLineNum=7;
      this.datasetservice.getDataSets(creator , dataSetType , name , sort, 1 , size ).subscribe(rep =>{
        let aviliableData = rep.content;
        let unloadingData = new Array(rep.totalElements-rep.content.length);
        this.d_tableData = aviliableData.concat(unloadingData);
        document.documentElement.scrollTop=0;
        this.rollFlag =1;
      })
    }else if(this.icon=='list'){
      this.datasetservice.getDataSets(creator , dataSetType , name , sort, page , size ).subscribe(rep =>{
        this.d_tableData = rep.content;
        //console.log(this.d_tableData);
        this.changePageParmas(rep);
      })
    }
  }
  // -----初始化数据 end --------------------------------------------

  $nav_click(index) {
    this.s_select_datasetType = 'all'; // type
    this.s_nav_selected = index;
    this.initTable();
  }
  $nav_icon(icon,index){
    this.index = index;
    if(icon=='file'){
      this.icon = 'file';
      this.initTable();
    }else if(icon=='list'){
      this.icon = 'list';
      this.initTable();
    }
  }
  $upload_click () {
    if (!this.s_popup_show) {
      this.s_popup_show = true;
    }
  }
  $create_click(){
    this.createfile = true;
  }
  $data_backup(){
    this.backup=[];
    for(let i=0;this.d_tableData[i]!=undefined;i++){
      if(this.d_tableData[i].checked){
        this.backup.push(this.d_tableData[i].dataPath);
      }
    }
    if(this.backup.length>0){
      this.loading = true;
      this.datasetservice.backupDataset(this.backup)
        .subscribe((result)=>{
          this.loading = false;
          this.downloadPath = result.substring(26);
          this.downloadBackup(this.downloadPath);
        },
          (error)=>{
          this.loading = false;
        })
    }else{
      this.showTip = true;
      this.tipWidth = "100%";
      this.tipType = "warnning";
      this.tipMargin = "0 auto 20px";
      this.tipContent = "请选择数据集！";
    }
  }
  downloadBackup(path) {
    let url = SERVER_URL+"/download/"+path;
    location.href = url;
  }
  createMethod(event:any){
    this.createfile = event;
    this.initTable();
  }
  $select_change() {
    //console.log(this.s_select_datasetType);
    this.initTable ();
  }

  $name_change () {
    //console.log(this.s_select_name);
    this.s_page = 0;
    this.initTable();
  }
  searchLeft(){
    this.focus=1;
    this.blur=1;
  }
  searchBlur(){
    if(this.s_select_name){
      this.focus=1;
    }else{
      this.focus=0;
    }
    this.blur=0;
  }
  changePageParmas(result) {
    this.s_totalNum = result.totalElements;
    //console.log(result);
    let page = new Page();
    page.pageMaxItem = result.size;
    page.curPage = result.number+1;
    page.totalPage = result.totalPages;
    page.totalNum = result.totalElements;
    //page.totalNum = this.s_totalNum;
    this.s_page = page.curPage;
    this.s_size = page.pageMaxItem;
    this.pageParams = page;
  }
  changeNum(num){
    this.s_totalNum = num;
    //console.log(this.s_totalNum);
  }
  changeSize(size){
    this.s_size = size;
    this.initTable();
  }
  getPageData(paraParam) {
    this.s_page = paraParam.curPage;
    this.s_size = paraParam.pageMaxItem;
    this.s_totalNum = paraParam.totalNum;
    this.initTable();
    //console.log('触发', paraParam);
  }

  loadLazyData(){
    if(this.icon=='list') return;
    if(this.rollFlag==0) return;
    // let devWidth = document.getElementsByClassName('myfile-content')[0].scrollWidth;
    // let t= document.documentElement.scrollTop;
    // let d = Math.ceil(t/156);
    // if(d+7<=this.dataLineNum)return;
    // this.dataLineNum=d+7;
    // this.getScrollLazyFile(0,(d+7)*Math.floor(devWidth/120));
    if(document.getElementsByClassName('myfile-content').length<=0)return;
    let devWidth = document.getElementsByClassName('myfile-content')[0].scrollWidth;

    let t= document.documentElement.scrollTop;

    let d = Math.ceil(t/156);
    if(d+7<=this.dataLineNum)return;
    this.dataLineNum +=7;
    this.getScrollLazyFile(this.dataLineNum/7-1,Math.floor(devWidth/120)*7)
  }
  loadResizeData(){
    if(this.icon=='list') return;
    if(this.rollFlag==0) return;
    let newWidth = document.body.clientWidth;
    if(this.windowWidth>newWidth){
      this.windowWidth=newWidth;
      return;
    }
    let t= document.documentElement.scrollTop;
    if(document.getElementsByClassName('myfile-content').length<=0)return;
    let devWidth = document.getElementsByClassName('myfile-content')[0].scrollWidth;
    let d =Math.ceil(t/150)+7;
    let lineNum =Math.floor(devWidth/130);
    let aviliableDataNum =0;
    for(let i=0;i<this.d_tableData.length;i++){
      if(this.d_tableData[i]===undefined)break;
      aviliableDataNum++;
    }

    for(let i=0;i<d;i++){
      if(i>=Math.floor(aviliableDataNum/(lineNum*7))&&i<=Math.ceil(d/7)){
        this.dataLineNum=(i+1)*7;
        this.getScrollLazyFile(i,lineNum*7);
      }
    }
  }
  getScrollLazyFile(page , size ){
    let dataSetType = this.s_select_datasetType;
    let name = this.s_select_name;
    let sort = this.s_sort_type;
    let creator = this.s_nav_selected === 1 ? 'system' : this.username;
    dataSetType = dataSetType === 'all' ? null : dataSetType;
    this.datasetservice.getDataSets(creator , dataSetType , name , sort, page+1 , size ).subscribe(rep =>{
      let aviliableData = rep.content;
      for(let i=page*(size);(i<(page+1)*size)&&(i<this.d_tableData.length);i++){
        this.d_tableData[i]=aviliableData[i-size*page];
      }
    })
  }
}





