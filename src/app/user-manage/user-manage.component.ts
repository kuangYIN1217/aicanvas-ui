import { Component, OnInit } from '@angular/core';
import {calc_height} from "../common/ts/calc_height";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../common/services/user.service";
import {Page} from "../common/defs/resources";

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css'],
  providers:[UserService]
})
export class UserManageComponent{
  allSelect:boolean = false;
  name:string='';
  userInfo:any[]=[];
  pageParams = new Page();
  page: number = 0;
  pageMaxItem: number = 10;
  showDelete:boolean = false;
  content:string='';
  deleteId:string='';
  constructor(private router: Router, private route: ActivatedRoute,private userService:UserService) {
  }
  ngOnInit() {
    calc_height(document.getElementsByClassName('userContent')[0]);
    this.getAllUser(this.name,this.page,this.pageMaxItem);
    this.route.queryParams.subscribe(params =>{
      if(JSON.stringify(params)!='{}'){
        this.page = params["page"];
        this.pageMaxItem = params["size"];
      }
    })
  }
  getAllUser(name,page,size){
    this.userService.getAllUser(name,page,size)
      .subscribe(result=>{
        this.userInfo = result.content;
        let page = new Page();
        page.pageMaxItem = result.size;
        page.curPage = result.number + 1;
        page.totalPage = result.totalPages;
        page.totalNum = result.totalElements;
        this.pageParams = page;
      })
  }
  selectAll(){
    this.allSelect = !this.allSelect;
    if(this.allSelect){
      for(let i=0;i<this.userInfo.length;i++){
        this.userInfo[i].selected = true;
      }
    }else{
      for(let i=0;i<this.userInfo.length;i++){
        this.userInfo[i].selected = false;
      }
    }
  }
  selectUser(item){
    item.selected = !item.selected;
    for(let i=0;i<this.userInfo.length;i++){
      if(this.userInfo[i].selected == false){
        this.allSelect = false;
        break;
      }
    }
  }
  searchName(){
    this.getAllUser(this.name,this.page,this.pageMaxItem);
  }
  getPageData(paraParam){
    this.getAllUser(this.name,paraParam.curPage-1,paraParam.pageMaxItem);
    this.page = paraParam.curPage-1;
    this.pageMaxItem = paraParam.pageMaxItem;
  }
  createUser(){
    this.router.navigate(['../createuser']);
  }
  editUser(item){
    this.router.navigate(['../createuser'],{queryParams: {"userInfo": JSON.stringify(item),"page":this.page,"size":this.pageMaxItem}});
  }
  deleteUser(){
    let id:string='';
    for(let i=0;i<this.userInfo.length;i++){
      if(this.userInfo[i].selected == true){
        id+=this.userInfo[i].id+',';
      }
    }
    this.deleteId = id.substring(0,id.length-1);
    this.showDelete = true;
    this.content = "是否确定删除该用户?"
  }
  deleteChange(event){
    this.userService.deleteUser(this.deleteId)
      .subscribe(result=>{
        if(result=="true"){
          this.getAllUser(this.name,this.page,this.pageMaxItem);
        }
      })
  }
}
