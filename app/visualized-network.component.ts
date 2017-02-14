import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Layer, LayerType } from './layer';
import { DataService } from './data.service';
import * as d3 from 'd3';

@Component({
    moduleId: module.id,
    selector: 'visualized-network',
    templateUrl: 'visualized-network.component.html',
    styleUrls: ['visualized-network.component.css'],
})
export class VisualizedNetworkComponent implements OnInit {

    // The counter used to be part of the layer name.
    idCounter: number = 0;
    
    @Output() onLayerSelected: EventEmitter<Layer> = new EventEmitter<Layer>();;


    // Container to visualize all layers.
    container = null;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        if (this.container == null) {
            this.container = d3.select('#map').append('g');
        }
    }

    dragstarted(d): void {
        //d3.select(this).raise().classed("active", true);
    }

    dragged(d): void {
        d3.select(this).attr('x', d3.event.x).attr("y", d3.event.y);
    }

    makeDragended(layerId): any {
        return (d) => {
            this.dataService.updateLayerPosition(layerId, d3.event.x, d3.event.y);
        }
    }

    // TODO: specify the exact return type.
    makeClickHandler(e: EventEmitter<Layer>, layer: Layer): any {
        return function () {
            if (e && layer) {
                e.emit(layer)
            }
        }
    }

    showLayerIcon(layer: Layer): void {
        var drag = d3.drag()
            .on('drag', this.dragged)
            .on('start', this.dragstarted)
            .on('end', this.makeDragended(layer.id));

        var svg = this.container.append('svg')
            .attr('x', layer.x)
            .attr('y', layer.y)
            .attr('id', layer.id)
            .on('click', this.makeClickHandler(this.onLayerSelected, layer))
            .call(drag);

        var circle = svg.append('circle')
            .attr('cx', 20)
            .attr('cy', 20)
            .attr('r', 15);

        var text = svg.append('text')
            .attr('x', 20)
            .attr('y', 20)
            .attr('fill', '#000')
            .attr('cursor', 'pointer')
            .text(layer.name);

        var layerType = this.dataService.getLayerTypeById(layer.layerTypeId);
        if (layerType) {
            circle.attr('fill', layerType.color);
        }
    };

    deleteLayerIcon(layer: Layer): void {
        if (layer) {
            this.container.select('#' + layer.id).remove();
        }
    };

    createLayer(layerType: LayerType): Layer {
        var layer = new Layer();
        layer.layerTypeId = layerType.id;
        layer.id = "id_" + this.idCounter++;
        layer.name = layerType.name + '_' + (layer.id);
        layer.x = 50 + this.idCounter;
        layer.y = 50 + this.idCounter;
        this.dataService.createLayer(layer);
        this.showLayerIcon(layer);
        return layer;
    }

    onSetLayerParamClick(layer: Layer): void {
        // TODO Need to check and hint if there is a conflicting names.
        this.dataService.updateLayer(layer);
        this.deleteLayerIcon(layer);
        this.showLayerIcon(layer);
    }

    onDeleteLayerClick(layer: Layer): void {
        if (layer) {
            this.dataService.deleteLayer(layer.id);
            this.deleteLayerIcon(layer);
            this.onLayerSelected.emit(null);
        }
    }

    // Link related functionalities.
    showLinkLine(origLayer: Layer, destLayer: Layer): void {
        this.container.append("line")          // attach a line
            .style("stroke", "black")
            .attr("x1", origLayer.x - 15)
            .attr("y1", origLayer.y - 15)
            .attr("x2", destLayer.x + 15)
            .attr("y2", destLayer.y + 15);
    }
    
    createLink(origLayer: Layer, destLayerId: string): void {
        var destLayer = this.dataService.getLayerById(destLayerId);
        if (origLayer && destLayer) {
            
          // TODO: record data. 

          this.showLinkLine(origLayer, destLayer);
        }
    }
}