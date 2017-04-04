import { Component } from '@angular/core';
import { Location } from '@angular/common'
// import { ActivatedRoute,Params} from '@angular/router';
import { JobService } from '../../common/services/job.service'

import { JobInfo,UserInfo } from "../../common/defs/resources";
import { JobParameter } from "../../common/defs/resources";
import * as d3 from 'd3';
declare var $:any;
@Component({
    moduleId: module.id,
    selector: 'jobDetail',
    styleUrls: ['./css/jobDetail.component.css'],
    templateUrl: './templates/jobDetail.html',
    providers: [JobService]
})
export class JobDetailComponent {
    job: JobInfo = new JobInfo();
    user: UserInfo = new UserInfo();
    jobParam: JobParameter[] = [];
    initial: number = 0;
    interval:any;
    index: number = 0;

    param1: string = '';
    param2: string = '';
    param3: string = '';
    param4: string = '';
    param5: string = '';
    param6: string = '';
    param7: string = '';
    param8: string = '';
    param9: string = '';

    constructor(private jobService: JobService, private location: Location){

        if (location.path(false).indexOf('/jobDetail/')!=-1){
            let jobPath = location.path(false).split('/jobDetail/')[1];
            if(jobPath){
                // jobService.getJob(jobPath)
                //     .subscribe(jobParam => this.jobParam = jobParam);
                jobService.getAllJobs().subscribe(jobs => this.selectJob(jobs,jobPath));
                this.interval = setInterval(() => this.updatePage(jobPath,this.index), 1000);
            }
        }
    }
    ngOnDestroy(){
        // 退出时停止更新
        clearInterval(this.interval);
    }
    selectJob(jobs, jobPath){
        for (let job of jobs){
            if(job.jobPath == jobPath){
                this.job = job;
                this.user = job.user;
                break;
            }
        }
    }

    updatePage(jobPath,index){
        this.jobService.getJob(jobPath,index)
            .subscribe(jobParam => this.update(jobParam));
        this.index++;
    }

    update(jobParam){
        let lossArray = [];
        let accuracyArray = [];
        let index = 1;
        let min_loss = Number(jobParam[0].loss);
        let max_loss = Number(jobParam[0].loss);
        let min_acc = Number(jobParam[0].acc);
        let max_acc = Number(jobParam[0].acc);
        for (let jobParameter of jobParam){
            let temp1 = new Array();
            temp1.push(index);
            temp1.push(Number(jobParameter.loss));
            if (min_loss>(Number(jobParameter.loss))){
                min_loss = Number(jobParameter.loss);
            }
            if (max_loss<(Number(jobParameter.loss))){
                max_loss = Number(jobParameter.loss);
            }
            lossArray.push(temp1);
            let temp2 = new Array();
            temp2.push(index);
            temp2.push(Number(jobParameter.acc));
            if (min_acc>(Number(jobParameter.acc))){
                min_acc = Number(jobParameter.acc);
            }
            if (max_acc<(Number(jobParameter.acc))){
                max_acc = Number(jobParameter.acc);
            }
            accuracyArray.push(temp2);
            index++;
        }
        // console.log(lossArray);
        // console.log(accuracyArray);
        // update view
        d3.select('#chart1').select( 'svg' ).selectAll('path').remove();
        d3.select('#chart1').select( 'svg' ).selectAll('g').remove();
        this.drawLoss(lossArray,min_loss,max_loss);

        d3.select('#chart2').select( 'svg' ).selectAll('path').remove();
        d3.select('#chart2').select( 'svg' ).selectAll('g').remove();
        this.drawAccuracy(accuracyArray,min_acc,max_acc);

        // update parameters
        this.updateParams(jobParam);
    }

    drawLoss(lossArray,min_loss,max_loss){
        var margin = {top: 50, right:40, bottom: 10, left: 40};
        var width = 755- margin.left - margin.right;
        var height = 420- margin.top - margin.bottom;
        var container = d3.select('#chart1');
        var svg = container.select( 'svg' )
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var data2 = lossArray;
        var xAxis = d3.axisBottom(x)
        .ticks(6);
        var yAxis = d3.axisLeft(y)
        .ticks(5);

        var line = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]); })
        .curve(d3.curveLinear);

        var area = d3.area()
        .defined(line.defined())
        .x(line.x())
        .y1(line.y())
        .y0(y(0));//360

        let offset = Number((max_loss-min_loss)/8);
        // console.log(offset);
        x.domain( [1 , 3]);
        y.domain( [ min_loss-offset, max_loss + offset]);

        svg.append("path")
        .attr( 'class', 'lineChart--area' )
        .attr('transform', 'translate(45,20)')
        .attr("d", area(data2));

        var path = svg.append('path')
        .attr('class', 'line')
        .attr( 'class', 'lineChart--areaLine' )
        .attr('transform', 'translate(45,20)')
        .attr('d', line(data2));

        var grid = svg.selectAll(".grid")
        .data(x.ticks(6))
        .enter().append("g")
        .attr("class", "grid");

        // 横坐标
        // 横坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(45,' + (height+20) + ')')
        .call(xAxis)
        // 增加坐标值说明
        .append('text')
        .text('X')
        .attr('transform', 'translate(' + width +', 35)');

        // 纵坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(45,20)')
        .call(yAxis)
        .append('text')
        .text('Y')
        .attr('transform', 'translate(0, -5)');

        // 横线
        grid.data(x.ticks(6));
        grid.append("line")
        .attr("class","gridline")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", height).attr('transform', 'translate(45,20)');
        // 竖线
        grid.data(y.ticks(5));
        grid.append("line")
        .attr("class","gridline")
        .attr("y1", y)
        .attr("y2", y)
        .attr("x1", 0)
        .attr("x2", width).attr('transform', 'translate(45,20)');



        //change color
        $("text")
            .attr("fill","none")
            .attr("stroke","#e1e1e1")
            .attr("font-size","16px");
        $(".domain")
            .attr("fill","none")
            .attr("stroke","white")
            .attr("stroke-width","1.5px");
        $("line")
            .attr("fill","none")
            .attr("stroke","white")
            .attr("stroke-width","1.5px");
        $(".gridline")
            .attr("fill","none")
            .attr("stroke","white")
            .attr("stroke-width","0.5px")
            .attr("opacity","0.5");
    }

    drawAccuracy(accuracyArray,min_acc,max_acc){
        var margin = {top: 50, right:40, bottom: 10, left: 40};
        var width = 755- margin.left - margin.right;
        var height = 420- margin.top - margin.bottom;
        var container = d3.select('#chart2');
        var svg = container.select( 'svg' )
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var data2 = accuracyArray;

        var xAxis = d3.axisBottom(x)
        .ticks(6);
        var yAxis = d3.axisLeft(y)
        .ticks(5);

        var line = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]); })
        .curve(d3.curveLinear);

        var area = d3.area()
        .defined(line.defined())
        .x(line.x())
        .y1(line.y())
        .y0(y(0));//360

        let offset = (max_acc-min_acc)/8;
        x.domain( [ 1, 3]);
        y.domain( [ min_acc-offset, max_acc + offset]);

        svg.append("path")
        .attr( 'class', 'lineChart--area' )
        .attr('transform', 'translate(45,20)')
        .attr("d", area(data2));

        var path = svg.append('path')
        .attr('class', 'line')
        .attr( 'class', 'lineChart--areaLine' )
        .attr('transform', 'translate(45,20)')
        .attr('d', line(data2));

        var grid = svg.selectAll(".grid")
        .data(x.ticks(6))
        .enter().append("g")
        .attr("class", "grid");

        // 横坐标
        // 横坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(45,' + (height+20) + ')')
        .call(xAxis)
        // 增加坐标值说明
        .append('text')
        .text('X')
        .attr('transform', 'translate(' + width +', 35)');

        // 纵坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(45,20)')
        .call(yAxis)
        .append('text')
        .text('Y')
        .attr('transform', 'translate(0, -5)');

        // 横线
        grid.data(x.ticks(6));
        grid.append("line")
        .attr("class","gridline")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", height).attr('transform', 'translate(45,20)');
        // 竖线
        grid.data(y.ticks(5));
        grid.append("line")
        .attr("class","gridline")
        .attr("y1", y)
        .attr("y2", y)
        .attr("x1", 0)
        .attr("x2", width).attr('transform', 'translate(45,20)');



        //change color
        $("text")
            .attr("fill","none")
            .attr("stroke","#e1e1e1")
            .attr("font-size","16px");
        $(".domain")
            .attr("fill","none")
            .attr("stroke","white")
            .attr("stroke-width","1.5px");
        $("line")
            .attr("fill","none")
            .attr("stroke","white")
            .attr("stroke-width","1.5px");
        $(".gridline")
            .attr("fill","none")
            .attr("stroke","white")
            .attr("stroke-width","0.5px")
            .attr("opacity","0.5");
    }

    updateParams(jobParam){
        // getNewValue
        // update
        let jobParameter: JobParameter = jobParam[jobParam.length-1];
        // console.log(jobParameter);
        if (jobParameter.epoch){
            this.param1 = jobParameter.epoch;
        }
        if (jobParameter.val_loss){
            this.param2 = jobParameter.val_loss;
        }
        if (jobParameter.val_acc){
            this.param3 = jobParameter.val_acc;
        }
        this.param4 = '';
        this.param5 = '';
        this.param6 = '';
        this.param7 = '';
        this.param8 = '';
        this.param9 = '';
    }
}
