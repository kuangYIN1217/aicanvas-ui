import { Component} from '@angular/core';
import{ FormControl,FormGroup }from '@angular/forms';
import{BeautifulBackgroundDirective} from '../home/beautifulBackground.directive';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: []
})
export class HomeComponent{
  name:string;
  dateObj= new Date('2016-06-08 20:05:08');
  dateStr= '2016-06-08 20:05:08';
  loginControl:FormControl = new FormControl('');
  loginForm:FormGroup;
constructor(){

}
btn(){

}
  ngOnInit(){
 this.loginForm=new FormGroup({
 name:new FormControl(''),
 pass:new FormControl('')
 });
  }

}
