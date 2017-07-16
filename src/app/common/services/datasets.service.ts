/**
 * Created by Administrator on 2017/7/13 0013.
 */
import {Headers, Http, Response} from "@angular/http";
import {Injectable} from "@angular/core";

import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class DatasetsService {
  // SERVER_URL: string = SERVER_URL;
  SERVER_URL: string = 'http://192.168.16.99:8083';
  constructor(private http: Http) { }

  getAuthorization(){
    return 'Bearer '+ sessionStorage['authenticationToken'];
  }

  getHeaders(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',this.getAuthorization());
    return headers;
  }

  getDataSetType(){
    let path = "/api/dataSetType"
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL+path, { headers : headers} )
      .map((response: Response) => {
        if (response) {
          return response.json();
        }
      });
  }


  deleteDataSet(id){
    let path = "/api/dataSet/" + id;
    let headers = this.getHeaders();
    return this.http.delete(this.SERVER_URL+path, { headers : headers} )
      .map((response: Response) => {
        if (response) {
          return response;
        }
      });
  }


  getDataSets(creator , dataSetType , name , sort, page , size ){

    let path = "/api/dataSets?";
    if (creator) {
      path += "creator=" + creator;
    }
    if (dataSetType) {
      path += '&type=' + dataSetType;
    }
    if (name) {
      path += '&name=' + name;
    }
    if (sort) {
      path += '&sort=' + sort;
    }
    if (page) {
      path += '&page=' + (page -1);
    }
    if (size) {
      path += '&size=' + size;
    }
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL+path, { headers : headers} )
      .map((response: Response) => {
        if (response) {
          return response.json();
        }
      });
  }

}
