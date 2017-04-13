import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { plainToClass } from "class-transformer";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { JobInfo, ModelInfo, SceneInfo } from "../defs/resources";


import {SERVER_URL} from "../../app.constants";
@Injectable()
export class modelService {

    SERVER_URL: string = SERVER_URL;

    constructor(private http: Http) {
    }

    getAuthorization() {
        return 'Bearer ' + sessionStorage.authenticationToken;
    }

    getHeaders() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', this.getAuthorization());
        return headers;
    }

    getStatue(jobPath: string){
        let path = "/api/publishJob/"+jobPath;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path, { headers : headers} )
            .map((response: Response) => {
                if (response) {
                    return response.text();
                }
            });
    }
    getModel(id:number){
        let path = "/api/models/"+id;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path, { headers : headers} )
            .map((response: Response) => {
                if (response && response.json()) {
                    return plainToClass(ModelInfo, response.json());
                }else{
                    alert("获取失败");
                }
            });
    }
}