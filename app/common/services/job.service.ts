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

    createJob(senceId){
        let path = "/api/job?senseId="+senceId;
        let body = JSON.stringify({});
        let headers = this.getHeaders();
        return this.http.post(this.SERVER_URL+path,body,{ headers: headers })
        .map((response: Response) => {
            if (response) {
                if(response.status==200&&response.json()){
                    return plainToClass(JobInfo,response.json());
                }
                return response;
            }
        });
    }

    getJob(jobPath: string, index): Observable<JobParameter[]>{
        let path = "/api/job/"+jobPath+"/"+index;
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
        let headers = this.getHeaders();
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
                if (response) {
                    return response;
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

    updateJob(){

    }
}
