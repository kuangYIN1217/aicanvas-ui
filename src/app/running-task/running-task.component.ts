import { Component, OnInit,Input } from '@angular/core';
import {SceneInfo} from "../common/defs/resources";
import {SceneService} from "../common/services/scene.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-running-task',
  templateUrl: './running-task.component.html',
  styleUrls: ['./running-task.component.css'],
  providers: [SceneService]
})
export class RunningTaskComponent{
  SceneInfo: SceneInfo[] = [];
  student: number = 0;
  id: number;
  statuss: string = '运行';
  constructor(private sceneService: SceneService,private route: ActivatedRoute, private router: Router) {
    this.sceneService.getAllScenes(2)
      .subscribe(
        (scenes) => {
          this.SceneInfo = scenes
        },
        (error)=>{
          if(error.status==401){
            this.router.navigate(['/login']);
          }
        });
  }

  ngOnInit() {
  }
  selectChange() {
    this.id = this.student;
  }
}
