"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
// import { Layer } from '../../common/defs/training-network';
const network_editor_service_1 = require("./services/network-editor.service");
let NetworkEditorComponent = class NetworkEditorComponent {
};
NetworkEditorComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'network-editor',
        styleUrls: ['./css/network-editor.component.css'],
        templateUrl: './templates/network-editor.component.html',
        providers: [network_editor_service_1.NetworkEditorService]
    })
], NetworkEditorComponent);
exports.NetworkEditorComponent = NetworkEditorComponent;
//# sourceMappingURL=network-editor.component.js.map