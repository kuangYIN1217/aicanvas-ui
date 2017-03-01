import { ParameterType, Parameter } from '../defs/parameter';

const PARAM_LIST: Parameter[] = [
    {
        name: 'loss',
        translation: '损失',
        description: 'result of loss from model calculation?',
        type: 'FLOAT',
        d_type: 'FLOAT',
        shape:[1],
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
        shape:[1],
        allowed_values: [],
        default_value: 'default_value',
        set_value: 'set_value',
    },
];

export class ParameterService {

    getParameterList(): Parameter[] {

        // Demo of how to convert between json and typescript object.
        var jsonstr = JSON.stringify(PARAM_LIST);
        console.log('jsonstr=' + jsonstr);

        // Parse json string back to js object.
        var jsObjs = JSON.parse(jsonstr);
        console.log('jsObjs:'+ jsObjs, jsObjs)

        // Converts js object to ts object.
        var tsObjects = new Array<Parameter>();
        for (let jsObj of jsObjs) {
            console.log('jsObj:::', jsObj);
            var tsObj = Object.assign(new Parameter(), jsObj);
            tsObjects.push(tsObj);
        }
        
        console.log('tsObjects:', tsObjects);
        return tsObjects;
    }
}

