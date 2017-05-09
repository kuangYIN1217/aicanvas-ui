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
// import { ActivatedRoute,Params} from '@angular/router';
const scene_service_1 = require("../../common/services/scene.service");
const resources_1 = require("../../common/defs/resources");
let AlgchainDetailComponent = class AlgchainDetailComponent {
    constructor(sceneService, location) {
        this.sceneService = sceneService;
        this.location = location;
        this.scene = new resources_1.SceneInfo();
    }
    ngOnInit() {
        // let test=this.route.params
        // .switchMap((params: Params) => params['scene_id']);
        // console.log(test);
        if (this.location.path(false).indexOf('/algchainDetail/') != -1) {
            let id = this.location.path(false).split('/algchainDetail/')[1];
            if (id) {
                //console.log(id);
                this.sceneService.getSceneById(id)
                    .subscribe(scene => this.scene = scene);
            }
        }
    }
};
AlgchainDetailComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'algchainDetail',
        styleUrls: ['./css/algchainDetail.component.css'],
        templateUrl: './templates/algchainDetail.html',
        providers: [scene_service_1.SceneService]
    }),
    __metadata("design:paramtypes", [scene_service_1.SceneService, common_1.Location])
], AlgchainDetailComponent);
exports.AlgchainDetailComponent = AlgchainDetailComponent;
//# sourceMappingURL=algchainDetail.component.js.map