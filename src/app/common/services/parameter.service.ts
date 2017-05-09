import {ParameterType, Parameter} from '../defs/parameter';
import {plainToClass} from "class-transformer";

const PARAM_LIST: Parameter[] = [
  {
    name: 'loss',
    translation: '损失',
    description: 'result of loss from model calculation?',
    type: 'float',
    d_type: 'float',
    shape: [1],
    allowed_values: [],
    default_value: 0.0,
    set_value: 0.4,
    has_min: null,
    min_value: null,
    has_max: null,
    max_value: null,

// More on lvl/history_values.
    history_values: null,
  },
  {
    name: 'params',
    translation: 'translation',
    description: 'example label2',
    type: 'string',
    d_type: 'string',
    shape: [1],
    allowed_values: [],
    default_value: 'default_value',
    set_value: 'set_value',
    has_min: null,
    min_value: null,
    has_max: null,
    max_value: null,

// More on lvl/history_values.
    history_values: null,
  },
];

export class ParameterService {

  getParameterList(): Parameter[] {

    // Demo of how to convert between json and typescript object.
    var jsonstr = JSON.stringify(PARAM_LIST);
    console.log('jsonstr=' + jsonstr);

    // Parse json string back to js object.
    var jsObjs = JSON.parse(jsonstr);
    console.log('jsObjs:' + jsObjs, jsObjs)

    return plainToClass(Parameter, jsObjs);
  }
}
