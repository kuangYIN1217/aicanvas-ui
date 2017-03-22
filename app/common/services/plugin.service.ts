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

    savePlugin(PluginInfo){
        let path = "/api/plugins";
        let body = JSON.stringify({
                "password": "password",
                "rememberMe": true,
                "username": "username"
        });
        let headers = this.getHeaders();
        return this.http.post(this.SERVER_URL+path,body,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return plainToClass(PluginInfo, response.json());
                }
        });
    }

    getPlugin(pluginId: string): Observable<PluginInfo[]>{
        let path = "/api/plugins/"+pluginId;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return plainToClass(PluginInfo, response.json());
                }
        });
    }

    getAllPlugin(): Observable<PluginInfo[]>{
        let path = "/api/plugins";
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return plainToClass(PluginInfo, response.json());
                }
        });
    }
}
