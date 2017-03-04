import {Type} from 'class-transformer';
import {Parameter} from './parameter';

export class LayerType {
  id: number;
  name: string;
  cssClassName: string;
  color: string;

  @Type(()=>Parameter)
  layer_params: Parameter[];
  // Constraints ?
  // UI specs ?
}

export class Layer {
    // Id of the layer type.
    layerTypeId: number;
    // If of the layer.
    id: string;
    name: string;

    // x, y coordinates, and the color of the layer representation in the UI.
    x: number;
    y: number;
    color: string;
}

// Record the links betwen layers.
export class Link {
  // Id of the source layer.
  srcLayerId: string;
  // Id of the destination layer.
  destLayerId: string;

  // x, y coordinates of the start point of the link arrow.
  srcx: number;
  srcy: number;

  // x, y coordinates of the end point of the link arrow.
  destx: number;
  desty: number;
}

export class TrainingNetwork {
  // The layers of the network.
  // @Type is used for parsing json object to ts object.
  // More on https://github.com/pleerock/class-transformer
  @Type(()=>Layer)
  layers: Layer[];

  // The links between the layers.
  @Type(()=>Link)
  links: Link[];
}
