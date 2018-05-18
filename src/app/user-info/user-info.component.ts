import { Component, OnInit } from '@angular/core';
import {calc_height} from "../common/ts/calc_height";
import {UserService} from "../common/services/user.service";
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
  constructor(private userService:UserService) {
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
  save(){
    if(!this.createFlag){
      return false
    }
    let reg = /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{4,23}/;
    if(!reg.test(this.password)){
      this.showTip = true;
      this.tipWidth = "634px";
      this.tipType = "warnning";
      this.tipMargin = "20px 0 0 22px";
      this.tipContent = "请填写用户密码（字母、数字组合）！";
      this.createFlag = true;
      return false
    }
    this.createFlag = false;
    this.userService.editUser(this.userId,this.username,this.password)
      .subscribe(result=>{
        if(result==true){
          this.showTip = true;
          this.tipWidth = "634px";
          this.tipType = "success";
          this.tipMargin = "20px 0 0 22px";
          this.tipContent = "密码修改成功";
          this.createFlag = true;
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
