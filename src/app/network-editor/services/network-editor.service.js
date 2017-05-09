"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const training_network_1 = require("../../../common/defs/training-network");
const LAYER_METADATA_LIST = [
    { id: 0, name: 'Input Layer', cssClassName: 'input', color: '#1186C1' },
    { id: 1, name: 'Output Layer', cssClassName: 'output', color: '#636363' },
    { id: 2, name: 'Hidden Layer', cssClassName: 'hidden', color: '#ff7f0e' },
];
let NetworkEditorService = class NetworkEditorService {
    constructor() {
        // The list of network layers created by the user.
        this.layerList = [];
        this.linkList = [];
    }
    // Operations related to layer type.
    getLayerTypeList() {
        return LAYER_METADATA_LIST;
    }
    ;
    // Operations related to layers.
    getLayerTypeById(id) {
        return this.getLayerTypeList().find(layerType => layerType.id === id);
    }
    createLayer(layer) {
        this.layerList.push(layer);
    }
    deleteLayer(layerId) {
        var i = this.layerList.findIndex(l => l.id === layerId);
        if (i >= 0) {
            this.layerList.splice(i, 1);
            while (1) {
                var i = this.linkList.findIndex(l => (l.srcLayerId === layerId || l.destLayerId === layerId));
                if (i < 0) {
                    break;
                }
                this.linkList.splice(i, 1);
            }
        }
    }
    getLayerById(id) {
        return this.getLayerList().find(layer => layer.id === id);
    }
    getLayerList() {
        return this.layerList;
    }
    updateLayer(layer) {
        var i = this.layerList.findIndex(l => l.id === layer.id);
        if (i >= 0) {
            this.layerList[i] = layer;
            this.updateLinkList();
        }
    }
    updateLayerPosition(layerId, x, y) {
        var i = this.layerList.findIndex(l => l.id === layerId);
        if (i >= 0) {
            this.layerList[i].x = x;
            this.layerList[i].y = y;
        }
        else {
            console.log('layer not found' + layerId);
        }
    }
    // Operations related to links.
    getLinkList() {
        return this.linkList;
    }
    updateLinkList() {
        for (var i = 0; i < this.linkList.length; i++) {
            var srcLayer = this.getLayerById(this.linkList[i].srcLayerId);
            var destLayer = this.getLayerById(this.linkList[i].destLayerId);
            if (srcLayer && destLayer) {
                this.linkList[i].srcx = srcLayer.x;
                this.linkList[i].srcy = srcLayer.y;
                this.linkList[i].destx = destLayer.x;
                this.linkList[i].desty = destLayer.y;
            }
        }
    }
    addLink(srcLayerId, destLayerId) {
        if (this.linkList.findIndex(l => (l.srcLayerId === srcLayerId
            && l.destLayerId === destLayerId)) >= 0) {
            return;
        }
        var srcLayer = this.getLayerById(srcLayerId);
        var destLayer = this.getLayerById(destLayerId);
        if (srcLayer && destLayer) {
            var link = new training_network_1.Link();
            link.srcLayerId = srcLayerId;
            link.destLayerId = destLayerId;
            this.linkList.push(link);
            this.updateLinkList();
        }
    }
};
NetworkEditorService = __decorate([
    core_1.Injectable()
], NetworkEditorService);
exports.NetworkEditorService = NetworkEditorService;
//# sourceMappingURL=network-editor.service.js.map