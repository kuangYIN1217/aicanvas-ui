import {
    Component, OnInit, Input, animate, style, transition, trigger, state, HostListener,
    keyframes
} from '@angular/core';
@Component({
    moduleId: module.id,
    selector: 'showImage',
    styleUrls: ['./css/showImage.component.css'],
    templateUrl: './templates/showImage.html',
    providers: [],
    animations: [
        trigger('imgClick', [
            state('off', style({'z-index': '0', 'transform': 'none'})),
            state('on', style({'z-index': '1', 'transform': 'scale(2)'})),
            transition('off=>on', [animate('0.3s ease-in')]),
            transition('on=>off', [animate('0.3s ease-in')]),
        ])
    ]
})
export class ShowImageComponent {
    imgs: any[]=["banner4.jpg","banner3.jpg","banner2.jpg","banner1.png"];
    public current;
    constructor() {
        this.current = 0;
    }
    current(index){
        if(this.current==index){
            return 'on'
        }
    }
    enlarge(){
        if(this.current=='off') {
            this.current='on';
        }else{
            this.current='on';
        }
    }
}