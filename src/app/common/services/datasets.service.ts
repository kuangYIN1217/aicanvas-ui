/**
 * Created by Administrator on 2017/7/13 0013.
 */
import {Headers, Http, Response} from "@angular/http";
import {Injectable} from "@angular/core";

import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {SERVER_URL_DATASETS,SERVER_URL} from "../../app.constants";
import {Observable} from "rxjs";
@Injectable()
export class DatasetsService {
  // SERVER_URL: string = SERVER_URL;
  SERVER_URL: string = SERVER_URL_DATASETS;
  SERVER_URL_TAC: string = SERVER_URL;
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

  getDataSetType(){
    let path = "/api/dataSetType";
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
  getDataInfo(id){
    let path = "/api/dataSet/" + id;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL+path, { headers : headers} )
      .map((response: Response) => {
        if (response && response.json()) {
          return response.json();
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
  updateSetName(id,name){
    let path = "/api/dataSetRename?dataId="+id+"&newName="+name;
    let headers = this.getHeaders();
    return this.http.post(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response) {
          if (response.status == 200) {
            return response.text();
          }
          return response;
        }
      });
  }
  backupDataset(files){
    let path = "/api/backup?files="+files;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response) {
            return response.text();
        }
      })
      /*.timeoutWith(10000, Observable.throw(new Error("Error message")))*/
  }
  updateFileName(id,name){
    let path = "/api/dataFileRename?fileId="+id+"&newName="+name;
    let headers = this.getHeaders();
    return this.http.post(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
          if (response.status == 200) {
            return response.text();
          }
      });
  }
  createDataSet(creator,dataName,dataType,dataTypeName){
    let path = "/api/createDataSet";
    let dataSet = {
      "creator": creator,
      "dataName": dataName,
      "dataId": 0,
      "dataType": dataType,
      "dataTypeName": dataTypeName,
      "diskUsageAccount": "0",
      "fileCount": 0,
      "fileFailed": 0,
      "fileVaild": 0
    }
    let headers = this.getHeaders();
    return this.http.post(this.SERVER_URL + path,dataSet, {headers: headers})
      .map((response: Response) => {
        if (response) {
          if (response.status == 200) {
            return response.text();
          }
          return response;
        }
      });
  }
  createFile(dataId,parentPath){
    let path = "/api/createNewDir/"+dataId+"?parentPath="+parentPath;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response) {
          if (response.status == 200) {
            return response.text();
          }
          return response;
        }
      });
  }
  enterDataset(dataId,level,fileType,fileName,page=0,size=10){
    let path = "/api/dynamicSelect/"+dataId+"/"+fileType+"/"+fileName+"?path="+level+"&page="+page+"&size="+size;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
          if (response) {
            return response;
          }
      });
  }
  deleteFile(fileId,dataId,filePath){
    let path = "/api/deleteDataSetFile/"+fileId+"/"+dataId+"?path="+filePath;
    let headers = this.getHeaders();
    return this.http.delete(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response) {
          return response;
        }
      });
  }
  getTxt(txtPath){
    let path ="/download/" + txtPath;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL_TAC+path, { headers : headers} )
      .map((response: Response) => {
        if (response) {
          console.log('txtresponse:',response);
          return response;
        }
      });
  }
  getHistoryTag(name){
    let path ="/api/getHistoryTag/"+name;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL+path, { headers : headers} )
      .map((response: Response) => {
        if (response && response.json()) {
          return response.json();
        }
      });
  }
  mark(mark,id){
    let path = "/api/addMarkCoordinate/"+id;
    let markImage = mark;
    let headers = this.getHeaders();
    return this.http.post(this.SERVER_URL + path,markImage, {headers: headers})
      .map((response: Response) => {
        if (response) {
          if (response.status == 200) {
            return response.json();
          }
          return response;
        }
      });
  }
  getMarkInfo(fileId){
    let path = "/api/getMarkXMLInfo?imageFileId="+fileId;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response && response.json()) {
          return response.json();
        }else if(response && response.text()){
          return response.text();
        }
      });
  }
  setSign(id){
    let path = "/api/sign?fileId="+id;
    let headers = this.getHeaders();
    return this.http.post(this.SERVER_URL + path, {headers: headers})
      .map((response: Response) => {
        if (response && response.text()) {
          return response.text();
        }
      });
  }
  deleteMark(markCoordinate1,id,fileId){
    let path = "/api/deleteMarkCoordinate/"+id+"/"+fileId;
    let markCoordinate = markCoordinate1;
    let headers = this.getHeaders();
    return this.http.post(this.SERVER_URL + path,markCoordinate,{headers: headers})
      .map((response: Response) => {
        if (response) {
          if (response.status == 200) {
            return response.json();
          }
          return response;
        }
      });
  }
  updateMark(markCoordinate1,id){
    let path = "/api/updateMarkCoordinate/"+id;
    let markCoordinate = markCoordinate1;
    let headers = this.getHeaders();
    return this.http.put(this.SERVER_URL + path,markCoordinate,{headers: headers})
      .map((response: Response) => {
        if (response) {
          if (response.status == 200) {
            return response.json();
          }
          return response;
        }
      });
  }
  createJobGetDatasets(type,creator){
    let path = "/api/dataSets?type="+type+"&creator="+creator+"&page=0&size=100000";
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path,{headers: headers})
      .map((response: Response) => {
        if (response) {
          if (response.status == 200) {
            return response.json();
          }
          return response;
        }
      });
  }
  getDatasets(type,creator){
    let path = "/api/dataSets?type="+type+"&creator="+creator;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path,{headers: headers})
      .map((response: Response) => {
        if (response) {
          if (response.status == 200) {
            return response.json();
          }
          return response;
        }
      });
  }
  searchDatasets(type,name,creator){
    let path = "/api/dataSets?type="+type+"&name="+name+"&creator="+creator;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path,{headers: headers})
      .map((response: Response) => {
        if (response) {
          if (response.status == 200) {
            return response.json();
          }
          return response;
        }
      });
  }
  createXML(arr,dataId){
    let path = "/api/saveXmlFile?xmlPathList="+arr+"&dataId="+dataId;
    let headers = this.getHeaders();
    return this.http.post(this.SERVER_URL + path,{headers: headers})
      .map((response: Response) => {
        if (response) {
          if (response.status == 200) {
            return response.text();
          }
          return response;
        }
      });
  }
  deleteRepeatName(filename,fatherPath){
    let path = "/api/checkDataSetExisting?filenames="+filename+"&fatherPath="+fatherPath;
    let headers = this.getHeaders();
    return this.http.get(this.SERVER_URL + path,{headers: headers})
      .map((response: Response) => {
          if (response.status == 200) {
            return response.json();
          }
      });
  }
}
