import { Layer, Link } from './training-network';
import {Type, plainToClass} from "class-transformer";

export type ParameterType = 'STRING'|'BOOL'|'INT'|'FLOAT'|'ENUM'|'LIST';

export class Parameter {
  name: string;
  // The translated name of the parameter.
  translation: string;

  // Human readable description.
  description: string;

  // The type of the param.
  type: ParameterType;

  // The basic data type of the param if type = ENUM or LIST.
  // d_type should not be type ENUM/LIST.
  d_type: ParameterType;

  // Define the shape of data if type = LIST.
  shape: number[];// 长度=纬度，13，14，15 = 13*14*15；

  // If type == enums, the options specifies the available values to choose from.
  allowed_values: any[];

  default_value: any;
  set_value: any;

  // When ParamType is INT or FLOAT, allow the following attribute to specify the range of the input data.
  has_min: boolean;
  min_value: number;
  has_max: boolean;
  max_value: number;

  // More on lvl/history_values.
}

export class TrainingNetwork {

  // Refer to https://github.com/pleerock/class-transformer to type annotation.
  @Type(()=>Layer)
  layers: Layer[];

  @Type(()=>Link)
  links: Link[];

  @Type(()=>Parameter)
  layer_params: Parameter[];
}
