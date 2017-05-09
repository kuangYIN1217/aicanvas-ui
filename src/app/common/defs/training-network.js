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
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const parameter_1 = require("./parameter");
class LayerType {
}
__decorate([
    class_transformer_1.Type(() => parameter_1.Parameter),
    __metadata("design:type", Array)
], LayerType.prototype, "layer_params", void 0);
exports.LayerType = LayerType;
class Layer {
}
exports.Layer = Layer;
// Record the links betwen layers.
class Link {
}
exports.Link = Link;
class TrainingNetwork {
}
__decorate([
    class_transformer_1.Type(() => Layer),
    __metadata("design:type", Array)
], TrainingNetwork.prototype, "layers", void 0);
__decorate([
    class_transformer_1.Type(() => Link),
    __metadata("design:type", Array)
], TrainingNetwork.prototype, "links", void 0);
exports.TrainingNetwork = TrainingNetwork;
//# sourceMappingURL=training-network.js.map