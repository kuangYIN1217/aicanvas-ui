import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ResourcesService } from '../../common/services/resources.service'
import { modelService} from "../../common/services/model.service";
import {inferenceResult, ModelInfo, PageInfo, PercentInfo} from "../../common/defs/resources";
import {ActivatedRoute} from "@angular/router";
import {FileUploader, FileUploaderOptions} from "ng2-file-upload";
import {SERVER_URL} from "../../app.constants";

@Component({
    moduleId: module.id,
    selector: 'historyDetail',
    styleUrls: ['./css/historyDetail.component.css'],
    templateUrl: './templates/historyDetail.html',
    providers: [ResourcesService,modelService]
})
export class ModelDetailComponent {
    constructor(private modelService: modelService, private location: Location, private route: ActivatedRoute) {

    }

}
