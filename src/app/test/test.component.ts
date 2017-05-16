import { Component, OnInit } from '@angular/core';
import {AmChartsService} from "amcharts3-angular2";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  t: any;

  private timer: any;
  private chart: any;

  constructor(private AmCharts: AmChartsService) {}

  makeRandomDataProvider() {
    var dataProvider = [];

    // Generate random data
    for (var year = 1950; year <= 1960; ++year) {
      dataProvider.push({
        lineColor:"#000",
        year1: "" + year,
        value: Math.floor(Math.random() * 100)
      });
    }

    return dataProvider;
  }

  makeRandomDataProvider1() {
    var dataProvider = [];

    // Generate random data
    for (var year = 1950; year <= 1960; ++year) {
      dataProvider.push({

        year1: "" + year,
        value: Math.floor(Math.random() * 100),
        value1: Math.floor(Math.random() * 100)
      });
    }

    return dataProvider;
  }

  ngOnInit() {
    this.chart = this.AmCharts.makeChart("chartdiv", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 80,
      "dataProvider": this.makeRandomDataProvider(),
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{
        "id":"g1",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 8,
        "lineColor": "#d1655d",
        "fillAlphas":"0.3",
        "lineThickness": 2,
        "negativeLineColor": "#d1655d",
        "type": "smoothedLine",
        "valueField": "value"
      }],
      "chartScrollbar": {
        "graph":"g1",
        "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "dataDateFormat": "YYYY",
      "categoryField": "year1",
      "categoryAxis": {
        "minPeriod": "YYYY",
        "parseDates": true,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true
      }
    });

    this.chart = this.AmCharts.makeChart("chartdiv1", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 80,
      "dataProvider": this.makeRandomDataProvider1(),
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{

        "id":"g2",
        // "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        // "bullet": "round",
        // "bulletSize": 0,
        "lineColor": "#000",
        // "lineColorField":"lineColor",
        // "fillColorsField":"lineColor",
        "fillAlphas":"0.3",
        "lineThickness": 1,
        "type": "smoothedLine",
        "valueField": "value"
      },
  ],
      "chartScrollbar": {
        "graph":"g2",
        "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1
      },
      "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "dataDateFormat": "YYYY",
      "categoryField": "year1",
      "categoryAxis": {
        "minPeriod": "YYYY",
        "parseDates": true,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
      },
      "export": {
        "enabled": true
      }
    });

    // Updates the chart every 3 seconds
    // this.timer = setInterval(() => {
    //   // This must be called when making any changes to the chart
    //   this.AmCharts.updateChart(this.chart, () => {
    //     this.chart.dataProvider = this.makeRandomDataProvider();
    //   });
    // }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    this.AmCharts.destroyChart(this.chart);
  }


}
