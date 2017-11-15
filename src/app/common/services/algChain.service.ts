import {Headers, Http, Response} from "@angular/http";
import {Injectable} from "@angular/core";

import {plainToClass} from "class-transformer";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import {PluginInfo} from "../defs/resources";
import {SERVER_URL} from "../../app.constants";
// import { JobParameter,JobCollection } from "../../common/defs/resources";

// import { Parameter, TrainingNetwork } from "../defs/parameter";
@Injectable()
export class AlgChainService {
    SERVER_URL: string = SERVER_URL;
    constructor(private http: Http) { }

    getAuthorization(){
        return 'Bearer '+ localStorage['authenticationToken'];
    }

    getHeaders(){
        let headers = new Headers();
        headers.append('Content-Type','application/json');
        headers.append('Accept','application/json');
        headers.append('Authorization',this.getAuthorization());
        return headers;
    }

    getChainById(chainId: string){
        let path = "/api/algChain/"+chainId;
        let headers = this.getHeaders();
        return this.http.get(this.SERVER_URL+path, { headers : headers} )
            .map((response: Response) => {
                if (response && response.json()) {
                    return plainToClass(PluginInfo, response.json());
                }
        });
    }

  getChainDetailById(chainId: string){
    let path = "/api/algChainDetail/"+chainId;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL+path, { headers : headers} )
      .map((response: Response) => {
        if (response) {
          return response.json();
        }
      });
  }
}
