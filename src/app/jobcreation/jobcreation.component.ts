import {Component, Input} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../common/services/user.service";
import {JobService} from "../common/services/job.service";
import {SceneService} from "../common/services/scene.service";
import {PluginService} from "../common/services/plugin.service";
import {modelService} from "../common/services/model.service";
import {AlgChainService} from "../common/services/algChain.service";
import {Editable_param, Parameter} from "../common/defs/parameter";
import {ChainInfo, JobInfo, PluginInfo, SceneInfo} from "../common/defs/resources";
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'jobcreation',
  styleUrls: ['./css/jobcreation.component.css'],
  templateUrl: './templates/jobcreation.html',
  providers: [UserService, JobService, SceneService, PluginService, modelService, AlgChainService]
})
export class JobCreationComponent {
  creator: any;
  editable_params: Editable_param[] = [];
  // 被选中plugin的参数组合（结合了字典）
  editable_parameters: Editable_param[] = [];
  // 是否已经创建了新的
  created: number = 0;
  //
  scenes: SceneInfo[] = [];
  scene: number;
  chosenSceneId: number;
  chosen_scene: SceneInfo = new SceneInfo();
  pluginArr: PluginInfo[] = [];
  PluginInfo: PluginInfo[] = [];
  chosenPluginId: string;
  createdJob: JobInfo = new JobInfo();
  pluginIds: string[] = [];
  // record the current step
  stepNumber: number = 1;
  // "manage"/"createJob"
  jobPageStatus: string = "manage";
  Jobs: JobInfo[] = [];
  Jobs_current: JobInfo[] = [];
  page: number = 1;
  pageMaxItem: number = 10;
  interval: any;
  // 右侧是否显示node参数，0--显示plugin参数 ， 1--显示node参数
  rightBox_node = 0;
  student: number;
  selected: number = 0;
  item: string = '0';
  ChainInfo: ChainInfo[] = [];
  arr: any[] = [];
  result: number = 1;
  remainder: number;
  data: number;
  length: number;
  haveModel: number = 0;
  firstSceneId: number;
  firstChainId: string;
  @Input() statuss: string = '';
  jobName:string;

  constructor(private sceneService: SceneService, private jobService: JobService, private  modelService: modelService, private algChainService: AlgChainService, private pluginService: PluginService, private userService: UserService, private router: Router, private route: ActivatedRoute, private toastyService:ToastyService, private toastyConfig: ToastyConfig) {
    pluginService.getLayerDict()
      .subscribe(dictionary => this.getDictionary(dictionary));
    this.pluginService.getTranParamTypes()
      .subscribe(editable_params => this.getTranParamTypes(editable_params));
  }
  // alert 提示
  addToast(title: string = '消息提示' , msg: string , flag: string = 'info') {
    // Just add default Toast with title only
    // Or create the instance of ToastOptions
    var toastOptions:ToastOptions = {
      title: title,
      msg: msg,
      showClose: true,
      timeout: 3000,
      theme: 'default',
      onAdd: (toast:ToastData) => {
      },
      onRemove: function(toast:ToastData) {
      }
    };

    // Add see all possible types in one shot

    this.toastyService[flag](toastOptions);
  }
  ngOnDestroy() {
    // 退出时停止更新
    clearInterval(this.interval);
  }

  getTranParamTypes(editable_params) {
    // editable_params为参数字典
    this.editable_params = editable_params;
  }




  changeChosenSceneId() {
    let id = this.student;
    console.log(id);
    this.chosenSceneId = id;
    this.sceneService.getChainByScene(id)
      .subscribe(results => {
        this.PluginInfo = results;
        this.arr = results;
        // this.firstChainId = this.PluginInfo[0].id;
        console.log(this.firstChainId);

        this.data = Math.floor(this.PluginInfo.length / this.pageMaxItem) + 1;
        this.length = this.PluginInfo.length;
        if (this.result && this.length != 0) {
          if (this.length % this.pageMaxItem == 0) {
            this.result = this.length / this.pageMaxItem;
          } else {
            this.result = Math.floor(this.length / this.pageMaxItem) + 1;
          }
        } else if (this.length == 0) {
          this.result = 1;
        }
      });
    //console.log(this.PluginInfo[0]);
    /*this.sceneService.getChainWithLoss(id)
     .subscribe(result=>this.ChainInfo=result);*/
    this.pageMaxItem = 10;
    for (let scene of this.scenes) {
      if (scene.id == id) {
        this.chosen_scene = scene;
        break;
      }
    }
  }

  clickStatus(statu, id) {
    this.selected = statu;
    this.item = id;
    //console.log(id)
  }

  output(statu) {
    if (statu == 1) {
      return "是";
    } else if (statu == 0) {
      return "否";
    }
  }

  // createJob
  createJob() {
    this.sceneService.getAllScenes()
      .subscribe(scenes => {
        this.createJob_getScene(scenes);
        this.student = scenes[0].id;
        // this.firstSceneId = this.student;
        //console.log(this.firstSceneId);
        this.sceneService.getChainByScene(this.student)
          .subscribe(result => {
            this.PluginInfo = result;
            // this.firstChainId = this.PluginInfo[0].id;
            //console.log(this.firstChainId);
            this.arr = result;
            this.arr = this.PluginInfo.slice(0, 10);
          })
      });
    //console.log(this.student);
  }
  goHistory(){
    this.jobPageStatus='manage';
  }
  viewDetail(id, name) {
    this.item = id;
    this.creator = name;
    this.router.navigate(['../algchains'], {queryParams: {"chain_id": this.item, "creator": this.creator}});
  }

  getDictionary(dictionary) {
    $('#layer_dictionary').val(JSON.stringify(dictionary));
  }

  createJob_getScene(scenes) {
    this.jobPageStatus = "createJob";
    this.scenes = scenes;
    if (scenes[0]) {
      this.chosenSceneId = scenes[0].id;
    }

  }



  nextStep() {

      this.createJobBySenceId(this.chosenSceneId, this.firstSceneId);
  }

  // 第一次点击下一步时，创建job，存储下来
  createJobBySenceId(chosenSceneId, chainId) {
    if(!chainId){
      // alert("请选择算法链");
      this.addToast("消息提示" , "请选择算法链" , "warning");
      return false;
    }
    if(!this.jobName){
      // alert("请输入任务名称")
      this.addToast("消息提示" , "请输入任务名称" , "warning");
      return false;

    }
    this.jobService.createJob(chosenSceneId, chainId,this.jobName)
      .subscribe(createdJob => {
        //let job: any = createdJob;
        //this.createdJob = job;
        this.createdJob = createdJob;
        // alert("任务创建成功");
        this.addToast("消息提示" , "任务创建成功" , "success");
        location.reload();
       // this.jobPageStatus='jobPageStatus';
        console.log(this.createdJob.chainId);
        // this.createJobBySenceId2(this.createdJob.chainId);
      });
  }


  nodeClicked() {
    // 改变右侧显示的内容--显示node
    this.rightBox_node = 1;
  }



  saveJobNormalPlugin(response, plugin_id) {
    if (response.status == 200) {
      console.info("plugins -- " + plugin_id + "save ok");
    } else {
      console.warn("save failed");
    }
  }

  create() {
    this.jobService.runJob(this.createdJob.jobPath)
      .subscribe(reply => this.runJobResult(reply, this.createdJob.jobPath));
  }

  runJobResult(reply, jobPath) {
    // 成功运行
    if (reply.status == 200) {
      // 重新获取所有Job
      // this.jobService.getAllJobs(this.page-1,this.pageMaxItem);
      // 前往详情界面
      this.router.navigate(['/jobDetail', jobPath]);
    } else {
      // 运行失败报错
    }
  }


  checkStatus(status, sence, jobPath) {
    if (status == 'Finished') {
      this.modelService.getStatue(jobPath).subscribe(data => {
        this.router.navigate(['../model'], {queryParams: {sence: sence}});
      });
      //TODO if success give alert

    } else {
      return false;
    }
  }

  getTotals(num) {
    if (this.PluginInfo.length % num == 0) {
      this.result = Math.floor(this.PluginInfo.length / num);
    } else {
      this.result = Math.floor(this.PluginInfo.length / num) + 1;
    }
  }

  maxItemChange(num) {
    this.page = 1;
    this.arr = this.PluginInfo.slice(0, num);
    this.getTotals(num);
  }





  set2dArray(parameter: Parameter, i1: number, j1: number, value: string) {
    if ((parameter.d_type == 'int' || parameter.d_type == 'float') && Number(value) + "" == NaN + "") {
      // alert('输入必须为数值!');
      this.addToast("消息提示" , "输入必须为数值" , "warning");
    } else {
      parameter.set_value[i1][j1] = Number(value);
    }
  }

  set3dArray(parameter: Parameter, i1: number, j1: number, z1: number, value: string) {
    if ((parameter.d_type == 'int' || parameter.d_type == 'float') && Number(value) + "" == NaN + "") {
      // alert('输入必须为数值!');
      this.addToast("消息提示" , "输入必须为数值" , "warning");
    } else {
      parameter.set_value[i1][j1][z1] = Number(value);
    }
  }


}
