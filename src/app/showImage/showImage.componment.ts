import {Component, Input} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SERVER_URL} from "../app.constants";
import {modelService} from "../common/services/model.service";
import {ResourcesService} from "../common/services/resources.service";
import {inferenceResult, Page, PercentInfo} from "../common/defs/resources";
@Component({
  moduleId: module.id,
  selector: 'showImage',
  styleUrls: ['./css/showImage.component.css'],
  templateUrl: './templates/showImage.html',
  providers: [ResourcesService, modelService],
})
export class ShowImageComponent {
  SERVER_URL = SERVER_URL;
  @Input() model_id: number = -1;
  model_pre: number = -1;
  file: any;
  interval: any;
  items: any[] = ['top1', 'top2', 'top3', 'All'];
  item: string;
  show: string;
  tabIndex: number = 0;
  page: number = 1;
  pageMaxItem: number = 10;
  id: number;
  result: inferenceResult[] = [];
  resultP: inferenceResult[] = [];
  PercentInfo: PercentInfo = new PercentInfo;
  stringArr: string;
  pageParams=new Page();

  constructor(private modelService: modelService, private route: ActivatedRoute, private router: Router) {
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
        this.interval = setInterval(() => this.getResult(this.model_id, this.page - 1, this.pageMaxItem), 500);
      // }
      // this.modelService.getPercent(this.model_id)
      //   .subscribe(percent => {
      //     this.PercentInfo = percent;
      //     console.log(this.PercentInfo.percent);
      //   });
    // }
  }

  ngOnDestroy() {
    // 退出时停止更新
    clearInterval(this.interval);
  }

  getPageData(paraParam) {
    this.getResult(this.model_id,paraParam.curPage-1,paraParam.pageMaxItem);
    //console.log('触发', paraParam);
  }
  getResult(modelId: number, page, size) {
    this.modelService.getResult(modelId, page, size).subscribe(result => {
      if (result.content.length != 0) {
        clearInterval(this.interval);
        this.result = result.content;
        this.resultP = result;
        let page = new Page();
        page.pageMaxItem = result.size;
        page.curPage = result.number+1;
        page.totalPage = result.totalPages;
        page.totalNum = result.totalElements;
        this.pageParams=page;
        console.log(this.result[0].output);
      }
    })
  }

  changeValue() {
    if (this.item == 'All')
      this.id = 10;
    else
      this.id = Number(this.item.substring(3));
  }

  enlarge(imgPath) {
    this.show = imgPath;
    this.tabIndex = 1;
  }

  closeWindow() {
    this.tabIndex = 0;
  }

  outputImg(input) {
    this.stringArr = input.substring(1, input.length - 1);
    return JSON.parse(this.stringArr).image_file_name
  }

  outputLabel(input) {
    this.stringArr = input.substring(1, input.length - 1);
    return JSON.parse(this.stringArr).label
  }

}
