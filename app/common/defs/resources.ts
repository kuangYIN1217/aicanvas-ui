import { Parameter, TrainingNetwork } from './parameter';
export class CpuInfo {
    // Number of cpu cours
    cores: number;
    // Actual cpu frequency.  e.g."1.7330 GHz"
    hz: string;
    // Brand of the cpu.
    brand: string;
    // Current usage of cpu.
    cpu_pct: number;
}
export class UserInfo{
    //
    activated: boolean;
    // email of user
    email: string;
    //
    firstName: string;
    // id of user
    id: number;
    // head image url
    imageUrl: string;
    // language
    langKey: string;
    //
    lastName: string;
    // login username
    login: string;
    //
    createdBy: string;
    //
    createdDate: string;
    //
    lastModifiedBy: string;
    //
    lastModifiedDate: string;
    resetDate: string;
    resetKey: string;
    //
    authorities: string[];
}
export class PluginInfo{
    // the id of the Plugin
    plugin_id: string;
    // The translated name of the Plugin.
    plugin_name: string;
    // the owner/creator of the Plugin     'admin' represent admins ,other represent normal user
    plugin_owner: string;
    // the id of the Plugin this one forked from
    original_plugin_id: number;
    // description of this Plugin
    plugin_description: string;
    // if this Plugin has_training_network 0-- no 1-- has
    has_training_network: number;
    // training_network of this Plugin
    training_network: TrainingNetwork;
    // parameters allowed to be modified
    editable_param_list: Parameter[];
}
export class JobInfo{
    // createTime of job
    createTime: string;
    // name of dataset
    dataSet: string;
    // id of job
    id: number;
    // path of job
    jobPath: string;
    // scene's name of job
    sences: string;
    // creator
    user: UserInfo;
    // // number of job
    // name: string;
    // // status of job
    // job_status: string;
    // // percent pg job progress
    // job_progress: number;
    // construtor
    // constructor(createTime,dataSet,id,jobPath,scenes,name,job_status,job_progress,user){
    //     this.createTime = createTime;
    //     this.dataSet = dataSet;
    //     this.id = id;
    //     this.jobPath = jobPath;
    //     this.scenes = scenes;
    //     this.user = user;
    //     this.name = name;
    //     this.job_status = job_status;
    //     this.job_progress = job_progress;
    // }
    // constructor(createTime,dataSet,id,jobPath,scenes,user){
    //     this.createTime = createTime;
    //     this.dataSet = dataSet;
    //     this.id = id;
    //     this.jobPath = jobPath;
    //     this.scenes = scenes;
    //     this.user = user;
    //     // this.name = name;
    //     // this.job_status = job_status;
    //     // this.job_progress = job_progress;
    // }
}
export class JobParameter{
    loss: string;
    epoch: string;
    val_loss: string;
    acc: string;
    val_acc: string;
}
export class JobProcess{
    acc: string;
    epoch: string;
    id: number;
    job: JobInfo;
    loss: string;
    val_acc: string;
    val_loss: string;
}
export class SceneInfo{
    scene_id: number;
    scene_name: string;
    scene_description: string;
    editable_param_list: Parameter[];
}
