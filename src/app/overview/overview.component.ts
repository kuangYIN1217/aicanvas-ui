import {Component, Input} from "@angular/core";
import {ResourcesService} from "../common/services/resources.service";
import {JobService} from "../common/services/job.service";

import {Cpu, CpuInfo, Gpu, GpuInfo, JobInfo, SceneInfo} from "../common/defs/resources";
import * as d3 from "d3";
import {ActivatedRoute, Router} from "@angular/router";
import {AmChartsService} from "amcharts3-angular2";
import {modelService} from "../common/services/model.service";
import {SceneService} from "../common/services/scene.service";
declare var $:any;
@Component({
    moduleId: module.id,
    selector: 'overview',
    styleUrls: ['./css/overview.component.css'],
    templateUrl: './templates/overview.html',
    providers: [ResourcesService,JobService,SceneService]
})
export class OverviewComponent {
    gpuArray: Gpu[] = [];
    // infomation of cpu
    cpuInfoArray: CpuInfo[] = [];
    SceneInfo:SceneInfo[] = [];
    // list of jobs
    jobArray: JobInfo[] = [];
    createdJob: JobInfo = new JobInfo();
    // show resource or task 0--resource, 1--task
    GpuInfo:GpuInfo[]=[];
    tabIndex: number = 0;
    interval: any;
    student:number=0;
    id:number;
  focusImg:number=0;
    private timer: any;
    private chart: any;
  gpuIndex:number=0;
  cpuIndex:number=0;
  @Input() statuss:string='运行';
  @Input() sceneId:number=this.id;
  private chart2: any;
  private chart3: any;
  private chart4: any;
  private chart5: any;
  private chart6: any;
  private chart7: any;
  private chart8: any;
  tot_memory:number;
  totalGlobalMem:number;
    constructor(private sceneService: SceneService,private AmCharts: AmChartsService,private resourcesService: ResourcesService, private jobService: JobService,private route: ActivatedRoute ,private router: Router) {
        resourcesService.getCpuInfo()
        .subscribe(cpu => this.getCpu(cpu));
        resourcesService.getAllGpus()
        .subscribe(gpuArray => this.getGpus(gpuArray));
        //this.getAlljobs(this.page-1,this.pageMaxItem);
        // loading show
        this.sceneService.getAllScenes()
        .subscribe(scenes => this.SceneInfo=scenes);

        this.loading();
        this.interval = setInterval (() => {
            this.update();
        }, 10000);

        if (sessionStorage.overviewTab){
            this.changeTab(sessionStorage.overviewTab);
        }else{
            sessionStorage.overviewTab = 0;
            this.tabIndex = 0;
        }
    }
  makeRandomDataProvider1() {
    var dataProvider = [{
      created_at: "0",
      total_gpu_utilization:'0',
    }];
    return dataProvider;
  }
  makeRandomDataProvider2() {
    var dataProvider = [{
      created_at: "0",
      total_used_memory:'0',
    }];
    return dataProvider;
  }
 makeRandomDataProvider3() {
    var dataProvider = [{
      created_at: "0",
      cpu_utilization:'0',
    }];
    return dataProvider;
  }
  makeRandomDataProvider4() {
    var dataProvider = [{
      created_at: "0",
      percent:'0',
    }];
    return dataProvider;
  }
  makeRandomDataProvider5() {
    var dataProvider = [{
      created_at: "0",
      total_gpu_utilization:'0',
    }];
    return dataProvider;
  }
  makeRandomDataProvider6() {
    var dataProvider = [{
      created_at: "0",
      total_used_memory:'0',
    }];
    return dataProvider;
  }
  makeRandomDataProvider7() {
    var dataProvider = [{
      created_at: "0",
      cpu_utilization:'0',
    }];
    return dataProvider;
  }
  makeRandomDataProvider8() {
    var dataProvider = [{
      created_at: "0",
      used_memory:'0',
    }];
    return dataProvider;
  }
  ngOnInit() {
    this.chart = this.AmCharts.makeChart("chartdiv1", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 80,
      "dataProvider": this.makeRandomDataProvider1(),
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{

        "id":"g2",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 0,
        "lineColor": "#65af91",
        "lineColorField":"lineColor",
        "fillColorsField":"lineColor",
        "fillAlphas":"0.3",
        "lineThickness": 1,
        //"type": "smoothedLine",
        "type": "line",
        "valueField": "total_gpu_utilization"
      },
      ],
      "chartScrollbar": {
        "graph":"g2",
        // "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        // "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "dataDateFormat": "JJ:NN:SS",
      "categoryField": "created_at",
        "categoryAxis": {
        // "minPeriod": "YYYY",
        // "parseDates": true,
        "minorGridAlpha": 0.1,
          "labelsEnabled": false,
          "minorGridEnabled": true
      },
      "export": {
        "enabled": true
      }
    });
    this.chart2 = this.AmCharts.makeChart("chartdiv2", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 80,
      "dataProvider": this.makeRandomDataProvider2(),
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{

        "id":"g2",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 0,
        "lineColor": "#65af91",
        "lineColorField":"lineColor",
        "fillColorsField":"lineColor",
        "fillAlphas":"0.3",
        "lineThickness": 1,
        //"type": "smoothedLine",
        "type": "line",
        "valueField": "total_used_memory"
      },
      ],
      "chartScrollbar": {
        "graph":"g2",
        // "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        // "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "dataDateFormat": "JJ:NN:SS",
      "categoryField": "created_at",
      "categoryAxis": {
        "labelsEnabled": false,
        //"minPeriod": "YYYY",
        //"parseDates": true,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true
      }
    });
    this.chart3 = this.AmCharts.makeChart("chartdiv3", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 80,
      "dataProvider": this.makeRandomDataProvider3(),
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{

        "id":"g2",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 0,
        "lineColor": "#65af91",
        "lineColorField":"lineColor",
        "fillColorsField":"lineColor",
        "fillAlphas":"0.3",
        "lineThickness": 1,
        //"type": "smoothedLine",
        "type": "line",
        "valueField": "cpu_utilization"
      },
      ],
      "chartScrollbar": {
        "graph":"g2",
        // "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        // "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "dataDateFormat": "JJ:NN:SS",
      "categoryField": "created_at",
      "categoryAxis": {
        // "minPeriod": "YYYY",
        // "parseDates": true,
        "minorGridAlpha": 0.1,
        "labelsEnabled": false,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true
      }
    });
    this.chart4 = this.AmCharts.makeChart("chartdiv4", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 80,
      "dataProvider": this.makeRandomDataProvider4(),
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{

        "id":"g2",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 0,
        "lineColor": "#65af91",
        "lineColorField":"lineColor",
        "fillColorsField":"lineColor",
        "fillAlphas":"0.3",
        "lineThickness": 1,
        //"type": "smoothedLine",
        "type": "line",
        "valueField": "used_memory"
      },
      ],
      "chartScrollbar": {
        "graph":"g2",
       // "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        //"autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
       "dataDateFormat": "JJ:NN:SS",
      "categoryField": "created_at",
      "categoryAxis": {
        "labelsEnabled": false,
        //"minPeriod": "YYYY",
        //"parseDates": true,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true
      }
    });
    this.chart5 = this.AmCharts.makeChart("chartdiv5", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 80,
      "dataProvider": this.makeRandomDataProvider5(),
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{

        "id":"g2",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 0,
        "lineColor": "#65af91",
        "lineColorField":"lineColor",
        "fillColorsField":"lineColor",
        "fillAlphas":"0.3",
        "lineThickness": 1,
        //"type": "smoothedLine",
        "type": "line",
        "valueField": "total_gpu_utilization"
      },
      ],
      "chartScrollbar": {
        "graph":"g2",
        // "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        // "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "dataDateFormat": "JJ:NN:SS",
      "categoryField": "created_at",
      "categoryAxis": {
        // "minPeriod": "YYYY",
        // "parseDates": true,
        "minorGridAlpha": 0.1,
        "labelsEnabled": false,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true
      }
    });
    this.chart6 = this.AmCharts.makeChart("chartdiv6", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 80,
      "dataProvider": this.makeRandomDataProvider6(),
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{

        "id":"g2",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 0,
        "lineColor": "#65af91",
        "lineColorField":"lineColor",
        "fillColorsField":"lineColor",
        "fillAlphas":"0.3",
        "lineThickness": 1,
        //"type": "smoothedLine",
        "type": "line",
        "valueField": "total_used_memory"
      },
      ],
      "chartScrollbar": {
        "graph":"g2",
        // "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        // "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "dataDateFormat": "JJ:NN:SS",
      "categoryField": "created_at",
      "categoryAxis": {
        "labelsEnabled": false,
        //"minPeriod": "YYYY",
        //"parseDates": true,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true
      }
    });
    this.chart7 = this.AmCharts.makeChart("chartdiv7", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 80,
      "dataProvider": this.makeRandomDataProvider7(),
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{

        "id":"g2",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 0,
        "lineColor": "#65af91",
        "lineColorField":"lineColor",
        "fillColorsField":"lineColor",
        "fillAlphas":"0.3",
        "lineThickness": 1,
        //"type": "smoothedLine",
        "type": "line",
        "valueField": "cpu_utilization"
      },
      ],
      "chartScrollbar": {
        "graph":"g2",
        "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "dataDateFormat": "JJ:NN:SS",
      "categoryField": "created_at",
      "categoryAxis": {
        "labelsEnabled": false,
        //"minPeriod": "YYYY",
        // "parseDates": true,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true
      }
    });
    this.chart8 = this.AmCharts.makeChart("chartdiv8", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 80,
      "dataProvider": this.makeRandomDataProvider8(),
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{

        "id":"g2",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 0,
        "lineColor": "#65af91",
        "lineColorField":"lineColor",
        "fillColorsField":"lineColor",
        "fillAlphas":"0.3",
        "lineThickness": 1,
        //"type": "smoothedLine",
        "type": "line",
        "valueField": "used_memory"
      },
      ],
      "chartScrollbar": {
        "graph":"g2",
        "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "dataDateFormat": "JJ:NN:SS",
      "categoryField": "created_at",
      "categoryAxis": {
        "labelsEnabled": false,
        //"minPeriod": "YYYY",
        //"parseDates": true,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true
      }
    });
  }
    ngOnDestroy(){
        // 退出时停止更新
        if(this.interval){
            clearInterval(this.interval);
        }
      clearInterval(this.timer);
      this.AmCharts.destroyChart(this.chart);
    }
    loading(){
    }
  selectChange(){
    this.id=this.student;
  }
    getCpu(cpu){
        // console.log(cpu);
        this.resourcesService.getCpuStatus()
        /*.subscribe(cpuInfoArray => this.getCpuInfo(cpuInfoArray,cpu));*/
         .subscribe(cpuInfoArray =>  {
           this.cpuInfoArray = cpuInfoArray;
           this.tot_memory = cpu.tot_memory;
           for(let i = 0;i<this.cpuInfoArray.length;i++){
            let cpuInfo = cpuInfoArray[i].used_memory;
            let data = Number((cpuInfo/this.tot_memory).toFixed(2))*100;
             cpuInfoArray[i].used_memory = data;
          }
           //console.log(cpuInfoArray[0].used_memory);
           this.AmCharts.updateChart(this.chart3, () => {
             this.chart3.dataProvider = cpuInfoArray;
           });
           this.AmCharts.updateChart(this.chart4, () => {
             this.chart4.dataProvider = cpuInfoArray;
           });
          });

    }
    getCpuInfo(cpuInfoArray: CpuInfo[],cpu: Cpu){
        console.log(cpuInfoArray);
        this.cpuInfoArray = cpuInfoArray;
        if(cpuInfoArray.length>500){
            this.cpuInfoArray = cpuInfoArray.slice(-201,-1);
        }
        this.drawCpuLine(this.cpuInfoArray);
        this.drawCpuPie(this.cpuInfoArray,cpu);
    }
    getGpus(gpuArray: Gpu[]){
        // 如果长度不变且不为0 默认gpu没变，不需改变this.gpuArray,因为改变this.gpuArray时，页面会刷新
        if(this.gpuArray.length!=0&&this.gpuArray.length==gpuArray.length){
            for (let gpu of this.gpuArray){
                let id = gpu.id;
                this.resourcesService.getGpuStatus(id)
                /*.subscribe(gpuInfoArray => this.getGpuInfo(gpuInfoArray,gpu));*/
                  .subscribe(gpuInfoArray => {
                    //
                    // this.AmCharts.updateChart(this.chart, () => {
                    //   this.chart.dataProvider = gpuInfoArray;
                    // });
                  });
            }
        }else{
            this.gpuArray = gpuArray;
          this.totalGlobalMem = this.gpuArray[0].totalGlobalMem;
         // console.log(this.totalGlobalMem);
            for (let gpu of this.gpuArray){
                let id = gpu.id;
                if(id==0){
                  this.resourcesService.getGpuStatus(id)
                  /*.subscribe(gpuInfoArray => this.getGpuInfo(gpuInfoArray,gpu));*/
                    .subscribe(gpuInfoArray => {
                      this.GpuInfo = gpuInfoArray;
                      for(let i = 0;i<this.GpuInfo.length;i++){
                        let gpuInfo = gpuInfoArray[i].total_used_memory;
                        let data = Number((gpuInfo/this.totalGlobalMem).toFixed(2))*100;
                        gpuInfoArray[i].total_used_memory = data;
                      }
                      this.AmCharts.updateChart(this.chart, () => {
                        this.chart.dataProvider = gpuInfoArray;
                      });
                      this.AmCharts.updateChart(this.chart2, () => {
                        this.chart2.dataProvider = gpuInfoArray;
                      });
                    });
                }else if(id==1){
                  this.resourcesService.getGpuStatus(id)
                  /*.subscribe(gpuInfoArray => this.getGpuInfo(gpuInfoArray,gpu));*/
                    .subscribe(gpuInfoArray => {
                      this.GpuInfo = gpuInfoArray;
                      this.AmCharts.updateChart(this.chart5, () => {
                        this.chart5.dataProvider = gpuInfoArray;
                      });
                      this.AmCharts.updateChart(this.chart6, () => {
                        this.chart6.dataProvider = gpuInfoArray;
                      });
                    });
                }

            }
        }
    }
    getGpuInfo(gpuInfoArray: GpuInfo[], gpu: Gpu){
        this.drawGpuLine(gpuInfoArray,gpu);
        this.drawGpuPie(gpuInfoArray,gpu);
    }

    drawCpuLine(cpuInfoArray: CpuInfo[]){
        let dataset = [];
        let index = 0;
        for (let cpuInfo of cpuInfoArray){
            dataset.push({x:index,y:cpuInfo.cpu_utilization});
            index++;
        }
        var selector = "#cpu_utilization_line";
        d3.select(selector).select( 'svg' ).selectAll('path').remove();
        d3.select(selector).select( 'svg' ).selectAll('g').remove();
        var svg = d3.select(selector).select("svg");
        this.drawLine(svg,dataset,15);
        this.addStyle();
    }
    drawCpuPie(cpuInfoArray: CpuInfo[],cpu: Cpu){
        // console.log("drawCpuPie");
        d3.select('#cpu_storage_pie').select( 'svg' ).remove();
        d3.select('#cpu_storage_pie').select( 'svg' ).remove();
        d3.select('#proportion').select( 'svg' ).remove();
        let cpuInfo = cpuInfoArray[cpuInfoArray.length-1];
        let used_memory = cpuInfo.used_memory;
        let tot_memory = cpu.tot_memory;
        let not_used_memory = tot_memory - used_memory;

        var selector = "#cpu_storage_pie";
        // var random = Math.random();

        var dataset = [["已用空间",used_memory],["剩余空间",not_used_memory]];
        // var dataset = [["已用空间",random],["剩余空间",1-random]];
        var selector2 = "#proportion";

        var svg=d3.select(selector).append("svg");
        var proportion=d3.select(selector2);
        this.drawPie(svg,dataset,proportion);
        this.addStyle();
    }
    drawGpuLine(gpuInfoArray: GpuInfo[], gpu: Gpu){
        let gpuId = gpu.id;
        let dataset = [];
        let index = 0;
        for (let gpuInfo of gpuInfoArray){
            dataset.push({x:index,y:gpuInfo.total_gpu_utilization});
            index++;
        }
        var selector = "#gpu_utilization_line"+gpuId;
        d3.select(selector).select( 'svg' ).selectAll('path').remove();
        d3.select(selector).select( 'svg' ).selectAll('g').remove();
        var svg = d3.select(selector).select("svg");
        this.drawLine(svg,dataset,100);
        this.addStyle();
    }
    drawGpuPie(gpuInfoArray: GpuInfo[], gpu: Gpu){
        let gpuInfo = gpuInfoArray[gpuInfoArray.length-1];
        let total_used_memory = gpuInfo.total_used_memory;
        let totalGlobalMem = gpu.totalGlobalMem;
        let not_used_memory = totalGlobalMem - total_used_memory;
        let gpuId = gpu.id;

        var selector = "#gpu_storage_pie"+gpuId;
        var selector2 = "#proportion"+gpuId;

        d3.select(selector).select( 'svg' ).remove();
        d3.select(selector).select( 'svg' ).remove();
        d3.select(selector2).select( 'svg' ).remove();

        var dataset = [["已用空间",total_used_memory],["剩余空间",not_used_memory]];
        // var random = Math.random();
        // var dataset = [["已用空间",cpu_utilization],["剩余空间",1-cpu_utilization]];
        // var dataset = [["已用空间",random],["剩余空间",1-random]];

        var svg=d3.select(selector).append("svg");
        var proportion = d3.select(selector2);
        this.drawPie(svg,dataset,proportion);
        this.addStyle();
    }
    update(){
        this.resourcesService.getCpuInfo()
        .subscribe(cpu => this.getCpu(cpu));
        this.resourcesService.getAllGpus()
        .subscribe(gpuArray => this.getGpus(gpuArray));
        // this.getGpus(this.gpuArray);
    }
    changeTab(tabIndex: number){
        this.tabIndex = tabIndex;
        sessionStorage.overviewTab = tabIndex;
    }
    gpuToggle(){
       if(this.gpuIndex==0&&this.focusImg==0){
         this.gpuIndex = 1;
         this.focusImg=1;
       }else{
         this.gpuIndex = 0;
         this.focusImg=0;
       }
    }
/*  cpuToggle(){
    if(this.cpuIndex==0){
      this.cpuIndex = 1;
    }else{
      this.cpuIndex = 0;
    }
  }*/
    // 增加样式
    addStyle(){
        //change color
        $("text")
            .attr("fill","none")
            .attr("stroke","#e1e1e1")
            .attr("font-size","14px");
        $(".domain")
            .attr("fill","none")
            .attr("stroke","white")
            .attr("stroke-width","1.5px");
        $("line")
            .attr("fill","none")
            .attr("stroke","white")
            .attr("stroke-width","1.5px");
        $(".gridline")
            .attr("fill","none")
            .attr("stroke","white")
            .attr("stroke-width","0.5px")
            .attr("opacity","0.5");
    }
    //画饼图的函数
    drawPie(svg,dataset,proportion){

        var width=240;
        var height=240;
        svg.attr("width",width)
        .attr("height",height);
        //转换数据
        var pie=d3.pie() //创建饼状图
        .value(function(d){
            return d[1];
        });//值访问器
        //dataset为转换前的数据 piedata为转换后的数据
        var piedata=pie(dataset);

        //绘制
        var outerRadius=width/2;
        var innerRadius=0;//内半径和外半径

        //创建弧生成器
        var arc=d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
        var color = d3.scaleOrdinal(d3.schemeCategory20b);
        //添加对应数目的弧组
        var arcs=svg.selectAll("g")
        .data(piedata)
        .enter()
        .append("g")
        .attr("transform","translate("+(width/2)+","+(height/2)+")");
        //添加弧的路径元素
        arcs.append("path")
        .attr("fill",function(d,i){
            return color(i);  //颜色
        })
        .attr("d",function(d){
            return arc(d);//使用弧生成器获取路径
        });

        var svg = proportion.append("svg")
        .attr("width",200)
        .attr("height",140)
        ;
        var x=0;
        var y=0;//文字的x坐标

        //画圆形
        var circle = svg.selectAll("circle")
        .data(piedata)
        .enter()
        .append("circle")
        .attr("cx",7.5)
        .attr("cy",7.5)
        .attr("r",7.5)
        .style("position","relative")
        .style("margin-top","5px")
        .attr("fill",function(d,i){
            return color(i);  //颜色
        })
        .attr("transform",function(){
            x=0;//x坐标
            if(y>80) y=0;
            y=y+22;
            return "translate("+x+","+y+")";
        });
        var y1=15;
        var y2=15;
        var tt=svg.selectAll("g")
        .data(piedata)
        .enter()
        .append("g")  ;
        tt.append("text")
        .style("font-family","Microsoft YaHei")
        .style("font-size","18")
        .style("color","#e0e0e0")
        .text(function(d){
            return d.data[0];
        })
        .attr("transform",function(){
            x=30;//x坐标
            if(y1>95) y1=15;
            y1=y1+22;
            return "translate("+x+","+y1+")";
        }) ;
        tt .append("text")
        .text(function(d){
            //百分比
            var percent=Number(d.value)/d3.sum(dataset,function(d){
                return d[1];
            })*100;
            //保留一位小数点 末尾加一个百分号返回
            return percent.toFixed(1)+"%";
        })
        .attr("transform",function(){
            x=110;//x坐标
            if(y2>95) y2=15;
            y2=y2+22;
            return "translate("+x+","+y2+")";
        }) ;
    }
    // CPU波动
    drawLine(svg,dataset,Ymax){
        var margin = {top: 40, right:40, bottom: 40, left: 20};
        var width = 900- margin.left - margin.right;
        var height = 360- margin.top - margin.bottom;
        svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

        var x = d3.scaleLinear().range([0, width]);
        // var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // var data2 = [
        //     {x: 0, y: 3},
        //     {x: 1, y: 4.2},
        //     {x: 2, y: 4.8},
        //     {x: 3, y: 3.8},
        //     {x: 4, y: 5.7},
        //     {x: 5, y: 6},
        //     {x: 6, y: 8}
        // ];

        // console.log(dataset);
        var data2 = dataset;

        var xAxis = d3.axisBottom(x)
        .ticks(10);
        var yAxis = d3.axisLeft(y)
        .ticks(10);

        var line = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); })
        .curve(d3.curveLinear);

        var area = d3.area()
        .defined(line.defined())
        .x(line.x())
        .y1(line.y())
        .y0(y(0));//360

        x.domain( [ 0, dataset.length]);
        y.domain( [ 0, Ymax]);

        svg.append("path")
        .attr( 'class', 'lineChart--area' )
        .attr('transform', 'translate(45,27)')
        .attr("d", area(data2));

        var path = svg.append('path')
        .attr('class', 'line')
        .attr( 'class', 'lineChart--areaLine' )
        .attr('transform', 'translate(45,27)')
        .attr('d', line(data2));

        var grid = svg.selectAll(".grid")
        .data(x.ticks(6))
        .enter().append("g")
        .attr("class", "grid");

        // 横坐标
        // 横坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(45,' + (height+27) + ')')
        .call(xAxis)
        // 增加坐标值说明
        .append('text')
        .text('时间')
        .attr('transform', 'translate(' + width +', 38)');

        // 纵坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(45,27)')
        .call(yAxis)
        .append('text')
        .text('CPU %')
        .attr('transform', 'translate(20, -10)');

        // 横线
        grid.data(x.ticks(6));
        grid.append("line")
        .attr("class","gridline")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", height).attr('transform', 'translate(45,27)');
        // 竖线
        grid.data(y.ticks(5));
        grid.append("line")
        .attr("class","gridline")
        .attr("y1", y)
        .attr("y2", y)        .attr("x1", 0)
        .attr("x2", width).attr('transform', 'translate(45,27)');
    }
}
