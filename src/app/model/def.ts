import {JobInfo, UserInfo} from "../common/defs/resources";
export class model_prediction{
  id:number;
  predictionName:string;
  job:JobInfo;
  user:UserInfo;
  inputPath:string;
  outputPath:string;
  percent:string;
}
