import {Component, EventEmitter, OnInit, Output} from '@angular/core';

import {Layer, LayerType} from '../common/defs/training-network';
import {NetworkEditorService} from './services/network-editor.service';
import {ParameterService} from '../common/services/parameter.service'
import {TrainingNetworkService} from '../common/services/training-network.service'
import * as d3 from 'd3';

@Component({
  moduleId: module.id,
  selector: 'visualized-network',
  templateUrl: './templates/visualized-network.component.html',
  styleUrls: ['./css/visualized-network.component.css'],
  providers: [ParameterService, TrainingNetworkService,NetworkEditorService]
})
export class VisualizedNetworkComponent implements OnInit {

  // The counter used to be part of the layer name.
  idCounter: number = 0;

  @Output() onLayerSelected: EventEmitter<Layer> = new EventEmitter<Layer>();


  // Container to visualize all layers.
  container = null;

  constructor(public networkEditorService: NetworkEditorService,
              private parameterService: ParameterService,
              private trainingNetworkService: TrainingNetworkService) {
  }

  ngOnInit(): void {
    if (this.container == null) {
      this.container = d3.select('#map').append('g');
    }
  }

  layerIconDragStarted(c: VisualizedNetworkComponent): any {
    return function (d): void {
      c.hideLinkIcons();
    }
  }

  layerIconDragged(c: VisualizedNetworkComponent, redraw: boolean): any {
    return function (d): void {
      var draggedIcon = d3.select(this);
      draggedIcon
        .attr('x', d3.event.x)
        .attr('y', d3.event.y);

      c.networkEditorService.updateLayerPosition(draggedIcon.attr('id'), d3.event.x, d3.event.y);
      if (redraw) {
        c.networkEditorService.updateLinkList();
        c.redraw();
      }
    }
  }

  layerIconClicked(c: VisualizedNetworkComponent): any {
    return function (d): void {
      var draggedIcon = d3.select(this);
      var layer = c.networkEditorService.getLayerById(draggedIcon.attr('id'));
      if (c.onLayerSelected && layer) {
        c.onLayerSelected.emit(layer);
      }
    }
  }

  updateLayerIcons(): void {
    var selection = this.container.selectAll('.layer-icon')
      .data(this.networkEditorService.getLayerList());

    // Update
    selection
      .attr('x', function (layer) {
        return layer.x + 'px';
      })
      .attr('y', function (layer) {
        return layer.y + 'px';
      })
      .attr('id', function (layer) {
        return layer.id;
      });
    selection.select('text').text(function (layer) {
      return layer.name;
    });

    // Create.
    var dragStartHandler = this.layerIconDragStarted(this);
    var dragHandler = this.layerIconDragged(this, false);
    var dragEndHandler = this.layerIconDragged(this, true);
    var drag = d3.drag()
      .on('start', dragStartHandler)
      .on('drag', dragHandler)
      .on('end', dragEndHandler);

    var clickHandler = this.layerIconClicked(this);

    var svg = selection.enter().append('svg')
      .attr('x', function (layer) {
        return layer.x + 'px';
      })
      .attr('y', function (layer) {
        return layer.y + 'px';
      })
      .attr('id', function (layer) {
        return layer.id;
      })
      .attr('class', 'layer-icon')
      .on('click', clickHandler)
      .call(drag);

    svg.append('circle')
      .attr('cx', 20)
      .attr('cy', 20)
      .attr('r', 15)
      .attr('fill', function (layer) {
        return layer.color;
      })

    svg.append('text')
      .attr('x', 20)
      .attr('y', 20)
      .attr('fill', '#000')
      .attr('cursor', 'pointer')
      .text(function (layer) {
        return layer.name;
      });

    // Delete.
    selection.exit().remove();
  }

  createLayer(layerType: LayerType): Layer {
    var layer = new Layer();
    layer.layerTypeId = layerType.id;
    layer.id = "id_" + this.idCounter++;
    layer.name = layerType.name + '_' + (layer.id);
    layer.x = 50 + this.idCounter * 10;
    layer.y = 50 + this.idCounter;
    layer.color = layerType.color;
    this.networkEditorService.createLayer(layer);
    this.redraw();
    return layer;
  }

  onSetLayerParamClick(layer: Layer): void {
    // TODO Need to check and hint if there is a conflicting names.
    this.networkEditorService.updateLayer(layer);
    this.redraw();
  }

  onDeleteLayerClick(layer: Layer): void {
    if (layer) {
      this.networkEditorService.deleteLayer(layer.id);
      this.onLayerSelected.emit(null);
      this.redraw()
    }
  }

  // Link related functionalities.
  updateLinkIcons(): void {
    var selection = this.container.selectAll('.link-icon')
      .data(this.networkEditorService.getLinkList());

    // Update.
    selection
      .attr('x1', function (link) {
        return link.srcx + 15;
      })
      .attr('y1', function (link) {
        return link.srcy + 15;
      })
      .attr('x2', function (link) {
        return link.destx + 15;
      })
      .attr('y2', function (link) {
        return link.desty + 15;
      });

    // Create.
    selection.enter().append('line')
      .attr('stroke', 'black')
      .attr('class', 'link-icon')
      .attr('x1', function (link) {
        return link.srcx + 15;
      })
      .attr('y1', function (link) {
        return link.srcy + 15;
      })
      .attr('x2', function (link) {
        return link.destx + 15;
      })
      .attr('y2', function (link) {
        return link.desty + 15;
      });

    // Delete.
    selection.exit().remove();
  }

  hideLinkIcons(): void {
    var selection = this.container.selectAll('.link-icon')
      .data([]);
    selection.exit().remove();
  }

  createLink(srcLayerId: string, destLayerId: string): void {
    if (srcLayerId != destLayerId) {
      this.networkEditorService.addLink(srcLayerId, destLayerId);
      this.redraw()
    }
  }

  redraw(): void {
    this.updateLinkIcons();
    this.updateLayerIcons();
  }
}
