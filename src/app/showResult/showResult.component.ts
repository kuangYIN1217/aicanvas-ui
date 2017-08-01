import {animate, Component, Input, keyframes, state, style, transition, trigger} from "@angular/core";
import {ResourcesService} from "../common/services/resources.service";
import {modelService} from "../common/services/model.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SERVER_URL} from "../app.constants";
import {inferenceResult, Page} from "../common/defs/resources";
import {addErrorToast} from "../common/ts/toast";
import {ToastyService} from "ng2-toasty";
/*import { SlideImg } from './slide-img.interface';*/
@Component({
    moduleId: module.id,
    selector: 'showResult',
    styleUrls: ['./css/showResult.component.css'],
    templateUrl: './templates/showResult.html',
    providers: [ResourcesService, modelService],
    animations: [
         trigger('imgMove', [
             state('off', style({'display': 'none', 'z-index': '0', 'opacity':0})),
             state('prev', style({'z-index': '1', 'opacity': 0})),
             state('next', style({'z-index': '2', 'opacity': 0})),
             state('on', style({'z-index': '3', 'opacity': 1})),
                 transition('prev=>on', [
                     animate(1000, keyframes([
                         style({ opacity: 0 }),
                         style({ opacity: 1})
                     ]))
                 ]),
                transition('next=>on', [
                    animate(1000, keyframes([
                        style({ opacity: 0 }),
                        style({ opacity:1})
                    ]))
                 ]),
                 transition('on=>prev', [
                     animate(1000, keyframes([
                         style({ opacity: 0 }),
                         style({ opacity: 1})
                     ]))
                 ]),
                 transition('on=>next', [
                     animate(1000, keyframes([
                         style({ opacity: 0 }),
                         style({ opacity: 1})
                     ]))
                 ])
         ])
    ]
})
export class ShowResultComponent {
  SERVER_URL = SERVER_URL;
  @Input() model_id: number = -1;
  model_pre: number = -1;
  file: any;
  interval: any;
  page: number = 1;
  pageMaxItem: number = 10;
  id: number;
  result: inferenceResult[] = [];
  resultP: inferenceResult[] = [];
  items: any[] = ['top1', 'top2', 'top3', 'All'];
  item: string;
  pageParams=new Page();
  stringArr: string;
    /*@Input() imgs: SlideImg[];*/
    inImgs: any[]=[];
    outImgs: any[]=[];
    public current;
    constructor(private modelService: modelService, private route: ActivatedRoute, private router: Router,private toastyService: ToastyService) {
      this.route.queryParams.subscribe(params => {
        this.model_id = params['runId'];
        if (this.model_id && this.model_id != -1) {
          this.model_pre = this.model_id;
          this.interval = setInterval(() => this.getResult(this.model_id, this.page - 1, this.pageMaxItem), 500);
        }
      });
        this.current = 0;
       setInterval(() => {
            let id = (this.current + 1) % this.result.length;
            this.current = id;
            //console.log(this.current);
        },1000);
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
        console.log(this.result);
        for(let i in this.result){
            this.inImgs.push(this.result[i].inputPath);
            this.outImgs.push(this.result[i].output);
        }
        console.log(this.inImgs);
        console.log(this.outImgs);
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
  outputImg(input) {
    this.stringArr = input.substring(1, input.length - 1);
    return JSON.parse(this.stringArr).image_file_name;
  }
  ImgState1(index) {
    if (this.inImgs && this.inImgs.length) {
      if (this.current === 0) {
        return index === 0 ? 'on' :
          index === 1 ? 'next' :
            index === this.inImgs.length - 1 ? 'prev' :
              'off';
      } else if (this.current === this.inImgs.length - 1) {
        return index === this.inImgs.length - 1 ? 'on' :
          index === this.inImgs.length - 2 ? 'prev' :
            index === 0 ? 'next' :
              'off';
      }
      switch (index - this.current) {
        case 0:
          return 'on';
        case 1:
          return 'next';
        case -1:
          return 'prev';
        default:
          return 'off';
      }
    } else {
      return 'off';
    }
  }
  ImgState(index) {
        if (this.outImgs && this.outImgs.length) {
            if (this.current === 0) {
                return index === 0 ? 'on' :
                    index === 1 ? 'next' :
                        index === this.outImgs.length - 1 ? 'prev' :
                            'off';
            } else if (this.current === this.outImgs.length - 1) {
                return index === this.outImgs.length - 1 ? 'on' :
                    index === this.outImgs.length - 2 ? 'prev' :
                        index === 0 ? 'next' :
                            'off';
            }
            switch (index - this.current) {
                case 0:
                    return 'on';
                case 1:
                    return 'next';
                case -1:
                    return 'prev';
                default:
                    return 'off';
            }
        } else {
            return 'off';
        }
    }

/*    public Next() {
        this.current = (this.current + 1) % this.outImgs.length;
    }
    public Prev() {
        this.current = this.current - 1 < 0 ? this.outImgs.length - 1 : this.current - 1;
    }
    public Change(e) {
        if (e === 'left') {
            this.Next();
        } else if (e === 'right') {
            this.Prev();
        }
    }*/

}
