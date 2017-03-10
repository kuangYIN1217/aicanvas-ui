import { Component } from '@angular/core';
import { ResourcesService } from '../../common/services/resources.service'

import { CpuInfo } from "../../common/defs/resources";

@Component({
  moduleId: module.id,
  selector: 'overview',
  styleUrls: ['./css/overview.component.css'],
  templateUrl: './templates/overview.html',
  providers: [ResourcesService]
})
export class OverviewComponent {
    // infomation of cpu
    cpuInfoArray: CpuInfo[] = [];
    // show resource or task 0--resource, 1--task
    tabIndex: number = 0;

    constructor(private resourcesService: ResourcesService) {
        resourcesService.getCpuInfo()
            .subscribe(cpuInfoArray => this.cpuInfoArray = cpuInfoArray);
    }

    changeTab(tabIndex: number){
        this.tabIndex = tabIndex;
    }

}
