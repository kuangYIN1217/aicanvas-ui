import {Component} from "@angular/core";
import {Location, LocationStrategy, PathLocationStrategy} from "@angular/common";
import {ResourcesService} from "../common/services/resources.service";
import {SceneService} from "../common/services/scene.service";
import {SceneInfo} from "../common/defs/resources";
import {Router} from "@angular/router";

declare var $:any;
@Component({
  selector: 'navigation',
  styleUrls: ['./css/navigation.component.css'],
  templateUrl: './templates/navigation.html',
  providers: [ResourcesService, SceneService],

})
export class NavigationComponent {
  // needhide = 0;
  focusTab: number;
  collapse: number = 0;
  sceneArray: SceneInfo[] = [];
  focusCollapse: string = "0";
  username: string = "";
  // location: Location;
  show_menu:boolean=false;
  changeCollapse() {
    this.collapse = 1 - this.collapse;
  }

  changeTab(nextFocus: number , url?) {
    this.focusTab = nextFocus;
    if(url){
      this.router.navigate(['/'], {skipLocationChange: true})
        .then(() => {
          this.router.navigate([url]);
        });
      if(this.focusTab==2||this.focusTab==4||this.focusTab==5||this.focusTab==7){
        $("#nav8").find('.selectDown').attr("src","assets/navigation/shang_bai.png");
        this.getArrow();
      }else{
        $("#nav8").find('.selectDown').attr("src","assets/navigation/kong_hui.png");
      }
    }else{
      this.focusTab = nextFocus;
      this.show_menu = !this.show_menu;
      this.router.navigate(['/'], {skipLocationChange: true})
        .then(() => {
          this.router.navigate(['/datasetssave']);
        });
      if(this.show_menu){
        $("#nav8").find('.selectDown').attr("src","assets/navigation/shang_bai.png");
      }else{
        $("#nav8").find('.selectDown').attr("src","assets/navigation/kong_bai.png");
      }
    }

  }

/*  changNav(index){
    if(index==1){
      $("#nav"+index).find("img").eq(0).attr("src","assets/navigation/icon_xxzl_01_h.png");
    }else if(index==3){
      $("#nav"+index).find("img").eq(0).attr("src","assets/navigation/icon_xlrw_03_h.png");
    }else if(index==6){
      $("#nav"+index).find("img").eq(0).attr("src","assets/navigation/icon_zj_06_h.png");
    }
  }
  removeNav(index){
    if(index==1) {
      $("#nav" + index).find("img").eq(0).attr("src", "assets/navigation/icon_xxzl_01_n.png");
    }else if(index==3){
      $("#nav" + index).find("img").eq(0).attr("src", "assets/navigation/icon_xlrw_03_n.png");
    }else if(index==6){
      $("#nav" + index).find("img").eq(0).attr("src", "assets/navigation/icon_zj_06_n.png");
    }
  }*/
  change_menu(index){
    this.focusTab = index;
    this.show_menu = !this.show_menu;
  }
  loadArrow(){
    let displayStyle = document.getElementById('dataStorage').getAttribute('style');
    if(displayStyle!=null&&displayStyle.toString()=='display: inline;'){
      this.show_menu = true;
    }
    if(this.focusTab==2||this.focusTab==4||this.focusTab==5||this.focusTab==7){
      if(this.show_menu){
        return "assets/navigation/shang_bai.png"
      }else{
        return "assets/navigation/kong_bai.png"
      }
    }else{
      return "assets/navigation/kong_hui.png"
    }
  }
  getArrow(){
    if($("#nav8").find('.selectDown').attr("src")=="assets/navigation/shang_bai.png"){
      return{
        "width":"11px",
        "height":"6px"
      }
    }else{
      return{
        "width":"6px",
        "height":"11px"
      }
    }
  }
  constructor(private location: Location,private router:Router) {
    if (!localStorage['username']) {
      this.focusTab = 0;
      this.router.navigate(['/login'])
    }
  }
  //response
  response(data){
    console.log(data)
  }

  ngAfterContentChecked(){
    // this.location = location;
    // console.log("navigation initial");
    if (!this.location.isCurrentPathEqualTo('/login')) {
      // sceneService.getAllScenes()
      //     .subscribe(sceneArray => this.sceneArray = sceneArray);
    }
    if (localStorage['username']) {
      this.username = localStorage['username'];
    } else {
      this.username = "Loading";
    }

    if (this.location.isCurrentPathEqualTo('/login') || this.location.isCurrentPathEqualTo('')) {
      this.focusTab = 0;
      // this.needhide = 0;
    } else if (this.location.isCurrentPathEqualTo('/overview')) {
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
    } else if (this.location.isCurrentPathEqualTo('/jobcreation') || this.location.path(false).indexOf('/jobDetail/') != -1) {
      this.focusTab = 3;
      // this.needhide = 0;
    } else if (this.location.isCurrentPathEqualTo('/datasets')||this.location.isCurrentPathEqualTo('/enterdataset')) {
      this.focusTab = 4;
      // this.needhide = 0;
    } else if (this.location.isCurrentPathEqualTo('/inferenceModel')) {
      this.focusTab = 5;
      // this.needhide = 0;
    } else if (this.location.isCurrentPathEqualTo('/algplugins') || this.location.path(false).indexOf('/algpluginDetail/') != -1) {
      this.focusTab = 6;
      // this.needhide = 0;
    }
    else if (this.location.isCurrentPathEqualTo('/datasetssave')) {
      this.focusTab = 7;
      // this.needhide = 0;
    }
    else if (this.location.isCurrentPathEqualTo('/datasetssave')) {
      this.focusTab = 8;
      // this.needhide = 0;
    }
/*    else if (this.location.isCurrentPathEqualTo('/boostedtree')) {
      this.focusTab = 9;
    }*/
  }

  logout() {
    localStorage.removeItem("authenticationToken");
    localStorage.removeItem("username");
    this.router.navigate(['/login'])

    // window.location.href = "/login";
  }
}
