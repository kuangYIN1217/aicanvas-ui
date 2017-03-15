import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../common/services/resources.service'
import { PluginInfo } from "../../common/defs/resources";
import { Parameter, TrainingNetwork } from "../../common/defs/parameter";
declare var $:any;
declare var jsPlumb:any;
@Component({
  moduleId: module.id,
  selector: 'algplugins',
  styleUrls: ['./css/algplugins.component.css'],
  templateUrl: './templates/algplugins.html',
  providers: [ResourcesService],
})
export class AlgPluginsComponent{
    // store data of Plugins
    plugins: PluginInfo[] = [];
    // store the plugin now shoing
    plugin_current: PluginInfo = new PluginInfo();
    param_list_current: Parameter[] = [];
    editable_param_list_current: Parameter[] = [];
    // param_list_current: any;
    // editable_param_list_current: any;
    training_network_current: TrainingNetwork = new TrainingNetwork();
    // show one of two different table
    showSystemPlugin: number = 1;
    // show detail
    ifshowDetail = 0;
    // detail choose
    detailDivChoose = 0;

    constructor(private resourcesService: ResourcesService) {
    resourcesService.getPlugins()
        .subscribe(plugins => this.plugins = plugins);
    }

    sysTemplateClick(){
        this.showSystemPlugin = 1;
    }

    selfTemplateClick(){
        this.showSystemPlugin = 0;
    }

    getLayers(){
        let defaultvw: number = 2;
        let i: number = 1;
        for (let layer of this.training_network_current.layers) {
            document.getElementById("left").innerHTML = document.getElementById("left").innerHTML + "<div class='node' id='node" + i + "' style='top:" +defaultvw +"vw'>"+layer.name+"</div>";
            defaultvw += 5;
            i++;
        }
    }

    showDetail(index: number){
        this.ifshowDetail = 1;
        this.detailDivChoose = 1;

        this.plugin_current = this.plugins[index];
        for (let param of this.plugin_current.editable_param_list){
            param.set_value = param.default_value;
        }
        this.editable_param_list_current = this.plugin_current.editable_param_list;
        this.training_network_current = this.plugin_current.training_network;
        // prase type 'ENUM' to Array, prase type 'LIST'
        let originList = this.editable_param_list_current;
        // let resultList = this.editable_param_list_current;

        // get layers of plugin
        this.getLayers();
        function save() {
            var connects = [];
            $.each(jsPlumb.getAllConnections(), function (idx, connection) {
                var cont = connection.getLabel();
                connects.push({
                    ConnectionId: connection.id,
                    PageSourceId: connection.sourceId,
                    PageTargetId: connection.targetId,
                    SourceText: connection.source.innerText,
                    TargetText: connection.target.innerText,
                    SourceAnchor: connection.endpoints[0].anchor.type,
                    TargetAnchor: connection.endpoints[1].anchor.type,
                    ConnectText: $(cont).html()
                });
            });
            var blocks = [];
            $("#right .node").each(function (idx, elem) {
                var $elem = $(elem);
                blocks.push({
                    BlockId: $elem.attr('id'),
                    BlockContent: $elem.html(),
                    BlockX: parseInt($elem.css("left"), 10),
                    BlockY: parseInt($elem.css("top"), 10)
                });
            });

            var serliza = JSON.stringify(connects) + "&" + JSON.stringify(blocks);
            $.ajax({
                type: "post",
                url: "ajax.aspx",
                data: { id: serliza },
                success: function (filePath) {
                    window.open("show-flowChart.aspx?path=" + filePath);
                }
            });
        }
        var test = new Array();
        test = this.training_network_current.layers;
        function singleclick(id) {
            $(id).click(function () {
                for (var i = 0;i < test.length; i++) {
                    if (("#"+test[i].name +"_"+ "1") == id){
                        for (var j=0; j<test[i].layer_params.length; j++){
                            document.getElementById("property1").innerHTML = document.getElementById("property1").innerHTML + "属性" + test[i].layer_params[j].name + "：<input type='text'" + "name='property1' class='property1' />";
                        }
                    }else {
                        // console.log(id+"-=-=-=-=-=-"+test[i].name);
                        break;
                    }
                }
            });
        }

        function doubleclick(id) {
            $(id).dblclick(function () {
                var text = $(this).text();
                $(this).html("");
                $(this).append("<input type='text' value='" + text + "' />");
                $(this).mouseleave(function () {
                    $(this).html($("input[type='text']").val());
                });
            });
        }
        function init(){
            var i = 0,j = 0,k = 0,l = 0;
            $(function () {
                $("#left").children().draggable({
                    helper: "clone",
                    scope: "ss",
                });
                $("#right").droppable({
                    scope: "ss",
                    drop: function (event, ui) {
                        var left = parseInt(ui.offset.left - $(this).offset().left);
                        var top = parseInt(ui.offset.top - $(this).offset().top);
                        var id = ui.draggable[0].id;
                        var name = ui.draggable[0].id;
                        // // var test = $(this);
                        // switch (name) {
                        //     case "node1":
                        //         i++;
                        //         var id = "state_start_" + i;
                        //         $(this).append('<div class="node" style="border-radius: 25em;font-size:2px"  id="' + id + '" >' + '</div>');
                        //         $("#"+id).html(""+id) ;
                        //
                        //         $("#" + id).css("left", left).css("top", top);
                        //         jsPlumb.addEndpoint(id, { anchors: "TopCenter" }, hollowCircle);
                        //         //jsPlumb.addEndpoint(id, { anchors: "RightMiddle" }, hollowCircle);
                        //         jsPlumb.addEndpoint(id, { anchors: "BottomCenter" }, hollowCircle);
                        //         //jsPlumb.addEndpoint(id, { anchors: "LeftMiddle" }, hollowCircle);
                        //         jsPlumb.draggable(id);
                        //         $("#" + id).draggable({ containment: "parent" });
                        //         //doubleclick("#" + id);
                        //         singleclick("#" + id);
                        //         break;
                        //     case "node2":
                                j++;
                                id = id +"_"+ j;
                                $(this).append("<div class='node' style='font-size:2px' id='" + id + "'>"  + "</div>");
                                $("#"+id).html(""+name);
                                $("#" + id).css("left", left).css("top", top);
                                jsPlumb.addEndpoint(id, { anchors: "TopCenter" }, hollowCircle);
                                //jsPlumb.addEndpoint(id, { anchors: "RightMiddle" }, hollowCircle);
                                jsPlumb.addEndpoint(id, { anchors: "BottomCenter" }, hollowCircle);
                                //jsPlumb.addEndpoint(id, { anchors: "LeftMiddle" }, hollowCircle);
                                jsPlumb.addEndpoint(id, hollowCircle);
                                jsPlumb.draggable(id);
                                $("#" + id).draggable({ containment: "parent" });
                                //doubleclick("#" + id);
                                singleclick("#" + id);
                        //         break;
                        //     case "node3":
                        //         k++;
                        //         id = "state_decide_" + k;
                        //         //$(this).append("<div class='node' id='" + id + "'>" + $(ui.helper).html() + "</div>");
                        //         $(this).append("<div class='node' style='font-size:2px' id='" + id + "'>"  + "</div>");
                        //         $("#"+id).html(""+id);
                        //         $("#" + id).css("left", left).css("top", top);
                        //         jsPlumb.addEndpoint(id, { anchors: "TopCenter" }, hollowCircle);
                        //         //jsPlumb.addEndpoint(id, { anchors: "RightMiddle" }, hollowCircle);
                        //         jsPlumb.addEndpoint(id, { anchors: "BottomCenter" }, hollowCircle);
                        //         //jsPlumb.addEndpoint(id, { anchors: "LeftMiddle" }, hollowCircle);
                        //         jsPlumb.addEndpoint(id, hollowCircle);
                        //         jsPlumb.draggable(id);
                        //         $("#" + id).draggable({ containment: "parent" });
                        //         //doubleclick("#" + id);
                        //         singleclick("#" + id);
                        //         break;
                        //     case "node4":
                        //         l++;
                        //         id = "state_end_" + l;
                        //         //$(this).append('<div class="node" style="border-radius: 25em"  id="' + id + '" >' + $(ui.helper).html() + '</div>');
                        //         $(this).append("<div class='node' style='border-radius: 25em;font-size:2px' id='" + id + "'>"  + "</div>");
                        //         $("#"+id).html(""+id);
                        //         $("#" + id).css("left", left).css("top", top);
                        //         jsPlumb.addEndpoint(id, { anchors: "TopCenter" }, hollowCircle);
                        //         //jsPlumb.addEndpoint(id, { anchors: "RightMiddle" }, hollowCircle);
                        //         jsPlumb.addEndpoint(id, { anchors: "BottomCenter" }, hollowCircle);
                        //         //jsPlumb.addEndpoint(id, { anchors: "LeftMiddle" }, hollowCircle);
                        //         jsPlumb.draggable(id);
                        //         $("#" + id).draggable({ containment: "parent" });
                        //         //doubleclick("#" + id);
                        //         singleclick("#" + id);
                        //         break;
                        // }
                    }
                });
                $("#right").on("mouseenter", ".node", function () {
                    $(this).append('<img src="images/algplugin/close2.png"  style="position: absolute;" />');
                    if ($(this).text() == "开始" || $(this).text() == "结束") {
                        $("img").css("left", 78).css("top", 0);
                    } else {
                        $("img").css("left", 78).css("top", -10);
                    }
                });
                $("#right").on("mouseleave", ".node", function () {
                    $("img").remove();
                });
                $("#right").on("click", "img", function () {
                    if (confirm("确定要删除吗?")) {
                        jsPlumb.removeAllEndpoints($(this).parent().attr("id"));
                        $(this).parent().remove();

                    }
                });
                jsPlumb.bind("connection", function (connInfo, originalEvent) {
                    connInfo.connection.setLabel("");
                });
                var _time = null;
                jsPlumb.bind("click", function (conn, originalEvent) {
                    clearTimeout(_time);
                    var str = conn.getLabel();
                    if (str == null) {
                        conn.setLabel("<input type='text' value=' ' />");
                    } else {
                        conn.setLabel("<input type='text' value='" + $(str).text() + "' />");
                    }
                    $("input[type='text']").mouseleave(function () {
                        if ($(this).val().trim() == "") {
                            conn.setLabel("");
                        } else {
                            conn.setLabel("<span style='display:block;padding:10px;opacity: 0.5;height:auto;background-color:white;border:1px solid #346789;text-align:center;font-size:12px;color:black;border-radius:0.5em;'>" + $(this).val() + "</span>");
                        }
                    });
                });

                jsPlumb.bind("dblclick", function (conn, originalEvent) {
                    clearTimeout(_time);
                    _time = setTimeout(function () {
                        if (confirm("确定删除吗？ "))
                            jsPlumb.detach(conn);
                    }, 300);

                });
                jsPlumb.bind("singleclick", function (conn, originalEvent) {
                    clearTimeout(_time);
                    _time = setTimeout(function () {
                        // if (confirm("确定删除吗？ "))
                            jsPlumb.detach(conn);
                    }, 300);

                });
                //基本连接线样式
                var connectorPaintStyle = {
                    lineWidth: 4,
                    strokeStyle: "#61B7CF",
                    joinstyle: "round",
                    outlineColor: "white",
                    outlineWidth: 2
                };
                // 鼠标悬浮在连接线上的样式
                var connectorHoverStyle = {
                    lineWidth: 4,
                    strokeStyle: "#216477",
                    outlineWidth: 2,
                    outlineColor: "white"
                };
                // var endpointHoverStyle = {
                //     fillStyle: "#216477",
                //     strokeStyle: "#216477"
                // };
                //空心圆端点样式设置
                var hollowCircle = {
                    endpoint: ["Dot", { radius: 4}],  //端点的形状
                    ConnectorStyle: connectorPaintStyle,//连接线的颜色，大小样式
                    ConnectorHoverStyle: connectorHoverStyle,
                    PaintStyle: {
                        strokeStyle: "#1e8151",
                        fillStyle: "transparent",
                        radius: 2,
                        lineWidth: 2
                    },    //端点的颜色样式
                    //anchor: "AutoDefault",
                    isSource: true, //是否可以拖动（作为连线起点）
                    connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
                    isTarget: true, //是否可以放置（连线终点）
                    maxConnections: -1, // 设置连接点最多可以连接几条线
                    connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }]]
                };
                //实心圆样式
                // var solidCircle = {
                //     endpoint: ["Dot", { radius: 4 }],  //端点的形状
                //     PaintStyle: { fillStyle: "rgb(122, 00, 00)" }, //端点的颜色样式
                //     connectorStyle: { strokeStyle: "rgb(97, 183, 207)", lineWidth: 4 },   //连接线的颜色，大小样式
                //     isSource: true, //是否可以拖动（作为连线起点）
                //     connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }], //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
                //     isTarget: true,   //是否可以放置（连线终点）
                //     //anchor: "AutoDefault",
                //     maxConnections: 3,  // 设置连接点最多可以连接几条线
                //     connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }]]
                // };

            });
            // //右折线
            //     var rightConnector = {
            //       connector: "Flowchart",
            //       anchors: ["RightMiddle", "LeftMiddle"],
            //       paintStyle: { lineWidth: 1, strokeStyle: "#000000" },
            //       overlays: [["Arrow", { width: 10, length: 10, location: 1 }]],
            //       endpoint: ["Dot", { radius: 1 }]
            //     };
            //     //右直线
            //     var rightStraightConnector = {
            //       connector: "Straight",
            //       anchors: ["RightMiddle", "LeftMiddle"],
            //       paintStyle: { lineWidth: 1, strokeStyle: "#000000" },
            //       overlays: [["Arrow", { width: 10, length: 10, location: 1 }]],
            //       endpoint: ["Dot", { radius: 1 }]
            //     };

            //     //上折线
            //     var upConnector = {
            //       connector: "Flowchart",
            //       anchors: ["TopCenter", "BottomCenter"],
            //       paintStyle: { lineWidth: 1, strokeStyle: "#000000" },
            //       overlays: [["Arrow", { width: 10, length: 10, location: 1 }]],
            //       endpoint: ["Dot", { radius: 1 }]
            //     };

            //     var downConnector = {
            //       connector: "Flowchart",
            //       anchors: ["BottomCenter", "TopCenter"],
            //       paintStyle: { lineWidth: 1, strokeStyle: "#000000" },
            //       //paintStyle: { lineWidth: 2, strokeStyle: "#61b7cf", joinstyle: "round", outlineColor: "white", outlineWidth: 2 },
            //       overlays: [["Arrow", { width: 10, length: 10, location: 1 }]],
            //       endpoint: ["Dot", { radius: 1 }]
            //     };

            //     var flowConnector = {
            //       connector: "Flowchart",
            //       //anchors: ["BottomCenter", "TopCenter"],
            //       paintStyle: { lineWidth: 2, strokeStyle: "#61B7CF", fillStyle: "transparent" },
            //       //paintStyle: { lineWidth: 2, strokeStyle: "#61b7cf", joinstyle: "round", outlineColor: "white", outlineWidth: 2 },
            //       overlays: [["Arrow", { width: 10, length: 10, location: 1 }]],
            //       endpoint: ["Dot", { radius: 1 }]
            //     };
            //     jsPlumb.ready(function () {
            //       //jsPlumb.draggable($(".node"));
            //     });

            // function autoAlign() {
            //   var top = 10;
            //   $(".node").each(function () {
            //     $(this).css("top", top);
            //     top += $(this).height() + 60;
            //   });
            // }
            //
            // function autoAlignDown() {
            //   var arrLevel = new Array();
            //   var i = 0;
            //   $(".node").each(function () {
            //    var id = $(this).attr("id");
            //    var targetNodes = $(this).attr("targetNodes").split(',');
            //    for (var j = 0; j < targetNodes.length; j++) {
            //      arrLevel[targetNodes] = arrLevel[id] + 1;
            //    }
            //
            //    arr[i] = [$(this), "", ""];
            //    i++;
            //    $(this).css("top", top);
            //    top += $(this).height() + 60;
            //   });
            // }
        }
        init();
        // console.log(this.training_network_current.layers[0].name);
        this.training_network_current.layers = test;
        this.plugin_current.training_network = this.training_network_current;
    }

    isArray(object: string){
        return (object.indexOf('[')!=-1);
    }

    detailDivChooseClick(detailDivChoose: number){
        this.detailDivChoose = detailDivChoose;
    }

    backToModalDiv(){
        this.ifshowDetail =0;
        this.detailDivChoose = 0;
    }

    fork(){
        // set value of new Plugin, copy the unchanged data at the same time.
        this.plugin_current.editable_param_list = this.editable_param_list_current;
        this.plugin_current.training_network = this.training_network_current;

        // store
        // onwer id of the plugin
        let userId = 1;
        // plugin_id
        let pluginId = this.plugin_current.plugin_id;
        // plugin meta
        let pluginMeta = this.plugin_current;
        this.resourcesService.createPluginFrom(pluginId, userId);
        this.resourcesService.savePlugin(pluginMeta);

        // // chain_id
        // let chainId = 1;
        // // chain meta
        // let chainMeta = 1;
        // this.resourcesService.createChainFrom(chainId, userId);
        // this.resourcesService.saveChain(chainMeta);
    }

    test(x:any){
        //console.log(this.editable_param_list_current[x].set_value);
        //console.log(this.plugin_current.editable_param_list[x].set_value);
    }
    setValue(parameter: Parameter,value: string){
        if (parameter.type=='STRING'){
            parameter.set_value = value;
        }else if(parameter.type=='BOOL'){
            // 当作string
            parameter.set_value = value;
        }else if(parameter.type=='INT'||parameter.type=='FLOAT'){
            if (Number(value)+""==NaN+""){
                alert('输入必须为数值!');
            }else{
                let condition: number = 1;
                if(parameter.has_min){
                    if(+value<parameter.min_value){
                        condition = -1;
                        alert("Can't lower than min_value:"+parameter.min_value+"!  Back to default...");
                    }
                }
                if(parameter.has_max){
                    if(+value>parameter.max_value){
                        condition = -2;
                        alert("Can't higher than max_value:"+parameter.max_value+"!  Back to default...");
                    }
                }
                if(condition==1){
                    parameter.set_value = +value;
                }else{
                    parameter.set_value = parameter.default_value;
                }
            }
        }
    }
    set2dArray(parameter: Parameter,i1: number,j1: number,value: string){
        if ((parameter.d_type=='INT'||parameter.d_type=='FLOAT')&&Number(value)+""==NaN+""){
            alert('输入必须为数值!');
        }else{
            parameter.set_value[i1][j1] = Number(value);
        }
    }
    set3dArray(parameter: Parameter,i1: number,j1: number,z1: number,value: string){
        if ((parameter.d_type=='INT'||parameter.d_type=='FLOAT')&&Number(value)+""==NaN+""){
            alert('输入必须为数值!');
        }else{
            parameter.set_value[i1][j1][z1] = Number(value);
        }
    }
}
