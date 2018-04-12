/**
 * Created by Administrator on 2017/7/12 0012.
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'cpt-publicfile',
  styleUrls: ['./publicfile.component.css'],
  templateUrl: './publicfile.component.html',
  providers: [DatasetsService]
})
export class PublicFileComponent{
  @Input() d_tableData:string;
  @Output() getResult: EventEmitter<any> = new EventEmitter();
  fileName:string;
  constructor(private datasetsService:DatasetsService,private route: ActivatedRoute ,private router: Router){

  }
  ngOnChanges(...args: any[]) {
    //console.log(this.d_tableData);
  }
  getImage(num){
    if(num=='1'){
      return 'assets/datasets/file/sjjgl_tp.png';
    }else if(num=='2'){
      return 'assets/datasets/file/sjjgl_yp.png';
    }else if(num=='3'){
      return 'assets/datasets/file/sjjgl_wb.png';
    }else if(num=='4'){
      return 'assets/datasets/file/sjjgl_sp.png';
    }else if(num=='5'){
      return 'assets/datasets/file/sjjgl_qt.png';
    }
  }
  enterfile(item){
    item.enter = 1;
  }
  leavefile(item){
    item.enter = 2;
  }
  enterDataset(item){
    //console.log(item);
    sessionStorage.setItem("dataName",item.dataName);
    //this.datasetsService.enterDataset(item.dataId,encodeURI(item.dataPath),null,null)
    // .subscribe(result=>{
    this.router.navigate(['../publicdataset'],{queryParams:{"dataId":item.dataId,"parentPath":item.dataPath,"dataset":true}});
    //console.log(result);
    //})
  }
  filterName(name){
    if(name.match(/^\d{13}_/)){
      return name.substring(14);
    }else{
      return name;
    }
  }
}
