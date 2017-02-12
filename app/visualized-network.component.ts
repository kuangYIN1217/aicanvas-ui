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

    dragended(d): void {
        //d3.select(this).classed("active", false);
    }

    // TODO: specify the exact return type.
    makeClickHandler(e: EventEmitter<Layer>, layer: Layer): any {
        return function () {
            if (e && layer) {
                e.emit(layer)
            }
        };
    }

    showALayerIcon(layer: Layer): void {
        if (this.container == null) {
            this.container = d3.select('#map').append('g');
        }
        var drag = d3.drag()
            .on('drag', this.dragged)
            .on('start', this.dragstarted)
            .on('end', this.dragended);

        var svg = this.container.append('svg')
            .attr('x', layer.x)
            .attr('y', layer.y)
            .on('click', this.makeClickHandler(this.onLayerSelected, layer))
            .call(drag);

        svg.id = "id_" + layer.id;

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
            this.container.select('#id_' + layer.id).remove();
        }
    };

    createNewLayer(layerType: LayerType): Layer {
        var layer = new Layer();
        layer.layerTypeId = layerType.id;
        layer.id = this.count++;
        layer.name = layerType.name + '_' + (layer.id);
        layer.x = 50 + this.count;
        layer.y = 50 + this.count;
        this.layerList.push(layer);
        this.showALayerIcon(layer);
        return layer;
    };

    selected(layerType: LayerType): void {
        this.createNewLayer(layerType);
    };

    onSetLayerParamClick(layer: Layer): void {
        for (var i = 0; i < this.layerList.length; i++) {
            if (this.layerList[i].id === layer.id) {
                this.layerList[i] = layer;
            }
        }
        this.deleteAlayerIcon(layer);
        this.showALayerIcon(layer);
    };
}