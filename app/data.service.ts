
import { Injectable } from '@angular/core';

import { LayerType, Layer } from './layer';

const LAYER_METADATA_LIST: LayerType[] = [
  { id: 0, name: 'Input Layer', cssClassName: 'input', color: '#1186C1' },
  { id: 1, name: 'Output Layer', cssClassName: 'output', color: '#636363'},
  { id: 2, name: 'Hidden Layer', cssClassName: 'hidden', color: '#ff7f0e'},
];

@Injectable()
export class DataService {

    // The list of network layers created by the user.
    layerList: Layer[] = [];

    getLayerTypeList(): LayerType[] {
        return LAYER_METADATA_LIST;
    };

    getLayerTypeById(id: number): LayerType {
        return this.getLayerTypeList().find(layerType => layerType.id === id);
    }

    createLayer(layer: Layer) :void {
        this.layerList.push(layer);
    }

    deleteLayer(layerId: string): void {
        var i = this.layerList.findIndex(l => l.id === layerId);
        if (i >= 0) {
            this.layerList.splice(i, 1);
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
        }
    }

    updateLayerPosition(layerId: string, x: number, y: number): void {
        var i = this.layerList.findIndex(l => l.id === layerId);
        if (i >= 0) {
            this.layerList[i].x = x;
            this.layerList[i].y = y;
        }
    }
}