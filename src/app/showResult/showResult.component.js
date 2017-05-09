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
/*import { SlideImg } from './slide-img.interface';*/
let ShowResultComponent = class ShowResultComponent {
    constructor() {
        /*@Input() imgs: SlideImg[];*/
        this.imgs = ["banner4.jpg", "banner3.jpg", "banner2.jpg", "banner1.png"];
        this.current = 0;
        setInterval(() => {
            let id = (this.current + 1) % 4;
            this.current = id;
            //console.log(this.current);
        }, 1000);
    }
    ImgState(index) {
        if (this.imgs && this.imgs.length) {
            if (this.current === 0) {
                return index === 0 ? 'on' :
                    index === 1 ? 'next' :
                        index === this.imgs.length - 1 ? 'prev' :
                            'off';
            }
            else if (this.current === this.imgs.length - 1) {
                return index === this.imgs.length - 1 ? 'on' :
                    index === this.imgs.length - 2 ? 'prev' :
                        index === 0 ? 'next' :
                            'off';
            }
            switch (index - this.current) {
                case 0:
                    return 'on';
                case 1:
                    return 'next';
                case -1:
                    return 'prev';
                default:
                    return 'off';
            }
        }
        else {
            return 'off';
        }
    }
    Next() {
        this.current = (this.current + 1) % this.imgs.length;
    }
    Prev() {
        this.current = this.current - 1 < 0 ? this.imgs.length - 1 : this.current - 1;
    }
    Change(e) {
        if (e === 'left') {
            this.Next();
        }
        else if (e === 'right') {
            this.Prev();
        }
    }
};
ShowResultComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'showResult',
        styleUrls: ['./css/showResult.component.css'],
        templateUrl: './templates/showResult.html',
        providers: [],
        animations: [
            core_1.trigger('imgMove', [
                core_1.state('off', core_1.style({ 'display': 'none', 'z-index': '0', 'transform': 'scale(0)' })),
                core_1.state('prev', core_1.style({ 'z-index': '1', 'transform': 'scale(0)' })),
                core_1.state('next', core_1.style({ 'z-index': '2', 'transform': 'scale(0)' })),
                core_1.state('on', core_1.style({ 'z-index': '3', 'transform': 'scale(1)' })),
                core_1.transition('prev=>on', [
                    core_1.animate(1000, core_1.keyframes([
                        core_1.style({ opacity: 0 }),
                        core_1.style({ opacity: 1 })
                    ]))
                ]),
                core_1.transition('next=>on', [
                    core_1.animate(1000, core_1.keyframes([
                        core_1.style({ opacity: 1 }),
                        core_1.style({ opacity: 0 })
                    ]))
                ]),
                core_1.transition('on=>prev', [
                    core_1.animate(1000, core_1.keyframes([
                        core_1.style({ opacity: 0 }),
                        core_1.style({ opacity: 1 })
                    ]))
                ]),
                core_1.transition('on=>next', [
                    core_1.animate(1000, core_1.keyframes([
                        core_1.style({ opacity: 1 }),
                        core_1.style({ opacity: 0 })
                    ]))
                ])
            ])
        ]
    }),
    __metadata("design:paramtypes", [])
], ShowResultComponent);
exports.ShowResultComponent = ShowResultComponent;
//# sourceMappingURL=showResult.component.js.map