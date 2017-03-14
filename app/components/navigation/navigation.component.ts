import { Component } from '@angular/core';
import { Location } from '@angular/common'

@Component({
  moduleId: module.id,
  selector: 'navigation',
  styleUrls: ['./css/navigation.component.css'],
  templateUrl: './templates/navigation.html'
})
export class NavigationComponent {
    focusTab: number;
    collapse: number = 0;
    changeCollapse(){
        this.collapse = 1 - this.collapse;
    }
    changeTab(nextFocus: number){
        this.focusTab = nextFocus;
    }
    constructor(private location: Location){
        if (this.location.isCurrentPathEqualTo('/login')||this.location.isCurrentPathEqualTo('')){
            this.focusTab = 0;
        }else if (this.location.isCurrentPathEqualTo('/overview')){
            this.focusTab = 1;
        }else if (this.location.isCurrentPathEqualTo('/datasets')){
            this.focusTab = 2;
        }else if (this.location.isCurrentPathEqualTo('/jobcreation')){
            this.focusTab = 3;
        }else if (this.location.isCurrentPathEqualTo('/datasets')){
            this.focusTab = 4;
        }else if (this.location.isCurrentPathEqualTo('/algchains')){
            this.focusTab = 5;
        }else if (this.location.isCurrentPathEqualTo('/algplugins')){
            this.focusTab = 6;
        }
    }
}
