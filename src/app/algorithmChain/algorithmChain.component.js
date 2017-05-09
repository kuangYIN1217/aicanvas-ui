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
const model_service_1 = require("../../common/services/model.service");
const router_1 = require("@angular/router");
const plugin_service_1 = require("../../common/services/plugin.service");
const scene_service_1 = require("../../common/services/scene.service");
let AlgorithmChainComponent = class AlgorithmChainComponent {
    constructor(sceneService, pluginService, location, route, router) {
        this.sceneService = sceneService;
        this.pluginService = pluginService;
        this.location = location;
        this.route = route;
        this.router = router;
        this.showSystemPlugin = 1;
        this.modalTab = [];
        this.selfTab = [];
        this.PluginInfo = [];
        this.page = 1;
        this.pageMaxItem = 10;
        this.arr = [];
        this.arr2 = [];
        this.temporary = [];
        this.result = 1;
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.sceneId = params['sceneId'];
        });
        this.sceneService.getChainByScene(this.sceneId)
            .subscribe(plugin => {
            this.PluginInfo = plugin;
            for (let i = 0; i < this.PluginInfo.length; i++) {
                if (this.PluginInfo[i].creator == 'general') {
                    this.modalTab.push(this.PluginInfo[i]);
                }
                else {
                    this.selfTab.push(this.PluginInfo[i]);
                }
            }
            this.arr = this.modalTab.slice(0, 10);
            this.arr2 = this.selfTab.slice(0, 10);
            this.getInit();
        });
    }
    getInit() {
        if (this.result) {
            if (this.showSystemPlugin == 1) {
                if (this.modalTab.length % this.pageMaxItem == 0) {
                    this.result = this.modalTab.length / this.pageMaxItem;
                }
                else {
                    this.result = Math.floor(this.modalTab.length / this.pageMaxItem) + 1;
                }
            }
            else if (this.showSystemPlugin == 0) {
                if (this.selfTab.length % this.pageMaxItem == 0) {
                    this.result = this.selfTab.length / this.pageMaxItem;
                }
                else {
                    this.result = Math.floor(this.selfTab.length / this.pageMaxItem) + 1;
                }
            }
        }
    }
    output(statu) {
        if (statu == 1) {
            return "是";
        }
        else if (statu == 0) {
            return "否";
        }
    }
    clickChain(id, name) {
        this.item = id;
        this.creator = name;
        this.router.navigate(['../algchains'], { queryParams: { "chain_id": this.item, "scene_id": this.sceneId, "creator": this.creator } });
    }
    sysTemplateClick() {
        this.showSystemPlugin = 1;
        sessionStorage.showSystemPlugin = 1;
        this.pageMaxItem = 10;
        this.result = this.modalTab.length % this.pageMaxItem == 0 ? this.modalTab.length / this.pageMaxItem : Math.floor(this.modalTab.length / this.pageMaxItem) + 1;
        this.arr = this.modalTab.slice(0, 10);
    }
    selfTemplateClick() {
        this.showSystemPlugin = 0;
        sessionStorage.showSystemPlugin = 0;
        this.pageMaxItem = 10;
        this.result = this.selfTab.length % this.pageMaxItem == 0 ? this.selfTab.length / this.pageMaxItem : Math.floor(this.selfTab.length / this.pageMaxItem) + 1;
        this.arr2 = this.selfTab.slice(0, 10);
    }
    changeValue(num) {
        if (this.showSystemPlugin == 1) {
            this.arr = this.modalTab.slice(0, num);
            this.getTotals(num, this.modalTab);
        }
        else {
            this.arr2 = this.selfTab.slice(0, num);
            this.getTotals(num, this.selfTab);
        }
    }
    getTotals(num, obj) {
        if (obj.length % num == 0) {
            this.result = obj.length / num;
        }
        else {
            this.result = Math.floor(obj.length / num) + 1;
        }
    }
    maxItemChange(num) {
        this.page = 1;
        this.changeValue(num);
    }
    nextPage(num) {
        if (this.showSystemPlugin == 1) {
            this.next(num, this.modalTab);
        }
        else if (this.showSystemPlugin == 0) {
            this.next(num, this.selfTab);
        }
    }
    next(num, obj) {
        this.result = (obj.length % num == 0) ? (obj.length / num) : (Math.floor(obj.length / num) + 1);
        this.lastPage(num, this.result);
    }
    lastPage(num, result) {
        if (this.showSystemPlugin == 1) {
            if (this.page < result) {
                this.page++;
                this.arr = this.modalTab.slice(num * this.page - num, num * this.page);
            }
            else {
                alert('已经是最后一页');
            }
        }
        else if (this.showSystemPlugin == 0) {
            if (this.page < result) {
                this.page++;
                this.arr2 = this.selfTab.slice(num * this.page - num, num * this.page);
            }
            else {
                alert('已经是最后一页');
            }
        }
    }
    previousPage(num) {
        if (this.showSystemPlugin == 1) {
            if (this.page > 1) {
                this.page--;
                this.arr = this.modalTab.slice(num * this.page - num, num * this.page);
                console.log(this.arr);
            }
            else {
                alert('已经是首页');
            }
        }
        else if (this.showSystemPlugin == 0) {
            if (this.page > 1) {
                this.page--;
                this.arr2 = this.selfTab.slice(num * this.page - num, num * this.page);
                console.log(this.arr);
            }
            else {
                alert('已经是首页');
            }
        }
    }
};
AlgorithmChainComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'algorithmChain',
        styleUrls: ['./css/algorithmChain.component.css'],
        templateUrl: './templates/algorithmChain.html',
        providers: [resources_service_1.ResourcesService, model_service_1.modelService, plugin_service_1.PluginService, scene_service_1.SceneService]
    }),
    __metadata("design:paramtypes", [scene_service_1.SceneService, plugin_service_1.PluginService, common_1.Location, router_1.ActivatedRoute, router_1.Router])
], AlgorithmChainComponent);
exports.AlgorithmChainComponent = AlgorithmChainComponent;
//# sourceMappingURL=algorithmChain.component.js.map