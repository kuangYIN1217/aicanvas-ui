
import { Injectable } from '@angular/core';

import { LayerType } from './layer';

const LAYER_METADATA_LIST: LayerType[] = [
  { id: 0, name: 'Input Layer', cssClassName: 'input', color: '#1186C1' },
  { id: 1, name: 'Output Layer', cssClassName: 'output', color: '#636363'},
  { id: 2, name: 'Hidden Layer', cssClassName: 'hidden', color: '#ff7f0e'},
];

@Injectable()
export class LayerService {
    getLayerTypeList(): LayerType[] {
        return LAYER_METADATA_LIST;
    };

    getLayerTypeById(id: number): LayerType {
        return this.getLayerTypeList().find(layerType => layerType.id === id);
    }
}