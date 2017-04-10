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
import {SERVER_URL} from "../../app.constants";


import { Parameter, TrainingNetwork } from "../defs/parameter";

@Injectable()
export class ResourcesService {
    SERVER_URL: string = SERVER_URL;
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

    createPluginFrom(pluginId: number, userId: number){

    }
    savePlugin(pluginMeta:any){

    }
    createChainFrom(chainId: number, userId: number){

    }
    saveChain(chainMeta:any){

    }
}
