import {Headers, Http, Response} from "@angular/http";
import {Injectable} from "@angular/core";

import {plainToClass} from "class-transformer";

import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import {JobInfo} from "../defs/resources";
import {JobParameter} from "../defs/resources";

import {SERVER_URL} from "../../app.constants";
@Injectable()
export class JobService {
  SERVER_URL: string = SERVER_URL;

  constructor(private http: Http) {
  }

  getAuthorization() {
    return 'Bearer ' + localStorage['authenticationToken'];
  }

  getHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', this.getAuthorization());
    return headers;
  }

  createJob(chainId,dataId,jobName,senceId) {
    let path = "/api/job";
    /*let number_senceId: number = Number(senceId);*/
    console.log(chainId,dataId,jobName,senceId)
    let senseId = {
      "chainId": chainId,
      "dataId": dataId,
      "jobName": jobName,
      "senceId": senceId,
    };
    console.log(senseId);
    let headers = this.getHeaders();
    return this.http.post(this.SERVER_URL + path, senseId, {headers: headers})
      .map((response: Response) => {
        if (response) {
          if (response.status == 200 && response.json()) {
            return response.json();
          }
          return response;
        }
      });
  }
  deletaDate(data_set){
    let path = "/api/getJobByDataSet/" + data_set;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL+path, { headers : headers} )
      .map((response: Response)=> {
        if (response && response.json()) {
          if(response.status==200){
            return response.json();
          }else{
            return "fail";
          }
        }
      });
  }
  getUnrunningJob(jobPath: string): Observable<JobParameter[]> {
    let path = "/api/job/" + jobPath;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response && response.json()) {
          // return plainToClass(JobParameter, response.json());
          return response.json();
        }
      });
  }

  resetLog(jobPath: string) {
    let path = "/api/reset/" + jobPath;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response) {
          return response;
        }
      });
  }

  downloadLog(jobPath: string) {
    let path = "/api/log?jobPath=" + jobPath;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        return response;
      });
  }

  getJob(jobPath: string, index): Observable<JobParameter[]> {
    let path = "/api/job/" + jobPath + "/" + index;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response && response.json()) {
          return plainToClass(JobParameter, response.json());
        }
      });
  }

  getAllJobs(status, page, size, sencesId, jobName) {
    let condition = "page=" + page + "&size=" + size + "&status=" + status + "&sort=id,desc"
    if (sencesId) {
      condition += "&sencesId=" + sencesId
    }
    if (jobName) {
      condition += "&search=" + jobName
    }
    let path = "/api/jobs?" + condition;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response && response.json()) {
          return response.json();
        }
      });
  }
  getJobDetailById(jobId: number) {
      let path = "/api/jobDetailById/" + jobId;
      let headers = this.getHeaders();
      return this.http.get(this.SERVER_URL + path, {headers: headers})
        .map((response: Response) => {
          if (response && response.json()) {
            return response.json();
          }
        });
  }
  getJobDetail(jobPath: string) {
    let path = "/api/jobDetail/" + jobPath;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response && response.json()) {
          return response.json();
        }
      });
  }

  getWholeJobs() {
    let path = "/api/jobs";
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response && response.json()) {
          return plainToClass(JobInfo, response.json().content);
        }
      });
  }

  runJob(jobPath,num) {
    let path = "/api/runJob/" + jobPath + "/" + num;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response) {
          if (response.status == 200) {
            return "success";
          }else
            return "输入的gpu编号不合法";
        }
      });
  }

  stopJob(jobPath: string) {
    let path = "/api/stopJob/" + jobPath;
    let headers = this.getHeaders();  
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response) {
          return response;
        }
      });
  }

  saveJobProcess() {
    let path = "/api/jobProcess";
    let body = JSON.stringify({
      "password": "password",
      "rememberMe": true,
      "username": "username"
    });
    let headers = this.getHeaders();
    return this.http.post(this.SERVER_URL + path, body, {headers: headers})
      .map((response: Response) => {
        if (response && response.json()) {
          if (response.status == 200) {
            return response.json();
          }
        }
      });
  }

  updateJob(jobId: number, pluginIdArr: string[]) {
    let path = "/api/updateJob";
    let body = JSON.stringify({
      "jobId": jobId,
      "pluginArr": JSON.stringify(pluginIdArr),
    });
    console.log(body);
    let headers = this.getHeaders();
    return this.http.post(this.SERVER_URL + path, body, {headers: headers})
      .map((response: Response) => {
        if (response && response.json()) {
          if (response.status == 200) {
            return response.json();
          }
        }
      });
  }

  finishJob(jobPath: string) {
    let path = "/api/finishJob/" + jobPath;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response) {
          return response;
        }
      });
  }

  publishJob(jobPath: string) {
    let path = "/api/publishJob/" + jobPath;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response) {
          return response;
        }
      });
  }

  getPluginInfoById(jobPath: string , pluginId: string) {
    let path = "/api/jobProcess/" + jobPath + "/" + pluginId;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response && response.json()) {
          return response.json();
        }
      });
  }

}
