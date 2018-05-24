import {Component} from "@angular/core";
import {Location, LocationStrategy, PathLocationStrategy} from "@angular/common";
import {ResourcesService} from "../common/services/resources.service";
import {SceneService} from "../common/services/scene.service";
import {SceneInfo} from "../common/defs/resources";
import {ActivatedRoute, Router} from "@angular/router";

declare var $:any;
@Component({
  selector: 'navigation',
  styleUrls: ['./css/navigation.component.css'],
  templateUrl: './templates/navigation.html',
  providers: [ResourcesService, SceneService],

})
export class NavigationComponent {
  userInfo:string='false';
  // needhide = 0;
  focusTab: number=0;
  collapse: number = 0;
  sceneArray: SceneInfo[] = [];
  focusCollapse: string = "0";
  username: string = "";
  userAuthority:string='';
  menuAuthority:any[]=[];
  Index:number=0;
  modelList:any[]=[{"id":3,"url":"/datasetssave","focusTab":1},{"id":4,"url":"/algchains","focusTab":2},{"id":7,"url":"/datasets","focusTab":3},{"id":12,"url":"/inferenceModel","focusTab":4},{"id":13,"url":"/jobcreation","focusTab":5},{"id":21,"url":"/algplugins","focusTab":6}];
  // location: Location;
  show_menu:boolean=false;
  changeCollapse() {
    this.collapse = 1 - this.collapse;
  }
  enterUser(){
    sessionStorage['userInfo'] = 'true';
    this.userInfo = sessionStorage['userInfo'];
    this.router.navigate(['/userinfo']);
  }
  changeTab(nextFocus: number , url?) {
    this.focusTab = nextFocus;
      if(this.focusTab<10){
        sessionStorage['userInfo'] = 'false';
        this.userInfo = sessionStorage['userInfo'];
      }else{
        sessionStorage['userInfo'] = 'true';
        this.userInfo = sessionStorage['userInfo'];
      }
        this.router.navigate([url]);
  }

  constructor(private location: Location,private router:Router,private route: ActivatedRoute) {
    if (!localStorage['username']) {
      this.focusTab = 0;
      this.router.navigate(['/login'])
    }
    if (sessionStorage['userInfo']=='true') {
      this.userInfo = sessionStorage['userInfo'];
    }
  }
  ngOnChanges(...args: any[]) {

  }
  //response
  response(data){
    console.log(data)
  }
  backIndex(){
    sessionStorage['userInfo'] = 'false';
    this.userInfo = sessionStorage['userInfo'];
    for(let i=0;i<this.menuAuthority.length;i++){
      console.log(this.menuAuthority);
      if(this.menuAuthority[i].hasAuthority){
          this.focusTab = i+1;
          let url = this.modelList[i].url;
          this.router.navigate([url]);
          break;
      }
    }
  }
  ngAfterContentChecked(){
    // this.location = location;
    // console.log("navigation initial");
    if (!this.location.isCurrentPathEqualTo('/login')) {
      // sceneService.getAllScenes()
      //     .subscribe(sceneArray => this.sceneArray = sceneArray);
    }
    if (localStorage['username']&&localStorage['userAuthority']&&localStorage['allAuthority']){
      this.username = localStorage['username'];
      this.userAuthority = localStorage['userAuthority'];
      this.menuAuthority = JSON.parse(localStorage['allAuthority']);
    } else {
      this.username = "Loading";
    }
    if (sessionStorage['userInfo']=='true') {
      this.userInfo = sessionStorage['userInfo'];
    }else{
      this.userInfo = 'false';
    }
    if (this.location.isCurrentPathEqualTo('/login') || this.location.isCurrentPathEqualTo('')) {
      this.focusTab = 0;
      // this.needhide = 0;
    } else if (this.location.isCurrentPathEqualTo('/datasetssave')||this.location.isCurrentPathEqualTo('/overview')||this.location.isCurrentPathEqualTo('/runningtask')) {
      this.focusTab = 1;
      // this.needhide = 0;
    } else if (this.location.isCurrentPathEqualTo('/algchains') || this.location.path(false).indexOf('/algchainDetail/') != -1) {
      this.focusTab = 2;
      // this.needhide = 0;
    } else if (this.location.path(false).indexOf('/algchains/') != -1) {
      this.collapse = 1;
      let scene_id_str = this.location.path(false).split('/algchains/')[1];
      //console.log(scene_id_str);
      this.focusCollapse = scene_id_str;
      this.focusTab = 2;
      // this.needhide = 0;
    } else if (this.location.path().match('/jobcreation')||this.location.isCurrentPathEqualTo('/createjob') ||this.location.path().match('/createjob')|| this.location.path().match(/\/jobDetail/)|| this.location.path().match(/\/model/)) {
      this.focusTab = 5;
      // this.needhide = 0;
    } else if (this.location.isCurrentPathEqualTo('/datasets')||this.location.path().match('/enterdataset')||this.location.path().match('/mark')) {
      this.focusTab = 3;
      // this.needhide = 0;
    } else if (this.location.isCurrentPathEqualTo('/inferenceModel')||this.location.path().match(/\/inferenceModel/)) {
      this.focusTab = 4;
      // this.needhide = 0;
    } else if (this.location.isCurrentPathEqualTo('/algplugins') || this.location.path(false).indexOf('/algpluginDetail/') != -1) {
      this.focusTab = 6;
      // this.needhide = 0;
    }else if (this.location.isCurrentPathEqualTo('/userinfo')) {
      this.focusTab = 12;
      // this.needhide = 0;
    }else if (this.location.path().match(/\/usermanage/) || this.location.path().match(/\/createuser/)) {
      this.focusTab = 13;
      // this.needhide = 0;
    }else if (this.location.path().match(/\/authoritymanage/) || this.location.path().match(/\/createrole/)) {
      this.focusTab = 14;
      // this.needhide = 0;
    }
/*    else if (this.location.isCurrentPathEqualTo('/boostedtree')) {
      this.focusTab = 9;
    }*/
  }
  logout() {
    localStorage.removeItem("authenticationToken");
    localStorage.removeItem("username");
    localStorage.removeItem("allAuthority");
    sessionStorage.removeItem("userInfo");
    this.router.navigate(['/login'])
    // window.location.href = "/login";
  }
}
