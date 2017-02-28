"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require("@angular/core");
const layer_1 = require("./defs/layer");
const network_editor_service_1 = require("./services/network-editor.service");
const parameter_service_1 = require("../../common/services/parameter.service");
const d3 = require("d3");
let VisualizedNetworkComponent = class VisualizedNetworkComponent {
    constructor(networkEditorService, parameterService) {
        this.networkEditorService = networkEditorService;
        this.parameterService = parameterService;
        // The counter used to be part of the layer name.
        this.idCounter = 0;
        this.onLayerSelected = new core_1.EventEmitter();
        // Container to visualize all layers.
        this.container = null;
    }
    ;
    ngOnInit() {
        if (this.container == null) {
            this.container = d3.select('#map').append('g');
        }
    }
    layerIconDragStarted(c) {
        return function (d) {
            c.hideLinkIcons();
        };
    }
    layerIconDragged(c, redraw) {
        return function (d) {
            var draggedIcon = d3.select(this);
            draggedIcon
                .attr('x', d3.event.x)
                .attr('y', d3.event.y);
            c.networkEditorService.updateLayerPosition(draggedIcon.attr('id'), d3.event.x, d3.event.y);
            if (redraw) {
                c.networkEditorService.updateLinkList();
                c.redraw();
            }
        };
    }
    layerIconClicked(c) {
        return function (d) {
            var draggedIcon = d3.select(this);
            var layer = c.networkEditorService.getLayerById(draggedIcon.attr('id'));
            if (c.onLayerSelected && layer) {
                c.onLayerSelected.emit(layer);
            }
        };
    }
    updateLayerIcons() {
        var selection = this.container.selectAll('.layer-icon')
            .data(this.networkEditorService.getLayerList());
        // Update 
        selection
            .attr('x', function (layer) { return layer.x + 'px'; })
            .attr('y', function (layer) { return layer.y + 'px'; })
            .attr('id', function (layer) { return layer.id; });
        selection.select('text').text(function (layer) { return layer.name; });
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
            .attr('x', function (layer) { return layer.x + 'px'; })
            .attr('y', function (layer) { return layer.y + 'px'; })
            .attr('id', function (layer) { return layer.id; })
            .attr('class', 'layer-icon')
            .on('click', clickHandler)
            .call(drag);
        svg.append('circle')
            .attr('cx', 20)
            .attr('cy', 20)
            .attr('r', 15)
            .attr('fill', function (layer) { return layer.color; });
        svg.append('text')
            .attr('x', 20)
            .attr('y', 20)
            .attr('fill', '#000')
            .attr('cursor', 'pointer')
            .text(function (layer) { return layer.name; });
        // Delete.
        selection.exit().remove();
    }
    createLayer(layerType) {
        var layer = new layer_1.Layer();
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
    onSetLayerParamClick(layer) {
        // TODO Need to check and hint if there is a conflicting names.
        this.networkEditorService.updateLayer(layer);
        this.redraw();
    }
    onDeleteLayerClick(layer) {
        if (layer) {
            this.networkEditorService.deleteLayer(layer.id);
            this.onLayerSelected.emit(null);
            this.redraw();
        }
    }
    // Link related functionalities.
    updateLinkIcons() {
        var selection = this.container.selectAll('.link-icon')
            .data(this.networkEditorService.getLinkList());
        // Update.
        selection
            .attr('x1', function (link) { return link.srcx + 15; })
            .attr('y1', function (link) { return link.srcy + 15; })
            .attr('x2', function (link) { return link.destx + 15; })
            .attr('y2', function (link) { return link.desty + 15; });
        // Create.
        selection.enter().append('line')
            .attr('stroke', 'black')
            .attr('class', 'link-icon')
            .attr('x1', function (link) { return link.srcx + 15; })
            .attr('y1', function (link) { return link.srcy + 15; })
            .attr('x2', function (link) { return link.destx + 15; })
            .attr('y2', function (link) { return link.desty + 15; });
        // Delete.
        selection.exit().remove();
    }
    hideLinkIcons() {
        var selection = this.container.selectAll('.link-icon')
            .data([]);
        selection.exit().remove();
    }
    createLink(srcLayerId, destLayerId) {
        if (srcLayerId != destLayerId) {
            this.networkEditorService.addLink(srcLayerId, destLayerId);
            this.redraw();
        }
    }
    redraw() {
        this.updateLinkIcons();
        this.updateLayerIcons();
    }
};
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], VisualizedNetworkComponent.prototype, "onLayerSelected", void 0);
VisualizedNetworkComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'visualized-network',
        templateUrl: './templates/visualized-network.component.html',
        styleUrls: ['./css/visualized-network.component.css'],
        providers: [parameter_service_1.ParameterService]
    }),
    __metadata("design:paramtypes", [network_editor_service_1.NetworkEditorService,
        parameter_service_1.ParameterService])
], VisualizedNetworkComponent);
exports.VisualizedNetworkComponent = VisualizedNetworkComponent;
//# sourceMappingURL=visualized-network.component.js.map