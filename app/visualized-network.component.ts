import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Layer, LayerType } from './layer';
import { LayerService } from './layer.service';
import * as d3 from 'd3';

@Component({
    moduleId: module.id,
    selector: 'visualized-network',
    templateUrl: 'visualized-network.component.html',
    styleUrls: ['visualized-network.component.css'],
    providers: [LayerService]
})
export class VisualizedNetworkComponent implements OnInit {
    layerTypeList: LayerType[] = [];

    count: number = 0;
    layerList: Layer[] = [];

    @Output() onLayerSelected: EventEmitter<Layer> = new EventEmitter<Layer>();;


    // Container to visualize all layers.
    container = null;

    constructor(private layerService: LayerService) { }

    ngOnInit(): void {
        this.layerTypeList = this.layerService.getLayerTypeList();
    }

    dragstarted(d): void {
        //d3.select(this).raise().classed("active", true);
    }

    dragged(d): void {
        d3.select(this).attr('x', d3.event.x).attr("y", d3.event.y);
    }

    makeDragended(layerId): any {
        return (d) => {
            var i = this.layerList.findIndex(l => l.id === layerId);
            if (i >= 0) {
                this.layerList[i].x = d3.event.x;
                this.layerList[i].y = d3.event.y;
            }
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

    showALayerIcon(layer: Layer): void {
        if (this.container == null) {
            this.container = d3.select('#map').append('g');
        }
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

        var layerType = this.layerService.getLayerTypeById(layer.layerTypeId);
        if (layerType) {
            circle.attr('fill', layerType.color);
        }
    };

    deleteAlayerIcon(layer: Layer): void {
        if (layer) {
            this.container.select('#' + layer.id).remove();
        }
    };

    createLayer(layerType: LayerType): Layer {
        var layer = new Layer();
        layer.layerTypeId = layerType.id;
        layer.id = "id_" + this.count++;
        layer.name = layerType.name + '_' + (layer.id);
        layer.x = 50 + this.count;
        layer.y = 50 + this.count;
        this.layerList.push(layer);
        this.showALayerIcon(layer);
        return layer;
    }

    deleteLayer(layer: Layer): void {
        var i = this.layerList.findIndex(l => l.id === layer.id);
        if (i >= 0) {
            this.layerList.splice(i, 1);
        }
    }

    onLayerTypeSelected(layerType: LayerType): void {
        this.createLayer(layerType);
    }

    onSetLayerParamClick(layer: Layer): void {
        // TODO Need to check and hint if there is a conflicting names.
        var i = this.layerList.findIndex(l => l.id === layer.id);
        if (i >= 0) {
            this.layerList[i] = layer;
            this.deleteAlayerIcon(layer);
            this.showALayerIcon(layer);
        }
    }

    onDeleteLayerClick(layer: Layer): void {
        if (layer) {
            this.deleteAlayerIcon(layer);
            this.deleteLayer(layer);
            this.onLayerSelected.emit(null);
        }
    }
}