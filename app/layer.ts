export class LayerType {
  id: number;
  name: string;
  cssClassName: string;
  color: string;
  // Constraints ?
  // UI specs ?
}

export class Layer {
    layerTypeId: number;
    id: string;
    name: string;
    x: number;
    y: number;
    color: string;
}