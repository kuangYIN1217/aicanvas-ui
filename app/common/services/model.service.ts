import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { plainToClass } from "class-transformer";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { JobInfo, JobProcess } from "../defs/resources";

import {SERVER_URL} from "../../app.constants";
@Injectable()
export class ModelService {
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

    handleFileUpload(modelId, file){
        let path = "/api/model/upload";
        let body = JSON.stringify({
            "modelId": modelId,
            "file": file
        });
        // console.log(body);
        let headers = this.getHeaders();
        return this.http.post(this.SERVER_URL+path,body,{ headers: headers })
        .map((response: Response) => {
            if (response) {
                return response;
            }
        });
    }

    getModelsByUser(prob_id: string){
        let path = "/api/models/"+prob_id;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response) {
                    return response;
                }
        });
    }
}
