import {Component} from "@angular/core";
import {Location} from "@angular/common";
// import { ActivatedRoute,Params} from '@angular/router';
import {JobService} from "../common/services/job.service";

import {JobInfo, JobParameter, UserInfo} from "../common/defs/resources";
import {AmChartsService} from "amcharts3-angular2";
declare var $: any;
declare var unescape: any;
@Component({
  moduleId: module.id,
  selector: 'jobDetail',
  styleUrls: ['./css/jobDetail.component.css'],
  templateUrl: './templates/jobDetail.html',
  providers: [JobService]
})
export class JobDetailComponent {
  jobResultParam = [];
  job: JobInfo = new JobInfo();
  user: UserInfo = new UserInfo();
  jobParam: JobParameter[] = [];
  initial: number = 0;
  interval: any;
  index: number = -1;
  lossArray = [];
  accuracyArray = [];
  val_loss_array = [];
  val_acc_array = [];
  jobResult: any = {};
  MAX_CIRCLE = 40;

  private timer: any;
  private lossChart: any;
  private metricsChart: any;


  lossChartInitData() {
    var dataProvider = [{
      loss: "0",
      epoch: "0"
    }];


    return dataProvider;
  }

  metricsChartInitData() {
    var dataProvider = [{
      metrics_value: "0",
      epoch: "0"
    }];


    return dataProvider;
  }


  constructor(private jobService: JobService, private location: Location, private AmCharts: AmChartsService) {
    if (location.path(false).indexOf('/jobDetail/') != -1) {
      let jobPath = location.path(false).split('/jobDetail/')[1];
      if (jobPath) {
        jobPath = unescape(jobPath);
        // jobService.getJob(jobPath)
        //     .subscribe(jobParam => this.jobParam = jobParam);
        jobService.getJobDetail(jobPath).subscribe(jobDetail => {
          this.job = jobDetail;
          this.user = this.job.user;
          if (this.job.status == "Running") {
            // console.log("Running");
            this.updatePage(jobPath, this.index);
            this.interval = setInterval(() => this.updatePage(jobPath, this.index), 3000);
          } else {
            // console.log("not Running");
            this.not_running_show(jobPath);
          }
        });
      }
    }
  }


  ngOnInit() {
    this.lossChart = this.AmCharts.makeChart("lossGraph", {
      "type": "serial",
      "theme": "light",
      "marginTop": 10,
      "marginRight": 80,
      "dataProvider": this.lossChartInitData(),
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{
        "id": "g1",
        // "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        // "bullet": "round",
        // "bulletSize": 8,
        "lineColor": "#d1655d",
        "fillAlphas": "0.3",
        "lineThickness": 2,
        "negativeLineColor": "#d1655d",
        "type": "smoothedLine",
        "valueField": "loss"
      }],
      "chartScrollbar": {
        "graph": "g1",
        "gridAlpha": 0,
        "color": "#888888",
        "scrollbarHeight": 55,
        "backgroundAlpha": 0,
        "selectedBackgroundAlpha": 0.1,
        "selectedBackgroundColor": "#888888",
        "graphFillAlpha": 0,
        "autoGridCount": true,
        "selectedGraphFillAlpha": 0,
        "graphLineAlpha": 0.2,
        "graphLineColor": "#c2c2c2",
        "selectedGraphLineColor": "#888888",
        "selectedGraphLineAlpha": 1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled": true,
        "valueLineBalloonEnabled": true,
        "valueLineAlpha": 0.5,
        "fullWidth": true
      },
      "categoryField": "epoch",
      "categoryAxis": {
        "maxSeries": 300,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
      },

      "export": {
        "enabled": true
      }
    });
    this.metricsChart = this.AmCharts.makeChart("metricsGraph", {
      "type": "serial",
      "theme": "light",
      "marginTop": 10,
      "marginRight": 80,
      "dataProvider": this.metricsChartInitData(),
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{
        "id": "g1",
        // "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        // "bullet": "round",
        // "bulletSize": 8,
        "lineColor": "#d1655d",
        "fillAlphas": "0.3",
        "lineThickness": 2,
        "negativeLineColor": "#d1655d",
        "type": "smoothedLine",
        "valueField": "metrics_value"
      }],
      "chartScrollbar": {
        "graph": "g1",
        "gridAlpha": 0,
        "color": "#888888",
        "scrollbarHeight": 55,
        "backgroundAlpha": 0,
        "selectedBackgroundAlpha": 0.1,
        "selectedBackgroundColor": "#888888",
        "graphFillAlpha": 0,
        "autoGridCount": true,
        "selectedGraphFillAlpha": 0,
        "graphLineAlpha": 0.2,
        "graphLineColor": "#c2c2c2",
        "selectedGraphLineColor": "#888888",
        "selectedGraphLineAlpha": 1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled": true,
        "valueLineBalloonEnabled": true,
        "valueLineAlpha": 0.5,
        "fullWidth": true
      },
      "categoryField": "epoch",
      "categoryAxis": {
        "maxSeries": 300,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true
      }
    });
  }

  ngOnDestroy() {
    // 退出时停止更新
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.AmCharts.destroyChart(this.lossChart);
    this.AmCharts.destroyChart(this.metricsChart);
  }


  // 不再running状态时一次性展示数据
  not_running_show(jobPath: string) {
    this.jobService.getUnrunningJob(jobPath)
      .subscribe(jobParam => {
        this.jobResultParam = this.jobResultParam.concat(jobParam);
        this.jobResult = this.jobResultParam[this.jobResultParam.length - 1];

        console.log(this.jobResult)
        // debugger
        // this.update(jobParam);
        this.AmCharts.updateChart(this.lossChart, () => {
          this.lossChart.dataProvider = this.jobResultParam;
        });
        this.AmCharts.updateChart(this.metricsChart, () => {
          this.metricsChart.dataProvider = this.jobResultParam;
        });
      });
  }

  updatePage(jobPath, index) {
    this.jobService.getJobDetail(jobPath).subscribe(jobDetail => {
      this.job = jobDetail;
      this.user = this.job.user;
    });
    this.jobService.getJob(jobPath, index)
      .subscribe(jobParam => {
        this.jobResultParam = this.jobResultParam.concat(jobParam);
        this.jobResult = this.jobResultParam[this.jobResultParam.length - 1];

        this.index = this.jobResult.epoch;
        // debugger
        // this.update(jobParam);
        this.AmCharts.updateChart(this.lossChart, () => {
          this.lossChart.dataProvider = this.jobResultParam;
        });
        this.AmCharts.updateChart(this.metricsChart, () => {
          this.metricsChart.dataProvider = this.jobResultParam;
        });
        this.jobResult = jobParam[jobParam.length - 1];
        // this.jobResult =jobParam.jobResult;
      });
    // console.log(this.index);
  }


  stop(jobPath: string) {
    this.jobService.stopJob(jobPath).subscribe(job=>{
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.jobService.getJobDetail(jobPath).subscribe(jobDetail => {
        this.job = jobDetail;
        this.user = this.job.user;
      });
    });
  }


}
