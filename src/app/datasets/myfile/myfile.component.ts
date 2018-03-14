/**
 * Created by Administrator on 2017/7/12 0012.
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatasetsService} from "../../common/services/datasets.service";
import {ActivatedRoute, Router} from "@angular/router";
import {JobService} from "../../common/services/job.service";

declare var $:any;
@Component({
  selector: 'cpt-myfile',
  styleUrls: ['./myfile.component.css'],
  templateUrl: './myfile.component.html',
  providers: [DatasetsService,JobService]
})
export class MyFileComponent{
  @Input() d_tableData:any;
  @Output() getResult: EventEmitter<any> = new EventEmitter();
  @Output() noopearte: EventEmitter<any> = new EventEmitter();
  fileName:string;
  sameName:string='';
  show:boolean = false;
  content:string='';
  constructor(private datasetsService:DatasetsService,private jobService:JobService,private route: ActivatedRoute ,private router: Router){

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
  updateName(item,i){
    if(item.flag==undefined||item.flag!=1) {
      this.fileName = item.dataName;
      this.sameName = this.fileName;
      item.flag = 1;
    }
    setTimeout(()=>{
      $(`#${i}`).attr("id",i).focus();
    },300);
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
  enterchecked(item){
    item.sb = true;
  }
  leavechecked(item){
    item.sb = false;
  }
  checkFile(item){
    for(let i=0;i<this.d_tableData.length;i++){
      this.d_tableData[i].checked = false;
      this.d_tableData[i].enter = 2;
      this.d_tableData[i].parent = 2;
    }
    item.checked = true;
    if(item.checked){
      item.enter = 2;
      item.parent = 1;
    }
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
            this.noopearte.emit('editname');
            /*this.show = true;
            this.content = "您修改的名称已存在！";*/
          })
    }
  }
  deleteDateSet(id){
    this.jobService.deleteDatasets(id)
      .subscribe(result=>{
        if(result=='true'){
          this.delete(id);
        }else if(result=='false'){
        this.noopearte.emit(result);
        }
      })
  }
  delete(id){
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
