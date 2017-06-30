import {Component, Input} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ResourcesService} from "../common/services/resources.service";
import {modelService} from "../common/services/model.service";
import {inferenceResult, Page, PercentInfo} from "../common/defs/resources";
import {SERVER_URL} from "../app.constants";
import {debug} from "util";
declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'historyDetail',
  styleUrls: ['./css/historyDetail.component.css'],
  templateUrl: './templates/historyDetail.html',
  providers: [ResourcesService, modelService]
})
export class HistoryDetailComponent {
  SERVER_URL = SERVER_URL;
  @Input() model_id: number = -1;
  model_pre: number = -1;
  file: any;
  interval: any;
  PercentInfo: PercentInfo = new PercentInfo;
  items: any[] = ['top1', 'top2', 'top3', 'All'];
  item: string;
  outputArr: any[] = [];
  id: number;
  result: inferenceResult[] = [];
  resultP: inferenceResult[] = [];
  page: number = 1;
  pageMaxItem: number = 10;
  pageParams: Page = new Page;
  type:string;
  arr:any[]=[];
  arr1:any[]=[];
  arr2:any[]=[];
  arr3:any[]=[];
  word: string;
  wordId:string='0';
  val:string;
  constructor(private modelService: modelService, private location: Location, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.model_id = params['runId'];
      if (this.model_id && this.model_id != -1) {
        this.model_pre = this.model_id;
        this.interval = setInterval(() => this.getResult(this.model_id, this.page - 1, this.pageMaxItem), 500);
      }
    });
    this.item = this.items[0];
    this.changeValue();
  }

  ngOnChanges(...args: any[]) {
    // for (let obj = 0; obj < args.length; obj++) {
    //   if (args[obj]['model_id']["currentValue"]) {
    //     this.model_pre = this.model_id;
        //console.log(this.model_id);
        this.interval = setInterval(() => this.getResult(this.model_id, this.page - 1, this.pageMaxItem), 500);
    //   }
    //   // this.modelService.getPercent(this.model_id)
    //   //   .subscribe(percent => {
    //   //     this.PercentInfo = percent;
    //   //   });
    // }
  }

  ngOnDestroy() {
    // 退出时停止更新
    clearInterval(this.interval);
  }

  queryResult(runId) {
    this.model_id = runId;
    this.model_pre = this.model_id;
    this.interval = setInterval(() => this.getResult(this.model_id, this.page - 1, this.pageMaxItem), 500);
  }

  getResult(modelId: number, page, size) {
    this.modelService.getResult(modelId, page, size).subscribe(result => {
      if (result.content.length != 0) {
        clearInterval(this.interval);
        this.type = result.content[0].inputPath.split('.').pop().toLowerCase();
        if(this.type == "txt"||this.type == "csv") {
          this.result = result.content;
          result.content[0].inputPath = "/home/ligang/dataset/1498613919473showTxt.png";
          let input = result.content[0].output;
          this.arr=input.substring(2, input.length - 2).split(':');
          this.arr1=[];
          this.arr2=[];
          for(let i=1;i<this.arr.length-1;i++){
            this.arr3=this.arr[i].split(',');
            this.arr1.push(this.arr3[this.arr3.length-1]);
            this.arr3.splice(this.arr3.length-1,1);
            this.arr2.push(this.arr3.join(''));
          }
          this.arr1.splice(0,0,this.arr[0]);
          this.arr2.push(this.arr[this.arr.length-1]);
          this.word = this.arr1[0];
          result.content[0].output = this.arr2;
        }else{
          this.result = result.content;
        }
        let page = new Page();
        page.pageMaxItem = result.size;
        page.curPage = result.number+1;
        page.totalPage = result.totalPages;
        page.totalNum = result.totalElements;
        this.pageParams=page;
        this.resultP = result;
      }
    })
  }
  getPageData(paraParam) {
    this.getResult(this.model_id,paraParam.curPage-1,paraParam.pageMaxItem);
    //console.log('触发', paraParam);
  }
  changeValue() {
      if (this.item == 'All')
        this.id = 10;
      else
        this.id = Number(this.item.substring(3));
  }
  changeWord(word){
    for(let i in this.arr1){
      if(word==this.arr1[i]){
        this.wordId = i;
      }
    }
  }
  sub(i){
    return i.substring(1,i.length-1);
  }
  wordPut(word){
    if(word){
      this.val = word[this.wordId];
      return this.val;
    }
  }
  outPut(input) {
    if(input){
        this.outputArr = input.substring(1, input.length - 1).split(",");
        return this.outputArr.slice(0, this.id);
    }
  }

}
