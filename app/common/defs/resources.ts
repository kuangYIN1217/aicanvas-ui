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
    executor: string;
    path: string;
    creator: string;
    input: string;
    output: string;
    root: string;
    // the id of the Plugin
    train_params: string;
    // The translated name of the Plugin.
    alg_name: string;
    // description of this Plugin
    description: string;
    // the id of the Plugin this one forked from
    id: string;
    // if this Plugin has_training_network 0-- no 1-- has
    prob_domain: number;
    // training_network of this Plugin
    ui_network_editor: string;
    // parameters allowed to be modified
    model: string;
}
export class JobInfo{
    // name of job
    jobName: string;
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
    // chainId
    chainId: string;
    // creator
    user: UserInfo;
    // status of job
    status: string;
    // 开始运行时间
    startTime:string;
    // 停止时间
    stopTime: string;
    // 运行时长 /秒
    runningTime: string;
    // // percent pg job progress
    // job_progress: number;
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
    id: string;
    name: string;
    translation: string;
    description: string;
}
