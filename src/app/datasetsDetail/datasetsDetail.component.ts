import {Component,Input,Output,EventEmitter} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {calc_height} from '../common/ts/calc_height'
import {JobService} from "../common/services/job.service";
import {calc_size} from '../datasets/calc-size';
import {SERVER_URL} from "../app.constants";
import {modelService} from "../common/services/model.service";
import {DatasetsService} from "../common/services/datasets.service";
import {Page} from "../common/defs/resources";
@Component({
  moduleId: module.id,
  selector: 'datasets-detail',
  styleUrls: ['./css/datasetsDetail.component.css'],
  templateUrl: './templates/datasetsDetail.html',
  providers: [JobService,modelService,DatasetsService]
})
export class DatasetsDetailComponent{
  @Input() show: boolean = false;
  @Input() dataList:any={};
  @Input() jobPath:string='';
  @Input() test:string;
  @Input() train:string;
  @Input() valid:string;
  @Input() dataId:string='';
  @Input() jobId:string='';
  @Input() datasetPath:string='';
  @Output() showChange: EventEmitter<any> = new EventEmitter();
  @Output() uploadPathChange: EventEmitter<any> = new EventEmitter();
  data:any={};
  dataArr:any[]=[];
  dataKey:any[]=[];
  dataSet:any[]=[];
  dataPath:any[]=[];
  SERVER_URL = SERVER_URL;
  hide:boolean = true;
  name:string;
  tempArr:any[]=[];
  index:number=0;
  arr:any[]=[];
  filterArr:any[]=[];
  image:boolean = false;
  imageUrl:string;
  uploadPath:any[]=[];
  hasIt:boolean = false;
  dataInfo:any={};
  txtShow:boolean = false;
  txtContent:string;
  headerPath:any[]=[];
  arrow:string;
  fileFlag:boolean = true;
  label:any[]=[];
  dataListShow:any={};
  icon:boolean = true;
  placeholder:boolean = true;
  searchName:any;
  indexLevel:number=0;
  pageParams=new Page();
  page: number = 0;
  pageMaxItem: number = 14;
  constructor(private datasetservice: DatasetsService,private route: ActivatedRoute, private router: Router,private jobService: JobService,private modelService: modelService) {
  }
  ngOnChanges(...args: any[]){
    this.dataPath=[];
    this.arr=[];
    if(this.test == 'test'){
      //console.log(this.jobPath);
      this.dataPath.push('全部文件');
      this.arr = this.dataPath;
      this.index=1;
      this.label=["test"];
      this.getFile(this.jobPath,this.label);
      this.getTestResult(this.jobPath,[this.test],null,this.judgeSearch(),this.page,this.pageMaxItem);
    }
    if(this.test == 'train'){
      //console.log(this.jobPath);
      this.dataPath.push('全部文件');
      this.arr = this.dataPath;
      this.index=1;
      this.label=["train"];
      this.getFile(this.jobPath,this.label);
      this.getTestResult(this.jobPath,[this.test],null,this.judgeSearch(),this.page,this.pageMaxItem);
    }
    if(this.train == 'train'){
      //console.log(this.jobPath);
      this.dataPath.push('全部文件');
      this.arr = this.dataPath;
      this.index=1;
      this.label=["train","valid"];
      this.getFile(this.jobPath,this.label);
      this.getTestResult(this.jobPath,[this.train,this.valid],null,this.judgeSearch(),this.page,this.pageMaxItem);
    }
    if(this.jobPath!=undefined){
     // this.jobService.getDataId(this.jobPath)
       // .subscribe(result=>{
          this.jobService.getDatasetBackupInfo(this.dataId,this.jobId,this.datasetPath)
            .subscribe(rep=>{
                this.dataInfo = rep;
            });
        //})
    }
  }
  select_name(event){
    if(this.test=='test'&&this.arr.length==1){
      this.getTestResult(this.jobPath,[this.test],null,this.judgeSearch(),this.page,this.pageMaxItem);
    }else if(this.train=='train'&&this.arr.length==1){
      this.getTestResult(this.jobPath,[this.train,this.valid],null,this.judgeSearch(),this.page,this.pageMaxItem);
    }else if(this.test=='test'&&this.arr.length>1){
      this.getTestResult(this.jobPath,[this.test],this.arr[1],this.judgeSearch(),this.page,this.pageMaxItem);
    }else if(this.train=='train'&&this.arr.length>1){
      this.getTestResult(this.jobPath,[this.train,this.valid],this.arr[1],this.judgeSearch(),this.page,this.pageMaxItem);
    }
  }
  getFile(jobPath,label){
    this.modelService.getFile(jobPath,label)
      .subscribe(result=>{
        this.dataListShow = result;
      })
  }
  getTestResult(jobPath,arr,path,name,page,size){
    this.modelService.getJobDataset(jobPath,arr,path,name,page,size)
      .subscribe(result=>{
        this.getDetail(result);
      })
  }
  getResult(path){
    this.jobService.getDataSetsDetail(path)
      .subscribe(result=>{
        //console.log(result);
        this.getDetail(result);
      })
  }
  getDetail(result){
    this.fileFlag = true;
    this.dataKey=[];
    this.dataSet=[];
    this.dataArr=[];
    if(this.arr.length>1){
      this.indexLevel = 1;
    }else{
      this.indexLevel = 0;
    }
    this.data = JSON.parse(result.text());
/*    for(var key in this.data.content){
      this.dataKey.push(key);
      this.dataSet.push(this.data.content[key]);
    }
    for(let i=0;i<this.dataKey.length;i++){
      let obj = {};
      obj[this.dataKey[i]] = this.dataSet[i];
      this.dataArr.push(obj);
    }
    this.filterArr = this.dataArr;*/
    this.filterArr = this.data.content;
    let page = new Page();
    page.pageMaxItem = this.data.size;
    page.curPage = this.data.number+1;
    page.totalPage = this.data.totalPages;
    page.totalNum = this.data.totalElements;
    this.pageParams = page;
    //console.log(this.pageParams);
/*    for(let i=0;i<this.dataArr.length;i++){
      for(var key in this.dataArr[i]) {
        if (key.indexOf("file") != -1) {
            let arr = this.dataArr[i][key].split('/');
            let last = arr[arr.length-1];
            if(last.match(/^_/)){
              this.dataArr[i].flag = 1;
            }
        }
      }
    }*/
  }
  getPageData(paraParam) {
    if(this.test=='test'&&this.arr.length==1){
      this.getTestResult(this.jobPath,[this.test],null,this.judgeSearch(),paraParam.curPage-1,paraParam.pageMaxItem);
    }else if(this.train=='train'&&this.arr.length==1){
      this.getTestResult(this.jobPath,[this.train,this.valid],null,this.judgeSearch(),paraParam.curPage-1,paraParam.pageMaxItem);
    }else if(this.test=='test'&&this.arr.length>1){
      this.getTestResult(this.jobPath,[this.test],this.arr[1],this.judgeSearch(),paraParam.curPage-1,paraParam.pageMaxItem);
    }else if(this.train=='train'&&this.arr.length>1){
      this.getTestResult(this.jobPath,[this.train,this.valid],this.arr[1],this.judgeSearch(),paraParam.curPage-1,paraParam.pageMaxItem);
    }
  }
  hideIcon(){
    this.icon = false;
    this.placeholder = false;
  }
  showIcon(){
    if(this.searchName){
      this.icon = false;
    }else{
      this.icon = true;
    }
    this.placeholder = true;
  }
  // arrow(){
  //   if(this.hide==false){
  //     return {'content':' !important' };
  //   }
  // }
  getItem(item){
    for(var key in item){
      if(key.indexOf("file")!=-1){
        return 'assets/datasets/file/sjxq_wjj.png';
      }else if(key.indexOf("image")!=-1){
        let temp = item[key].split('$');
        let path = temp[0].split('dataset')[1];
        //let path = item[key].substring(26);
        return `${SERVER_URL}/download/${path.substring(1)}`;
      }else if(key.indexOf("txt")!=-1){
        return 'assets/datasets/file/wb.png';
      }else if(key.indexOf("video")!=-1){
        return 'assets/datasets/file/sp.png';
      }else if(key.indexOf("audio")!=-1){
        return 'assets/datasets/file/yp.png';
      }else{
        return 'assets/datasets/file/qt.png';
      }
    }
  }
  output(item){
/*    if(this.dataList.creator=='admin'&&this.index==1){
      let path = item.split('/');
      let data = path[path.length-1].split('-')[1];
      return data;
    }else{*/
      let path = item.split('/');
      let temp = new RegExp(/^\d{13}-/);
      if(temp.test(path[path.length-1])){
        return path[path.length-1].substring(14);
      }else{
        return path[path.length-1];
      }
    //}
  }
  enterPath(item) {
    if (!this.fileFlag) {
      return;
    }
    this.fileFlag = false;
    for(var key in item){
      //console.log(item[key]);
      if(key.indexOf("file")!=-1){
        //console.log(this.index);
        this.dataPath = this.dataPath.slice(0,this.index);
        this.dataPath.push(item[key]);
        if(JSON.stringify(this.dataList) != "{}"){
          this.getResult(item[key]);
        }else if(this.test=='test'){
          this.getTestResult(this.jobPath,[this.test],item[key],this.judgeSearch(),this.page,this.pageMaxItem);
        }else if(this.test=='train'){
          this.getTestResult(this.jobPath,[this.test],item[key],this.judgeSearch(),this.page,this.pageMaxItem);
        }else if(this.train=='train'){
          this.getTestResult(this.jobPath,[this.train,this.valid],item[key],this.judgeSearch(),this.page,this.pageMaxItem);
        }
        this.index++;
        if(this.dataArr.length==this.dataPath.length){
          this.arr = this.dataPath.slice(0,this.index);
        }else{
          this.arr = this.dataPath;
        }
      }else if((key.indexOf("image")!=-1||key.indexOf("txt")!=-1)&&(this.test == 'test'||this.test == 'train')){
        //for(let i=0;i<this.uploadPath.length;i++){
          //this.uploadPath.push(item[key]);
        this.indexLevel = 0;
          this.uploadPathChange.emit(item);
          this.close();
/*          if(this.uploadPath[i]==item[key]){
              this.hasIt = true;
          }else{
              this.hasIt = false;
          }*/
       // }
 /* if(this.hasIt == false){
          this.uploadPath.push(item[key]);
        }*/
        //console.log(this.uploadPath);
      }/*else if(key.indexOf("txt")!=-1&&this.test==undefined){
        let temp = item[key].split('$');
        console.log(temp);
        this.jobService.getTxt(temp[0].substring(26))
          .subscribe(result=>{
            this.txtContent = result.text();
            this.txtShow = true;
          })
      }*/else{
        return false;
      }
    }
  }
  // getPath(arr){
  //   for(let i=0;i<arr.length;i++){
  //     let obj:any={};
  //     obj.path = arr[i];
  //     obj.flag = 1;
  //     this.headerPath.push(obj);
  //     console.log(this.headerPath);
  //   }
  // }
  judgeSearch(){
    if(this.searchName==undefined||this.searchName==''){
      return -1
    }else{
      return this.searchName
    }
  }
  getImageStyle(obj,width,height,img,x,y){
    obj.className = "show-img";
    obj.style.position = "relative";
    obj.style.top = "50%";
    obj.style.left = "50%";
    obj.style.marginTop = -(height/2)+'px';
    obj.style.marginLeft = -(width/2)+'px';
    img.style.right = x-17+'px';
    img.style.top = y-17+'px';
  }
  getWH(){
    let obj:any;
    obj = document.getElementById("image1");
    obj.className = "";
    let img:any;
    img = document.getElementById("closeImage1");
    let width = obj.offsetWidth;
    let height = obj.offsetHeight;
    let x = (970-parseInt(width))/2;
    let y = (545-parseInt(height))/2;
    if(parseInt(width)>parseInt(height)){
      if(parseInt(width)>=970){
        obj.style.width = "970px";
        obj.style.position = "relative";
        obj.style.left = "0";
        obj.style.right = "0";
        obj.style.top = "50%";
        obj.style.marginTop = -(obj.offsetHeight/2)+'px';
        let y1 = (545-parseInt(obj.offsetHeight))/2;
        img.style.right = '-17px';
        img.style.top = y1-17+'px';
        return
      }else{
        this.getImageStyle(obj,width,height,img,x,y);
        return
      }
    }else if(parseInt(width)<=parseInt(height)){
      if(parseInt(height)>=545){
        obj.style.height = "545px";
        obj.style.position = "relative";
        obj.style.top = "0";
        obj.style.bottom = "0";
        obj.style.left = "50%";
        obj.style.marginLeft = -(obj.offsetWidth/2)+'px';
        let x1 = (970-parseInt(obj.offsetWidth))/2;
        img.style.right = x1-17+'px';
        img.style.top = '-17px';
        return
      }else{
        this.getImageStyle(obj,width,height,img,x,y);
        return
      }
    }
  }
/*  open(item){
    for(var key in item){
        if(key.indexOf("image")!=-1){
          if(this.test == 'test'){

          }else{
            this.image = true;
            let temp = item[key].split('$');
            this.imageUrl = temp[0].slice(26);

          }
        }else if(key.indexOf("file")!=-1){
          return false;
        }else if(key.indexOf("txt")!=-1){
          if(this.test == 'test'){

          }else{

          }
        }else if(key.indexOf("other")!=-1){
          return false;
        }
    }
  }*/
  closeImage(){
    this.image = false;
  }
  getSet(item){
      for(var key in item){
        let name:any[]=[];
        let temp = item[key].split('$');
        let size = temp[1];
        name = temp[0].split('/');
        //console.log(name[name.length-1]);
        // console.log(name[name.length-1].substring(0,1));
        this.name = '';
        // if(name[name.length-1].substring(0,1)=='.'||name[name.length-1].substring(0,1)=='_'){
        //   item.flag = 1;
        // }
        if(size){
          return name[name.length-1]+"("+size+")";
        }else{
          return name[name.length-1];
        }

      }
  }
  previous(){
      if (this.index == 1) {
        return false;
      }
    this.index--;
    if(JSON.stringify(this.dataList) != "{}"){
      this.getResult(this.dataPath[this.index-1]);
    }else if(this.test=='test'){
      if(this.index==1){
        this.getTestResult(this.jobPath,[this.test],null,this.judgeSearch(),this.page,this.pageMaxItem);
      }else{
        this.getTestResult(this.jobPath,[this.test],this.dataPath[this.index-1],this.judgeSearch(),this.page,this.pageMaxItem);
      }
    }else if(this.train=='train'){
      if(this.index==1){
        this.getTestResult(this.jobPath, [this.train, this.valid],null,this.judgeSearch(),this.page,this.pageMaxItem);
      }else {
        this.getTestResult(this.jobPath, [this.train, this.valid], this.dataPath[this.index - 1],this.judgeSearch(),this.page,this.pageMaxItem);
      }
    }
    this.arr = this.dataPath.slice(0,this.index);
    //this.getPath(this.arr);
    //console.log(this.arr);
  }
  right(){
    if(this.index==this.dataPath.length){
      return false;
    }
    this.index++;
    //console.log(this.index);
    if(JSON.stringify(this.dataList) != "{}"){
      this.getResult(this.dataPath[this.index-1]);
    }else if(this.test=='test'){
      this.getTestResult(this.jobPath,[this.test],this.dataPath[this.index-1],this.judgeSearch(),this.page,this.pageMaxItem);
    }else if(this.train=='train'){
      this.getTestResult(this.jobPath,[this.train,this.valid],this.dataPath[this.index-1],this.judgeSearch(),this.page,this.pageMaxItem);
    }
    this.arr = this.dataPath.slice(0,this.index);
    //this.getPath(this.arr);
  }
  calc_size = calc_size;
  ngOnInit() {
    /*calc_height(document.getElementById('systemDiv'));*/
  }
  close(){
    this.show = false;
    this.showChange.emit(this.show);
  }
}
