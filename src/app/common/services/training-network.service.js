"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const training_network_1 = require("../defs/training-network");
const class_transformer_1 = require("class-transformer");
const TRAINIG_NETWORK_JSON = ` {
  "layers": [
      {
          "layerTypeId": 0,
          "id": "layer1",
          "name": "Input_1",
          "x": 10,
          "y": 10,
          "color": "#369",
          "layer_params":[
              {
                    "name": "loss",
                    "translation": "损失",
                    "description": "result of loss from model calculation?",
                    "type": "FLOAT",
                    "d_type": "FLOAT",
                    "shape":[1],
                    "allowed_values": [],
                    "default_value": 0.0,
                    "set_value": 0.4
              }
          ]
      },
      {
          "layerTypeId": 0,
          "id": "layer2",
          "name": "Output2",
          "x": 10,
          "y": 10,
          "color": "#888",
          "layer_params":[ 
              {
                    "name": "accuracy",
                    "translation": "精度",
                    "description": "result accuracy",
                    "type": "FLOAT",
                    "d_type": "FLOAT",
                    "shape":[1],
                    "allowed_values": [],
                    "default_value": 0.0,
                    "set_value": 0.9
              }
          ]
      }
  ],

  "links": [
      {"srcLayerId": "layer1", "destLayerId": "layer2", "srcx": 10, "srcy": 10, "destx": 30, "desty": 30}
  ]
}`;
class TrainingNetworkService {
    getTrainingNetwork() {
        var jsObjs = JSON.parse(TRAINIG_NETWORK_JSON);
        console.log('jsObjs:' + jsObjs, jsObjs);
        var twdata = class_transformer_1.plainToClass(training_network_1.TrainingNetwork, jsObjs);
        console.log(twdata);
        return twdata;
    }
}
exports.TrainingNetworkService = TrainingNetworkService;
//# sourceMappingURL=training-network.service.js.map