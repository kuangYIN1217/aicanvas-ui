import {Component, Input, ViewChild} from '@angular/core';
import { JobService } from '../../common/services/job.service'
import { UserService } from '../../common/services/user.service'
import { SceneService } from '../../common/services/scene.service'
import { PluginService } from '../../common/services/plugin.service'
import { AlgChainService } from '../../common/services/algchain.service'
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';
import {JobInfo, UserInfo, SceneInfo, PluginInfo, ChainInfo} from "../../common/defs/resources";
import { Editable_param, Parameter } from "../../common/defs/parameter"
import { plainToClass } from "class-transformer";
import {modelService} from "../../common/services/model.service";
import {TaskStatusComponent} from "../taskStatus/taskStatus.component";
declare var $:any;
@Component({
    moduleId: module.id,
    selector: 'jobcreation',
    styleUrls: ['./css/jobcreation.component.css'],
    templateUrl: './templates/jobcreation.html',
    providers: [UserService,JobService,SceneService,PluginService,modelService,AlgChainService]
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
    scene:number;
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
    interval:any;
    // 右侧是否显示node参数，0--显示plugin参数 ， 1--显示node参数
    rightBox_node = 0;
    student:number;
    selected:number=0;
    item:number=0;
    ChainInfo:ChainInfo[]=[];
    arr:any[]=[];
    result:number=1;
    remainder:number;
    data:number;
    length:number;
    haveModel: number = 0;
    firstSceneId:number;
    firstChainId:string;
    @Input() statuss:string='';
    constructor(private sceneService: SceneService,private jobService: JobService,private  modelService:modelService,private algChainService: AlgChainService,private pluginService: PluginService, private userService: UserService, private router: Router,private route: ActivatedRoute) {
        pluginService.getLayerDict()
            .subscribe(dictionary => this.getDictionary(dictionary));
        this.pluginService.getTranParamTypes()
            .subscribe(editable_params => this.getTranParamTypes(editable_params));
    }
    ngOnDestroy(){
        // 退出时停止更新
        clearInterval(this.interval);
    }

    getTranParamTypes(editable_params){
        // editable_params为参数字典
        this.editable_params = editable_params;
    }

    initialJobArray(Jobs){
        console.log(Jobs);
        this.Jobs = Jobs;
        this.Jobs_current = Jobs;
    }

    //table operations
    showManage(){
        this.jobPageStatus = "manage";
    }

    CSV(){

    }
    XLS(){

    }
    changeChosenSceneId(){
        let id = this.student;
        console.log(id);
        this.chosenSceneId = id;
        this.sceneService.getChainByScene(id)
            .subscribe(results=>{
                this.PluginInfo=results;
                this.firstChainId = this.PluginInfo[0].id;
                console.log(this.firstChainId);
                this.arr = this.PluginInfo.slice(0,10);
                this.data = Math.floor(this.PluginInfo.length/this.pageMaxItem)+1;
                this.length = this.PluginInfo.length;
                if(this.result&&this.length!=0){
                    if(this.length%this.pageMaxItem==0){
                        this.result = this.length/this.pageMaxItem;
                    }else{
                        this.result = Math.floor(this.length/this.pageMaxItem)+1;
                    }
                }else if(this.length==0){
                    this.result=1;
                }
            });
        //console.log(this.PluginInfo[0]);
        /*this.sceneService.getChainWithLoss(id)
            .subscribe(result=>this.ChainInfo=result);*/
        this.pageMaxItem=10;
        for (let scene of this.scenes){
            if(scene.id == id){
                this.chosen_scene = scene;
                break;
            }
        }
    }
    clickStatus(statu,id){
        this.selected= statu;
        this.item=id;
        //console.log(id)
    }
    output(statu){
        if(statu==1){
            return "是";
        }else if(statu==0){
            return "否";
        }
    }
    // createJob
    createJob(){
        this.sceneService.getAllScenes()
        .subscribe(scenes => {
            this.createJob_getScene(scenes);
            this.student =scenes[0].id;
            this.firstSceneId = this.student;
            //console.log(this.firstSceneId);
            this.sceneService.getChainByScene(this.student)
                .subscribe(result=>{
                    this.PluginInfo=result;
                    this.firstChainId = this.PluginInfo[0].id;
                    //console.log(this.firstChainId);
                    this.arr = result;
                    this.arr = this.PluginInfo.slice(0,10);
                })
        });
      //console.log(this.student);
    }
    viewDetail(id,name){
        this.item = id;
        this.creator = name;
        this.router.navigate(['../algchains'],{queryParams:{"chain_id":this.item,"creator":this.creator}});
    }
    getDictionary(dictionary){
        $('#layer_dictionary').val(JSON.stringify(dictionary));
    }
    createJob_getScene(scenes){
        this.scenes = scenes;
        if(scenes[0]){
            this.chosenSceneId = scenes[0].id;
        }
        this.jobPageStatus = "createJob";
    }

    toStep(dest:number){
        this.stepNumber = dest;
    }

    nextStep(){
        if(this.stepNumber==1&&this.created==0){
            this.created = 1;
            if(this.chosenSceneId==0 || this.item=='0'){
                this.chosenSceneId = this.firstSceneId;
                this.item = this.firstChainId;
            }
            this.createJobBySenceId(this.chosenSceneId,this.item);
        }else if(this.stepNumber==2){
            this.saveJob();
        }
    }

    // 第一次点击下一步时，创建job，存储下来
    createJobBySenceId(chosenSceneId,chainId){
        this.jobService.createJob(chosenSceneId,chainId)
        .subscribe(createdJob => {
            //let job: any = createdJob;
            //this.createdJob = job;
            this.createdJob = createdJob;
            console.log(this.createdJob.chainId);
            this.createJobBySenceId2(this.createdJob.chainId);
        });
    }
    // 根据chainId得到算法链,保存后进入下一页面
    createJobBySenceId2(chainId){
        // console.log(this.createdJob);
        console.log(chainId);
        this.algChainService.getChainById(chainId)
        .subscribe(pluginArr => {
            this.pluginArr = pluginArr;
            this.changeChosenPlugin(this.pluginArr[0].id);
            this.stepNumber = this.stepNumber + 1;
        });
    }

    changeChosenPlugin(id:string){
        if(!this.chosenPluginId){
            this.chosenPluginId = id;
            let training_network_json = this.findPluginById(this.chosenPluginId).model;
            // console.log(training_network_json);
            if (training_network_json){
                this.haveModel = 1;
                // console.log(this.findPluginById(this.chosenPluginId));
                // console.log(training_network_json);
                $('#plugin_storage').val(JSON.stringify(training_network_json));
                $('#hideBtn').click();
            }
        }else{
            this.savePluginChange();
            this.chosenPluginId = id;
            let training_network_json = this.findPluginById(this.chosenPluginId).model;
            // console.log(training_network_json);
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
                this.stepNumber=2;
                this.haveModel = 0;

            }
        }
        this.pluginClicked();
    }
    getTotals(num){
        if(this.PluginInfo.length%num == 0){
            this.result = Math.floor(this.PluginInfo.length/num);
        }else{
            this.result = Math.floor(this.PluginInfo.length/num)+1;
        }
    }
    maxItemChange(num){
        this.page=1;
        this.arr = this.PluginInfo.slice(0,num);
        this.getTotals(num);
    }
    nextPage(num){
        this.remainder = this.PluginInfo.length%num;
        if(this.remainder == 0){
            this.result = Math.floor(this.PluginInfo.length/num);
            //console.log(this.result);
            this.lastPage(num,this.result);
        }else{
            this.result = Math.floor(this.PluginInfo.length/num)+1;
            this.lastPage(num,this.result);
            //console.log(this.result);
        }
    }
    lastPage(num,result){
        if(this.page<result){
            this.page++;
            this.arr = this.PluginInfo.slice(num*this.page-num,num*this.page);
        }else{
            alert('已经是最后一页');
        }
    }
    previousPage(num){
        if (this.page>1){
            this.page--;
            this.arr = this.PluginInfo.slice(num*this.page-num,num*this.page);
            console.log(this.arr);
        }else{
            alert('已经是首页');
        }
    }
    savePluginChange(){
        let id = this.chosenPluginId;
        let originJson = JSON.stringify(this.findPluginById(id).model);
        let json = $('#plugin_storage').val();
        let jsonData = JSON.parse(json);
        this.findPluginById(id).model = jsonData;
        let params: any = this.findPluginById(this.chosenPluginId).train_params;
        for (var key in params){
            for (let editable_parameter of this.editable_params){
                if (editable_parameter.path == key){
                    this.findPluginById(this.chosenPluginId).train_params[key] = editable_parameter.editable_param.set_value;
                }
            }
        }

    }
    pluginClicked(){
        let editable_parameters: Editable_param[] = [];
        let params: any = this.findPluginById(this.chosenPluginId).train_params;
        for(var param in params){
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
    nodeClicked(){
        // 改变右侧显示的内容--显示node
        this.rightBox_node = 1;
    }
    savePluginParams(){

    }
    findPluginById(id:string){
        for (let plugin of this.pluginArr){
            if (plugin.id == id){
                return plugin;
            }
        }
    }
    saveJob(){
        console.log("saveJob...");
        this.savePluginChange();
        for (let plugin of this.pluginArr){
            this.pluginService.savePlugin(plugin)
                .subscribe(response => this.saveJobNormalPlugin(response,plugin.id));
        }
        this.stepNumber = this.stepNumber + 1;
    }
    saveJobNormalPlugin(response,plugin_id){
        if (response.status==200){
            console.info("plugins -- "+ plugin_id +"save ok");
        }else{
            console.warn("save failed");
        }
    }

    create(){
        this.jobService.runJob(this.createdJob.jobPath)
            .subscribe(reply => this.runJobResult(reply,this.createdJob.jobPath));
    }
    runJobResult(reply,jobPath){
        // 成功运行
        if(reply.status==200){
            // 重新获取所有Job
            // this.jobService.getAllJobs(this.page-1,this.pageMaxItem);
            // 前往详情界面
            this.router.navigate(['/jobDetail', jobPath]);
        }else{
            // 运行失败报错
        }
    }


   checkStatus(status,sence , jobPath){
        if(status=='Finished'){
            this.modelService.getStatue(jobPath).subscribe(data=>{
                this.router.navigate(['../model'],{queryParams: { sence: sence }});
            });
            //TODO if success give alert

        }else{
          return false;
        }
    }


    // 修改参数
    setValue(parameter: Parameter,value: string){
        if (parameter.type=='string'){
            parameter.set_value = value;
        }else if(parameter.type=='boolean'){
            // 当作string
            parameter.set_value = value;
        }else if(parameter.type=='int'||parameter.type=='float'){
            if (Number(value)+""==NaN+""){
                alert('输入必须为数值!');
            }else{
                let condition: number = 1;
                if(parameter.has_min){
                    if(+value<parameter.min_value){
                        condition = -1;
                        alert("Can't lower than min_value:"+parameter.min_value+"!  Back to default...");
                    }
                }
                if(parameter.has_max){
                    if(+value>parameter.max_value){
                        condition = -2;
                        alert("Can't higher than max_value:"+parameter.max_value+"!  Back to default...");
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

    set2dArray(parameter: Parameter,i1: number,j1: number,value: string){
        if ((parameter.d_type=='int'||parameter.d_type=='float')&&Number(value)+""==NaN+""){
            alert('输入必须为数值!');
        }else{
            parameter.set_value[i1][j1] = Number(value);
        }
    }

    set3dArray(parameter: Parameter,i1: number,j1: number,z1: number,value: string){
        if ((parameter.d_type=='int'||parameter.d_type=='float')&&Number(value)+""==NaN+""){
            alert('输入必须为数值!');
        }else{
            parameter.set_value[i1][j1][z1] = Number(value);
        }
    }


}
