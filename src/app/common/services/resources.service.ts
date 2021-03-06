
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { plainToClass } from "class-transformer";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CpuInfo, GpuInfo, Gpu,Cpu } from '../defs/resources';

import {SERVER_URL} from "../../app.constants";


import { Parameter, TrainingNetwork } from "../defs/parameter";

@Injectable()
export class ResourcesService {
    SERVER_URL: string = SERVER_URL;
    constructor(private http: Http) { }
  getAuthorization(){
    if(localStorage['authenticationToken']!=undefined){
      return 'Bearer '+ localStorage['authenticationToken'];
    }
    else {
      var url = window.location.href;
      var subUrl = url.substr(0, url.indexOf('#') + 1) + '/';
      window.location.href = subUrl;
    }
  }
    getHeaders(){
        let headers = new Headers();
        headers.append('Content-Type','application/json');
        headers.append('Accept','application/json');
        headers.append('Authorization',this.getAuthorization());
        /*headers.append('Access-Control-Allow-Origin','*');*/
        return headers;
    }
    getCpuInfo(){
        let path = "/api/cpuinfo";
        let headers = this.getHeaders();
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return response.json();
                }
            })
    }

    getCpuStatus(): Observable<CpuInfo[]> {
        let path = "/api/cpu";
        let headers = this.getHeaders();
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return (plainToClass(CpuInfo, response.json()));
                }
            });
    }


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

    getAllGpus(): Observable<Gpu[]> {
        let path = "/api/gpus";
        let headers = this.getHeaders();
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return (plainToClass(Gpu, response.json()));
                }
            });
    }
}
