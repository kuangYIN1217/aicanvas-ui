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
        return 'Bearer ' + sessionStorage['authenticationToken'];
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

    saveModelAndUpload(name, model_id, file) {
        let path = "/api/model";
        let body = JSON.stringify({
            "name": name,
            "modelId": model_id,
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
        return this.http.get(this.SERVER_URL+path, { headers : headers} )
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
