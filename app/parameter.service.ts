import { ParameterType, Parameter } from './parameter';

const PARAM_LIST: Parameter[] = [
    {
        name: 'loss',
        label: '损失',
        description: 'result of loss from model calculation?',
        type: ParameterType.FLOAT,
        d_type: ParameterType.FLOAT,
        options: [],
        default_value: 0.0,
        set_value: 0.4,
    },
    {
        name: 'params',
        label: 'label2',
        description: 'example label2',
        type: ParameterType.STRING,
        d_type: ParameterType.STRING,
        options: [],
        default_value: 'default_value',
        set_value: 'set_value',
    },
];

export class ParameterService {

    getParameterList(): Parameter[] {
        return PARAM_LIST;
    };

    //saveParameters(): void {
    //
    // }
}

