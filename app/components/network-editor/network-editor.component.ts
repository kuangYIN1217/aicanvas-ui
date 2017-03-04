import { Component } from '@angular/core';
import { Layer } from '../../common/defs/training-network';
import { NetworkEditorService } from './services/network-editor.service';

@Component({
  moduleId: module.id,
  selector: 'network-editor',
  styleUrls: ['./css/network-editor.component.css'],
  templateUrl: './templates/network-editor.component.html',
  providers: [NetworkEditorService]
})
export class NetworkEditorComponent {
  editingLayer: Layer = null;

  constructor(private networkEditorService: NetworkEditorService) { }

  onLayerSelected(layer: Layer) {
    if (layer) {
      this.editingLayer = layer;
    } else {
      this.editingLayer = null;
    }
  }

  onInputChange(newName: string): void {
    if (this.editingLayer) {
      this.editingLayer.name = newName;
    }
  }

  clear() {
    this.editingLayer = null;
  }
}