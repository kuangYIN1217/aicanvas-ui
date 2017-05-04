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
})
export class ShowImageComponent {
    imgs: any[]=["banner4.jpg","banner3.jpg","banner2.jpg","banner1.png"];
    items:any[]=['top1','top2','top3','All'];
    item:string;
    show:string;
    tabIndex:number=0;
    constructor() {

    }

    enlarge(imgPath){
        this.show = imgPath;
        this.tabIndex=1;
    }
    closeWindow(){
        this.tabIndex=0;
    }
}