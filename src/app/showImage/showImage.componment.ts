import {Component, Input} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SERVER_URL} from "../app.constants";
import {modelService} from "../common/services/model.service";
import {ResourcesService} from "../common/services/resources.service";
import {inferenceResult, Page, PercentInfo} from "../common/defs/resources";
import {addErrorToast} from "../common/ts/toast";
import {ToastyConfig, ToastyService} from "ng2-toasty";
declare var $:any;
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
  @Input() resultType:string="";
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
  outputName:any[]=[];
  constructor(private modelService: modelService, private route: ActivatedRoute, private router: Router,private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
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
    //console.log(this.model_id);
    //console.log(modelId);
    this.modelService.getResult(modelId, page, size).subscribe(result => {
      if (result.content.length != 0) {
        clearInterval(this.interval);
        this.result = result.content;
        console.log(this.result);
        this.resultP = result;
        let page = new Page();
        page.pageMaxItem = result.size;
        page.curPage = result.number+1;
        page.totalPage = result.totalPages;
        page.totalNum = result.totalElements;
        this.pageParams=page;
        //console.log(this.result[0].output);
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
    this.tabIndex = 1;
    this.show = imgPath;
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
  outputLabel1(input) {
    if(input!=null){
      return input.split("/")[8].split("_")[1];
    }
  }
  outName(input) {
    if(input){
      let input_arr = input.split('/');
      this.outputName = input_arr.pop();
      return this.outputName.slice(14, this.outputName.length);
    }
  }
  close(){
    this.tabIndex = 0;
    $("#img").remove();
  }
  getMaxHeight(){
    if($("#img").length>0){
      return
    }else{
      let imgObj = new Image();
      imgObj.src = $("#image").attr("src");
      imgObj.id = "img";
      $(".showImage").append(imgObj);
      console.log($("#img").width());
      imgObj.addEventListener("load",this.getWH);
      $("#img").css("display","none");
    }
  }
  getWH(){
    let obj:any;
    obj = document.getElementById("image");
    obj.className = "";
    let width = $("#img").width();
    let height = $("#img").height();
    let x = (970-parseInt(width))/2;
    let y = (545-parseInt(height))/2;
    if(parseInt(width)>parseInt(height)){
      if(parseInt(width)>=970){
        obj.style.width = "970px";
        obj.style.position = "absolute";
        obj.style.height = parseInt(height)*970/parseInt(width)+"px";
        obj.style.left = "0";
        obj.style.right = "0";
        obj.style.top = "50%";
        obj.style.marginTop = -(obj.offsetHeight/2)+'px';
        let y1 = (545-parseInt(obj.offsetHeight))/2;
        $(".closeImage").css("right","-17px");
        $(".closeImage").css("top",y1-17+'px');
        return
      }else{
        obj.className = "show-img";
        obj.style.position = "absolute";
        obj.style.width = width+"px";
        obj.style.height = height+"px";
        obj.style.top = "50%";
        obj.style.left = "50%";
        obj.style.marginTop = -(height/2)+'px';
        obj.style.marginLeft = -(width/2)+'px';
        $(".closeImage").css("right",x-17+'px');
        $(".closeImage").css("top",y-17+'px');
        return
      }
    }else if(parseInt(width)<=parseInt(height)){
      if(parseInt(height)>=545){
        obj.style.width = parseInt(width)*545/parseInt(height)+"px";
        obj.style.height = "545px";
        obj.style.position = "relative";
        obj.style.top = "0";
        obj.style.bottom = "0";
        obj.style.left = "50%";
        obj.style.marginLeft = -(obj.offsetWidth/2)+'px';
        let x1 = (970-parseInt(obj.offsetWidth))/2;
        $(".closeImage").css("right",x1-17+'px');
        $(".closeImage").css("top","-17px");
        return
      }else{
        obj.className = "show-img";
        obj.style.position = "absolute";
        obj.style.width = width+"px";
        obj.style.height = height+"px";
        obj.style.top = "50%";
        obj.style.left = "50%";
        obj.style.marginTop = -(height/2)+'px';
        obj.style.marginLeft = -(width/2)+'px';
        $(".closeImage").css("right",x-17+'px');
        $(".closeImage").css("top",y-17+'px');
        return
      }
    }
  }
}
