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
    authority:any[]=[
      {
        "basAuthority":{
          "id":19,
          "authorityName":"用户管理",
          "authorityType":"1"
        },
        "childAuthorityTreeDtos":null,
        "hasAuthority":true
      },
      {
        "basAuthority":{
          "id":20,
          "authorityName":"角色权限管理",
          "authorityType":"1"
        },
        "childAuthorityTreeDtos":null,
        "hasAuthority":true
      },
      {
        "basAuthority":{
          "id":1,
          "authorityName":"信息总览",
          "authorityType":"1"
        },
        "childAuthorityTreeDtos":null,
        "hasAuthority":true
      },
      {
        "basAuthority":{
          "id":2,
          "authorityName":"场景管理",
          "authorityType":"1"
        },
        "childAuthorityTreeDtos":[
          {
            "basAuthority":{
              "id":3,
              "authorityName":"公共场景",
              "authorityType":"2"
            },
            "childAuthorityTreeDtos":null,
            "hasAuthority":true
          },
          {
            "basAuthority":{
              "id":4,
              "authorityName":"我的场景",
              "authorityType":"2"
            },
            "childAuthorityTreeDtos":null,
            "hasAuthority":true
          }
        ],
        "hasAuthority":true
      },
      {
        "basAuthority":{
          "id":5,
          "authorityName":"数据集管理",
          "authorityType":"1"
        },
        "childAuthorityTreeDtos":[
          {
            "basAuthority":{
              "id":6,
              "authorityName":"公共数据集",
              "authorityType":"2"
            },
            "childAuthorityTreeDtos":null,
            "hasAuthority":true
          },
          {
            "basAuthority":{
              "id":7,
              "authorityName":"我的数据集（增删改数据集）",
              "authorityType":"2"
            },
            "childAuthorityTreeDtos":null,
            "hasAuthority":true
          },
          {
            "basAuthority":{
              "id":8,
              "authorityName":"数据标注（图像）",
              "authorityType":"2"
            },
            "childAuthorityTreeDtos":null,
            "hasAuthority":true
          },
          {
            "basAuthority":{
              "id":9,
              "authorityName":"数据备份",
              "authorityType":"2"
            },
            "childAuthorityTreeDtos":null,
            "hasAuthority":true
          }
        ],
        "hasAuthority":true
      },
      {
        "basAuthority":{
          "id":10,
          "authorityName":"模型发布管理",
          "authorityType":"1"
        },
        "childAuthorityTreeDtos":null,
        "hasAuthority":true
      },
      {
        "basAuthority":{
          "id":11,
          "authorityName":"训练任务管理",
          "authorityType":"1"
        },
        "childAuthorityTreeDtos":[
          {
            "basAuthority":{
              "id":12,
              "authorityName":"增删改训练任务",
              "authorityType":"2"
            },
            "childAuthorityTreeDtos":null,
            "hasAuthority":true
          },
          {
            "basAuthority":{
              "id":13,
              "authorityName":"执行训练任务",
              "authorityType":"2"
            },
            "childAuthorityTreeDtos":null,
            "hasAuthority":true
          },
          {
            "basAuthority":{
              "id":14,
              "authorityName":"查看算法链",
              "authorityType":"2"
            },
            "childAuthorityTreeDtos":null,
            "hasAuthority":true
          },
          {
            "basAuthority":{
              "id":15,
              "authorityName":"编辑算法链",
              "authorityType":"2"
            },
            "childAuthorityTreeDtos":null,
            "hasAuthority":true
          },
          {
            "basAuthority":{
              "id":16,
              "authorityName":"推演",
              "authorityType":"2"
            },
            "childAuthorityTreeDtos":null,
            "hasAuthority":true
          },
          {
            "basAuthority":{
              "id":17,
              "authorityName":"模型发布",
              "authorityType":"2"
            },
            "childAuthorityTreeDtos":null,
            "hasAuthority":true
          },
          {
            "basAuthority":{
              "id":21,
              "authorityName":"查看训练数据集",
              "authorityType":"2"
            },
            "childAuthorityTreeDtos":null,
            "hasAuthority":true
          }
        ],
        "hasAuthority":true
      },
      {
        "basAuthority":{
          "id":18,
          "authorityName":"算法组件库",
          "authorityType":"1"
        },
        "childAuthorityTreeDtos":null,
        "hasAuthority":true
      }
    ];
    constructor(private resourcesService: ResourcesService, private userService: UserService,private router: Router){
        if((!localStorage['authenticationToken'])||localStorage['authenticationToken']==""){
            // this.logined = 0;
            // console.log(sessionStorage['authenticationToken']);
        }else{
            let token = localStorage['authenticationToken'];
            // modal for going to overview
            // userService.getAccount().subscribe(account => console.log(account));
            // console.log(userService.getAccount());
            //console.log("already logined : ");
            //console.log(token);
          this.router.navigate(['/userinfo']);
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
        // console.log(valid);
        // if (valid!=this.validCode){
        //     this.showMessage("验证码错误");
        //     $('surePwd').value="";
        //     this.changeValidCode();
        // }else{
            // let token: string = "";
         this.userService.authorize(username, pwd)
            .subscribe(returnToken => this.validToken(returnToken,username));
        // }
    }
    validToken(returnToken,username){
        //console.log(returnToken);
        if(returnToken=="fail"){
            this.showMessage("登陆失败");
        }/*else if(returnToken&&returnToken.Jwt.id_token){
          localStorage['authenticationToken'] = returnToken.Jwt.id_token;
          localStorage['username']= username;
          localStorage['userAuthority']= returnToken.Authority.basRole.type;
          localStorage['allAuthority']= JSON.stringify(returnToken.Authority.authorityTreeList);
          this.router.navigate(['/userinfo'])
          // window.location.href = "/overview";
        }*/else if(returnToken){
          localStorage['authenticationToken'] = returnToken.id_token;
          localStorage['username']= username;
          localStorage['userAuthority']= "system";
          localStorage['allAuthority']= JSON.stringify(this.authority);
          this.router.navigate(['/userinfo'])
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
