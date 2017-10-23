import {Component,Input,Output,EventEmitter} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {calc_height} from '../common/ts/calc_height'
import {JobService} from "../common/services/job.service";
import {calc_size} from '../datasets/calc-size';
import {SERVER_URL} from "../app.constants";
import {modelService} from "../common/services/model.service";
import {DatasetsService} from "../common/services/datasets.service";
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
  @Input() jobPath:string;
  @Input() test:string;
  @Input() train:string;
  @Input() valid:string;
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
  constructor(private datasetservice: DatasetsService,private route: ActivatedRoute, private router: Router,private jobService: JobService,private modelService: modelService) {
  }
  ngOnChanges(...args: any[]){
    console.log(this.dataList);
    this.dataPath=[];
    this.arr=[];
    //console.log(this.jobPath);
    if(JSON.stringify(this.dataList) != "{}"){
      this.getResult(this.dataList.dataPath);
      this.dataPath.push(this.dataList.dataPath);
      this.arr = this.dataPath;
      this.index=1;
    }
    if(this.test == 'test'){
      //console.log(this.jobPath);
      this.getTestResult(this.jobPath,[this.test],null);
    }
    if(this.train == 'train'){
      //console.log(this.jobPath);
      this.getTestResult(this.jobPath,[this.train,this.valid],null);
    }
    if(this.jobPath){
      this.jobService.getDataId(this.jobPath)
        .subscribe(result=>{
          this.datasetservice.getDataInfo(result)
            .subscribe(rep=>{
                this.dataInfo = rep;
                //console.log(this.dataInfo);
                //console.log(this.dataList);
            });
        })
    }
  }
  getTestResult(jobPath,arr,path){
    this.modelService.getJobDataset(jobPath,arr,path)
      .subscribe(result=>{
        this.getDetail(result);
      })
  }
  getResult(path){
    this.jobService.getDataSetsDetail(path)
      .subscribe(result=>{
        console.log(result);
        this.getDetail(result);
/*        for(let i=0;i<this.dataSet.length;i++){
          let tem = this.dataSet[i].split('/');
          if(tem[tem.length-1].substring(0,1)=='.'){
            if(tem[tem.length-1].substring(1).indexOf('.')==-1){
                this.hide = true;
            }else{
              this.hide = false;
              return
            }
          }else{
            if(tem[tem.length-1].indexOf('.')==-1){
              this.hide = true;
            }else{
              this.hide = false;
              return
            }
          }
        }*/
      })
  }
  getDetail(result){
    this.fileFlag = true;
    this.dataKey=[];
    this.dataSet=[];
    this.dataArr=[];
    this.data = JSON.parse(result.text());
    for(var key in this.data){
      this.dataKey.push(key);
      this.dataSet.push(this.data[key]);
    }
    for(let i=0;i<this.dataKey.length;i++){
      let obj = {};
      obj[this.dataKey[i]] = this.dataSet[i];
      this.dataArr.push(obj);
    }
    this.filterArr = this.dataArr;
    //console.log(this.dataArr);
    for(let i=0;i<this.dataArr.length;i++){
      for(var key in this.dataArr[i]) {
        if (key.indexOf("file") != -1) {
            let arr = this.dataArr[i][key].split('/');
            let last = arr[arr.length-1];
            if(last.match(/^_/)){
              this.dataArr[i].flag = 1;
            }
        }
      }
    }
  }
  // arrow(){
  //   if(this.hide==false){
  //     return {'content':' !important' };
  //   }
  // }
  getItem(item){
    for(var key in item){
      if(key.indexOf("file")!=-1){
        return 'assets/datasetsDetail/file.png';
      }else if(key.indexOf("image")!=-1){
        let temp = this.data[key].split('$');
        let path = temp[0].substring(26);
        return `${SERVER_URL}/download/${path}`;
      }else if(key.indexOf("txt")!=-1){
        return 'assets/datasetsDetail/txt.png';
      }else{
        return 'assets/datasetsDetail/other.png';
      }
    }
  }
  output(item){
    let path = item.split('/');
    return path[path.length-1];
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
          this.getTestResult(this.jobPath,[this.test],item[key]);
        }else if(this.train=='train'){
          this.getTestResult(this.jobPath,[this.train,this.valid],item[key]);
        }
        this.index++;
        if(this.dataArr.length==this.dataPath.length){
          this.arr = this.dataPath.slice(0,this.index);
        }else{
          this.arr = this.dataPath;
        }
      }else if((key.indexOf("image")!=-1||key.indexOf("txt")!=-1)&&this.test == 'test'){
        //for(let i=0;i<this.uploadPath.length;i++){
          //this.uploadPath.push(item[key]);
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
      }else if(key.indexOf("txt")!=-1&&this.test==undefined){
        let temp = item[key].split('$');
        console.log(temp);
        this.jobService.getTxt(temp[0].substring(26))
          .subscribe(result=>{
            this.txtContent = result.text();
            this.txtShow = true;
          })
      }else{
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
  open(item){
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
  }
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
  left(){
    if(JSON.stringify(this.dataList) != "{}") {
      if (this.index == 1) {
        return false;
      }
    }else{
      if (this.index == 0) {
        return false;
      }
    }
    this.index--;
    if(JSON.stringify(this.dataList) != "{}"){
      this.getResult(this.dataPath[this.index-1]);
    }else if(this.test=='test'){
      this.getTestResult(this.jobPath,[this.test],this.dataPath[this.index-1]);
    }else if(this.train=='train'){
      this.getTestResult(this.jobPath,[this.train,this.valid],this.dataPath[this.index-1]);
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
      this.getTestResult(this.jobPath,[this.test],this.dataPath[this.index-1]);
    }else if(this.train=='train'){
      this.getTestResult(this.jobPath,[this.train,this.valid],this.dataPath[this.index-1]);
    }
    this.arr = this.dataPath.slice(0,this.index);
    //this.getPath(this.arr);
  }
  allfile(){
    this.filterArr = this.dataArr;
  }
  allimage(){
    this.filterArr=[];
    for(let i=0;i<this.dataArr.length;i++){
      for(var key in this.dataArr[i]){
        if(key.indexOf('image')!=-1){
          this.filterArr.push(this.dataArr[i]);
      }
    }
 }
     //console.log(this.filterArr);
  }
  alltext(){
    this.filterArr=[];
    for(let i=0;i<this.dataArr.length;i++){
      for(var key in this.dataArr[i]){
        if(key.indexOf('txt')!=-1){
          this.filterArr.push(this.dataArr[i]);
        }
      }
    }
    //console.log(this.filterArr);
  }
  allother(){
    this.filterArr=[];
    for(let i=0;i<this.dataArr.length;i++){
      for(var key in this.dataArr[i]){
        if(key.indexOf('other')!=-1){
          this.filterArr.push(this.dataArr[i]);
        }
      }
    }
    //console.log(this.filterArr);
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
