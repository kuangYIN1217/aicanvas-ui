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
const plugin_service_1 = require("../../common/services/plugin.service");
let AlgPluginsComponent = class AlgPluginsComponent {
    constructor(pluginService) {
        this.pluginService = pluginService;
        // store data of Plugins
        this.plugins = [];
        // show one of two different table
        this.showSystemPlugin = 1;
        this.page = 1;
        this.pageMaxItem = 10;
        this.arr = [];
        this.arr2 = [];
        this.modalTab = [];
        this.selfTab = [];
        this.result = 1;
        if (sessionStorage.showSystemPlugin) {
            this.showSystemPlugin = sessionStorage.showSystemPlugin;
        }
        else {
            sessionStorage.showSystemPlugin = 1;
        }
        pluginService.getAllPlugins()
            .subscribe(plugins => {
            this.plugins = plugins;
            for (let i = 0; i < this.plugins.length; i++) {
                if (this.plugins[i].creator == 'general') {
                    this.modalTab.push(this.plugins[i]);
                }
                else {
                    this.selfTab.push(this.plugins[i]);
                }
            }
            this.arr = this.modalTab.slice(0, 10);
            this.arr2 = this.selfTab.slice(0, 10);
            this.getInit();
        });
        // console.log(this.showSystemPlugin);
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
    sysTemplateClick() {
        // console.log("to Sys");
        this.showSystemPlugin = 1;
        sessionStorage.showSystemPlugin = 1;
        this.pageMaxItem = 10;
        this.result = this.modalTab.length % this.pageMaxItem == 0 ? this.modalTab.length / this.pageMaxItem : Math.floor(this.modalTab.length / this.pageMaxItem) + 1;
        this.arr = this.modalTab.slice(0, 10);
        // console.log(this.showSystemPlugin);
        // console.log(this.plugins);
    }
    selfTemplateClick() {
        // console.log("to Self");
        this.showSystemPlugin = 0;
        sessionStorage.showSystemPlugin = 0;
        this.pageMaxItem = 10;
        this.result = this.selfTab.length % this.pageMaxItem == 0 ? this.selfTab.length / this.pageMaxItem : Math.floor(this.selfTab.length / this.pageMaxItem) + 1;
        this.arr2 = this.selfTab.slice(0, 10);
        // console.log(this.showSystemPlugin);
    }
    maxItemChange(num) {
        this.page = 1;
        this.changeValue(num);
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
                // console.log(this.arr);
            }
            else {
                alert('已经是首页');
            }
        }
        else if (this.showSystemPlugin == 0) {
            if (this.page > 1) {
                this.page--;
                this.arr2 = this.selfTab.slice(num * this.page - num, num * this.page);
                //console.log(this.arr2);
            }
            else {
                alert('已经是首页');
            }
        }
    }
};
AlgPluginsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'algplugins',
        styleUrls: ['./css/algplugins.component.css'],
        templateUrl: './templates/algplugins.html',
        providers: [plugin_service_1.PluginService],
    }),
    __metadata("design:paramtypes", [plugin_service_1.PluginService])
], AlgPluginsComponent);
exports.AlgPluginsComponent = AlgPluginsComponent;
//# sourceMappingURL=algplugins.component.js.map