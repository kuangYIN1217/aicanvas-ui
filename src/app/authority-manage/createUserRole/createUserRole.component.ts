import { Component, OnInit } from '@angular/core';
import {calc_height} from "../../common/ts/calc_height";
import {UserService} from "../../common/services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
declare var $:any;
@Component({
  selector: 'user-role-create',
  templateUrl: './createUserRole.component.html',
  styleUrls: ['./createUserRole.component.css'],
  providers:[UserService]
})
export class CreateUserRoleComponent{
  rolename:string='';
  showTip:boolean = false;
  tipWidth:string='';
  tipContent:string='';
  tipType:string='';
  tipMargin:string='';
  allAuthority:any[]=[];
  checkedNodes:any[]=[];
  createFlag:boolean = true;
  roleInfo:any={};
  page:number=0;
  size:number=10;
  editIndex:boolean = false;
  roleId:number=0;
  creator:string='';
  constructor(private userService:UserService,private router: Router,private route: ActivatedRoute) {
    this.creator = localStorage['username'];
  }

  ngOnInit() {
    calc_height(document.getElementsByClassName('userContent')[0]);
    this.route.queryParams.subscribe(params =>{
      if(JSON.stringify(params)!='{}'){
        this.roleInfo = JSON.parse(params["roleInfo"]);
        this.page = params["page"];
        this.size = params["size"];
        this.rolename = this.roleInfo.roleName;
        this.roleId = this.roleInfo.id;
        this.editIndex = true;
        this.userService.getUserAuthorityById(this.roleInfo.id)
          .subscribe(result=>{
            this.allAuthority = result.authorityTreeList;
            var zNodes=[];
            if(this.editIndex&&result.authorityTreeList){
              for(let i=0;i<result.authorityTreeList.length;i++){
                let obj:any={};
                obj.name = result.authorityTreeList[i].basAuthority.authorityName;
                if(result.authorityTreeList[i].hasAuthority==true){
                  obj.checked = true;
                }
                if(result.authorityTreeList[i].childAuthorityTreeDtos!=null){
                  obj.open = true;
                  obj.children=[];
                  for(let j=0;j<result.authorityTreeList[i].childAuthorityTreeDtos.length;j++){
                    let child:any={};
                    child.name = result.authorityTreeList[i].childAuthorityTreeDtos[j].basAuthority.authorityName;
                    if(result.authorityTreeList[i].childAuthorityTreeDtos[j].hasAuthority==true){
                      child.checked = true;
                    }
                    obj.children.push(child);
                  }
                }else{
                  obj.isParent = true;
                }
                zNodes.push(obj);
              }
              var setting = {
                view: {
                  showIcon: this.showIconForTree
                },
                check: {
                  enable: true
                },
                data: {
                  simpleData: {
                    enable: true
                  }
                },
                callback:{
                  onCheck:function(event, treeId, treeNode){
                    var zTree = $.fn.zTree.getZTreeObj("roleTree");
                    this.linkageTree(zTree,treeNode);
                    this.checkedNodes = zTree.getCheckedNodes();
                  }.bind(this)
                }
              };
              $(document).ready(function(){
                $.fn.zTree.init($("#roleTree"), setting, zNodes);
                $(".ztree > li").each(function () {
                  $(this).find('span:first').hide();
                });
              });
            }else{
                this.getNullAuthorityList();
            }
          })
      }
    })
    if(!this.editIndex){
      this.getNullAuthorityList();
    }
  }
  judgeRoleName(){
    this.userService.judgeRoleName(this.rolename)
      .subscribe(result=>{
        if(result=="true"){
          this.showTip = true;
          this.tipWidth = "634px";
          this.tipType = "warnning";
          this.tipMargin = "20px 0 0 22px";
          this.tipContent = this.rolename+"已存在!";
          this.createFlag = false;
        }else{
          this.createFlag = true;
        }
      })
  }
  getNullAuthorityList(){
    this.userService.getAuthorityList()
      .subscribe(result=>{
        this.allAuthority = result;
        var zNodes=[];
        for(let i=0;i<this.allAuthority.length;i++){
          let obj:any={};
          obj.name = this.allAuthority[i].basAuthority.authorityName;
          if(this.allAuthority[i].childAuthorityTreeDtos!=null){
            obj.open = true;
            obj.children=[];
            for(let j=0;j<this.allAuthority[i].childAuthorityTreeDtos.length;j++){
              let child:any={};
              child.name = this.allAuthority[i].childAuthorityTreeDtos[j].basAuthority.authorityName;
              obj.children.push(child);
            }
          }else{
            obj.isParent = true;
          }
          zNodes.push(obj);
        }
        var setting = {
          view: {
            showIcon: this.showIconForTree
          },
          check: {
            enable: true
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback:{
            onCheck:function(event, treeId, treeNode){
              var zTree = $.fn.zTree.getZTreeObj("roleTree");
              this.linkageTree(zTree,treeNode);
              this.checkedNodes = zTree.getCheckedNodes();
            }.bind(this)
          }
        };
        $(document).ready(function(){
          $.fn.zTree.init($("#roleTree"), setting, zNodes);
          $(".ztree > li").each(function () {
            $(this).find('span:first').hide();
          });
        });
      });
  }
  showIconForTree(treeId, treeNode) {
    return !treeNode;
  }
  linkageTree(zTree,treeNode){
    if(treeNode.checked){
      if(treeNode.level==1){
        var name = treeNode.name;
        var arr =treeNode.getParentNode().children;
        for(var i=0;i<arr.length;i++){
          if((arr[i].name=="数据标注（图像）"&&name=="数据标注（图像）")||(arr[i].name=="数据备份"&&name=="数据备份")){
            var node1 =zTree.getNodeByParam("name","我的数据集（增删改数据集）");
            zTree.checkNode(node1, true, true);
          }
          if((arr[i].name=="执行训练任务"&&name=="执行训练任务")||(arr[i].name=="查看算法链"&&name=="查看算法链")||(arr[i].name=="查看训练数据集"&&name=="查看训练数据集")||(arr[i].name=="编辑算法链"&&name=="编辑算法链")||(arr[i].name=="推演"&&name=="推演")||(arr[i].name=="模型发布"&&name=="模型发布")){
            var node1 =zTree.getNodeByParam("name","增删改训练任务");
            zTree.checkNode(node1, true, true);
          }
          if(arr[i].name=="编辑算法链"&&name=="编辑算法链"){
            var node2 =zTree.getNodeByParam("name","查看算法链");
            zTree.checkNode(node2, true, true);
          }
          if((arr[i].name=="推演"&&name=="推演")||(arr[i].name=="模型发布"&&name=="模型发布")){
            var node2 =zTree.getNodeByParam("name","执行训练任务");
            zTree.checkNode(node2, true, true);
          }
          if(arr[i].name=="模型发布"&&name=="模型发布"){
            var node3 =zTree.getNodeByParam("name","推演");
            zTree.checkNode(node3, true, true);
          }
        }
      }
    }
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
    //let reg = /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]/;
    //let notChinese = new RegExp("[\\u4E00-\\u9FFF]+","g");
    //let noSpecial =  /[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/im;
    let reg = /^[0-9a-zA-Z]+$/;
    if(reg.test(this.rolename)){
      if((/^[0-9]*$/.test(this.rolename))||(/^[a-zA-Z]*$/.test(this.rolename))){
        this.errorTip("用户名");
        return false
      }
    }else{
      this.errorTip("用户名");
      return false
    }
    for(let i=0;i<this.allAuthority.length;i++){
      this.allAuthority[i].hasAuthority = null;
      if(this.allAuthority[i].childAuthorityTreeDtos!=null){
        for(let k=0;k<this.allAuthority[i].childAuthorityTreeDtos.length;k++){
          this.allAuthority[i].childAuthorityTreeDtos[k].hasAuthority = null;
        }
      }
    }
    for(let i=0;i<this.allAuthority.length;i++){
      for(let j=0;j<this.checkedNodes.length;j++){
        if(this.allAuthority[i].basAuthority.authorityName==this.checkedNodes[j].name){
          this.allAuthority[i].hasAuthority = true;
        }
        if(this.allAuthority[i].childAuthorityTreeDtos!=null){
          for(let k=0;k<this.allAuthority[i].childAuthorityTreeDtos.length;k++){
            if(this.allAuthority[i].childAuthorityTreeDtos[k].basAuthority.authorityName==this.checkedNodes[j].name){
              this.allAuthority[i].childAuthorityTreeDtos[k].hasAuthority = true;
            }
          }
        }
      }
    }
    this.createFlag = false;
    if(!this.editIndex){
      this.userService.createRole(this.creator,this.rolename,this.allAuthority)
        .subscribe(result=>{
          if(result=='true'){
            this.createFlag = true;
            this.router.navigate(['../authoritymanage']);
          }
        })
    }else{
      this.userService.editRole(this.rolename,this.roleId,this.allAuthority)
        .subscribe(result=>{
          if(result=='true'){
            this.createFlag = true;
            this.router.navigate(['../authoritymanage']);
          }
        })
    }

  }
  showTipChange(event){
    this.showTip = false;
  }
  back(){
    this.router.navigate(['../authoritymanage'],{queryParams: {"page":this.page,"size":this.size}});
  }
}
