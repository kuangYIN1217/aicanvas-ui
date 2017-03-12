import { Component } from '@angular/core';
@Component({
  moduleId: module.id,
  selector: 'navigation',
  styleUrls: ['./css/navigation.component.css'],
  templateUrl: './templates/navigation.html'
})
export class NavigationComponent {
    focusTab: number = 1;
    changeTab(nextFocus: number){
        this.focusTab = nextFocus;
    }
}
