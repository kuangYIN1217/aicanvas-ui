import { Http, Response, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

import { plainToClass } from "class-transformer";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CpuInfo } from '../defs/resources'
import { PluginInfo } from "../defs/resources";
import { JobInfo } from "../defs/resources";
import { SceneInfo } from "../defs/resources";

import { Parameter, TrainingNetwork } from "../defs/parameter";

@Injectable()
export class ResourcesService {
    SERVER_URL: string = "http://10.165.33.20:8080";
    constructor(private http: Http) { }

    getCpuInfo(): Observable<CpuInfo[]> {

        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get('http://127.0.0.1:5000/cpuinfo')
            .map((response: Response) => {
                if (response && response.json()) {
                    return (plainToClass(CpuInfo, response.json()));
                }
            });
    }

    getPlugins(): Observable<PluginInfo[]> {
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get('http://127.0.0.1:5000/algplugins')
            .map((response: Response) => {
                if (response && response.json()) {
                    return plainToClass(PluginInfo, response.json());
                }
            });
    }
    getPluginById(plugin_id: number): Observable<PluginInfo>{
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get('http://127.0.0.1:5000/algplugins')
            .map((response: Response) => {
                if (response && response.json()) {
                    let array = plainToClass(PluginInfo, response.json());
                    for (let plugin of array){
                        if (plugin.plugin_id == plugin_id+""){
                            console.log(plugin);
                            return plugin;
                        }
                    }
                    // console.log(plainToClass(SceneInfo, response.json())[0].scene_id);
                    // return plainToClass(SceneInfo, response.json());
                }
            });
    }

    getJobs(): Observable<JobInfo[]>{
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get('http://127.0.0.1:5000/jobs')
            .map((response: Response) => {
                if (response && response.json()) {
                    // console.log(response.json());
                    return plainToClass(JobInfo, response.json());
                }
            });
    }
    // getJobById(job_id: number): Observable<JobInfo>{
    //     // // TODO: what if it returns error?
    //     // // Moving hostname to maybe tsconfig.json
    //     // return this.http.get('http://127.0.0.1:5000/jobs')
    //     //     .map((response: Response) => {
    //     //         if (response && response.json()) {
    //     //             let array = plainToClass(JobInfo, response.json());
    //     //             for (let job of array){
    //     //                 if (job.job_id == job_id){
    //     //                     console.log(job);
    //     //                     return job;
    //     //                 }
    //     //             }
    //     //             // console.log(plainToClass(SceneInfo, response.json())[0].scene_id);
    //     //             // return plainToClass(SceneInfo, response.json());
    //     //         }
    //     //     });
    // }
    // createJob(json:any): any{
    //     let path: string = "api/job";
    //     console.log('service-createjob');
    //     let body = JSON.stringify({
    //         "train_params":{
    //             "batch_size":32,
    //             "SBO":true,
    //             "loss":"categorical_crossentropy",
    //             "metrics":"accuracy",
    //             "optimizer":"Adam",
    //             "epochs":2,
    //             "learning_rate":0.00001
    //         },
    //         "dataset":{},
    //         "plugin":{}
    //     });
    //     let headers = new Headers({ 'Content-Type': 'application/json' });
    //     let options = new RequestOptions({ headers: headers });
    //     // this.http.post("/api/products", body).toPromise().then((response) => {
    //     //     //do something...
    //     // });
    //
    //     return this.http.post(this.SERVER_URL+path, body, options).subscribe(response=> {
    //         console.log(response);
    //         if (response && response.json()) {
    //             console.log("= =");
    //         }
    //     });
    // }

    getScenes(): Observable<SceneInfo[]>{
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get('http://127.0.0.1:5000/scenes')
            .map((response: Response) => {
                if (response && response.json()) {
                    return plainToClass(SceneInfo, response.json());
                }
            });
    }
    getSceneById(scene_id: number): Observable<SceneInfo>{
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get('http://127.0.0.1:5000/scenes')
            .map((response: Response) => {
                if (response && response.json()) {
                    let array = plainToClass(SceneInfo, response.json());
                    for (let scene of array){
                        if (scene.scene_id == scene_id){
                            console.log(scene);
                            return scene;
                        }
                    }
                    // console.log(plainToClass(SceneInfo, response.json())[0].scene_id);
                    // return plainToClass(SceneInfo, response.json());
                }
            });
    }

    createPluginFrom(pluginId: number, userId: number){

    }
    savePlugin(pluginMeta:any){

    }
    createChainFrom(chainId: number, userId: number){

    }
    saveChain(chainMeta:any){

    }
}
