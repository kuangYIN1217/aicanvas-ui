import { Component } from '@angular/core';
import { ResourcesService } from '../../common/services/resources.service'

import { CpuInfo } from "../../common/defs/resources";

@Component({
  moduleId: module.id,
  selector: 'overview',
  templateUrl: './templates/overview.html',
  providers: [ResourcesService]
})
export class OverviewComponent {
  cpuInfo: CpuInfo = new CpuInfo();

  constructor(private resourcesService: ResourcesService) {
    resourcesService.getCpuInfo()
          .subscribe(cpuInfo => this.cpuInfo = cpuInfo);
  }
}