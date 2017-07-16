import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { plainToClass } from "class-transformer";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {AlgorithmInfo, PluginInfo} from "../defs/resources";
import {SERVER_URL} from "../../app.constants";

import { Parameter, TrainingNetwork,Editable_param } from "../defs/parameter";
@Injectable()
export class PluginService {
    SERVER_URL: string = SERVER_URL;
    constructor(private http: Http) { }

    getAuthorization(){
        return 'Bearer '+ sessionStorage['authenticationToken'];
    }

    getHeaders(){
        let headers = new Headers();
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
      console.log(pluginInfo);
        let body = JSON.stringify(
                pluginInfo
        );
        console.log(body);
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
        return this.http.post(this.SERVER_URL+path,null,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return response.json();
                }
        });
    }

    getTranParamTypes(): Observable<Editable_param[]>{
        let path = "/api/tranParamTypes";
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return plainToClass(Editable_param,response.json().train_params.editable_param_list);
                }
        });
    }
    getAlgorithmChain(){
        let path = "/api/algChains";
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return plainToClass(AlgorithmInfo, response.json());
                }
            });
    }
}
