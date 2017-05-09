
import { Injectable } from '@angular/core';

import { LayerType, Layer, Link } from '../../common/defs/training-network';

const LAYER_METADATA_LIST: LayerType[] = [
    { id: 0, name: 'Input Layer', cssClassName: 'input', color: '#1186C1',layer_params:null },
    { id: 1, name: 'Output Layer', cssClassName: 'output', color: '#636363',layer_params:null },
    { id: 2, name: 'Hidden Layer', cssClassName: 'hidden', color: '#ff7f0e',layer_params:null },
];

@Injectable()
export class NetworkEditorService {

    // The list of network layers created by the user.
    layerList: Layer[] = [];

    linkList: Link[] = [];

    // Operations related to layer type.
    getLayerTypeList(): LayerType[] {
        return LAYER_METADATA_LIST;
    };

    // Operations related to layers.
    getLayerTypeById(id: number): LayerType {
        return this.getLayerTypeList().find(layerType => layerType.id === id);
    }

    createLayer(layer: Layer): void {
        this.layerList.push(layer);
    }

    deleteLayer(layerId: string): void {
        var i = this.layerList.findIndex(l => l.id === layerId);
        if (i >= 0) {
            this.layerList.splice(i, 1);
            while (1) {
                var i = this.linkList.findIndex(
                    l => (l.srcLayerId === layerId || l.destLayerId === layerId));
                if (i < 0) { break; }
                this.linkList.splice(i, 1);
            }
        }
    }

    getLayerById(id: string): Layer {
        return this.getLayerList().find(layer => layer.id === id);
    }

    getLayerList(): Layer[] {
        return this.layerList;
    }

    updateLayer(layer: Layer): void {
        var i = this.layerList.findIndex(l => l.id === layer.id);
        if (i >= 0) {
            this.layerList[i] = layer;
            this.updateLinkList();
        }
    }

    updateLayerPosition(layerId: string, x: number, y: number): void {
        var i = this.layerList.findIndex(l => l.id === layerId);
        if (i >= 0) {
            this.layerList[i].x = x;
            this.layerList[i].y = y;
        } else {
            console.log('layer not found' + layerId);
        }
    }

    // Operations related to links.
    getLinkList(): Link[] {
        return this.linkList;
    }

    updateLinkList(): void {
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
        if (this.linkList.findIndex(
            l => (l.srcLayerId === srcLayerId
                  && l.destLayerId === destLayerId)) >= 0) {
            return;
        }

        var srcLayer = this.getLayerById(srcLayerId);
        var destLayer = this.getLayerById(destLayerId);
        if (srcLayer && destLayer) {
            var link = new Link();
            link.srcLayerId = srcLayerId;
            link.destLayerId = destLayerId;
            this.linkList.push(link)
            this.updateLinkList();
        }
    }
}
