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
let ShowImageComponent = class ShowImageComponent {
    constructor() {
        this.imgs = ["banner4.jpg", "banner3.jpg", "banner2.jpg", "banner1.png"];
        this.items = ['top1', 'top2', 'top3', 'All'];
        this.tabIndex = 0;
    }
    enlarge(imgPath) {
        this.show = imgPath;
        this.tabIndex = 1;
    }
    closeWindow() {
        this.tabIndex = 0;
    }
};
ShowImageComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'showImage',
        styleUrls: ['./css/showImage.component.css'],
        templateUrl: './templates/showImage.html',
        providers: [],
    }),
    __metadata("design:paramtypes", [])
], ShowImageComponent);
exports.ShowImageComponent = ShowImageComponent;
//# sourceMappingURL=showImage.js.map