import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import { plainToClass } from "class-transformer";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CpuInfo } from '../defs/resources'
import { PluginInfo } from "../defs/resources";

@Injectable()
export class ResourcesService {

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

    getPluginInfo(plugin_id: Observable<string>): Observable<PluginInfo>{
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get('http://127.0.0.1:5000/algplugins')
            .map((response: Response) => {
                if (response && response.json()) {
                    let plugins: PluginInfo[] = plainToClass(PluginInfo, response.json());
                    for (let plugin of plugins) {
                        if (plugin.plugin_id == plugin_id {
                            return plugin;
                        }
                    }
                }
            });
    }
}
