<<<<<<< HEAD
import { Http, Response, RequestOptions } from '@angular/http';
=======
import { Http, Response, RequestOptions, Headers } from '@angular/http';
>>>>>>> c49748ce00c9b8d3158b430794f12515572aec73
import { Injectable } from '@angular/core';

import { plainToClass } from "class-transformer";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

<<<<<<< HEAD
import { CpuInfo } from '../defs/resources'
import { PluginInfo } from "../defs/resources";
import { JobInfo } from "../defs/resources";
import { SceneInfo } from "../defs/resources";
=======
import { CpuInfo, GpuInfo } from '../defs/resources';
>>>>>>> c49748ce00c9b8d3158b430794f12515572aec73
import {SERVER_URL} from "../../app.constants";


import { Parameter, TrainingNetwork } from "../defs/parameter";

@Injectable()
export class ResourcesService {
    SERVER_URL: string = SERVER_URL;
    constructor(private http: Http) { }

<<<<<<< HEAD
    getCpuInfo(): Observable<CpuInfo[]> {

        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get('http://127.0.0.1:5000/cpuinfo')
=======
    getAuthorization(){
        return 'Bearer '+ sessionStorage.authenticationToken;
    }

    getHeaders(){
        let headers = new Headers();
        headers.append('Content-Type','application/json');
        headers.append('Accept','application/json');
        headers.append('Authorization',this.getAuthorization());
        return headers;
    }

    getCpuStatus(): Observable<CpuInfo[]> {
        let path = "/api/cpu";
        let headers = this.getHeaders();
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
>>>>>>> c49748ce00c9b8d3158b430794f12515572aec73
            .map((response: Response) => {
                if (response && response.json()) {
                    return (plainToClass(CpuInfo, response.json()));
                }
            });
    }

<<<<<<< HEAD
    createPluginFrom(pluginId: number, userId: number){

    }
    savePlugin(pluginMeta:any){

    }
    createChainFrom(chainId: number, userId: number){

    }
    saveChain(chainMeta:any){

=======
    getGpuStatus(gpuId): Observable<GpuInfo[]> {
        let path = "/api/gpu/"+gpuId;
        let headers = this.getHeaders();
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return (plainToClass(GpuInfo, response.json()));
                }
            });
    }

    getAllGpus(): Observable<GpuInfo[]> {
        let path = "/api/gpus";
        let headers = this.getHeaders();
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return (plainToClass(GpuInfo, response.json()));
                }
            });
>>>>>>> c49748ce00c9b8d3158b430794f12515572aec73
    }
}
