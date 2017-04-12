import { Component } from '@angular/core';
import { ResourcesService } from '../../common/services/resources.service'
import { JobService } from '../../common/services/job.service'


import { CpuInfo, GpuInfo } from "../../common/defs/resources";

import { JobInfo } from "../../common/defs/resources";
declare var $:any;
import * as d3 from 'd3';
@Component({
    moduleId: module.id,
    selector: 'overview',
    styleUrls: ['./css/overview.component.css'],
    templateUrl: './templates/overview.html',
    providers: [ResourcesService,JobService]
})
export class OverviewComponent {

    gpuArray: GpuInfo[] = [];
    // infomation of cpu
    cpuInfoArray: CpuInfo[] = [];
    jobArray: JobInfo[] = [];
    // show resource or task 0--resource, 1--task
    tabIndex: number = 0;

    constructor(private resourcesService: ResourcesService, private jobService: JobService) {

        resourcesService.getAllGpus()
        .subscribe(gpuArray => this.gpuArray = gpuArray);

        jobService.getAllJobs()
        .subscribe(jobArray => this.jobArray = jobArray);

        setTimeout (() => {
            //console.log("Hello from setTimeout");
            this.originPics();
        }, 200);


        if (sessionStorage.overviewTab){
            this.changeTab(sessionStorage.overviewTab);
        }else{
            sessionStorage.overviewTab = 0;
        }

    }

    changeTab(tabIndex: number){
        this.tabIndex = tabIndex;
    }

    originPics(){
        // 饼图的参数
        //饼图的参数
        var svg=d3.selectAll("#drawPie").append("svg")  ;
        var dataset=[ ["空间",50] , ["名称B",25] , ["名称C",15] , ["名称D",15]];
        this.originpix(svg,dataset);
        // 柱状图
        this.bar();
        this.cpu1();
        this.cpu2();
        this.cpu3();

        //change color
        $("text")
            .attr("fill","none")
            .attr("stroke","#e1e1e1")
            .attr("font-size","14px");
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
    //画饼图的函数
    originpix(svg,dataset){
        var width=180;
        var height=180;
        svg .attr("width",width)
        .attr("height",height);
        //转换数据
        var pie=d3.pie() //创建饼状图
        .value(function(d){
            return d[1];
        });//值访问器
        //dataset为转换前的数据 piedata为转换后的数据
        var piedata=pie(dataset);

        //绘制
        var outerRadius=width/2;
        var innerRadius=0;//内半径和外半径

        //创建弧生成器
        var arc=d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
        var color = d3.scaleOrdinal(d3.schemeCategory20b);
        //添加对应数目的弧组
        var arcs=svg.selectAll("g")
        .data(piedata)
        .enter()
        .append("g")
        .attr("transform","translate("+(width/2)+","+(height/2)+")");
        //添加弧的路径元素
        arcs.append("path")
        .attr("fill",function(d,i){
            return color(i);  //颜色
        })
        .attr("d",function(d){
            return arc(d);//使用弧生成器获取路径
        });

        var width1=140;
        var height1=140;
        var svg = d3.selectAll("#proportion").append("svg")
        .attr("width",140)
        .attr("height",140)
        ;
        var x=0;
        var y=0;//文字的x坐标

        //画圆形
        var circle = svg.selectAll("circle")
        .data(piedata)
        .enter()
        .append("circle")
        .attr("cx",7.5)
        .attr("cy",7.5)
        .attr("r",7.5)
        .style("position","relative")
        .style("margin-top","5px")
        .attr("fill",function(d,i){
            return color(i);  //颜色
        })
        .attr("transform",function(){
            x=0;//x坐标
            if(y>80) y=0;
            y=y+22;
            return "translate("+x+","+y+")";
        });
        var y1=15;
        var y2=15;
        var tt=svg.selectAll("g")
        .data(piedata)
        .enter()
        .append("g")  ;
        tt.append("text")
        .style("font-family","Microsoft YaHei")
        .style("font-size","18")
        .style("color","#e0e0e0")
        .text(function(d){
            return d.data[0];
        })
        .attr("transform",function(){
            x=30;//x坐标
            if(y1>95) y1=15;
            y1=y1+22;
            return "translate("+x+","+y1+")";
        }) ;
        tt .append("text")
        .text(function(d){
            //百分比
            var percent=Number(d.value)/d3.sum(dataset,function(d){
                return d[1];
            })*100;
            //保留一位小数点 末尾加一个百分号返回
            return percent.toFixed(1)+"%";
        })

        .attr("transform",function(){
            x=90;//x坐标
            if(y2>95) y2=15;
            y2=y2+22;
            return "translate("+x+","+y2+")";
        }) ;
    }

    //画柱状图的函数
    bar(){
        //画布大小
        var width = 480;
        var height = 220;
        //画布周边的空白
        var padding = { top: 30, right: 30, bottom: 30, left: 40 };
        //在 body 里添加一个 SVG 画布
        var svg = d3.select("#drawBar")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr('transform', "translate(" + padding.top + ',' + padding.left + ')');
        // 模拟数据
        var dataset = {
            x: ["JobA","JobB","JobC","JobD"],
            y: [98, 38, 30, 58]

        };
        var index=["JobA","JobB","JobC","JobD"];
        // 定义x轴的比例尺(序数比例尺)
        var xScale = d3.scaleBand()
        .domain(index)
        .range([0, width - padding.left - padding.right],0,0);
        // 定义y轴的比例尺(线性比例尺)
        var yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - padding.top - padding.bottom, 0]);
        // 定义x轴和y轴
        var xAxis = d3.axisBottom(xScale)

        ;
        var yAxis = d3.axisLeft(yScale)
        .ticks(5);
        // 定义纵轴网格线
        var yInner = d3.axisLeft(yScale)
        .tickSize(-(width-padding.left-padding.right),10,0)
        .tickFormat("")
        .ticks(6);
        //添加纵轴网格线
        var yBar=svg.append("g")
        .attr("class", "inner_line")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .call(yInner);

        //这一段是用来颜色渐变的
        var a = d3.rgb(255,255,255);    //红色
        var b = d3.rgb(255,89,13);    //绿色

        var compute = d3.interpolate(a,b);
        //定义一个线性渐变
        var defs = svg.append("defs");

        var linearGradient = defs.append("linearGradient")
        .attr("id","linearColor")
        .attr("x1","0%")
        .attr("y1","100%")
        .attr("x2","0%")
        .attr("y2","0%");

        var stop1 = linearGradient.append("stop")
        .attr("offset","0%")
        .style("stop-color",a.toString());

        var stop2 = linearGradient.append("stop")
        .attr("offset","100%")
        .style("stop-color",b.toString());
        // 矩形之间的间距
        var rectMargin = 24;
        // 添加矩形
        svg.selectAll('.bar')
        .data(dataset.y)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr("transform","translate(" + padding.left + "," + padding.top + ")")
        .attr('x', function(d, i) {
            return xScale(dataset.x[i]) + rectMargin;
        })
        .attr('y', function(d, i) {
            return yScale(d);
        })
        .attr('width', function(d){
            return xScale.bandwidth()-2*rectMargin;//设置每个条形的宽度
        })
        .attr('height', function(d, i) {
            return height - padding.top - padding.bottom - yScale(d);
        })
        .attr("fill","url(#" + linearGradient.attr("id") + ")");
        //添加x轴
        var axis1=svg.append("g")
        .attr("class","axis")
        .attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(xAxis);
        //添加y轴
        svg.append("g")
        .attr("class","axis")
        .attr("transform","translate(" + padding.left + "," + padding.top + ")")
        .attr("fill","#ffffff")
        .call(yAxis)
        .append('text')
        .text('内存占用%')
        .attr("fill","#ffffff")
        .attr('transform', 'translate(65, -15)');
        $("text")
        .attr("fill", "#e1e1e1")
        .attr("font-size", "16px");
        $(".domain")
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", "1.5px");
        $("line")
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", "1.5px");
        $(".gridline")
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", "0.5px")
        .attr("opacity", "0.5");
    }
    // CPU波动
    cpu1(){
        var margin = {top: 40, right:40, bottom: 40, left: 20};
        var width = 490- margin.left - margin.right;
        var height = 230- margin.top - margin.bottom;
        var container = d3.select('#cpuSvg1');
        var svg = container.select( 'svg' )
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var data2 = [
            {x: 0, y: 3},
            {x: 1, y: 4.2},
            {x: 2, y: 4.8},
            {x: 3, y: 3.8},
            {x: 4, y: 5.7},
            {x: 5, y: 6},
            {x: 6, y: 8}
        ];

        var xAxis = d3.axisBottom(x)
        .ticks(6);
        var yAxis = d3.axisLeft(y)
        .ticks(5);

        var line = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); })
        .curve(d3.curveLinear);

        var area = d3.area()
        .defined(line.defined())
        .x(line.x())
        .y1(line.y())
        .y0(y(0));//360

        x.domain( [ 0, 6]);
        y.domain( [ 0, 10]);

        svg.append("path")
        .attr( 'class', 'lineChart--area' )
        .attr('transform', 'translate(45,27)')
        .attr("d", area(data2));

        var path = svg.append('path')
        .attr('class', 'line')
        .attr( 'class', 'lineChart--areaLine' )
        .attr('transform', 'translate(45,27)')
        .attr('d', line(data2));

        var grid = svg.selectAll(".grid")
        .data(x.ticks(6))
        .enter().append("g")
        .attr("class", "grid");

        // 横坐标
        // 横坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(45,' + (height+27) + ')')
        .call(xAxis)
        // 增加坐标值说明
        .append('text')
        .text('时间')
        .attr('transform', 'translate(' + width +', 38)');

        // 纵坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(45,27)')
        .call(yAxis)
        .append('text')
        .text('CPU %')
        .attr('transform', 'translate(20, -10)');

        // 横线
        grid.data(x.ticks(6));
        grid.append("line")
        .attr("class","gridline")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", height).attr('transform', 'translate(45,27)');
        // 竖线
        grid.data(y.ticks(5));
        grid.append("line")
        .attr("class","gridline")
        .attr("y1", y)
        .attr("y2", y)
        .attr("x1", 0)
        .attr("x2", width).attr('transform', 'translate(45,27)');
    }

    cpu2(){
        var margin = {top: 40, right:40, bottom: 40, left: 20};
        var width = 490- margin.left - margin.right;
        var height = 230- margin.top - margin.bottom;
        var container = d3.select('#cpuSvg2');
        var svg = container.select( 'svg' )
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var data2 = [
            {x: 0, y: 3},
            {x: 1, y: 4.2},
            {x: 2, y: 4.8},
            {x: 3, y: 3.8},
            {x: 4, y: 5.7},
            {x: 5, y: 6},
            {x: 6, y: 8}
        ];

        var xAxis = d3.axisBottom(x)
        .ticks(6);
        var yAxis = d3.axisLeft(y)
        .ticks(5);

        var line = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); })
        .curve(d3.curveLinear);

        var area = d3.area()
        .defined(line.defined())
        .x(line.x())
        .y1(line.y())
        .y0(y(0));//360

        x.domain( [ 0, 6]);
        y.domain( [ 0, 10]);

        svg.append("path")
        .attr( 'class', 'lineChart--area' )
        .attr('transform', 'translate(45,27)')
        .attr("d", area(data2));

        var path = svg.append('path')
        .attr('class', 'line')
        .attr( 'class', 'lineChart--areaLine' )
        .attr('transform', 'translate(45,27)')
        .attr('d', line(data2));

        var grid = svg.selectAll(".grid")
        .data(x.ticks(6))
        .enter().append("g")
        .attr("class", "grid");

        // 横坐标
        // 横坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(45,' + (height+27) + ')')
        .call(xAxis)
        // 增加坐标值说明
        .append('text')
        .text('时间')
        .attr('transform', 'translate(' + width +', 38)');

        // 纵坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(45,27)')
        .call(yAxis)
        .append('text')
        .text('CPU %')
        .attr('transform', 'translate(20, -10)');

        // 横线
        grid.data(x.ticks(6));
        grid.append("line")
        .attr("class","gridline")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", height).attr('transform', 'translate(45,27)');
        // 竖线
        grid.data(y.ticks(5));
        grid.append("line")
        .attr("class","gridline")
        .attr("y1", y)
        .attr("y2", y)
        .attr("x1", 0)
        .attr("x2", width).attr('transform', 'translate(45,27)');
    }

    cpu3(){
        var margin = {top: 40, right:40, bottom: 40, left: 20};
        var width = 1000- margin.left - margin.right;
        var height = 360- margin.top - margin.bottom;
        var container = d3.select('#cpuwaveSvg');
        var svg = container.select( 'svg' )
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var data2 = [
            {x: 0, y: 3},
            {x: 1, y: 4.2},
            {x: 2, y: 4.8},
            {x: 3, y: 3.8},
            {x: 4, y: 5.7},
            {x: 5, y: 6},
            {x: 6, y: 8}
        ];

        var xAxis = d3.axisBottom(x)
        .ticks(6);
        var yAxis = d3.axisLeft(y)
        .ticks(5);

        var line = d3.line()
        .defined(function(d) { return d; })
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); })
        .curve(d3.curveLinear);

        var area = d3.area()
        .defined(line.defined())
        .x(line.x())
        .y1(line.y())
        .y0(y(0));//360

        x.domain( [ 0, 6]);
        y.domain( [ 0, 10]);

        svg.append("path")
        .attr( 'class', 'lineChart--area' )
        .attr('transform', 'translate(45,27)')
        .attr("d", area(data2));

        var path = svg.append('path')
        .attr('class', 'line')
        .attr( 'class', 'lineChart--areaLine' )
        .attr('transform', 'translate(45,27)')
        .attr('d', line(data2));

        var grid = svg.selectAll(".grid")
        .data(x.ticks(6))
        .enter().append("g")
        .attr("class", "grid");

        // 横坐标
        // 横坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(45,' + (height+27) + ')')
        .call(xAxis)
        // 增加坐标值说明
        .append('text')
        .text('时间')
        .attr('transform', 'translate(' + width +', 38)');

        // 纵坐标
        svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(45,27)')
        .call(yAxis)
        .append('text')
        .text('CPU %')
        .attr('transform', 'translate(20, -10)');

        // 横线
        grid.data(x.ticks(6));
        grid.append("line")
        .attr("class","gridline")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", height).attr('transform', 'translate(45,27)');
        // 竖线
        grid.data(y.ticks(5));
        grid.append("line")
        .attr("class","gridline")
        .attr("y1", y)
        .attr("y2", y)
        .attr("x1", 0)
        .attr("x2", width).attr('transform', 'translate(45,27)');
    }
}
