import {animate, Component, Input, keyframes, state, style, transition, trigger} from "@angular/core";
import {ResourcesService} from "../common/services/resources.service";
import {modelService} from "../common/services/model.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SERVER_URL} from "../app.constants";
import {inferenceResult, Page} from "../common/defs/resources";
/*import { SlideImg } from './slide-img.interface';*/
@Component({
    moduleId: module.id,
    selector: 'showResult',
    styleUrls: ['./css/showResult.component.css'],
    templateUrl: './templates/showResult.html',
    providers: [ResourcesService, modelService],
    animations: [
         trigger('imgMove', [
             state('off', style({'display': 'none', 'z-index': '0', 'transform': 'scale(0)'})),
             state('prev', style({'z-index': '1', 'transform': 'scale(0)'})),
             state('next', style({'z-index': '2', 'transform': 'scale(0)'})),
             state('on', style({'z-index': '3', 'transform': 'scale(1)'})),
                 transition('prev=>on', [
                     animate(1000, keyframes([
                         style({ opacity: 0 }),
                         style({ opacity: 1})
                     ]))
                 ]),
                transition('next=>on', [
                    animate(1000, keyframes([
                        style({ opacity: 1 }),
                        style({ opacity: 0})
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
                         style({ opacity: 1 }),
                         style({ opacity: 0})
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
    content:any[]=[
      {
        "id": 351483,
        "resultType": "multiple_labeled_images",
        "inputPath": "/home/ligang/dataset/input/admin/351482/1/1497435530873SEVP_JSMC_RADR_R_BENJ_E15_PI_20160623100600000-2.png",
        "output": "[{\"image_file_name\":\"\\/home\\/ligang\\/dataset\\/output\\/admin\\/351482\\/1497435530873SEVP_JSMC_RADR_R_BENJ_E15_PI_20160623100600000-2.png.output\\/output_img_1.bmp\",\"label\":\"index 1, intensity\"}]",
        "success": true,
        "modelPrediction": {
          "id": 351482,
          "predictionName": "q",
          "job": {
            "id": 351479,
            "jobName": "thunder",
            "jobPath": "L2hvbWUvbGlnYW5nL2FlLXNlcnZlci9hZS9iYWNrZW5kZGV2L3VzZXJzL2FkbWluL2pvYnMvam9iNzE=",
            "user": {
              "id": 3,
              "login": "admin",
              "firstName": "Administrator",
              "lastName": "Administrator",
              "email": "admin@localhost",
              "activated": true,
              "langKey": "en",
              "imageUrl": "",
              "resetKey": null,
              "resetDate": null
            },
            "createTime": "2017-06-14 18:11:57",
            "dataSet": null,
            "chainId": "c0007_admin_1497435117",
            "sences": "7",
            "sencesName": "雷暴识别",
            "status": "完成",
            "startTime": "2017-06-14 18:12:02",
            "stopTime": "2017-06-14 18:15:40",
            "runningTime": "218",
            "percent": "0.00",
            "whichGpu": "",
            "samples_sec": null
          },
          "inputPath": "/home/ligang/dataset/input/admin/351482",
          "outputPath": "/home/ligang/dataset/output/admin/351482",
          "percent": "0.00",
          "user": {
            "id": 3,
            "login": "admin",
            "firstName": "Administrator",
            "lastName": "Administrator",
            "email": "admin@localhost",
            "activated": true,
            "langKey": "en",
            "imageUrl": "",
            "resetKey": null,
            "resetDate": null
          },
          "status": "success",
          "createTime": "2017-06-14 18:18:51"
        }
      },
      {
        "id": 351484,
        "resultType": "multiple_labeled_images",
        "inputPath": "/home/ligang/dataset/input/admin/351482/1/1497435530832SEVP_JSMC_RADR_R_BENJ_E15_PI_20160623095400000-2.png",
        "output": "[{\"image_file_name\":\"\\/home\\/ligang\\/dataset\\/output\\/admin\\/351482\\/1497435530832SEVP_JSMC_RADR_R_BENJ_E15_PI_20160623095400000-2.png.output\\/output_img_1.bmp\",\"label\":\"index 1, intensity\"}]",
        "success": true,
        "modelPrediction": {
          "id": 351482,
          "predictionName": "q",
          "job": {
            "id": 351479,
            "jobName": "thunder",
            "jobPath": "L2hvbWUvbGlnYW5nL2FlLXNlcnZlci9hZS9iYWNrZW5kZGV2L3VzZXJzL2FkbWluL2pvYnMvam9iNzE=",
            "user": {
              "id": 3,
              "login": "admin",
              "firstName": "Administrator",
              "lastName": "Administrator",
              "email": "admin@localhost",
              "activated": true,
              "langKey": "en",
              "imageUrl": "",
              "resetKey": null,
              "resetDate": null
            },
            "createTime": "2017-06-14 18:11:57",
            "dataSet": null,
            "chainId": "c0007_admin_1497435117",
            "sences": "7",
            "sencesName": "雷暴识别",
            "status": "完成",
            "startTime": "2017-06-14 18:12:02",
            "stopTime": "2017-06-14 18:15:40",
            "runningTime": "218",
            "percent": "0.00",
            "whichGpu": "",
            "samples_sec": null
          },
          "inputPath": "/home/ligang/dataset/input/admin/351482",
          "outputPath": "/home/ligang/dataset/output/admin/351482",
          "percent": "0.00",
          "user": {
            "id": 3,
            "login": "admin",
            "firstName": "Administrator",
            "lastName": "Administrator",
            "email": "admin@localhost",
            "activated": true,
            "langKey": "en",
            "imageUrl": "",
            "resetKey": null,
            "resetDate": null
          },
          "status": "success",
          "createTime": "2017-06-14 18:18:51"
        }
      }
    ];
    public current;
    constructor(private modelService: modelService, private route: ActivatedRoute, private router: Router) {
      this.route.queryParams.subscribe(params => {
        this.model_id = params['runId'];
        if (this.model_id && this.model_id != -1) {
          this.model_pre = this.model_id;
          this.interval = setInterval(() => this.getResult(this.model_id, this.page - 1, this.pageMaxItem), 500);
        }
      });
        this.current = 0;
       setInterval(() => {
            let id = (this.current + 1) % 4;
            this.current = id;
            //console.log(this.current);
        },1000);
      for(let i in this.content){
        this.inImgs.push(this.content[i].inputPath);
        this.outImgs.push(this.content[i].output);
      }
      console.log(this.inImgs);
      console.log(this.outImgs);
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
        this.result = this.content;
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
    return JSON.parse(this.stringArr).image_file_name
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
