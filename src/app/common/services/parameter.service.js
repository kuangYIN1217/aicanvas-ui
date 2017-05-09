"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parameter_1 = require("../defs/parameter");
const class_transformer_1 = require("class-transformer");
const PARAM_LIST = [
    {
        name: 'loss',
        translation: '损失',
        description: 'result of loss from model calculation?',
        type: 'FLOAT',
        d_type: 'FLOAT',
        shape: [1],
        allowed_values: [],
        default_value: 0.0,
        set_value: 0.4,
    },
    {
        name: 'params',
        translation: 'translation',
        description: 'example label2',
        type: 'STRING',
        d_type: 'STRING',
        shape: [1],
        allowed_values: [],
        default_value: 'default_value',
        set_value: 'set_value',
    },
];
class ParameterService {
    getParameterList() {
        // Demo of how to convert between json and typescript object.
        var jsonstr = JSON.stringify(PARAM_LIST);
        console.log('jsonstr=' + jsonstr);
        // Parse json string back to js object.
        var jsObjs = JSON.parse(jsonstr);
        console.log('jsObjs:' + jsObjs, jsObjs);
        return class_transformer_1.plainToClass(parameter_1.Parameter, jsObjs);
    }
}
exports.ParameterService = ParameterService;
//# sourceMappingURL=parameter.service.js.map