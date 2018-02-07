/**
 * Created by Administrator on 2017/7/12 0012.
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'cpt-myfile',
  styleUrls: ['./myfile.component.css'],
  templateUrl: './myfile.component.html',
  providers: [DatasetsService]
})
export class MyFileComponent{
  @Input() d_tableData:string;
  @Output() getResult: EventEmitter<any> = new EventEmitter();
  fileName:string;
  sameName:string='';
  constructor(private datasetsService:DatasetsService,private route: ActivatedRoute ,private router: Router){

  }
  ngOnChanges(...args: any[]) {
    console.log(this.d_tableData);
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
  updateName(item){
    if(item.flag==undefined||item.flag!=1) {
      this.fileName = this.filterName(item.dataName);
      this.sameName = this.fileName;
      item.flag = 1;
    }

  }
  enterfile(item){
    item.enter = 1;
  }
  leavefile(item){
    item.enter = 2;
  }
  enterdelete(item){
    item.img = 1;
  }
  leavedelete(item){
    item.enter = 1;
    item.img = 2;
  }
  saveName(item){
    console.log(item);
    this.fileName.replace(/(^\s*)|(\s*$)/g,"");
    if(this.sameName==this.fileName){
      item.flag = 2;
      return
    }else {
      this.datasetsService.updateSetName(item.dataId, this.fileName)
        .subscribe(
          (result) => {
            if (result == 'rename success') {
              item.flag = 2;
              this.getResult.emit('rename success');
            }
          },
          (error) => {
            this.fileName = this.sameName;
            item.flag = 2;
          })
    }
  }
  deleteDateSet(id){
    this.datasetsService.deleteDataSet(id)
      .subscribe(result=>{
        this.getResult.emit('success');
      })
  }
  enterDataset(item){
    console.log(item);
    sessionStorage.setItem("dataName",item.dataName);
    //this.datasetsService.enterDataset(item.dataId,encodeURI(item.dataPath),null,null)
     // .subscribe(result=>{
    this.router.navigate(['../enterdataset'],{queryParams:{"dataId":item.dataId,"parentPath":item.dataPath,"dataset":true}});
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
