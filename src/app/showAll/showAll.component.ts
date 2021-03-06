import {Component, Input} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ResourcesService} from "../common/services/resources.service";
import {modelService} from "../common/services/model.service";
import {inferenceResult, Page, PercentInfo} from "../common/defs/resources";
import {SERVER_URL} from "../app.constants";
import {addErrorToast} from '../common/ts/toast';
import {debug} from "util";
import {ToastyService, ToastyConfig} from 'ng2-toasty';
declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'showAll',
  styleUrls: ['./css/showAll.component.css'],
  templateUrl: './templates/showAll.html',
  providers: [ResourcesService, modelService]
})
export class ShowAllComponent {
  SERVER_URL = SERVER_URL;
  @Input() model_id: number = -1;
  model_pre: number = -1;
  file: any;
  interval: any;
  PercentInfo: PercentInfo = new PercentInfo;
  items: any[] = ['top1', 'top2', 'top3', 'All'];
  item: string;
  outputArr: any[] = [];
  outputName: any[] = [];
  id: number;
  result: inferenceResult[] = [];
  resultP: inferenceResult[] = [];
  page: number = 1;
  pageMaxItem: number = 10;
  pageParams = new Page();
  type:string;
  arr:any[]=[];
  arr1:any[]=[];
  arr2:any[]=[];
  arr3:any[]=[];
  word: string;
  wordId:string='0';
  val:string;
  inputType:string;
  status:string;
  constructor(private modelService: modelService, private location: Location, private route: ActivatedRoute, private router: Router, private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
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
    console.log(modelId);
    this.modelService.getResult(modelId, page, size).subscribe(result => {
      if (result.content.length != 0) {
        clearInterval(this.interval);
        this.result = result.content;
        console.log(this.result);
        this.status = result.content[0].success;
        /*        if (this.result[0].modelPrediction.success!=true) {
         addErrorToast(this.toastyService, '推演结果异常！');
         return;
         }*/
        let page = new Page();
        page.model_id = modelId;
        page.pageMaxItem = result.size;
        page.curPage = result.number+1;
        page.totalPage = result.totalPages;
        page.totalNum = result.totalElements;
        this.pageParams=page;
        this.resultP = result;
      }
    })
  }
  getInput(inputType:string){
    let inputPath = inputType.split(',');
    return inputPath[0];
  }
  getOutput(inputType:string){
    let inputPath = inputType.split(',');
    return inputPath[1];
  }
  getPageData(paraParam) {
    console.log(paraParam);
    this.getResult(paraParam.model_id,paraParam.curPage-1,paraParam.pageMaxItem);
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
  outName(input) {
    if(input){
      let input_arr = input.split('/');
      this.outputName = input_arr.pop();
      return this.outputName.slice(13, this.outputName.length);
    }
  }
}
