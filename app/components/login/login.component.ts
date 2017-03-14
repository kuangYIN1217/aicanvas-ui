import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'login',
  styleUrls: ['./css/login.component.css'],
  templateUrl: './templates/login.html'
})
export class LoginComponent implements OnInit{
    ngOnInit(){
        $('#b03').unslider({
            dots: true,
        });
    }
}
