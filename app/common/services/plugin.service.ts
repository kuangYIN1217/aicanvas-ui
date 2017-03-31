import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { plainToClass } from "class-transformer";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { PluginInfo } from "../defs/resources";

import { Parameter, TrainingNetwork } from "../defs/parameter";
@Injectable()
export class PluginService {
    SERVER_URL: string = "http://10.165.33.20:8080";
    constructor(private http: Http) { }

    getAuthorization(){
        return 'Bearer '+ sessionStorage.authenticationToken;
    }

    getHeaders(){
        let headers = new Headers();
        // headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Content-Type','application/json');
        headers.append('Accept','application/json');
        headers.append('Authorization',this.getAuthorization());
        return headers;
    }

    getLayerDict(){
        let path = "/api/layerDict";
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return response.json();
                }
        });
    }

    savePlugin(pluginInfo){
        let path = "/api/plugin";
        let body = JSON.stringify({
                "plugin_id": pluginInfo.plugin_id,
                "plugin_name": pluginInfo.plugin_name,
                "plugin_owner": pluginInfo.plugin_owner,
                "original_plugin_id": pluginInfo.original_plugin_id,
                "plugin_description": pluginInfo.plugin_description,
                "algorithm": pluginInfo.algorithm,
                "has_training_network": pluginInfo.has_training_network,
                "training_network": pluginInfo.training_network,
                "editable_param_list": pluginInfo.editable_param_list
        });
        let headers = this.getHeaders();
        return this.http.post(this.SERVER_URL+path,body,{ headers: headers })
            .map((response: Response) => {
                if (response) {
                    return response;
                }
        });
    }

    getPlugin(pluginId: string): Observable<PluginInfo[]>{
        let path = "/api/plugin/"+pluginId;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return plainToClass(PluginInfo, response.json());
                }
        });
    }

    getAllPlugins(): Observable<PluginInfo[]>{
        let path = "/api/plugins";
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return plainToClass(PluginInfo, response.json());
                }
        });
    }

    copyPlugin(sysPlugin_id){
        let path = "/api/pluginCopy/"+sysPlugin_id;
        let headers = this.getHeaders();
        return this.http.post(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return response.json();
                }
        });
    }
}
