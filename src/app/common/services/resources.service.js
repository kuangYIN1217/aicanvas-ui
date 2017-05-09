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
const app_constants_1 = require("../../app.constants");
let ResourcesService = class ResourcesService {
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
    getCpuInfo() {
        let path = "/api/cpuinfo";
        let headers = this.getHeaders();
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                return (class_transformer_1.plainToClass(resources_1.Cpu, response.json()));
            }
        });
    }
    getCpuStatus() {
        let path = "/api/cpu";
        let headers = this.getHeaders();
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                return (class_transformer_1.plainToClass(resources_1.CpuInfo, response.json()));
            }
        });
    }
    getGpuStatus(gpuId) {
        let path = "/api/gpu/" + gpuId;
        let headers = this.getHeaders();
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                return (class_transformer_1.plainToClass(resources_1.GpuInfo, response.json()));
            }
        });
    }
    getAllGpus() {
        let path = "/api/gpus";
        let headers = this.getHeaders();
        // TODO: what if it returns error?
        // Moving hostname to maybe tsconfig.json
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                return (class_transformer_1.plainToClass(resources_1.Gpu, response.json()));
            }
        });
    }
};
ResourcesService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], ResourcesService);
exports.ResourcesService = ResourcesService;
//# sourceMappingURL=resources.service.js.map
