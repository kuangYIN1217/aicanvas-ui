import { Http, Response, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';

import { plainToClass } from "class-transformer";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { UserInfo } from '../defs/resources'
@Injectable()
export class UserService {
    SERVER_URL: string = "http://10.165.33.20:8080";
    constructor(private http: Http) { }
    // common functions
    getAuthorization(){
        return 'Bearer '+ sessionStorage.authenticationToken;
        // return 'Bearer '+ 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTQ5MjcyNDI5N30.j8nOGPy-W_pZW3Co1gpubwtmRz1VkNecxYWTV2KMEM6muwOtOehStM92kxjtOh1CILJznmmquSK2IdrebuNc3A';
    }
    getHeaders(){
        let headers = new Headers();
        // headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Content-Type','application/json');
        headers.append('Accept','application/json');
        headers.append('Authorization',this.getAuthorization());
        return headers;
    }
    // account resource
    // 获取账户信息 返回UserInfo对象
    getAccount() {
        let path = "/api/account";
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
        .map((response: Response)=> {
            if (response && response.json()) {
                if(Number(response.status)==200){
                    return plainToClass(UserInfo, response.json());
                }
            }
        });
    }
    saveAccount(){
        let path = "/api/account";
    }
    changePassword(){
        let path = "/api/account/change_password";
    }
    finishPasswordReset(){
        let path = "/api/account/reset_password/finish";
    }
    requestPasswordReset(){
        let path = "/api/account/reset_password/init";
    }
    // 激活账户 返回json
    activeAccount(key: string){
        let path = "/api/active";
        let params = new URLSearchParams();
        params.set('key', key);
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path,{ headers: headers, search: params  })
        .map((response: Response)=> {
            if (response && response.json()) {
                if(Number(response.status)==200){
                    return response.json();
                }
            }
        });
    }
    // 是否激活，返回json
    isAuthenticated(){
        let path = "/api/authenticate";
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path,{ headers: headers })
        .map((response: Response)=> {
            if (response && response.json()) {
                if(Number(response.status)==200){
                    return response.json();
                }
            }
        });
    }

    registerAccount(){
        let path = "/api/register";
    }
    // user-jwt-controller  返回token
    authorize(username: string, password: string){
        let path = "/api/authenticate";
        let body = JSON.stringify({
                "password": password,
                "rememberMe": true,
                "username": username
        });
        let headers = this.getHeaders();
        return this.http.post(this.SERVER_URL+path ,body,{ headers: headers})
        .map((response: Response)=> {
            if (response && response.json()) {
                if(Number(response.status)==200){
                    return response.json();
                }
                return "null";
            }
        });
    }
    // user-resource
    createUser(user: UserInfo){
        let path = "/api/users";
        let headers = this.getHeaders();
        return this.http.post(this.SERVER_URL+path,{ headers: headers })
        .map((response: Response)=> {
            if (response && response.json()) {
                if(Number(response.status)==200){
                    return plainToClass(UserInfo, response.json());
                }
            }
        });
    }

    updateUser(user: UserInfo){
        let path = "/api/users";
        let headers = this.getHeaders();
        return this.http.put(this.SERVER_URL+path,{ headers: headers })
        .map((response: Response)=> {
            if (response && response.json()) {
                if(Number(response.status)==200){
                    return plainToClass(UserInfo, response.json());
                }
            }
        });
    }

    deleteUser(login: string){
        let path = "/api/users/"+login;
        let headers = this.getHeaders();
        return this.http.delete(this.SERVER_URL+path,{ headers: headers})
        .map((response: Response)=> {
            if (response && response.json()) {
                if(Number(response.status)==200){
                    return plainToClass(UserInfo, response.json());
                }
            }
        });
    }

    getUser(login:string): Observable<UserInfo[]> {
        let path = "/api/users/"+login;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path,{ headers: headers})
        .map((response: Response)=> {
            if (response && response.json()) {
                if(Number(response.status)==200){
                    return plainToClass(UserInfo, response.json());
                }
            }
        });
    }

    getAllUsers(page, size): Observable<UserInfo[]>{
        let path = "/api/users";
        let params = new URLSearchParams();
        params.set('page', page);
        params.set('size',size);
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path,{ headers: headers, search: params  })
        .map((response: Response)=> {
            if (response && response.json()) {
                if(Number(response.status)==200){
                    return plainToClass(UserInfo, response.json());
                }
            }
        });
    }
}
