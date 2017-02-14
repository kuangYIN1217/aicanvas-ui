import { Component } from '@angular/core';
import { Layer } from './layer';
import { DataService } from './data.service';

@Component({
  moduleId: module.id,
  selector: 'network-editor',
  styleUrls: ['network-editor.component.css'],
  templateUrl: 'network-editor.component.html',
  providers: [DataService]
})
export class NetworkEditorComponent {
      editingLayer: Layer = null;
      
      constructor(private dataService: DataService) { }

      onLayerSelected(layer: Layer) {
        if (layer) {
          this.editingLayer = layer;
        } else {
          this.editingLayer = null;
        }
      }

      onInputChange(newName: string): void {
        if(this.editingLayer) {
          this.editingLayer.name = newName;
        }
      }

      clear() {
        this.editingLayer = null;
      }
}