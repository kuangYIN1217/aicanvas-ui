export enum ParameterType {
  STRING,
  BOOL,
  INT,
  FLOAT,
  ENUM,
  LIST,
  NETWORK
}

export class Parameter {
  name: string;
  // The translated label of the parameter.
  label: string;

  // Human readable description.
  description: string;

  // The type of the param.
  type: ParameterType;

  // The basic data type of the param if type = ENUM or LIST.
  // d_type should not be type ENUM/LIST/NETWORK.
  d_type: ParameterType;

  // Define the shape of data if type = LIST
  shape: number[];

  // If type == enums, the options specifies the available values to choose from.
  options: any[];

  default_value: any;
  set_value: any;

  // More on minVal/maxVal/history_values.
}
