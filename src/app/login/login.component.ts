import { Component, OnInit,HostListener } from '@angular/core';
import { ResourcesService } from '../common/services/resources.service'
import { UserService } from '../common/services/user.service'
import {Router} from "@angular/router";

declare var $:any;
@Component({
    moduleId: module.id,
    selector: 'login',
    styleUrls: ['./css/login.component.css'],
    templateUrl: './templates/login.html',
    providers: [ResourcesService,UserService]
})
export class LoginComponent implements OnInit{
    validCode: string = "";
    digit:number =6;
    username: string = "";
    msg_header = "";
    msg_content = "";
    msg_show = false;
    tabIndex:number=0;
    hg:any;
    errorInfo:string="";
    firstAuthorityId:number=0;
    modelList:any[]=[{"id":3,"url":"/datasetssave","focusTab":1},{"id":4,"url":"/algchains","focusTab":2},{"id":7,"url":"/datasets","focusTab":3},{"id":12,"url":"/inferenceModel","focusTab":4},{"id":13,"url":"/jobcreation","focusTab":5},{"id":21,"url":"/algplugins","focusTab":6}];
    constructor(private resourcesService: ResourcesService, private userService: UserService,private router: Router){
        if((!localStorage['authenticationToken'])||localStorage['authenticationToken']==""){
            // this.logined = 0;
        }else{
            let token = localStorage['authenticationToken'];
            if((!localStorage['allAuthority'])||localStorage['allAuthority']==""||localStorage['allAuthority']=="null"){

            }else{
              let authority =JSON.parse(localStorage['allAuthority']);
              for(let i=0;i<authority.length;i++){
                if(authority[i].hasAuthority==true){
                  this.firstAuthorityId = authority[i].basAuthority.id;
                  break;
                }
              }
              for(let i=0;i<this.modelList.length;i++){
                if(this.modelList[i].id==this.firstAuthorityId){
                  this.router.navigate([this.modelList[i].url]);
                  break;
                }
              }
            }

          //this.router.navigate(['/datasetssave']);
            // window.location.href = "/#/overview";
        }
    }
    ngOnInit(){
        $('#b03').unslider({
            dots: true,
        });
        // this.changeValidCode();
    }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
      if(event.key=="Enter"){
        this.login();
      }
  };
    clickBtn(){
        if(this.tabIndex==0){
            this.tabIndex=1;
        }
        else{
            this.tabIndex=0;
        }
    }
    changeValidCode(){
      //    $("#code").empty();
      //    this.validCode = this.getNewValidCode();
      //    var checkCode = document.getElementById('code');
      //    if (checkCode)
      //    {
      //       checkCode.className = "code";
      //    }
      //    var context = checkCode.getContext('2d');
      //    context.clearRect(0,0,checkCode.width,checkCode.height);
      //    context.fillStyle = '#000';
      //   // 设置文字属性
      //    context.font = 'bold italic 70px sans-serif';
      //    context.textBaseline = 'top';
      //    // 填充字符串
      // context.fillText(this.validCode,2,33);
     }

    getNewValidCode(): string{
        let result: string = "";
        for (let j=1;j<=this.digit;j++){
            let i = Math.floor(Math.random() * 1e6);
            if(this.ifCharacter()){
                let temp = i%26+65;
                if (this.ifCharacter()){
                    temp = temp + 32;
                }
                let charc = String.fromCharCode(temp);
                result = result +charc;
            }else{
                let temp = i%10+48;
                let charc = String.fromCharCode(temp);
                result = result +charc;
            }
        }
        //console.log(result);
        return result;
    }

    ifCharacter(){
        return Math.floor(Math.random() * 1e6)%2==0;
    }

    login(){
        var username = $('#username').val();
        var pwd = $('#password').val();
        var valid = $('#surePwd').val();
        if(username==''||username==undefined){
          this.errorInfo = "请填写用户名！";
          return false
        }
        if(pwd==''||pwd==undefined){
          this.errorInfo = "请填写密码！";
          return false
        }
      this.userService.judgeUserName(username)
        .subscribe(result=>{
          if(result=="false"){
            this.errorInfo = "无该用户名！";
          }else{
            this.userService.authorize(username, pwd)
              .subscribe(returnToken => this.validToken(returnToken,username));
          }
        })
    }
    validToken(returnToken,username){
        //console.log(returnToken);
        if(returnToken.isSuccess==false){
            this.errorInfo = returnToken.message;
        }/*else if(returnToken&&returnToken.Jwt.id_token){
          localStorage['authenticationToken'] = returnToken.Jwt.id_token;
          localStorage['username']= username;
          localStorage['userAuthority']= returnToken.Authority.basRole.type;
          localStorage['allAuthority']= JSON.stringify(returnToken.Authority.authorityTreeList);
          this.router.navigate(['/userinfo'])
          // window.location.href = "/overview";
        }*/else if(returnToken){
          localStorage['authenticationToken'] = returnToken.Jwt.id_token;
          localStorage['username']= username;
          localStorage['userAuthority'] = returnToken.Authority.basRole.type;
          localStorage['allAuthority'] = JSON.stringify(returnToken.Authority.authorityTreeList);
          for(let i=0;i<returnToken.Authority.authorityTreeList.length;i++){
            if(returnToken.Authority.authorityTreeList[i].hasAuthority==true&&(returnToken.Authority.authorityTreeList[i].basAuthority.authorityName!='用户管理'&&returnToken.Authority.authorityTreeList[i].basAuthority.authorityName!='角色权限管理')){
              this.firstAuthorityId = returnToken.Authority.authorityTreeList[i].basAuthority.id;
              break;
            }
          }
          for(let i=0;i<this.modelList.length;i++){
              if(this.modelList[i].id==this.firstAuthorityId){
                this.router.navigate([this.modelList[i].url]);
                break;
              }
          }
        }
    }

    showMessage(message: string){
        this.msg_show = true;
        this.msg_header = "登陆提示";
        this.msg_content = message;
    }
    hideMessageBox(){
        this.msg_show = false;
        if (this.msg_content=="登陆成功"){
          this.router.navigate(['/userinfo'])

          // window.location.href = "/overview";
        }
    }
}
