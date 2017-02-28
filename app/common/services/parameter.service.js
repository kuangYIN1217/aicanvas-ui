"use strict";
const parameter_1 = require("../defs/parameter");
const PARAM_LIST = [
    {
        name: 'loss',
        label: '损失',
        description: 'result of loss from model calculation?',
        type: parameter_1.ParameterType.FLOAT,
        d_type: parameter_1.ParameterType.FLOAT,
        options: [],
        default_value: 0.0,
        set_value: 0.4,
    },
    {
        name: 'params',
        label: 'label2',
        description: 'example label2',
        type: parameter_1.ParameterType.STRING,
        d_type: parameter_1.ParameterType.STRING,
        options: [],
        default_value: 'default_value',
        set_value: 'set_value',
    },
];
class ParameterService {
    getParameterList() {
        return PARAM_LIST;
    }
    ;
}
exports.ParameterService = ParameterService;
//# sourceMappingURL=parameter.service.js.map