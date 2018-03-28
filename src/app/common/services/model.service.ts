import {Headers, Http, Response} from "@angular/http";
import {Injectable} from "@angular/core";

import {plainToClass} from "class-transformer";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {HistoryInfo, ModelInfo} from "../defs/resources";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {SERVER_URL} from "../../app.constants";


@Injectable()
export class modelService {

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
                }
            });
    }
    getAllChains(){
      let path = "/api/getAllChains";
      let headers = this.getHeaders();
      return this.http.get(this.SERVER_URL+path, { headers : headers} )
        .map((response: Response) => {
          if (response && response.json()) {
            return response.json();
          }
        });
    }
    getJobDataset(jobPath,arr,path1,namePart,page=0,size=14){
      let path = "/api/scanDataSetFileDetail?page="+page+"&size="+size;
      let body = JSON.stringify({
        "jobPath": jobPath,
        "label": arr,
        "namePart": namePart,
        "path":path1
      });
      let headers = this.getHeaders();
      return this.http.post(this.SERVER_URL + path, body, { headers: headers })
        .map((response: Response) => {
          if (response) {
            return response;
          }
        });
    }
  getFile(jobPath,label){
    let path = "/api/getDatasetFileSizeAndCount";
    let body = JSON.stringify({
      "jobPath": jobPath,
      "label": label
    });
    let headers = this.getHeaders();
    return this.http.post(this.SERVER_URL + path, body, { headers: headers })
      .map((response: Response) => {
        if (response && response.json()) {
          return response.json();
        }
      });
  }
  publishModel(jobId,modelPredictionIds){
    let path = "/api/modelPublish";
    let modelVo = JSON.stringify({
      "jobId": jobId,
      "modelPredictionIds": modelPredictionIds
    });
    let headers = this.getHeaders();
    return this.http.post(this.SERVER_URL+path,modelVo,{ headers : headers})
      .map((response: Response) => {
        if (response) {
          return response.text();
        }
      });
  }
    saveModelAndUpload(name, jobId, file) {
        let path = "/api/model";
        let body = JSON.stringify({
            "name": name,
            "jobId": jobId,
            "filePath":file
        });
        let headers = this.getHeaders();
        return this.http.post(this.SERVER_URL + path, body, { headers: headers })
            .map((response) => {
                if (response && response.json()) {
                    if (response.status == 200) {
                        return response.json();
                    }
                    else {
                        return "fail";
                    }
                }
            });
    }

    runInference(modelId:number,job_path:string){
        let path = "/api/runInference/"+modelId+"/"+job_path;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path, { headers : headers} )
            .map((response: Response) => {
                if (response) {
                    return response;
                }
            });
    }

    getResult(modelId:number,page=0,size=10){
        let path = "/api/predictionResult/"+modelId+"?page="+page+"&size="+size;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path, { headers : headers})
            .map((response: Response) => {
                if (response) {
                    return response.json();
                }
            });
    }
    getPercent(modelId:number){
        let path = "/api/modelPrediction/"+modelId;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path, { headers : headers} )
            .map((response: Response) => {
                if (response && response.json()) {
                    return response.json();
                }
            });
    }
  getModelPredictionByJob(job_id, page=0,size=10){
    let path = "/api/modelPredictions/"+job_id+"?page="+page+"&size="+size;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL+path, { headers : headers})
      .map((response: Response) => {
        if (response && response.json()) {
          return response.json();
        }
      });
  }
  getAllModel(jobName,senceName, page=0,size=10){
    let path = "/api/getModelList/"+jobName+"/"+senceName+"?page="+page+"&size="+size+"&sort=createTime,desc";
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL+path, { headers : headers})
      .map((response: Response) => {
        if (response && response.json()){
          return response.json();
        }
      });
  }
  deleteModel(id){
    let path = "/api/deleteModel/"+id;
    let headers = this.getHeaders();
    return this.http.delete(this.SERVER_URL+path, { headers : headers})
      .map((response: Response) => {
        if (response){
          return response;
        }
      });
  }
    getHistory(page=0,size=10){
        let path = "/api/modelPredictions?page="+page+"&size="+size;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path, { headers : headers} )
            .map((response: Response) => {
                if (response && response.json()) {
                    return response.json();
                }
            });
    }

}
