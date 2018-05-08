import {Component} from "@angular/core";
import {Location} from "@angular/common";
import {Router} from "@angular/router";

declare var $:any;
@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent{
  focusTab: number;
  collapse: number = 0;
  focusCollapse: string = "0";
  username: string = "";
  changeTab(nextFocus: number , url?) {
    this.focusTab = nextFocus;
    this.router.navigate(['/'], {skipLocationChange: true})
      .then(() => {
        this.router.navigate([url]);
      });

  }
  constructor(private location: Location,private router:Router) {
    if (!localStorage['username']) {
      this.focusTab = 0;
      this.router.navigate(['/login'])
    }
  }
  ngAfterContentChecked(){
    if (!this.location.isCurrentPathEqualTo('/login')) {

    }
    if (localStorage['username']) {
      this.username = localStorage['username'];
    } else {
      this.username = "Loading";
    }
    if (this.location.isCurrentPathEqualTo('/login') || this.location.isCurrentPathEqualTo('')) {
      this.focusTab = 0;
    } else if (this.location.isCurrentPathEqualTo('/nav')) {
      this.focusTab = 1;
    } else if (this.location.isCurrentPathEqualTo('/userinfo')) {
      this.focusTab = 2;
    } else if (this.location.isCurrentPathEqualTo('/usermanage')) {
      this.focusTab = 3;
    }else if (this.location.isCurrentPathEqualTo('/authoritymanage')) {
      this.focusTab = 4;
    }
  }

  logout() {
    localStorage.removeItem("authenticationToken");
    localStorage.removeItem("username");
    this.router.navigate(['/login'])

    // window.location.href = "/login";
  }
}
