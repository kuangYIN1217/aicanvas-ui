import { Component } from '@angular/core';
import { Location } from '@angular/common'
// import { ActivatedRoute,Params} from '@angular/router';
import { ResourcesService } from '../../common/services/resources.service'

import { JobInfo } from "../../common/defs/resources";
import * as d3 from 'd3';
declare var $:any;
@Component({
    moduleId: module.id,
    selector: 'jobDetail',
    styleUrls: ['./css/jobDetail.component.css'],
    templateUrl: './templates/jobDetail.html',
    providers: [ResourcesService]
})
export class JobDetailComponent {
    job: JobInfo = new JobInfo();
    initial: number = 0;

    constructor(private resourcesService: ResourcesService, private location: Location){}
    ngOnInit(){
        // let test=this.route.params
        // .switchMap((params: Params) => params['scene_id']);
        // console.log(test);
        if (this.location.path(false).indexOf('/jobDetail/')!=-1){
            let id = this.location.path(false).split('/jobDetail/')[1];
            if(id){
                // console.log(id);
                this.resourcesService.getJobById(Number(id))
                    .subscribe(job => this.job = job);
            }
        }
    }
    ngDoCheck(){
        if(this.initial==0){
            if(this.job){
                this.updatePage();
            }
        }else{
            if (this.location.path(false).indexOf('/jobDetail/')!=-1){
                let id = this.location.path(false).split('/jobDetail/')[1];
                if(Number(id)!=this.job.job_id){
                    this.resourcesService.getJobById(Number(id))
                        .subscribe(job => this.job = job);
                    this.updatePage();
                }
            }
        }
    }
    updatePage(){
        this.drawLoss1();
        this.drawLoss2();
    }
    drawLoss1(){
        // var data1 = [
        //     {xParam: 0, yParam: 8},
        //     {xParam: 1, yParam: 8.2},
        //     {xParam: 2, yParam: 8.8},
        //     {xParam: 3, yParam: 8.8},
        //     {xParam: 4, yParam: 5.7},
        //     {xParam: 5, yParam: 8},
        //     {xParam: 6, yParam: 10}
        // ];

        var data = [
            [0,8],
            [1,8.2],
            [2,8.8],
            [3,8.8],
            [4,5.7],
            [5,8],
            [6,10]
        ];

        var margin = {top: 50, right:20, bottom: 10, left: 20};
        var width = 755- margin.left - margin.right;
        var height = 420- margin.top - margin.bottom;
        var container = d3.select('#chart1');
        var svg = container.select( 'svg' )
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // var line = d3.line()
        // .x(function(d) { return x(d[0]); })
        // .y(function(d) { return y(d[1]); })
        // .curve(d3.curveLinear);

        // var data1 = [
        //     {x: 0, y: 8},
        //     {x: 1, y: 8.2},
        //     {x: 2, y: 8.8},
        //     {x: 3, y: 8.8},
        //     {x: 4, y: 5.7},
        //     {x: 5, y: 8},
        //     {x: 6, y: 10}
        // ];

        var data2 = d3.range(40).map(function(i) {
            return i % 5 ? {x: i / 39, y: (Math.sin(i / 3) + 2) / 4} : null;
        });
        console.log(data2);
        console.log(data2[1]);


        var line = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); })
        .curve(d3.curveLinear);

        var area = d3.area()
        .defined(line.defined())
        .x(line.x())
        .y1(line.y())
        .y0(y(0));

        svg.append("path")
        .attr( 'class', 'lineChart--area' )
        .attr('transform', 'translate(30,20)')
        .attr("d", area(data2));

        var path = svg.append('path')
        .attr('class', 'line')
        .attr( 'class', 'lineChart--areaLine' )
        .attr('transform', 'translate(30,20)')
        .attr('d', line(data2));

        var grid = svg.selectAll(".grid")
        .data(x.ticks(6))
        .enter().append("g")
        .attr("class", "grid");

        x.domain( [ 0, d3.max( data, function( d )
            {
                return d[0];
            })
        ]);
        y.domain( [ 0, d3.max( data, function( d )
            {
                return d[1];
            })
        ]);
        var xAxis = d3.axisBottom(x)
        .ticks(6);
        var yAxis = d3.axisLeft(y)
        .ticks(5);
        // 横坐标
        // 横坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(30,' + (height+20) + ')')
        .call(xAxis)
        // 增加坐标值说明
        .append('text')
        .text('X')
        .attr('transform', 'translate(' + width +', 35)');

        // 纵坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(30,20)')
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
        .attr("y2", height).attr('transform', 'translate(30,20)');
        // 竖线
        grid.data(y.ticks(5));
        grid.append("line")
        .attr("class","gridline")
        .attr("y1", y)
        .attr("y2", y)
        .attr("x1", 0)
        .attr("x2", width).attr('transform', 'translate(30,20)');



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

    drawLoss2(){
        // var data1 = [
        //     {xParam: 0, yParam: 8},
        //     {xParam: 1, yParam: 8.2},
        //     {xParam: 2, yParam: 8.8},
        //     {xParam: 3, yParam: 8.8},
        //     {xParam: 4, yParam: 5.7},
        //     {xParam: 5, yParam: 8},
        //     {xParam: 6, yParam: 10}
        // ];

        var data = [
            [0,8],
            [1,8.2],
            [2,8.8],
            [3,8.8],
            [4,5.7],
            [5,8],
            [6,10]
        ];

        var margin = {top: 50, right:20, bottom: 10, left: 20};
        var width = 755- margin.left - margin.right;
        var height = 420- margin.top - margin.bottom;
        var container = d3.select('#chart2');
        var svg = container.select( 'svg' )
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // var line = d3.line()
        // .x(function(d) { return x(d[0]); })
        // .y(function(d) { return y(d[1]); })
        // .curve(d3.curveLinear);

        // var data1 = [
        //     {x: 0, y: 8},
        //     {x: 1, y: 8.2},
        //     {x: 2, y: 8.8},
        //     {x: 3, y: 8.8},
        //     {x: 4, y: 5.7},
        //     {x: 5, y: 8},
        //     {x: 6, y: 10}
        // ];

        var data2 = d3.range(40).map(function(i) {
            return i % 5 ? {x: i / 39, y: (Math.sin(i / 3) + 2) / 4} : null;
        });
        console.log(data2);
        console.log(data2[1]);


        var line = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); })
        .curve(d3.curveLinear);

        var area = d3.area()
        .defined(line.defined())
        .x(line.x())
        .y1(line.y())
        .y0(y(0));

        svg.append("path")
        .attr( 'class', 'lineChart--area' )
        .attr('transform', 'translate(30,20)')
        .attr("d", area(data2));

        var path = svg.append('path')
        .attr('class', 'line')
        .attr( 'class', 'lineChart--areaLine' )
        .attr('transform', 'translate(30,20)')
        .attr('d', line(data2));

        var grid = svg.selectAll(".grid")
        .data(x.ticks(6))
        .enter().append("g")
        .attr("class", "grid");

        x.domain( [ 0, d3.max( data, function( d )
            {
                return d[0];
            })
        ]);
        y.domain( [ 0, d3.max( data, function( d )
            {
                return d[1];
            })
        ]);
        var xAxis = d3.axisBottom(x)
        .ticks(6);
        var yAxis = d3.axisLeft(y)
        .ticks(5);
        // 横坐标
        // 横坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(30,' + (height+20) + ')')
        .call(xAxis)
        // 增加坐标值说明
        .append('text')
        .text('X')
        .attr('transform', 'translate(' + width +', 35)');

        // 纵坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(30,20)')
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
        .attr("y2", height).attr('transform', 'translate(30,20)');
        // 竖线
        grid.data(y.ticks(5));
        grid.append("line")
        .attr("class","gridline")
        .attr("y1", y)
        .attr("y2", y)
        .attr("x1", 0)
        .attr("x2", width).attr('transform', 'translate(30,20)');



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

}
