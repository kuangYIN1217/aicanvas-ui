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
const common_1 = require("@angular/common");
const resources_service_1 = require("../../common/services/resources.service");
const scene_service_1 = require("../../common/services/scene.service");
let NavigationComponent = class NavigationComponent {
    constructor(location, resourcesService, sceneService) {
        this.location = location;
        this.resourcesService = resourcesService;
        this.sceneService = sceneService;
        this.collapse = 0;
        this.sceneArray = [];
        this.focusCollapse = "0";
        this.username = "";
        // console.log("navigation initial");
        if (!this.location.isCurrentPathEqualTo('/login')) {
            // sceneService.getAllScenes()
            //     .subscribe(sceneArray => this.sceneArray = sceneArray);
        }
        if (sessionStorage.username) {
            this.username = sessionStorage.username;
        }
        else {
            this.username = "Loading";
        }
        if (this.location.isCurrentPathEqualTo('/login') || this.location.isCurrentPathEqualTo('')) {
            this.focusTab = 0;
            // this.needhide = 0;
        }
        else if (this.location.isCurrentPathEqualTo('/overview')) {
            this.focusTab = 1;
            // this.needhide = 0;
        }
        else if (this.location.isCurrentPathEqualTo('/algchains') || this.location.path(false).indexOf('/algchainDetail/') != -1) {
            this.focusTab = 2;
            // this.needhide = 0;
        }
        else if (this.location.path(false).indexOf('/algchains/') != -1) {
            this.collapse = 1;
            let scene_id_str = this.location.path(false).split('/algchains/')[1];
            //console.log(scene_id_str);
            this.focusCollapse = scene_id_str;
            this.focusTab = 2;
            // this.needhide = 0;
        }
        else if (this.location.isCurrentPathEqualTo('/jobcreation') || this.location.path(false).indexOf('/jobDetail/') != -1) {
            this.focusTab = 3;
            // this.needhide = 0;
        }
        else if (this.location.isCurrentPathEqualTo('/datasets')) {
            this.focusTab = 4;
            // this.needhide = 0;
        }
        else if (this.location.isCurrentPathEqualTo('/model')) {
            this.focusTab = 5;
            // this.needhide = 0;
        }
        else if (this.location.isCurrentPathEqualTo('/algplugins') || this.location.path(false).indexOf('/algpluginDetail/') != -1) {
            this.focusTab = 6;
            // this.needhide = 0;
        }
    }
    changeCollapse() {
        this.collapse = 1 - this.collapse;
    }
    changeTab(nextFocus) {
        this.focusTab = nextFocus;
    }
    logout() {
        sessionStorage.removeItem("authenticationToken");
        sessionStorage.removeItem("username");
        window.location.href = "/login";
    }
};
NavigationComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'navigation',
        styleUrls: ['./css/navigation.component.css'],
        templateUrl: './templates/navigation.html',
        providers: [resources_service_1.ResourcesService, scene_service_1.SceneService]
    }),
    __metadata("design:paramtypes", [common_1.Location, resources_service_1.ResourcesService, scene_service_1.SceneService])
], NavigationComponent);
exports.NavigationComponent = NavigationComponent;
//# sourceMappingURL=navigation.component.js.map