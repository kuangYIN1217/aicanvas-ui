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
export class PluginInfo{
    // the id of the Plugin
    plugin_id: number;
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
    // id of job
    job_id: number;
    // number of job
    job_name: string;
    // scene's name of job
    job_scene: string;
    // createTime of job
    job_createTime: string;
    // status of job
    job_status: string;
    // percent pg job progress
    job_progress: number;
}
export class SceneInfo{
    scene_id: number;
    scene_name: string;
}
