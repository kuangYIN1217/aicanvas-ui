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
        this.selectedLayer = layer;
        this.selectedName = layer.name;
      }
}