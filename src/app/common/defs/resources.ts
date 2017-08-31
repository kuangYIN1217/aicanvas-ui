export class CpuInfo {
    cpu_utilization: number;
    // time
    created_at: string;
    used_memory: number;
}

export class GpuInfo{
    total_gpu_utilization: number;
    created_at: string;
    total_used_memory: number;
}
export class Gpu{
    totalGlobalMem: number;
    id: number;
    name: string;
}
export class Cpu{
    brand: string;
    cores: number;
    tot_memory: number;
    hz: string;
}

export class Page{
  pageMaxItem: number;
  curPage: number;
  totalPage: number;
  totalNum:number;
  job_id:number;
  model_id:number;
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
    chain_name: string;
    output: string;
    root: string;
    // the id of the Plugin
    train_params: any;
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
    model: any;
    publish:string;
  has_training_network:any;
}
export class JobCollection{
    content: JobInfo[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    sort: string;
    numberOfElements: number;
    first: boolean;
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
    sences: number;
    sencesName: string;
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
    totalPages: number;
    totalElements: number;
    percent: number;
  samples_sec:string;
}
export class JobResult{
    val_acc: string;
    jobId: number;
    val_loss: string;
    chainId: string;
    id: number;
}
export class JobProcessItem{
    acc: string;
    epoch: string;
    id: number;
    job: JobInfo;
    loss: string;
    val_acc: string;
    val_loss: string;
    createTime: string;
}
export class JobParameter{
    jobResult: JobResult;
    jobProcess: JobProcessItem[];
}
export class SceneInfo{
    id: number;
    name: string;
    translation: string;
    description: string;
    tag:string;
    arrName:any;
}

export  class ModelInfo{
    model_id: number;
    creator:string;
    created_at:string;
    model_path:string;
    job_path:string;
    createTime:string;
}

export class inferenceResult{
    id:number;
    resultType:string;
    inputPath:string;
    output:string;
    success:boolean;
    inputType:string;
    modelPrediction: any;
}
export class PercentInfo{
    id:number;
    modelId: string;
    percent: string;
    inputPath: string;
    output: string;
    predictionName: string;
}

export class HistoryInfo{
    id:number;
    predictionName: string;
    modelId:number;
    inputPath: string;
    outputPath: string;
    percent: string;
    totalPages:number;
}
export class AlgorithmInfo{
    train_params: string;
    chain_name: string;
    id: string;
    publish: number;
    prob_domain: number;
    creator: string;
    path: string;
    description:string;
}
export class ChainInfo{

}

