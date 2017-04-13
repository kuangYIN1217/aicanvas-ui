
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { plainToClass } from "class-transformer";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CpuInfo, GpuInfo, Gpu } from '../defs/resources';

import {SERVER_URL} from "../../app.constants";


import { Parameter, TrainingNetwork } from "../defs/parameter";

@Injectable()
export class ResourcesService {
    SERVER_URL: string = SERVER_URL;
    constructor(private http: Http) { }


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
