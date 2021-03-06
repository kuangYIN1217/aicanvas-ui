import { Component, OnInit } from '@angular/core';
import {calc_height} from "../common/ts/calc_height";
import {UserService} from "../common/services/user.service";
import set = Reflect.set;
import {ActivatedRoute, Router} from "@angular/router";
declare var $:any;
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  providers:[UserService]
})
export class UserInfoComponent{
  login:string="";
  username:string="";
  userAuthority:any={};
  password:string="";
  userType:string="";
  userRole:string="";
  authority:string="";
  userId:number=0;
  createFlag:boolean = true;
  showTip:boolean = false;
  tipWidth:string='';
  tipContent:string='';
  tipType:string='';
  tipMargin:string='';
  constructor(private userService:UserService,private router: Router,private route: ActivatedRoute) {
    this.username = localStorage['username'];
    this.authority = localStorage['userAuthority'];
  }
  showIconForTree(treeId, treeNode) {
    return !treeNode;
  }
  beforeCollapse(treeId, treeNode){
    return (treeNode.collapse !== false);
  }
  ngOnInit() {
    this.userService.getUserDetail(this.username).subscribe(result=>{
      this.userAuthority = result;
      this.login = this.userAuthority.basUser.login;
      this.password = this.userAuthority.basUser.password?'******':null;
      this.userType = this.userAuthority.roleList[0].basRole.type;
      this.userRole = this.userAuthority.roleList[0].basRole.roleName;
      this.userId = this.userAuthority.basUser.id;
      var zNodes=[];
      let data = this.userAuthority.roleList[0].authorityTreeList;
      if(data){
        for(let i=0;i<data.length;i++){
          if(data[i].hasAuthority==true){
            let obj:any={};
            obj.name = data[i].basAuthority.authorityName;
            obj.open = true;
            obj.isParent = true;
            if(data[i].childAuthorityTreeDtos!=null){
              obj.children=[];
              for(let j=0;j<data[i].childAuthorityTreeDtos.length;j++){
                if(data[i].childAuthorityTreeDtos[j].hasAuthority==true){
                  let child:any={};
                  child.name = data[i].childAuthorityTreeDtos[j].basAuthority.authorityName;
                  obj.children.push(child);
                }
              }
            }else{
              obj.collapse = false;
            }
            zNodes.push(obj);
          }
        }
        var setting = {
          view: {
            showIcon: this.showIconForTree,
          },
          callback:{
            beforeCollapse:this.beforeCollapse,
          }
        };
        $(document).ready(function(){
          $.fn.zTree.init($("#userTree"), setting, zNodes);
        });
      }

    })
    calc_height(document.getElementsByClassName('userContent')[0]);
  }
  errorTip(text){
    this.showTip = true;
    this.tipWidth = "634px";
    this.tipType = "warnning";
    this.tipMargin = "20px 0 0 22px";
    this.tipContent = "请填写"+text+"（字母、数字组合）！";
  }
  save(){
    if(!this.createFlag){
      return false
    }
    if(this.password!=''&&this.password.indexOf('******')!=-1){

    }else{
      let reg = /^[0-9a-zA-Z]+$/;
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
    this.createFlag = false;
    this.userService.userInfoEditUser(this.userId,this.username,this.password)
      .subscribe(result=>{
        if(result.isSuccess==true){
          this.showTip = true;
          this.tipWidth = "634px";
          this.tipType = "success";
          this.tipMargin = "20px 0 0 22px";
          this.tipContent = "密码修改成功,请在3秒后重新登陆";
          this.createFlag = true;
          setTimeout(function () {
            localStorage.removeItem("authenticationToken");
            var url = window.location.href;
            var subUrl = url.substr(0, url.indexOf('#') + 1) + '/';
            window.location.href = subUrl;
          },3000);
        }
      })
  }
  changePsw(){
    this.createFlag = true;
  }
  showTipChange(event){
    this.showTip = false;
  }
}
