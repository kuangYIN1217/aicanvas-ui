/**
 * Created by Administrator on 2017/7/13 0013.
 */
import {Headers, Http, Response} from "@angular/http";
import {Injectable} from "@angular/core";
import {SERVER_URL} from "../../app.constants";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
@Injectable()
export class DatasaveService {
  // SERVER_URL: string = SERVER_URL;
  SERVER_URL: string = SERVER_URL;

  constructor(private http: Http) {
  }

  getAuthorization(){
    if(localStorage['authenticationToken']!=undefined){
      return 'Bearer '+ localStorage['authenticationToken'];
    }
    else {
      var url = window.location.href;
      var subUrl = url.substr(0, url.indexOf('#') + 1) + '/';
      window.location.href = subUrl;
    }
  }

  getHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', this.getAuthorization());
    return headers;
  }
  getAllSave(){
    let path = "/api/everyDiskSpace"
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL+path, { headers : headers} )
      .map((response: Response) => {
        if (response) {
          return response.json();
        }
      });
  }
}
