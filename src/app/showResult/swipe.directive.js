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
let SwipeDirective = class SwipeDirective {
    constructor() {
        this.mySwipe = new core_1.EventEmitter();
    }
    onTouchStart(e) {
        this.touchStartX = e.changedTouches[0].clientX;
        this.touchStartY = e.changedTouches[0].clientY;
    }
    onTouchEnd(e) {
        let moveX = e.changedTouches[0].clientX - this.touchStartX;
        let moveY = e.changedTouches[0].clientY - this.touchStartY;
        if (Math.abs(moveY) < Math.abs(moveX)) {
            /**
             * Y轴移动小于X轴 判定为横向滑动
              */
            if (moveX > 50) {
                this.mySwipe.emit('right');
            }
            else if (moveX < -50) {
                this.mySwipe.emit('left');
            }
        }
        else if (Math.abs(moveY) > Math.abs(moveX)) {
            /**
            * Y轴移动大于X轴 判定为纵向滑动
             */
            if (moveY > 50) {
                this.mySwipe.emit('down');
            }
            else if (moveY < -50) {
                this.mySwipe.emit('up');
            }
        }
        this.touchStartX = this.touchStartY = -1;
    }
};
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SwipeDirective.prototype, "mySwipe", void 0);
__decorate([
    core_1.HostListener('touchstart', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SwipeDirective.prototype, "onTouchStart", null);
__decorate([
    core_1.HostListener('touchend', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SwipeDirective.prototype, "onTouchEnd", null);
SwipeDirective = __decorate([
    core_1.Directive({ selector: '[mySwipe]' })
], SwipeDirective);
exports.SwipeDirective = SwipeDirective;
//# sourceMappingURL=swipe.directive.js.map