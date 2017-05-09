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
const training_network_1 = require("./training-network");
const class_transformer_1 = require("class-transformer");
class Editable_param {
}
exports.Editable_param = Editable_param;
class Parameter {
}
exports.Parameter = Parameter;
class TrainingNetwork {
}
__decorate([
    class_transformer_1.Type(() => training_network_1.Layer),
    __metadata("design:type", Array)
], TrainingNetwork.prototype, "layers", void 0);
__decorate([
    class_transformer_1.Type(() => training_network_1.Link),
    __metadata("design:type", Array)
], TrainingNetwork.prototype, "links", void 0);
__decorate([
    class_transformer_1.Type(() => Parameter),
    __metadata("design:type", Array)
], TrainingNetwork.prototype, "layer_params", void 0);
exports.TrainingNetwork = TrainingNetwork;
//# sourceMappingURL=parameter.js.map