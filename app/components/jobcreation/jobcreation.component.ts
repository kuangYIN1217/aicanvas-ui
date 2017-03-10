import { Component } from '@angular/core';
@Component({
    moduleId: module.id,
    selector: 'jobcreation',
    styleUrls: ['./css/jobcreation.component.css'],
    templateUrl: './templates/jobcreation.html'
})
export class JobCreationComponent {
    // record the current step
    stepNumber: number = 1;

    toStep(dest:number){
        this.stepNumber = dest;
    }

    nextStep(){
        this.stepNumber = this.stepNumber + 1;
    }
}
