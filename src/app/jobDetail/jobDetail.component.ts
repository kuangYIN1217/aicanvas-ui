import {Component} from "@angular/core";
import {Location} from "@angular/common";
import {JobService} from "../common/services/job.service";
import {JobInfo, JobParameter, PluginInfo, UserInfo} from "../common/defs/resources";
import {AmChartsService} from "amcharts3-angular2";
import {Router} from "@angular/router";
import {AlgChainService} from "../common/services/algChain.service";
import {Editable_param} from "../common/defs/parameter";
import {PluginService} from "../common/services/plugin.service";
import {WebSocketService} from "../web-socket.service";

declare var $: any;
declare var unescape: any;
@Component({
  moduleId: module.id,
  selector: 'jobDetail',
  styleUrls: ['./css/jobDetail.component.css'],
  templateUrl: './templates/jobDetail.html',

  providers: [JobService,AlgChainService,PluginService,WebSocketService]
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
  tabIndex: number = 0;
  private timer: any;
  private lossChart: any;
  private metricsChart: any;
  changeIndex:number=0;
  pluginArr: PluginInfo[] = [];
  rightBox_node:number = 0;
  chosenPluginId: string;
  haveModel: number;
  statusIndex:number;
  lookIt:number;
  editable_params: Editable_param[] = [];
  editable_parameters: Editable_param[] = [];
  log_list = [];
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
  constructor( private pluginService: PluginService ,private algchainService: AlgChainService,private jobService: JobService, private location: Location, private AmCharts: AmChartsService,private router:Router,private websocket:WebSocketService) {
    if (location.path(false).indexOf('/jobDetail/') != -1) {
      let jobPath = location.path(false).split('/jobDetail/')[1];
      if (jobPath) {
        jobPath = unescape(jobPath);
        // jobService.getJob(jobPath)
        //     .subscribe(jobParam => this.jobParam = jobParam);
        jobService.getJobDetail(jobPath).subscribe(jobDetail => {
          if(jobDetail){
            this.job = jobDetail;
            this.user = this.job.user;
            if (this.job.status == "运行") {
              // console.log("Running");
              this.jobService.resetLog(jobPath).subscribe(data=>{
                this.updatePage(jobPath, this.index);
                this.interval = setInterval(() => {
                  this.jobService.getJobDetail(jobPath).subscribe(jobDetail => {
                    this.job = jobDetail;
                    this.user = this.job.user;
                  });
                }, 1000);
              });

            } else {
              // console.log("not Running");
              this.not_running_show(jobPath);
            }
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
      },{
        "id": "g2",
        // "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        // "bullet": "round",
        // "bulletSize": 8,
        "lineColor": "#23a880",
        "fillAlphas": "0.3",
        "lineThickness": 2,
        "negativeLineColor": "#23a880",
        "type": "smoothedLine",
        "valueField": "val_loss"
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
      },{
        "id": "g2",
        // "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        // "bullet": "round",
        // "bulletSize": 8,
        "lineColor": "#23a880",
        "fillAlphas": "0.3",
        "lineThickness": 2,
        "negativeLineColor": "#23a880",
        "type": "smoothedLine",
        "valueField": "val_metrics_value"
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
        "minorGridEnabled": true,
      },
      "export": {
        "enabled": true
      }
    });
    this.pluginService.getTranParamTypes()
      .subscribe(editable_params => this.editable_params = editable_params);
    this.pluginService.getLayerDict()
      .subscribe(dictionary => this.getDictionary(dictionary));
  }

  ngOnDestroy() {
    // 退出时停止更新
    if (this.interval) {
      clearInterval(this.interval);
    }
    // this.websocket.unsubscribe();
    // this.websocket.disconnect(null);
    this.AmCharts.destroyChart(this.lossChart);
    this.AmCharts.destroyChart(this.metricsChart);
  }
  nodeClicked(){
    // 改变右侧显示的内容--显示node
    this.rightBox_node = 1;
  }
  changeTab(chainId,index,status){
    this.lookIt = 1;
    this.changeIndex = index;
    if(status=="运行"){
      this.statusIndex = 0;
    }else{
      this.statusIndex = 1;
    }
    this.algchainService.getChainById(chainId)
      .subscribe(plugin=>{
        this.pluginArr=plugin;
         //console.log(this.pluginArr[0]);
        this.changeChosenPlugin(this.pluginArr[0].id);
      });
  }
  goback(){
    this.changeIndex=0;
    this.lookIt = 0;
}
  changeChosenPlugin(id:string){
    if(!this.chosenPluginId){
      this.chosenPluginId = id;
      let training_network_json = this.findPluginById(this.chosenPluginId).model;
      // 有网络层
      if (training_network_json){
        this.haveModel = 1;
        // console.log(this.findPluginById(this.chosenPluginId));
        // console.log(training_network_json);
        $('#plugin_storage').val(JSON.stringify(training_network_json));
        $('#hideBtn').click();
      }
      // 无网络层则无需任何操作
    }else{
      // this.savePluginChange();
      this.chosenPluginId = id;
      let training_network_json = this.findPluginById(this.chosenPluginId).model;
      if(training_network_json){
        // console.log(training_network_json);
        let inited = false;
        if ($('#plugin_storage').val()&&$('#plugin_storage').val()!==""){
          inited = true;
        }
        $('#plugin_storage').val(JSON.stringify(training_network_json));
        if(inited){
          $('#loadBtn').click();
          // 等待动画效果结束后再展示，否则会闪烁一下
          setTimeout(() => {
            this.haveModel = 1;
          },50);
        }else{
          $('#hideBtn').click();
          this.haveModel = 1;
        }
      }else{
        // 无网络层则将网络层隐藏
        this.haveModel = 0;
      }
    }
    this.pluginClicked();
  }
  pluginClicked(){
    let editable_parameters: Editable_param[] = [];
    let params: any = this.findPluginById(this.chosenPluginId).train_params;
    // console.log(params);
    for(var param in params){
      // console.log(param);
      for (let editable_parameter of this.editable_params){
        if (editable_parameter.path == param){
          editable_parameter.editable_param.set_value = params[param];
          editable_parameters.push(editable_parameter);
          break;
        }
      }
    }
    // 更新变量
    this.editable_parameters = editable_parameters;

    // 改变右侧显示的内容--显示plugin
    this.rightBox_node = 0;
  }
  findPluginById(id:string){
    for (let plugin of this.pluginArr){
      if (plugin.id == id){
        return plugin;
      }
    }
  }
  getDictionary(dictionary){
    $('#layer_dictionary').val(JSON.stringify(dictionary));
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

    this.jobService.getUnrunningJob(jobPath )
      .subscribe(jobParam => {
        this.jobResultParam = this.jobResultParam.concat(jobParam);
        this.jobResult = this.jobResultParam[this.jobResultParam.length - 1];
        if(this.jobResult)
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
        this.websocket.connect().then(()=>{
          this.websocket.subscribe('/job/'+jobPath,(data)=>{
            this.updateChart(data);
          });

          this.websocket.subscribe('/logs/'+jobPath,(data)=>{
            this.log_list=this.log_list.concat(data);
            console.log(data);
          });
        })
        // this.jobResult =jobParam.jobResult;

      });
    // console.log(this.index);
  }


  updateChart(data){
    let temp:JobParameter = data;
    this.jobResultParam.push(temp);
    this.AmCharts.updateChart(this.lossChart, () => {
      this.lossChart.dataProvider = this.jobResultParam;
    });
    this.AmCharts.updateChart(this.metricsChart, () => {
      this.metricsChart.dataProvider = this.jobResultParam;
    });
    this.jobResult = temp;
  }


  stop(jobPath: string) {
    this.jobService.stopJob(jobPath).subscribe(job=>{
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.index=-1;
      this.jobService.getJobDetail(jobPath).subscribe(jobDetail => {
        this.job = jobDetail;
        this.user = this.job.user;
      });
    });
  }


  start(jobPath: string){
    this.jobService.runJob(jobPath)
      .subscribe(reply => {
        this.updatePage(jobPath, this.index);
        this.interval = setInterval(() => {
          this.jobService.getJobDetail(jobPath).subscribe(jobDetail => {
            this.job = jobDetail;
            this.user = this.job.user;
          });
        }, 1000);
      });
  }

  save(){
    $('#saveBtn').click();
    let json = $('#plugin_storage').val();
    this.pluginArr[0].model = JSON.parse(json);
    // if(this.plugin.creator!="general"){
    this.pluginService.savePlugin(this.pluginArr[0])
      .subscribe(msg => this.forkResult(msg));
  }
  forkResult(response){
    if(response.status==200){
      console.log("saved!");
    }else{
      console.log("save plugin failed");
    }
  }
  goModel(){
    this.router.navigate(['/model'],{queryParams: {'job_id': this.job.id }})
  }


}
