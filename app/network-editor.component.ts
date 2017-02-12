import { Component } from '@angular/core';
import { Layer } from './layer';

@Component({
  moduleId: module.id,
  selector: 'network-editor',
  styleUrls: ['network-editor.component.css'],
  templateUrl: 'network-editor.component.html',
})
export class NetworkEditorComponent {
      selectedLayer: Layer = null;
      selectedName: string = '';

      onLayerSelected(layer: Layer) {
        if (layer) {
          this.selectedLayer = layer;
          this.selectedName = layer.name;
        } else {
          this.selectedLayer = null;
          this.selectedName = '';
        }
      }

      onInputChange(newName: string): void {
        if(this.selectedLayer) {
          this.selectedLayer.name = newName;
          this.selectedName = newName;
        }
      }
      clear() {
        this.selectedName = '';
        this.selectedLayer = null;
      }
}