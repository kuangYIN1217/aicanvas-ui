"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("@angular/http");
const core_1 = require("@angular/core");
const class_transformer_1 = require("class-transformer");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
const resources_1 = require("../defs/resources");
const resources_2 = require("../defs/resources");
const app_constants_1 = require("../../app.constants");
let JobService = class JobService {
    constructor(http) {
        this.http = http;
        this.SERVER_URL = app_constants_1.SERVER_URL;
    }
    getAuthorization() {
        return 'Bearer ' + sessionStorage['authenticationToken'];
    }
    getHeaders() {
        let headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', this.getAuthorization());
        return headers;
    }
    createJob(senceId, chainId) {
        let path = "/api/job";
        /*let number_senceId: number = Number(senceId);*/
        let senseId = {
            "chainId": chainId,
            "senceId": senceId
        };
        // console.log(body);
        let headers = this.getHeaders();
        return this.http.post(this.SERVER_URL + path, senseId, { headers: headers })
            .map((response) => {
            if (response) {
                if (response.status == 200 && response.json()) {
                    return class_transformer_1.plainToClass(resources_1.JobInfo, response.json());
                }
                return response;
            }
        });
    }
    getUnrunningJob(jobPath) {
        let path = "/api/job/" + jobPath;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                return class_transformer_1.plainToClass(resources_2.JobParameter, response.json());
            }
        });
    }
    getJob(jobPath, index) {
        let path = "/api/job/" + jobPath + "/" + index;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                return class_transformer_1.plainToClass(resources_2.JobParameter, response.json());
            }
        });
    }
    getAllJobs(status, page, size) {
        let path = "/api/jobs?page=" + page + "&size=" + size + "&status=" + status;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                return response.json();
            }
        });
    }
    getJobDetail(jobPath) {
        let path = "/api/jobDetail/" + jobPath;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                return response.json();
            }
        });
    }
    getWholeJobs() {
        let path = "/api/jobs";
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                return class_transformer_1.plainToClass(resources_1.JobInfo, response.json().content);
            }
        });
    }
    runJob(jobPath) {
        let path = "/api/runJob/" + jobPath;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response) {
                return response;
            }
        });
    }
    stopJob(jobPath) {
        let path = "/api/stopJob/" + jobPath;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
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
        return this.http.post(this.SERVER_URL + path, body, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                if (response.status == 200) {
                    return response.json();
                }
            }
        });
    }
    updateJob(jobId, pluginIdArr) {
        let path = "/api/updateJob";
        let body = JSON.stringify({
            "jobId": jobId,
            "pluginArr": JSON.stringify(pluginIdArr),
        });
        console.log(body);
        let headers = this.getHeaders();
        return this.http.post(this.SERVER_URL + path, body, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                if (response.status == 200) {
                    return response.json();
                }
            }
        });
    }
    finishJob(jobPath) {
        let path = "/api/finishJob/" + jobPath;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response) {
                return response;
            }
        });
    }
    publishJob(jobPath) {
        let path = "/api/publishJob/" + jobPath;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response) {
                return response;
            }
        });
    }
};
JobService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], JobService);
exports.JobService = JobService;
//# sourceMappingURL=job.service.js.map
