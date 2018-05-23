import { Component, OnInit } from '@angular/core';
import {calc_height} from "../../common/ts/calc_height";
import {UserService} from "../../common/services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
declare var $:any;
@Component({
  selector: 'app-user-create',
  templateUrl: './createUser.component.html',
  styleUrls: ['./createUser.component.css'],
  providers:[UserService]
})
export class CreateUserComponent{
  username:string='';
  password:string='';
  role:string='';
  showTip:boolean = false;
  tipWidth:string='';
  tipContent:string='';
  tipType:string='';
  tipMargin:string='';
  roleList:any[]=[];
  roleId:number=0;
  showTree:any[]=[];
  createFlag:boolean = true;
  creator:string='';
  userInfo:any={};
  page:number=0;
  size:number=10;
  editIndex:boolean = false;
  userId:number=0;
  constructor(private userService:UserService,private router: Router,private route: ActivatedRoute) {
    this.creator = localStorage['username'];
  }

  ngOnInit() {
    calc_height(document.getElementsByClassName('userContent')[0]);
    this.route.queryParams.subscribe(params =>{
      if(JSON.stringify(params)!='{}'){
        this.userInfo = JSON.parse(params["userInfo"]);
        this.username = this.userInfo.login;
        this.password = '******';
        this.userId = this.userInfo.id;
        this.role = this.userInfo.roleName;
        this.page = params["page"];
        this.size = params["size"];
        this.editIndex = true;
      }
    });
    this.userService.getRoleList('')
      .subscribe(result=>{
        this.roleList = result;
        if(this.editIndex){
          for(let i=0;i<this.roleList.length;i++){
            if(this.roleList[i].roleName==this.role){
              this.roleId = this.roleList[i].id;
              break;
            }
          }
          this.selectRole();
        }
      })
  }
  judgeUserName(){
    this.userService.judgeUserName(this.username)
      .subscribe(result=>{
        if(result=="true"){
          this.showTip = true;
          this.tipWidth = "634px";
          this.tipType = "warnning";
          this.tipMargin = "20px 0 0 22px";
          this.tipContent = this.username+"已存在!";
          this.createFlag = false;
        }else{
          this.createFlag = true;
        }
      })
  }
  showTipChange(event){
    this.showTip = false;
  }
  selectRole(){
    for(let i=0;i<this.roleList.length;i++){
      if(this.role==this.roleList[i].roleName){
          this.roleId = this.roleList[i].id;
          break;
      }else{
        this.roleId = 0;
      }
    }
    if(this.role==''){
      this.roleId = 0;
      $.fn.zTree.destroy();
    }
    if(this.roleId==0){

    }else{
      this.getTree();
    }
  }
  getTree(){
    this.userService.getUserAuthorityById(this.roleId)
      .subscribe(result=>{
        var zNodes=[];
        this.showTree = result.authorityTreeList;
        if(this.showTree){
          for(let i=0;i<this.showTree.length;i++){
            if(this.showTree[i].hasAuthority==true){
              let obj:any={};
              obj.name = this.showTree[i].basAuthority.authorityName;
              obj.isParent = true;
              obj.open = true;
              if(this.showTree[i].childAuthorityTreeDtos!=null){
                obj.children=[];
                for(let j=0;j<this.showTree[i].childAuthorityTreeDtos.length;j++){
                  if(this.showTree[i].childAuthorityTreeDtos[j].hasAuthority==true){
                    let child:any={};
                    child.name = this.showTree[i].childAuthorityTreeDtos[j].basAuthority.authorityName;
                    obj.children.push(child);
                  }
                }
              }else{
                obj.collapse = false;
              }
              zNodes.push(obj);
            }
          }
        }

        var setting = {
          view: {
            showIcon: this.showIconForTree
          },
          callback:{
            beforeCollapse:this.beforeCollapse,
          }
        };
        $.fn.zTree.init($("#userTree"), setting, zNodes);
      })
  }
  beforeCollapse(treeId, treeNode){
    return (treeNode.collapse !== false);
  }
  showIconForTree(treeId, treeNode) {
    return !treeNode;
  }
  errorTip(text){
    this.showTip = true;
    this.tipWidth = "634px";
    this.tipType = "warnning";
    this.tipMargin = "20px 0 0 22px";
    this.tipContent = "请填写"+text+"（字母、数字组合）！";
  }
  create(){
    if(!this.createFlag){
      return false
    }

      //let reg =   /^[0-9a-zA-Z]*$/g;
      //let notChinese = new RegExp("[\\u4E00-\\u9FFF]+","g");
      //let noSpecial =  /[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.-\\\/;'\[\]]/im;
    let reg = /^[0-9a-zA-Z]+$/;
    if(reg.test(this.username)){
      if((/^[0-9]*$/.test(this.username))||(/^[a-zA-Z]*$/.test(this.username))){
        this.errorTip("用户名");
        return false
      }
    }else{
      this.errorTip("用户名");
      return false
    }
      if(this.editIndex&&this.password!=''&&this.password.indexOf('******')!=-1){

      }else{
        if(reg.test(this.password)){
          if((/^[0-9]*$/.test(this.password))||(/^[a-zA-Z]*$/.test(this.password))){
            this.errorTip("密码");
            return false
          }
        }else{
          this.errorTip("密码");
          return false
        }
      }
    if(this.role==''){
      this.showTip = true;
      this.tipWidth = "634px";
      this.tipType = "warnning";
      this.tipMargin = "20px 0 0 22px";
      this.tipContent = "请选择用户角色！";
      this.createFlag = true;
      return false
    }
    this.createFlag = false;
    if(this.editIndex){
      this.userService.editUser(this.userId,this.username,this.password,this.roleId,this.showTree)
        .subscribe(result=>{
          if(result.isSuccess==true){
            this.createFlag = true;
            this.router.navigate(['../usermanage']);
          }
        })
    }else{
      this.userService.createUser(this.creator,this.username,this.password,this.roleId,this.showTree)
        .subscribe(result=>{
          this.createFlag = true;
          this.router.navigate(['../usermanage']);
        })
    }
  }
  back(){
    this.router.navigate(['../usermanage'],{queryParams: {"page":this.page,"size":this.size}});
  }
}
