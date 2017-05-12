import {Component} from "@angular/core";
import {Location} from "@angular/common";
// import { ActivatedRoute,Params} from '@angular/router';
import {JobService} from "../common/services/job.service";

import {JobInfo, JobParameter, UserInfo} from "../common/defs/resources";
import * as d3 from "d3";
declare var $:any;
declare var unescape:any;
@Component({
    moduleId: module.id,
    selector: 'jobDetail',
    styleUrls: ['./css/jobDetail.component.css'],
    templateUrl: './templates/jobDetail.html',
    providers: [JobService]
})
export class JobDetailComponent {
    jobResultParam = [];
    job: JobInfo = new JobInfo();
    user: UserInfo = new UserInfo();
    jobParam: JobParameter[] = [];
    initial: number = 0;
    interval:any;
    index: number = -1;
    lossArray = [];
    accuracyArray = [];
    val_loss_array = [];
    val_acc_array = [];
    jobResult: any={};
    // 最多打多少个点 否则密密麻麻很难看
    MAX_CIRCLE: number = 40;

    constructor(private jobService: JobService, private location: Location){
        if (location.path(false).indexOf('/jobDetail/')!=-1){
            let jobPath = location.path(false).split('/jobDetail/')[1];
            if(jobPath){
                jobPath = unescape(jobPath);
                // jobService.getJob(jobPath)
                //     .subscribe(jobParam => this.jobParam = jobParam);
                jobService.getJobDetail(jobPath).subscribe(jobDetail => {
                    this.job = jobDetail;
                    this.user =  this.job.user;
                    if(this.job.status=="Running"){
                        // console.log("Running");
                        this.updatePage(jobPath,this.index);
                        this.interval = setInterval(() => this.updatePage(jobPath,this.index), 3000);
                    }else{
                        // console.log("not Running");
                        this.not_running_show(jobPath);
                    }
                });
            }
        }
    }
    ngOnDestroy(){
        // 退出时停止更新
        if(this.interval){
            clearInterval(this.interval);
        }
    }
    selectJob(jobs, jobPath:string){
        // console.log(jobPath);
        // console.log(jobs);
        for (let job of jobs){
            // console.log(job.jobPath)
            if(job.jobPath == jobPath){
                this.job = job;
                this.user = job.user;
                break;
            }
        }
        // 500ms刷新一次
        if(this.job.status=="Running"){
            // console.log("Running");
            this.updatePage(jobPath,this.index);
            this.interval = setInterval(() => this.updatePage(jobPath,this.index), 3000);
        }else{
            // console.log("not Running");
            this.not_running_show(jobPath);
        }
    }

    // 不再running状态时一次性展示数据
    not_running_show(jobPath:string){
        this.jobService.getUnrunningJob(jobPath)
        .subscribe(jobParam => {
          this.jobResult = jobParam[jobParam.length-1];
          this.update(jobParam)
        });
    }

    updatePage(jobPath,index){
        console.log("update , index="+index);
        this.jobService.getJob(jobPath,index)
            .subscribe(jobParam => {
                // debugger
                this.update(jobParam);
              this.jobResult = jobParam[jobParam.length-1];
                // this.jobResult =jobParam.jobResult;
            });
        // console.log(this.index);
    }

    update(jobParam){
        //  console.log(jobParam);
        let jobProcessItems = jobParam;
        // this.jobResult = jobParam.jobResult;
        // console.info(this.jobResult);
        // 更新下方参数
        // let resultParam = new Array();
        // for (let key in jobResult){
        //     resultParam.push({
        //         "key": key,
        //         "value": jobResult[key]
        //     });
        // }
        // this.jobResultParam = resultParam;
        // console.log(jobParam[0].acc);
        if(jobProcessItems&&jobProcessItems.length > 0){
            let min_loss = Number(jobProcessItems[0].loss);
            let max_loss = Number(jobProcessItems[0].loss);
            let min_acc = Number(jobProcessItems[0].metrics_value);
            let max_acc = Number(jobProcessItems[0].metrics_value);
            for (let jobProcessItem of jobProcessItems){
                this.index = Number(jobProcessItem.epoch);
                // console.log(jobProcessItem.val_acc);
                let temp1 = new Array();
                temp1.push(this.index);
                temp1.push(Number(jobProcessItem.loss));
                if (min_loss>(Number(jobProcessItem.loss))){
                    min_loss = Number(jobProcessItem.loss);
                }
                if (max_loss<(Number(jobProcessItem.loss))){
                    max_loss = Number(jobProcessItem.loss);
                }
                this.lossArray.push(temp1);
                let temp2 = new Array();
                temp2.push(this.index);
                // 现在坐标轴是固定的 所以显示不出来线
                temp2.push(Number(jobProcessItem.metrics_value));
                if (min_acc>(Number(jobProcessItem.metrics_value))){
                    min_acc = Number(jobProcessItem.metrics_value);
                }
                if (max_acc<(Number(jobProcessItem.metrics_value))){
                    max_acc = Number(jobProcessItem.metrics_value);
                }
                this.accuracyArray.push(temp2);

                // fake data
                // jobParameter.val_loss = Math.random()+2;
                // jobParameter.val_acc = Math.random()+2;

                let temp_val_loss = new Array();
                temp_val_loss.push(this.index);
                temp_val_loss.push(jobProcessItem.val_loss);
                this.val_loss_array.push(temp_val_loss);
                let temp_val_acc = new Array();
                temp_val_acc.push(this.index);
                temp_val_acc.push(jobProcessItem.val_metrics_value);
                this.val_acc_array.push(temp_val_acc);
            }
            // console.log(lossArray);
            // console.log(accuracyArray);
            // update view
            if(jobProcessItems.length==1){
                d3.select('#chart1').select( 'svg' ).selectAll('path').remove();
                d3.select('#chart1').select( 'svg' ).selectAll('g').remove();
                // d3.select('#chart1').select( 'svg' ).remove();
                this.drawSingleLoss(this.lossArray,this.val_loss_array);
                // console.log("loss update ok");
                d3.select('#chart2').select( 'svg' ).selectAll('path').remove();
                d3.select('#chart2').select( 'svg' ).selectAll('g').remove();
                this.drawSingleAccuracy(this.accuracyArray,this.val_acc_array);
            }else if(jobProcessItems.length>1){
                d3.select('#chart1').select( 'svg' ).selectAll('path').remove();
                d3.select('#chart1').select( 'svg' ).selectAll('g').remove();
                // d3.select('#chart1').select( 'svg' ).remove();
                this.drawLoss(this.lossArray,this.val_loss_array,min_loss,max_loss);
                // console.log("loss update ok");
                d3.select('#chart2').select( 'svg' ).selectAll('path').remove();
                d3.select('#chart2').select( 'svg' ).selectAll('g').remove();
                this.drawAccuracy(this.accuracyArray,this.val_acc_array,min_acc,max_acc);
            }
        }else{
            console.warn("This job returns no Info at this time!");
        }
    }

    drawSingleLoss(lossArray,val_loss_array){
        var margin = {top: 50, right:40, bottom: 10, left: 40};
        var width = 755- margin.left - margin.right;
        var height = 420- margin.top - margin.bottom;
        var container = d3.select('#chart1');
        var svg = container.select( 'svg' )
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var loss_data = lossArray;

        var val_loss_data = val_loss_array;

        var xTick = 6;
        var yTick = 5;

        var xAxis = d3.axisBottom(x)
        .ticks(xTick);
        var yAxis = d3.axisLeft(y)
        .ticks(yTick);

        // var area = d3.area()
        // .defined(line.defined())
        // .x(line.x())
        // .y1(line.y())
        // .y0(y(0));//360
        // console.log(offset);
        x.domain( [0 , 1]);
        // y.domain( [ min_loss-offset, max_loss + offset]);
        y.domain( [ 0, 10]);


        var loss_g = svg.selectAll('circle')
        .data(loss_data)
        .enter()
        .append('g')
        .append('circle')
        .attr('transform', 'translate(45 , 20)')
        .attr('class', 'linecircle')
        .attr('cx', function(d) { return x(d[0])})
        .attr('cy', function(d) { return y(d[1])})
        .attr('r', 3.5)
        .on('mouseover', function() {
            d3.select(this).transition().duration(400).attr('r', 5);
        })
        .on('mouseout', function() {
            d3.select(this).transition().duration(400).attr('r', 3.5);
        });


        var val_loss_g = svg.selectAll('circle_val')
        .data(val_loss_data)
        .enter()
        .append('g')
        .append('circle')
        .attr('transform', 'translate(45 , 20)')
        .attr('class', 'linecircle_val')
        .attr('cx', function(d) { return x(d[0])})
        .attr('cy', function(d) { return y(d[1])})
        .attr('r', 3.5)
        .on('mouseover', function() {
            d3.select(this).transition().duration(500).attr('r', 5);
        })
        .on('mouseout', function() {
            d3.select(this).transition().duration(500).attr('r', 3.5);
        });


        var grid = svg.selectAll(".grid")
        .data(x.ticks(xTick))
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
        grid.data(x.ticks(xTick));
        grid.append("line")
        .attr("class","gridline")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", height).attr('transform', 'translate(45,20)');
        // 竖线
        grid.data(y.ticks(yTick));
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

    drawSingleAccuracy(accuracyArray,val_acc_array){
        var margin = {top: 50, right:40, bottom: 10, left: 40};
        var width = 755- margin.left - margin.right;
        var height = 420- margin.top - margin.bottom;
        var container = d3.select('#chart2');
        var svg = container.select( 'svg' )
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var acc_data = accuracyArray;

        var val_acc_data = val_acc_array;

        var xTick = 6;
        var yTick = 5;

        var xAxis = d3.axisBottom(x)
        .ticks(xTick);
        var yAxis = d3.axisLeft(y)
        .ticks(yTick);

        // var area = d3.area()
        // .defined(line.defined())
        // .x(line.x())
        // .y1(line.y())
        // .y0(y(0));//360
        // console.log(offset);
        x.domain( [0 , 1]);
        // y.domain( [ min_loss-offset, max_loss + offset]);
        y.domain( [ 0, 1]);


        var acc_g = svg.selectAll('circle')
        .data(acc_data)
        .enter()
        .append('g')
        .append('circle')
        .attr('transform', 'translate(45 , 20)')
        .attr('class', 'linecircle')
        .attr('cx', function(d) { return x(d[0])})
        .attr('cy', function(d) { return y(d[1])})
        .attr('r', 3.5)
        .on('mouseover', function() {
            d3.select(this).transition().duration(500).attr('r', 5);
        })
        .on('mouseout', function() {
            d3.select(this).transition().duration(500).attr('r', 3.5);
        });


        var val_acc_g = svg.selectAll('circle_val')
        .data(val_acc_data)
        .enter()
        .append('g')
        .append('circle')
        .attr('transform', 'translate(45 , 20)')
        .attr('class', 'linecircle_val')
        .attr('cx', function(d) { return x(d[0])})
        .attr('cy', function(d) { return y(d[1])})
        .attr('r', 3.5)
        .on('mouseover', function() {
            d3.select(this).transition().duration(500).attr('r', 5);
        })
        .on('mouseout', function() {
            d3.select(this).transition().duration(500).attr('r', 3.5);
        });


        var grid = svg.selectAll(".grid")
        .data(x.ticks(xTick))
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
        grid.data(x.ticks(xTick));
        grid.append("line")
        .attr("class","gridline")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", height).attr('transform', 'translate(45,20)');
        // 竖线
        grid.data(y.ticks(yTick));
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

    drawLoss(lossArray,val_loss_array,min_loss,max_loss){
        console.log("Trying drawLoss");
        var margin = {top: 50, right:40, bottom: 10, left: 40};
        var width = 755- margin.left - margin.right;
        var height = 420- margin.top - margin.bottom;
        var container = d3.select('#chart1');
        var svg = container.select( 'svg' )
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var loss_data = lossArray;

        var val_loss_data = val_loss_array;

        var xTick = 6;
        var yTick = 5;

        var xAxis = d3.axisBottom(x)
        .ticks(xTick);
        var yAxis = d3.axisLeft(y)
        .ticks(yTick);

        var line = d3.line()
        // .defined(function(d) { return d; })
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]); })
        .curve(d3.curveLinear);

        // var area = d3.area()
        // .defined(line.defined())
        // .x(line.x())
        // .y1(line.y())
        // .y0(y(0));//360

        let offset = Number((max_loss-min_loss)/8);
        // console.log(offset);
        x.domain( [0 , this.index]);
        // y.domain( [ min_loss-offset, max_loss + offset]);
        y.domain( [ 0, 10]);

        // svg.append("path")
        // .attr( 'class', 'lineChart--area' )
        // .attr('transform', 'translate(45,20)')
        // .attr("d", area(loss_data));

        var path = svg.append('path')
        .attr('class', 'line')
        .attr( 'class', 'lineChart--areaLine' )
        .attr('transform', 'translate(45,20)')
        .attr('d', line(loss_data));


        var val_loss_path = svg.append('path')
        .attr('class', 'line')
        .attr( 'class', 'lineChart--areaLine_val' )
        .attr('transform', 'translate(45,20)')
        .attr('d', line(val_loss_data));

        if (this.index < this.MAX_CIRCLE){
            var loss_g = svg.selectAll('circle')
            .data(loss_data)
            .enter()
            .append('g')
            .append('circle')
            .attr('transform', 'translate(45 , 20)')
            .attr('class', 'linecircle')
            .attr('cx', function(d) { return x(d[0])})
            .attr('cy', function(d) { return y(d[1])})
            .attr('r', 3.5)
            .on('mouseover', function() {
            d3.select(this).transition().duration(500).attr('r', 5);
            })
            .on('mouseout', function() {
            d3.select(this).transition().duration(500).attr('r', 3.5);
            });

            var val_loss_g = svg.selectAll('circle_val')
            .data(val_loss_data)
            .enter()
            .append('g')
            .append('circle')
            .attr('transform', 'translate(45 , 20)')
            .attr('class', 'linecircle_val')
            .attr('cx', function(d) { return x(d[0])})
            .attr('cy', function(d) { return y(d[1])})
            .attr('r', 3.5)
            .on('mouseover', function() {
                d3.select(this).transition().duration(500).attr('r', 5);
            })
            .on('mouseout', function() {
                d3.select(this).transition().duration(500).attr('r', 3.5);
            });
        }

        var grid = svg.selectAll(".grid")
        .data(x.ticks(xTick))
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
        grid.data(x.ticks(xTick));
        grid.append("line")
        .attr("class","gridline")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", height).attr('transform', 'translate(45,20)');
        // 竖线
        grid.data(y.ticks(yTick));
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

        console.log("Drawloss finished");
    }

    drawAccuracy(accuracyArray,val_acc_array,min_acc,max_acc){
        var margin = {top: 50, right:40, bottom: 10, left: 40};
        var width = 755- margin.left - margin.right;
        var height = 420- margin.top - margin.bottom;
        var container = d3.select('#chart2');
        var svg = container.select( 'svg' )
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var acc_data = accuracyArray;

        var val_acc_data = val_acc_array;

        var xAxis = d3.axisBottom(x)
        .ticks(6);
        var yAxis = d3.axisLeft(y)
        .ticks(5);

        var line = d3.line()
        // .defined(function(d) { return d; })
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]); })
        .curve(d3.curveLinear);

        // var area = d3.area()
        // .defined(line.defined())
        // .x(line.x())
        // .y1(line.y())
        // .y0(y(0));//360

        let offset = Number((max_acc-min_acc)/8);
        // console.log(offset);
        x.domain( [0 , this.index]);
        // y.domain( [ min_loss-offset, max_loss + offset]);
        y.domain( [ 0, 1]);

        // svg.append("path")
        // .attr( 'class', 'lineChart--area' )
        // .attr('transform', 'translate(45,20)')
        // .attr("d", area(loss_data));

        var path = svg.append('path')
        .attr('class', 'line')
        .attr( 'class', 'lineChart--areaLine' )
        .attr('transform', 'translate(45,20)')
        .attr('d', line(acc_data));


        var val_acc_path = svg.append('path')
        .attr('class', 'line')
        .attr( 'class', 'lineChart--areaLine_val' )
        .attr('transform', 'translate(45,20)')
        .attr('d', line(val_acc_data));


        if (this.index < this.MAX_CIRCLE){
            var acc_g = svg.selectAll('circle')
            .data(acc_data)
            .enter()
            .append('g')
            .append('circle')
            .attr('transform', 'translate(45 , 20)')
            .attr('class', 'linecircle')
            .attr('cx', function(d) { return x(d[0])})
            .attr('cy', function(d) { return y(d[1])})
            .attr('r', 3.5)
            .on('mouseover', function() {
            d3.select(this).transition().duration(500).attr('r', 5);
            })
            .on('mouseout', function() {
            d3.select(this).transition().duration(500).attr('r', 3.5);
            });

            var val_acc_g = svg.selectAll('circle_val')
            .data(val_acc_data)
            .enter()
            .append('g')
            .append('circle')
            .attr('transform', 'translate(45 , 20)')
            .attr('class', 'linecircle_val')
            .attr('cx', function(d) { return x(d[0])})
            .attr('cy', function(d) { return y(d[1])})
            .attr('r', 3.5)
            .on('mouseover', function() {
            d3.select(this).transition().duration(500).attr('r', 5);
            })
            .on('mouseout', function() {
            d3.select(this).transition().duration(500).attr('r', 3.5);
            });
        }


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

}
