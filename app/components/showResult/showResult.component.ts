import { Component, OnInit, Input, animate, style, transition, trigger, state, HostListener} from '@angular/core';
/*import { SlideImg } from './slide-img.interface';*/
@Component({
    moduleId: module.id,
    selector: 'showResult',
    styleUrls: ['./css/showResult.component.css'],
    templateUrl: './templates/showResult.html',
    providers: [],
    animations: [
     trigger('imgMove', [
       /** 不显示 */
     state('off', style({'display': 'none', 'z-index': '0', 'transform': 'translateX(0)'})),
      /** 上一张图片 */
      state('prev', style({'z-index': '1', 'transform': 'translateX(-100%)'})),
            /** 下一张图片 */
      state('next', style({'z-index': '2', 'transform': 'translateX(100%)'})),
                /** 当前图片 */
      state('on', style({'z-index': '3', 'transform': 'translateX(0)'})),
      transition('prev=>on', [animate('0.3s ease-in')]),
      transition('next=>on', [animate('0.3s ease-in')]),
      transition('on=>prev', [animate('0.3s ease-in')]),
      transition('on=>next', [animate('0.3s ease-in')])
         ])
      ]
})
export class ShowResultComponent {
    /*@Input() imgs: SlideImg[];*/
    imgs: any[]=["banner1.png","banner1.png","banner1.png","banner1.png","banner1.png"];
    current:number;
    constructor() {
        this.current = 0;
        setInterval(() => {
            let id = (this.current + 1) % 3;
            this.current = id;
        },3000)
    }
    ImgState(index) {
         if (this.imgs && this.imgs.length) {
            if (this.current == 0) {
               return index == 0 ? 'on' :
                 index == this.imgs.length - 1 ? 'prev' :
                 'off';
            } else if (this.current == this.imgs.length - 1) {
                return index == this.imgs.length - 1 ? 'on' :
               index == this.imgs.length - 2 ? 'prev' :
               index == 0 ? 'next' :
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
    Next(){
        this.current = (this.current + 1) % this.imgs.length;
    }
     Prev(){
          this.current = this.current - 1 < 0 ? this.imgs.length - 1 : this.current - 1;
        }

     Change(e) {
        if (e == 'left') {
              this.Next();
        } else if (e == 'right') {
              this.Prev();
        }
      }
}
