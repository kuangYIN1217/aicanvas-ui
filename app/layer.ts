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
    id: number;
    name: string;
    x: number;
    y: number;
}