"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const resources_service_1 = require("../../common/services/resources.service");
const user_service_1 = require("../../common/services/user.service");
let LoginComponent = class LoginComponent {
    constructor(resourcesService, userService) {
        this.resourcesService = resourcesService;
        this.userService = userService;
        this.validCode = "";
        this.digit = 6;
        this.username = "";
        this.msg_header = "";
        this.msg_content = "";
        this.msg_show = false;
        this.tabIndex = 0;
        if ((!sessionStorage['authenticationToken']) || sessionStorage['authenticationToken'] == "") {
            // this.logined = 0;
            // console.log(sessionStorage['authenticationToken']);
        }
        else {
            let token = sessionStorage['authenticationToken'];
            // modal for going to overview
            // userService.getAccount().subscribe(account => console.log(account));
            // console.log(userService.getAccount());
            console.log("already logined : ");
            console.log(token);
          this.router.navigate(['../algorithmChain'],{queryParams: { sceneId: this.sceneId}})
            window.location.href = "/overview";
        }
    }
    ngOnInit() {
        $('#b03').unslider({
            dots: true,
        });
        this.changeValidCode();
    }
    clickBtn() {
        if (this.tabIndex == 0) {
            this.tabIndex = 1;
        }
        else {
            this.tabIndex = 0;
        }
    }
    changeValidCode() {
        $("#code").empty();
        this.validCode = this.getNewValidCode();
        var checkCode = document.getElementById('code');
        if (checkCode) {
            checkCode.className = "code";
        }
        var context = checkCode.getContext('2d');
        context.clearRect(0, 0, checkCode.width, checkCode.height);
        context.fillStyle = '#000';
        // 设置文字属性
        context.font = 'bold italic 70px sans-serif';
        context.textBaseline = 'top';
        // 填充字符串
        context.fillText(this.validCode, 2, 33);
    }
    getNewValidCode() {
        let result = "";
        for (let j = 1; j <= this.digit; j++) {
            let i = Math.floor(Math.random() * 1e6);
            if (this.ifCharacter()) {
                let temp = i % 26 + 65;
                if (this.ifCharacter()) {
                    temp = temp + 32;
                }
                let charc = String.fromCharCode(temp);
                result = result + charc;
            }
            else {
                let temp = i % 10 + 48;
                let charc = String.fromCharCode(temp);
                result = result + charc;
            }
        }
        //console.log(result);
        return result;
    }
    ifCharacter() {
        return Math.floor(Math.random() * 1e6) % 2 == 0;
    }
    login() {
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
        let result = this.userService.authorize(username, pwd)
            .subscribe(returnToken => this.validToken(returnToken, username));
        // }
    }
    validToken(returnToken, username) {
        console.log(returnToken);
        if (returnToken == "fail") {
            this.showMessage("登陆失败");
        }
        else if (returnToken && returnToken.id_token) {
            sessionStorage['authenticationToken'] = returnToken.id_token;
            sessionStorage.username = username;
            console.log(sessionStorage['authenticationToken']);
            console.log("登陆成功");
            // this.showMessage("登陆成功");
            window.location.href = "/overview";
        }
    }
    showMessage(message) {
        this.msg_show = true;
        this.msg_header = "登陆提示";
        this.msg_content = message;
    }
    hideMessageBox() {
        this.msg_show = false;
        if (this.msg_content == "登陆成功") {
            window.location.href = "/overview";
        }
    }
};
LoginComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'login',
        styleUrls: ['./css/login.component.css'],
        templateUrl: './templates/login.html',
        providers: [resources_service_1.ResourcesService, user_service_1.UserService]
    }),
    __metadata("design:paramtypes", [resources_service_1.ResourcesService, user_service_1.UserService])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map
