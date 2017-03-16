import { Component } from '@angular/core';
import { ResourcesService } from '../../common/services/resources.service'

import { CpuInfo } from "../../common/defs/resources";
import { JobInfo } from "../../common/defs/resources";
declare var $:any;
declare var d3:any;
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
    jobArray: JobInfo[] = [];
    // show resource or task 0--resource, 1--task
    tabIndex: number = 0;

    constructor(private resourcesService: ResourcesService) {
        resourcesService.getCpuInfo()
            .subscribe(cpuInfoArray => this.cpuInfoArray = cpuInfoArray);
        resourcesService.getJobs()
            .subscribe(jobArray => this.jobArray = jobArray);

        this.originPics();
    }

    changeTab(tabIndex: number){
        this.tabIndex = tabIndex;
    }

    originPics(){

    }

}
