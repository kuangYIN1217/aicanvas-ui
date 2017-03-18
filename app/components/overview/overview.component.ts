import { Component } from '@angular/core';
import { ResourcesService } from '../../common/services/resources.service'

import { CpuInfo } from "../../common/defs/resources";
import { JobInfo } from "../../common/defs/resources";
declare var $:any;
import * as d3 from 'd3';
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

        setTimeout (() => {
            //console.log("Hello from setTimeout");
            this.originPics();
        }, 200);
    }

    changeTab(tabIndex: number){
        this.tabIndex = tabIndex;
    }

    originPics(){
        // 饼图的参数
        var svg=d3.selectAll("#drawPie").append("svg");
        var dataset=[ ["空间",50] , ["名称B",25] , ["名称C",15] , ["名称D",15]];
        this.originpix(svg,dataset);
        // 柱状图
        this.bar();
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
        var color= d3.scaleOrdinal(d3.schemeCategory20);
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
        //添加弧内的文字
        arcs.append("text")
        .attr("transform",function(d){
            var x=arc.centroid(d)[0]*1.4;//文字的x坐标
            var y=arc.centroid(d)[1]*1.4;
            return "translate("+x+","+y+")";
        })
        .attr("text-anchor","middle")
        .text(function(d){
            //计算市场份额的百分比
            var percent=Number(d.value)/d3.sum(dataset,function(d){
                return d[1];
            })*100;
            //保留一位小数点 末尾加一个百分号返回
            return percent.toFixed(1)+"%";
        });

        var width1=140;
        var height1=140;
        var s=d3.selectAll("#proportion")
        .append("div")
        .attr("width",140)
        .attr("height",140)
        .style("position","relative")
        .style("float","left")
        .style("display","inline-block");

        //添加对应数目的组
        var tt=s.selectAll("div")
        .data(piedata)
        .enter()
        .append("div")
        .attr("width",100)
        .attr("height",35) ;

        var circle=tt.append("div")
        .attr("width","7.5")
        .attr("height","7.5")
        .style("border-radius","50%")

        .attr("fill",function(d,i){
            return color(i);  //颜色
        }) ;
        tt.append("text")
        .style("font-family","Microsoft YaHei")
        .style("font-size","18")
        .style("color","#e0e0e0")
        .style("margin-left","10px")
        .style("padding-top","30px")
        .text(function(d){
            return d.data[0];
        });
        tt.append("text")
        .style("font-family","Microsoft YaHei")
        .style("font-size","18")
        .style("color","#e0e0e0")
        .style("margin-left","20px")
        .style("margin-top","20px")
        .attr("text-anchor","middle")
        .text(function(d){
            //百分比
            var percent=Number(d.value)/d3.sum(dataset,function(d){
                return d[1];
            })*100;
            //保留一位小数点 末尾加一个百分号返回
            return percent.toFixed(1)+"%";
        });

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

        // 定义x轴的比例尺(序数比例尺)
        var xScale = d3.scaleOrdinal()
        .domain(dataset.x)
        .range([0, width - padding.left - padding.right],0,0);
        // 定义y轴的比例尺(线性比例尺)
        var yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - padding.top - padding.bottom, 0]);
        // 定义x轴和y轴
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale)
        .ticks(5);

        //添加x轴
        svg.append("g")
        .attr("class","axis")
        .attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .attr("fill","white")

        .call(xAxis);

        //添加y轴
        svg.append("g")
        .attr("class","axis")
        .attr("transform","translate(" + padding.left + "," + padding.top + ")")
        .attr("fill","white")
        .call(yAxis);
        var o = d3.scaleOrdinal()
        .domain([0, 1, 2])
        .rangeRound([0, 100], 0.4, 0.1);


        //定义纵轴网格线
        var yInner = d3.axisLeft(yScale)
        .ticks(5);
        // .tickSize(-(width-padding.left-padding.right),10,0)
        // .tickFormat("");
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
        .attr('width', xScale.rangeBand() - 2*rectMargin)
        .attr('height', function(d, i) {
            return height - padding.top - padding.bottom - yScale(d);
        })
        .attr("fill","url(#" + linearGradient.attr("id") + ")")
        ;
    }

}
