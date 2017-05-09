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
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
const app_constants_1 = require("../../app.constants");
let modelService = class modelService {
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
    getStatue(jobPath) {
        let path = "/api/publishJob/" + jobPath;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response) {
                return response.text();
            }
        });
    }
    getModel(id) {
        let path = "/api/models/" + id;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                return class_transformer_1.plainToClass(resources_1.ModelInfo, response.json());
            }
        });
    }
    saveModelAndUpload(name, model_id, file) {
        let path = "/api/model";
        let body = JSON.stringify({
            "name": name,
            "modelId": model_id,
            "filePath": file
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
    runInference(modelId, job_path) {
        let path = "/api/runInference/" + modelId + "/" + job_path;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response) {
                return response;
            }
        });
    }
    getResult(modelId, page = 0, size = 10) {
        let path = "/api/predictionResult/" + modelId + "?page=" + page + "&size=" + size;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response) {
                return response.json();
            }
        });
    }
    getPercent(modelId) {
        let path = "/api/modelPrediction/" + modelId;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                return response.json();
            }
        });
    }
    getHistory(page = 0, size = 10) {
        let path = "/api/modelPredictions/?page=" + page + "&size=" + size;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                return class_transformer_1.plainToClass(resources_1.HistoryInfo, response.json());
            }
        });
    }
};
modelService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], modelService);
exports.modelService = modelService;
//# sourceMappingURL=model.service.js.map
