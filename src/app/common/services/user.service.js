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
let UserService = class UserService {
    constructor(http) {
        this.http = http;
        this.SERVER_URL = app_constants_1.SERVER_URL;
    }
    // common functions
    getAuthorization() {
        return 'Bearer ' + sessionStorage['authenticationToken'];
        // return 'Bearer '+ 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTQ5MjcyNDI5N30.j8nOGPy-W_pZW3Co1gpubwtmRz1VkNecxYWTV2KMEM6muwOtOehStM92kxjtOh1CILJznmmquSK2IdrebuNc3A';
    }
    getHeaders() {
        let headers = new http_1.Headers();
        // headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', this.getAuthorization());
        return headers;
    }
    // account resource
    // 获取账户信息 返回UserInfo对象
    getAccount() {
        let path = "/api/account";
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                if (Number(response.status) == 200) {
                    return class_transformer_1.plainToClass(resources_1.UserInfo, response.json());
                }
            }
        });
    }
    saveAccount() {
        let path = "/api/account";
    }
    changePassword() {
        let path = "/api/account/change_password";
    }
    finishPasswordReset() {
        let path = "/api/account/reset_password/finish";
    }
    requestPasswordReset() {
        let path = "/api/account/reset_password/init";
    }
    // 激活账户 返回json
    activeAccount(key) {
        let path = "/api/active";
        let params = new http_1.URLSearchParams();
        params.set('key', key);
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers, search: params })
            .map((response) => {
            if (response && response.json()) {
                if (Number(response.status) == 200) {
                    return response.json();
                }
            }
        });
    }
    // 是否激活，返回json
    isAuthenticated() {
        let path = "/api/authenticate";
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                if (Number(response.status) == 200) {
                    return response.json();
                }
            }
        });
    }
    registerAccount() {
        let path = "/api/register";
    }
    // user-jwt-controller  返回token
    authorize(username, password) {
        let path = "/api/authenticate";
        let body = JSON.stringify({
            "password": password,
            "rememberMe": true,
            "username": username
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
    // user-resource
    createUser(user) {
        let path = "/api/users";
        let headers = this.getHeaders();
        return this.http.post(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                if (Number(response.status) == 200) {
                    return class_transformer_1.plainToClass(resources_1.UserInfo, response.json());
                }
            }
        });
    }
    updateUser(user) {
        let path = "/api/users";
        let headers = this.getHeaders();
        return this.http.put(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                if (Number(response.status) == 200) {
                    return class_transformer_1.plainToClass(resources_1.UserInfo, response.json());
                }
            }
        });
    }
    deleteUser(login) {
        let path = "/api/users/" + login;
        let headers = this.getHeaders();
        return this.http.delete(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                if (Number(response.status) == 200) {
                    return class_transformer_1.plainToClass(resources_1.UserInfo, response.json());
                }
            }
        });
    }
    getUser(login) {
        let path = "/api/users/" + login;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers })
            .map((response) => {
            if (response && response.json()) {
                if (Number(response.status) == 200) {
                    return class_transformer_1.plainToClass(resources_1.UserInfo, response.json());
                }
            }
        });
    }
    getAllUsers(page, size) {
        let path = "/api/users";
        let params = new http_1.URLSearchParams();
        params.set('page', page);
        params.set('size', size);
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL + path, { headers: headers, search: params })
            .map((response) => {
            if (response && response.json()) {
                if (Number(response.status) == 200) {
                    return class_transformer_1.plainToClass(resources_1.UserInfo, response.json());
                }
            }
        });
    }
};
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map
