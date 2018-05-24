import { Component, OnInit } from '@angular/core';
import {UserService} from "../common/services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Page} from "../common/defs/resources";
import {calc_height} from "../common/ts/calc_height";

@Component({
  selector: 'app-authority-manage',
  templateUrl: './authority-manage.component.html',
  styleUrls: ['./authority-manage.component.css'],
  providers:[UserService]
})
export class AuthorityManageComponent{
  name:string='';
  roleInfo:any[]=[];
  pageParams = new Page();
  page: number = 0;
  pageMaxItem: number = 10;
  showDelete:boolean = false;
  content:string='';
  deleteId:string='';
  constructor(private router: Router, private route: ActivatedRoute,private userService:UserService) {

  }
  getAllRole(name,page,size){
    this.userService.getAllRole(name,page,size)
      .subscribe(result=>{
        this.roleInfo = result.content;
        let page = new Page();
        page.pageMaxItem = result.size;
        page.curPage = result.number + 1;
        page.totalPage = result.totalPages;
        page.totalNum = result.totalElements;
        this.pageParams = page;
      })
  }
  getPageData(paraParam){
    this.getAllRole(this.name,paraParam.curPage-1,paraParam.pageMaxItem);
    this.page = paraParam.curPage-1;
    this.pageMaxItem = paraParam.pageMaxItem;
  }
  searchRole(){
    this.getAllRole(this.name,this.page,this.pageMaxItem);
  }
  createRole(){
    this.router.navigate(['../createrole']);
  }
  ngOnInit() {
    calc_height(document.getElementsByClassName('userContent')[0]);
    this.route.queryParams.subscribe(params =>{
      if(JSON.stringify(params)!='{}'){
        this.page = params["page"];
        this.pageMaxItem = params["size"];
      }
    })
    this.getAllRole(this.name,this.page,this.pageMaxItem);
  }
  editRole(item){
    this.router.navigate(['../createrole'],{queryParams: {"roleInfo": JSON.stringify(item),"page":this.page,"size":this.pageMaxItem}});
  }
  deleteRole(id){
    this.userService.checkRoleHasUser(id)
      .subscribe(result=>{
        if(result=='false'){
          this.deleteId = id;
          this.showDelete = true;
          this.content = "是否确定删除该用户角色?"
        }else if(result=='true'){

        }
      })

  }
  deleteChange(event){
    this.userService.deleteRole(this.deleteId)
      .subscribe(result=>{
        if(result=="true"){
          this.getAllRole(this.name,this.page,this.pageMaxItem);
        }
      })
  }

}
