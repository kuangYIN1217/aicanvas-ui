import { Component, OnInit } from '@angular/core';
import {calc_height} from "../common/ts/calc_height";
import {SceneService} from "../common/services/scene.service";
import {SceneInfo} from "../common/defs/resources";

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css'],
  providers:[SceneService]
})
export class CreateJobComponent implements OnInit {
  jobName: string="";
  name_validation: boolean = false;
  plugin_validation: boolean = false;
  data_validation: boolean = false;
  s_error_show: boolean = false;
  s_error_message: string = '';
  s_error_level: string = 'error';
  scenes: SceneInfo[] = [];
  showScene:any[]=[];
  sceneIndex:number=0;
  constructor(private sceneService: SceneService) {
    this.sceneService.getAllScenes(-1)
      .subscribe(scenes => {
        this.scenes = scenes;
        let arr:any[]=[];
        for(let i=0;i<this.scenes.length;i++){
          if((i+1)%5==0){
            arr.push(this.scenes[i]);
            this.showScene.push(arr);
            arr=[];
          }else{
            arr.push(this.scenes[i]);
          }
        }
        let num = this.scenes.length%5;
        arr=[];
        for(let i=num;i>0;i--){
          arr.push(this.scenes[this.scenes.length-i]);
        }
        this.showScene.push(arr);
        console.log(this.showScene);
      })
  }
  preScene(){
    if(this.sceneIndex==0){
      return false
    }else{
      this.sceneIndex--;
    }
  }
  nextScene(){
    if(this.sceneIndex==this.showScene.length-1){
      return false
    }else{
      this.sceneIndex++;
    }
  }
  chooseScene(scene,index){

  }
  ngOnInit() {
    calc_height(document.getElementsByClassName('allContent')[0]);
  }
  nameChange() {
    if (this.jobName) {
      this.name_validation = true;
      this.s_error_show = false;
    } else {
      this.name_validation = false;
    }
    //this.judgeClick();
  }
}
