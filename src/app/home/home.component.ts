import { Component, OnInit,Output,EventEmitter } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: []
})
export class HomeComponent{
  name:string;
  tel:number;
  sexValue:number;
  checkValue:any;
  interestValue:string;
  interests:any[]=[
    {'value':'reading', 'display':'阅读'},
    {'value':'traveling', 'display':'旅游'},
    {'value':'sport', 'display':'运动'}
    ]
  constructor(){
    console.log(this.interestValue);
  }
  changeClass(){
    let classes={
     /* red:true,
      font:true,
      title:false*/
    };
    return classes;
  }
}
