import {Component} from "@angular/core";
import {Location} from "@angular/common";
import {JobService} from "../common/services/job.service";
import {ChainInfo, JobInfo, JobParameter, JobResult, PluginInfo, UserInfo} from "../common/defs/resources";
import {AmChartsService} from "amcharts3-angular2";
import {Router} from "@angular/router";
import {AlgChainService} from "../common/services/algChain.service";
import {Editable_param, Parameter} from "../common/defs/parameter";
import {PluginService} from "../common/services/plugin.service";
import {WebSocketService} from "../web-socket.service";
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import {SERVER_URL} from "../app.constants";
import {addWarningToast} from '../common/ts/toast';
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
  jobResult: any = {
    bestLoss: null,
    bestValLoss: null,
    bestMetrics: null,
    bestValMetrics: null,
    sec_epoch: null,
    epoch: null
  };
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
  // 算法链信息
  chainInfo = [];
  // 当前正在运行的plugin
  runningPluginId = null;
  runningPluginIndex = -1;
  // 被选中plugin
  currentPluginId = null;
  // 显示plugin是否为当前runningPlugin
  runningFlag = false;
  jobPath: string;
  step: number=2;
  page:string;

  // progress logs
  s_process_flag: boolean = true;
  s_progress_show: boolean = false;
  d_progress_logs = [];
  d_progress_log: any = {
    percent: 0,
    step: '初始化'
  };
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
  constructor( private pluginService: PluginService ,private algchainService: AlgChainService,private jobService: JobService, private location: Location, private AmCharts: AmChartsService,private router:Router,private websocket:WebSocketService, private toastyService:ToastyService, private toastyConfig: ToastyConfig) {
    if (location.path(false).indexOf('/jobDetail/') != -1) {
      let jobPath = location.path(false).split('/jobDetail/')[1];
      if (jobPath) {
        jobPath = unescape(jobPath);
        this.jobPath = jobPath;
        // jobService.getJob(jobPath)
        //     .subscribe(jobParam => this.jobParam = jobParam);
        this.initJobDetailByPath();
      }
    }
  }
  back(){
    if(sessionStorage['curPage']){
      this.page = sessionStorage['curPage'];
      console.log(this.page);
      this.router.navigate(['/jobcreation'],{queryParams: { page: this.page}});
    }
  }
  /**
   * 获取jobDetail
   */
  initJobDetailByPath (flag?) {
    this.jobService.getJobDetail(this.jobPath).subscribe(jobDetail => {
      if(jobDetail){
        this.job = jobDetail;
        if (flag) {
          this.initData();
        }
        this.user = this.job.user;
        // 处理jobDetail
        this.resolveJobDetail(this.job , this.jobPath);
      }
    });
  }
  /* 初始化数据 */
  initData() {
    // 初始化图表信息
    this.runningPluginId = null;
    this.runningPluginIndex = -1;
    // 被选中plugin
    this.currentPluginId = null;
    /*this.job = new JobInfo();*/
    this.job.samples_sec = null;
    this.job.percent = null;
    this.job.sences = null;
    this.log_list = [];
    this.d_progress_logs = [];
    this.d_progress_log = {
      percent: 0,
      step: '正在初始化'
    };
    this.s_process_flag = true;
    // 清空图表数据
    this.jobResultParam = []
    this.AmCharts.updateChart(this.metricsChart, () => {
      this.metricsChart.dataProvider= this.metricsChartInitData();
    });
    this.AmCharts.updateChart(this.lossChart, () => {
      this.lossChart.dataProvider = this.lossChartInitData();
    });
  }
  downloadLog(){
    // this.jobService.downloadLog(this.job.jobPath).subscribe((data)=>{
    let path = "/api/log?jobPath=" + this.job.jobPath;
    let url =  SERVER_URL + path
        // window.open(url);
        location.href= url;
    // });
  }


  /**
   * 解析jobDetail
   */
  resolveJobDetail (jobDetail , jobPath) {
    this.algchainService.getChainById(jobDetail.chainId).subscribe(chainInfo => {
      // console.log('init');
      this.chainInfo = chainInfo;
      console.log(chainInfo);
      console.log("===================current status :" + jobDetail.status)
      switch (jobDetail.status) {
        case '完成':
          this.initNotRun(this.chainInfo.length - 1 , null , this.chainInfo[0].id , jobPath);
          break;
        case '未启动':
          this.initNotRun(-1 , null , null , jobPath);
          break;
        case '运行':
          this.initWithRun(jobPath);
          break;
        case '停止':
          this.not_running_show(jobPath , '停止');
          break;
      }
    })
  }

  /**
   * 非运行状态初始化
   */
  initNotRun(runningPluginIndex , runningPluginId , currentPluginId , jobPath) {
    this.setRunningInfo (runningPluginIndex , runningPluginId, currentPluginId);
    this.not_running_show(jobPath);
  }

  setRunningInfo (runningPluginIndex , runningPluginId, currentPluginId) {
    this.runningPluginIndex = runningPluginIndex;
    this.currentPluginId = currentPluginId;
    this.runningPluginId = runningPluginId;
  }
  /**
   * 运行状态下初始化
   */
  initWithRun(jobPath) {
    this.runningFlag = true;
    this.jobService.resetLog(jobPath).subscribe(data=>{
      this.updatePage(jobPath, this.index);
      this.interval = setInterval(() => {
        this.jobService.getJobDetail(jobPath).subscribe(jobDetail => {
          this.job = jobDetail;
          this.user = this.job.user;
        });
      }, 1000);
    });

  }
  /**
   * plugin点击切换事件
   */
  pluginClick (plugin , index) {
    // console.log(plugin)
    if (plugin.id == this.currentPluginId) {
      // 当前选中plugin点击无效
      // console.log('click own -> return')
      return;
    } else if (this.runningPluginIndex < index) {
      // 禁止未运行的plugin
      // console.log('click disabled -> return')
      return;
    } else if(plugin.id == this.runningPluginId) {
      // console.log('click run plugin -> switch to run plugin')
      this.runningFlag = true;
    } else {
      // console.log('click plugin -> switch to plugin')
      this.runningFlag = false;
      this.getPluginData(plugin.id);
    }
    this.currentPluginId = plugin.id;
  }

  /**
   * 根据pluginId获取job信息
   * @param pluginId
   */
  getPluginData( pluginId) {
    this.jobService.getPluginInfoById(this.jobPath , pluginId).subscribe(data => {
      this.AmCharts.updateChart(this.lossChart, () => {
        if (data && data.length > 0) {
          this.lossChart.dataProvider = data;
        } else {
          this.lossChart.dataProvider = this.lossChartInitData();
        }
      });
      this.AmCharts.updateChart(this.metricsChart, () => {
        if (data && data.length > 0) {
          this.metricsChart.dataProvider = data;
        } else {
          this.metricsChart.dataProvider = this.metricsChartInitData();
        }
      });
    });

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
        "lineColor": "#d4695e",
        "fillAlphas": "0.3",
        "lineThickness": 2,
        "negativeLineColor": "#d4695e",
        "type": "smoothedLine",
        "valueField": "loss"
      },{
        "id": "g2",
        // "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        // "bullet": "round",
        // "bulletSize": 8,
        "lineColor": "#22a981",
        "fillAlphas": "0.3",
        "lineThickness": 2,
        "negativeLineColor": "#22a981",
        "type": "smoothedLine",
        "valueField": "val_loss"
      }],
      "chartScrollbar": {
        "graph": "g1",
        "gridAlpha": 0,
        "color": "#888888",
        "scrollbarHeight": 30,
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
        "lineColor": "#d4695e",
        "fillAlphas": "0.3",
        "lineThickness": 2,
        "negativeLineColor": "#d4695e",
        "type": "smoothedLine",
        "valueField": "metrics_value"
      },{
        "id": "g2",
        // "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        // "bullet": "round",
        // "bulletSize": 8,
        "lineColor": "#22a981",
        "fillAlphas": "0.3",
        "lineThickness": 2,
        "negativeLineColor": "#22a981",
        "type": "smoothedLine",
        "valueField": "val_metrics_value"
      }],
      "chartScrollbar": {
        "graph": "g1",
        "gridAlpha": 0,
        "color": "#888888",
        "scrollbarHeight": 30,
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
    /*this.websocket.unsubscribe();
    this.websocket.disconnect(null);*/
    this.AmCharts.destroyChart(this.lossChart);
    this.AmCharts.destroyChart(this.metricsChart);
  }

  changeTab(chainId,index,status){
    this.step=1;
    this.lookIt = 1;
    this.changeIndex = index;
    if(status=="运行"){
      this.statusIndex = 0;
    }else{
      this.statusIndex = 1;
    }
    //console.log(chainId);
    this.algchainService.getChainById(chainId)
      .subscribe(plugin=>{
        this.pluginArr=plugin;
         //console.log(this.pluginArr[0]);
        //console.log(this.pluginArr[0].id);
        this.changeChosenPlugin(this.pluginArr[0].id);
      });
  }
  goback(){
    this.step=2;
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
     //console.log(params);
    for(var param in params){
      // console.log(param);
      for (let editable_parameter of this.editable_params){
        if (editable_parameter.path == param){
          editable_parameter.editable_param.set_value = params[param];
          //console.log( editable_parameter.editable_param.set_value);
          editable_parameters.push(editable_parameter);
          break;
        }
      }
    }
    // 更新变量
    this.editable_parameters = editable_parameters;
    //console.log( this.editable_parameters);

    // 改变右侧显示的内容--显示plugin
    this.rightBox_node = 0;
  }
  matchParams(){
    let params: any = this.findPluginById(this.chosenPluginId).train_params;
    for (var key in params){
      for (let dict of this.editable_params){
        if (key == dict.path){
          params[key] = dict.editable_param.set_value;
          console.log(params[key]);
        }
      }
    }
    this.findPluginById(this.chosenPluginId).train_params = params;
    //console.log(params);
  }

  save(){
    $('#saveBtn').click();
    this.matchParams();
    let json = $('#plugin_storage').val();
    this.pluginArr[0].model = JSON.parse(json);
    this.pluginArr[0].train_params = this.findPluginById(this.chosenPluginId).train_params;
    this.pluginService.savePlugin(this.pluginArr[0])
      .subscribe(msg => this.forkResult(msg));
  }
  nodeClicked(){
    // 改变右侧显示的内容--显示node
    this.rightBox_node = 1;
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
  not_running_show(jobPath: string , status?: string) {
    this.jobService.getUnrunningJob(jobPath)
      .subscribe(jobParam => {
        this.resolveJobParam(jobParam , status);
      });
  }

  /**
   * 处理非运行状态下图表数据
   * @param jobParam
   */
  resolveJobParam(jobParam , status?: string) {
   /* console.log('unrun status')
    console.log(jobParam)*/
    if (jobParam.length && jobParam.length > 0) {
      if (status === '停止') {
        this.getLastPluginJobParam(jobParam);
      } else {
        this.jobResultParam = this.jobResultParam.concat(jobParam);
        this.jobResult = this.jobResultParam[this.jobResultParam.length - 1];
      }
      // debugger
      // this.update(jobParam);
      this.AmCharts.updateChart(this.lossChart, () => {
        if (this.jobResultParam.length == 0) {
          this.lossChart.dataProvider = this.lossChartInitData();
        } else {
          this.lossChart.dataProvider = this.jobResultParam;
        }
      });
      this.AmCharts.updateChart(this.metricsChart, () => {
        if (this.jobResultParam.length == 0) {
          this.metricsChart.dataProvider = this.metricsChartInitData();
        } else {
          this.metricsChart.dataProvider = this.jobResultParam;
        }
      });
    }
  }

  /**
   * 解析停止状态下的job数据，获取停止位置与数据
   * @param jobParam
   */
  getLastPluginJobParam(jobParam) {
    /* console.log('stop status') */
    let temp_pluginId = jobParam[jobParam.length - 1].pluginId;
    this.currentPluginId = temp_pluginId;
    this.getRunningPlugin(jobParam[jobParam.length - 1]);
    this.runningPluginId = null;
    for (let i = jobParam.length - 1; i >=0 ; i --) {
      if (jobParam[i].pluginId !== temp_pluginId || i === 0) {
        this.jobResultParam = this.jobResultParam.concat(jobParam.slice((i===0?-1:i) + 1 , jobParam.length));
        this.jobResult = this.jobResultParam[this.jobResultParam.length - 1];
        break;
      }
    }
  }
  updatePage(jobPath, index) {

    this.jobService.getUnrunningJob(jobPath )
      .subscribe(jobParam => {
       /* console.log('run'); */
        this.jobResultParam = this.jobResultParam.concat(jobParam);
        this.jobResult = this.jobResultParam[this.jobResultParam.length - 1];
        // console.log(JobResult)
        if(this.jobResult) {
          this.index = this.jobResult.epoch;
          this.getRunningPlugin(this.jobResult);
          // 展示plugin为runingplugin
          if (this.runningFlag) {
            this.AmCharts.updateChart(this.lossChart, () => {
              if (this.jobResultParam.length == 0) {
                this.lossChart.dataProvider = this.lossChartInitData();
              } else {
                this.lossChart.dataProvider = this.jobResultParam;
              }
            });
            this.AmCharts.updateChart(this.metricsChart, () => {
              if (this.jobResultParam.length == 0) {
                this.metricsChart.dataProvider = this.metricsChartInitData();
              } else {
                this.metricsChart.dataProvider = this.jobResultParam;
              }
            });
          }
        }
       /* this.jobResult = jobParam[jobParam.length - 1];*/
        this.websocket.connect().then(()=>{
          this.websocket.subscribe('/job/'+jobPath,(data)=>{
            // console.log(data);
            this.updateChart(data);
          });

          this.websocket.subscribe('/logs/'+jobPath,(data)=>{
            this.log_list=this.log_list.concat(data);
          });
          this.websocket.subscribe('/preLog/'+ this.jobPath,(data)=>{
            if (this.s_process_flag) {
              this.s_progress_show = true;
              this.s_process_flag = false;
            }
            console.log(data);
            this.d_progress_logs.push(data);
            this.d_progress_log = data;
          });
        })
        // this.jobResult =jobParam.jobResult;

      });
    // console.log(this.index);
  }

  /**
   * 获取当前正在运行的插件信息
   * @param data
   */
   getRunningPlugin(data) {
     // 判断当前状态
     if (data.pluginId) {
       // 当前运行的plugin
       console.log("=================current plugin :" + this.runningPluginId)
       this.runningPluginId = data.pluginId;
       this.currentPluginId = data.pluginId;
       for (let i = 0 ; i < this.chainInfo.length ; i++) {
         if (this.chainInfo[i].id == this.runningPluginId) {
            this.runningPluginIndex = i;
            break;
         }
       }
     }
   }
  updateChart(data){
    this.getRunningPlugin(data);
    let temp:JobParameter = data;
    this.jobResultParam.push(temp);
    // 展示plugin为runingplugin
    if (this.runningFlag) {
      this.AmCharts.updateChart(this.lossChart, () => {
        this.lossChart.dataProvider = this.jobResultParam;
      });
      this.AmCharts.updateChart(this.metricsChart, () => {
        this.metricsChart.dataProvider = this.jobResultParam;
      });
    }
    this.jobResult = temp;
  }


  stop(jobPath: string) {
    this.jobService.stopJob(jobPath).subscribe(job=>{
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.index=-1;
      this.initJobDetailByPath();
     /* this.jobService.getJobDetail(jobPath).subscribe(jobDetail => {
        this.job = jobDetail;
        this.user = this.job.user;
      });*/
    });
  }


  start(jobPath: string){
    this.jobService.runJob(jobPath)
      .subscribe(reply => {
        this.initJobDetailByPath(true);
      });
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
  set2dArray(parameter: Parameter,i1: number,j1: number,value: string){
    if ((parameter.d_type=='int'||parameter.d_type=='float')&&Number(value)+""==NaN+""){
      // alert('输入必须为数值!');
      addWarningToast(this.toastyService ,"输入必须为数值");
    }else{
      parameter.set_value[i1][j1] = Number(value);
    }
  }
  setValue(parameter: Parameter,value: string){
    if (parameter.type=='string'){
      parameter.set_value = value;
    }else if(parameter.type=='boolean'){
      // 当作string
      parameter.set_value = value;
    }else if(parameter.type=='int'||parameter.type=='float'){
      if (Number(value)+""==NaN+""){
        // alert('输入必须为数值!');
        addWarningToast(this.toastyService ,"输入必须为数值" );
      }else{
        let condition: number = 1;
        if(parameter.has_min){
          if(+value<parameter.min_value){
            condition = -1;
            // alert("Can't lower than min_value:"+parameter.min_value+"!  Back to default...");
            addWarningToast(this.toastyService ,"Can't lower than min_value:"+parameter.min_value+"!  Back to default...");
          }
        }
        if(parameter.has_max){
          if(+value>parameter.max_value){
            condition = -2;
            // alert("Can't higher than max_value:"+parameter.max_value+"!  Back to default...");
            addWarningToast(this.toastyService ,"Can't higher than max_value:"+parameter.max_value+"!  Back to default..." );
          }
        }
        if(condition==1){
          parameter.set_value = +value;
        }else{
          parameter.set_value = parameter.default_value;
        }
      }
    }
  }
}
