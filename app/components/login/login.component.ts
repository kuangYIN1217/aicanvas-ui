import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../common/services/resources.service'
import { UserService } from '../../common/services/user.service'

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
    constructor(private resourcesService: ResourcesService, private userService: UserService){
        if((!sessionStorage.authenticationToken)||sessionStorage.authenticationToken==""){
            // this.logined = 0;
            // console.log(sessionStorage.authenticationToken);
        }else{
            let token = sessionStorage.authenticationToken;
            // modal for going to overview
            // userService.getAccount().subscribe(account => console.log(account));
            // console.log(userService.getAccount());
            console.log("already logined : ");
            console.log(token);
            window.location.href = "/overview";
        }
    }
    ngOnInit(){
        $('#b03').unslider({
            dots: true,
        });
        this.changeValidCode();
    }

    changeValidCode(){
        $("#code").empty();
        this.validCode = this.getNewValidCode();
        var checkCode = document.getElementById('code');
        if (checkCode)
        {
            checkCode.className = "code";
        }
        var context = checkCode.getContext('2d');
        context.clearRect(0,0,checkCode.width,checkCode.height);
        context.fillStyle = '#f00';
        // 设置文字属性
        context.font = 'bold italic 70px sans-serif';
        context.textBaseline = 'top';
        // 填充字符串
        context.fillText(this.validCode,2,33);


        // var width = 90;// 画布的宽度
        // var height = 35;// 画布的高度
        // var svg = d3.select(".surePwd").append("svg")
        //     .attr("opacity",0.6).attr("width", width).attr("height", height);
        // var dataset = [ 0 ];
        // var rectHeight = 35;
        // svg.selectAll("rect").data(dataset).enter().append("rect")
        //     .attr("x",0).attr("y",0).attr("width",90).attr("height",35).attr("fill","steelblue");
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
        // let info;
        // this.userService.getAllUsers(0,10).subscribe(msg => console.log(msg));
        // console.log(info);
        // this.userService.getUser("user").subscribe(msg => console.log(msg));

        var username = $('#username').val();
        var pwd = $('#password').val();
        var valid = $('#surePwd').val();
        // console.log(valid);
        if (valid!=this.validCode){
            alert('Wrong validCode!');
            $('surePwd').value="";
            this.changeValidCode();
        }else{
            // let token: string = "";
            let result = this.userService.authorize(username, pwd)
                .subscribe(returnToken => this.validToken(returnToken,username));
        }
    }

    validToken(returnToken,username){
        console.log(returnToken);
        if(returnToken&&returnToken.id_token){
            sessionStorage.authenticationToken = returnToken.id_token;
            sessionStorage.username = username;
            console.log(sessionStorage.authenticationToken);
            alert('登陆成功!');
            window.location.href = "/overview";
        }else{
            alert('登陆失败!');
        }
    }
}
