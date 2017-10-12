import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {calc_height} from "app/common/ts/calc_height";
@Component({
  moduleId: module.id,
  selector: 'app-api',
  styleUrls: ['./css/api.component.css'],
  templateUrl: './templates/api.html',
  providers: [],
})
export class ApiComponent{

  constructor(private route: ActivatedRoute, private router: Router) {

  }
  ngOnInit() {
    calc_height(document.getElementById('api-field'));
  }
}
