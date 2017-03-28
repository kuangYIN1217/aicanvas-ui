import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { plainToClass } from "class-transformer";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { JobInfo, JobProcess } from "../defs/resources";
import { JobParameter } from "../../common/defs/resources";

import { Parameter, TrainingNetwork } from "../defs/parameter";
@Injectable()
export class JobService {
    SERVER_URL: string = "http://10.165.33.20:8080";
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

    createJob(job:JobInfo){
        let path = "/api/job";
        // console.log(job);
        let body = JSON.stringify(job);
        // console.log(body);
        // let headers = this.getHeaders();
        let headers = new Headers();
        headers.append('Content-Type','application/json');
        headers.append('Accept','application/json');
        headers.append('Authorization','Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTQ5MjY5MzM5OX0.FdYeFZe5HFZsvxjwVmTP-o2mb7BO-W6qw7ZUFttLf-0PIut759OM8qxSyRsp9NjyGpx1qXuiUS1jkcaQNZfvWw');
        return this.http.post(this.SERVER_URL+path,body,{ headers: headers })
        .map((response: Response) => {
            if (response && response.json()) {
                if(Number(response.status)==200){
                    return response.json();
                }
                return "null";
            }
        });
    }

    getJob(jobPath: string): Observable<JobParameter[]>{
        let path = "/api/job/"+jobPath;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path, { headers : headers} )
            .map((response: Response) => {
                if (response && response.json()) {
                    return plainToClass(JobParameter, response.json());
                }
        });
    }

    getAllJobs(): Observable<JobInfo[]>{
        let path = "/api/jobs";
        let headers = new Headers();
        // headers.append('Content-Type','application/json');
        headers.append('Accept','application/json');
        headers.append('Authorization',this.getAuthorization());
        return this.http.get(this.SERVER_URL+path, { headers : headers} )
            .map((response: Response) => {
                if (response && response.json()) {
                    // console.log(response.json());
                    return plainToClass(JobInfo, response.json());
                }
        });
    }

    runJob(jobPath: string){
        let path = "/api/runJob/"+jobPath;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path, { headers : headers} )
            .map((response: Response) => {
                if (response) {
                    return response;
                }
        });
    }

    stopJob(jobPath: string){
        let path = "/api/stopJob/"+jobPath;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
            .map((response: Response) => {
                if (response && response.json()) {
                    return response.json();
                }
        });
    }

    saveJobProcess(){
        let path = "/api/jobProcess";
        let body = JSON.stringify({
                "password": "password",
                "rememberMe": true,
                "username": "username"
        });
        let headers = this.getHeaders();
        return this.http.post(this.SERVER_URL+path,body,{ headers: headers })
        .map((response: Response) => {
            if (response && response.json()) {
                if(Number(response.status)==200){
                    return response.json();
                }
                return "null";
            }
        });
    }
}
