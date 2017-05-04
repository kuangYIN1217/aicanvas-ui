import {
    Component, OnInit, Input, animate, style, transition, trigger, state, HostListener,
    keyframes
} from '@angular/core';
/*import { SlideImg } from './slide-img.interface';*/
@Component({
    moduleId: module.id,
    selector: 'showResult',
    styleUrls: ['./css/showResult.component.css'],
    templateUrl: './templates/showResult.html',
    providers: [],
    animations: [
         trigger('imgMove', [
             state('off', style({'display': 'none', 'z-index': '0', 'transform': 'scale(0)'})),
             state('prev', style({'z-index': '1', 'transform': 'scale(0)'})),
             state('next', style({'z-index': '2', 'transform': 'scale(0)'})),
             state('on', style({'z-index': '3', 'transform': 'scale(1)'})),
                 transition('prev=>on', [
                     animate(1000, keyframes([
                         style({  opacity: 0 }),
                         style({  opacity: 1})
                     ]))
                 ]),
                transition('next=>on', [
                    animate(1000, keyframes([
                        style({  opacity: 1 }),
                        style({  opacity: 0})
                    ]))
                 ]),
                 transition('on=>prev', [
                     animate(1000, keyframes([
                         style({  opacity: 0 }),
                         style({  opacity: 1})
                     ]))
                 ]),
                 transition('on=>next', [
                     animate(1000, keyframes([
                         style({  opacity: 1 }),
                         style({  opacity: 0})
                     ]))
                 ])
         ])
    ]
})
export class ShowResultComponent {
    /*@Input() imgs: SlideImg[];*/
    imgs: any[]=["banner4.jpg","banner3.jpg","banner2.jpg","banner1.png"];
    public current;
    constructor() {
        this.current = 0;
       setInterval(() => {
            let id = (this.current + 1) % 4;
            this.current = id;
            //console.log(this.current);
        },1000)
    }
    ImgState(index) {
        if (this.imgs && this.imgs.length) {
            if (this.current === 0) {
                return index === 0 ? 'on' :
                    index === 1 ? 'next' :
                        index === this.imgs.length - 1 ? 'prev' :
                            'off';
            } else if (this.current === this.imgs.length - 1) {
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
        } else {
            return 'off';
        }
    }

    public Next() {
        this.current = (this.current + 1) % this.imgs.length;
    }
    public Prev() {
        this.current = this.current - 1 < 0 ? this.imgs.length - 1 : this.current - 1;
    }

    public Change(e) {
        if (e === 'left') {
            this.Next();
        } else if (e === 'right') {
            this.Prev();
        }
    }

}
