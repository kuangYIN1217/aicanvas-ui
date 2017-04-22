import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { plainToClass } from "class-transformer";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { SceneInfo,PluginInfo } from "../defs/resources";

import { Parameter, TrainingNetwork } from "../defs/parameter";
import {SERVER_URL} from "../../app.constants";

@Injectable()
export class SceneService {
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

    getChainByScene(id: number){
        let path = "/api/chain/"+id;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path, { headers : headers} )
            .map((response: Response) => {
                if (response && response.json()) {
                    return plainToClass(PluginInfo, response.json());
                }
        });
    }

    getAllScenes(): Observable<SceneInfo[]>{
        let path = "/api/senses";
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path, { headers : headers} )
            .map((response: Response) => {
                if (response && response.json()) {
                    return plainToClass(SceneInfo, response.json());
                }
        });
    }

    getSceneById(id){
        let path = "/api/senses";
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path, { headers : headers} )
            .map((response: Response) => {
                if (response && response.json()) {
                    let scenes:SceneInfo[] = plainToClass(SceneInfo, response.json());
                    for (let scene of scenes){
                        if (scene.id = id){
                            return scene;
                        }
                    }
                }
        });
    }
}
