function init() {
            var $ = go.GraphObject.make;  // 简洁定义模板
            myDiagram =
                $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
                    {
                        initialContentAlignment: go.Spot.Center,
                        allowDrop: true,  // must be true to accept drops from the Palette
                        "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
                        "LinkRelinked": showLinkLabel,
                        "animationManager.duration": 800, // slightly longer than default (600ms) animation
                        "undoManager.isEnabled": true  // enable undo & redo
                    });
            //当文档被修改,添加一个“*”标题,使“保存”按钮
            myDiagram.addDiagramListener("Modified", function(e) {
                var button = document.getElementById("SaveButton");
                if (button) button.disabled = !myDiagram.isModified;
                var idx = document.title.indexOf("*");
                if (myDiagram.isModified) {
                    if (idx < 0) document.title += "*";
                } else {
                    if (idx >= 0) document.title = document.title.substr(0, idx);
                }
            });

            function getLayers() {
                var str = document.getElementById("testJson").value;
                var test = JSON.parse(str);
                var arr = "";
                var sep = "";
                var array = new Array();
                for (var i = 0;i<test['layers'].length;i++){
                    if (arr == "")
                        sep = "";
                    else
                        sep = ",";
                    arr = '{ "text": "' + test['layers'][i].id + '" }';
                    arr = JSON.parse(arr);
                    array[i] = arr;
                }
//                for (var i = 0;i<test['layers'].length;i++){
//                    array[i] = test['layers'][i].id;
//                }

                return array;
            }
            var idArr = getLayers();
            console.log(idArr);
            // 辅助节点模板的定义
            function nodeStyle() {
                return [
                    // The Node.location comes from the "loc" property of the node data,
                    // converted by the Point.parse static method.
                    // If the Node.location is changed, it updates the "loc" property of the node data,
                    // converting back using the Point.stringify static method.
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    {
                        // the Node.location is at the center of each node
                        locationSpot: go.Spot.Center,
                        //isShadowed: true,
                        //shadowColor: "#888",
                        // 鼠标移到上方或离开显示四点
                        mouseEnter: function (e, obj) { showPorts(obj.part, true); },
                        mouseLeave: function (e, obj) { showPorts(obj.part, false); }
                    }
                ];
            }
            // Define a function for creating a "port" that is normally transparent.
            // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
            // and where the port is positioned on the node, and the boolean "output" and "input" arguments
            // control whether the user can draw links from or to the port.
            // 绘制图形四角的圆点
            function makePort(name, spot, output, input) {
                // the port is basically just a small circle that has a white stroke when it is made visible
                return $(go.Shape, "Circle",
                    {
                        fill: "transparent",
                        stroke: null,  // this is changed to "white" in the showPorts function
                        desiredSize: new go.Size(8, 8),
                        alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                        portId: name,  // declare this object to be a "port"
                        fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                        fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                        cursor: "pointer"  // show a different cursor to indicate potential link point
                    });
            }
            // 为普通节点定义节点模板
            myDiagram.nodeTemplateMap.add("",  // the default category
                $(go.Node, "Spot", nodeStyle(),
                    // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                    $(go.Panel, "Auto",
                        $(go.Shape, "Rectangle",
                            { minSize: new go.Size(160, 70), fill: "#18191B", stroke: "#424344" },
                            new go.Binding("figure", "figure")),
                        $(go.TextBlock,
                            {
                                font: "bold 11pt Helvetica, Arial, sans-serif",
                                stroke: "white",
                                margin: 20,
                                maxSize: new go.Size(160, NaN),
                                wrap: go.TextBlock.WrapFit,
                                editable: true
                            },
                            new go.Binding("text").makeTwoWay()
                        )
                    ),
                    // 节点周围四点
                    makePort("T", go.Spot.Top, false, true),
                    makePort("L", go.Spot.Left, true, true),
                    makePort("R", go.Spot.Right, true, true),
                    makePort("B", go.Spot.Bottom, true, false),
                    {click: function(e, Node) {
                        var str = document.getElementById("testJson").value;
                        var test = JSON.parse(str);
                        var layerId = Node.toString().split("(")[1].split(")")[0].split("_")[0];
//                        document.getElementById("test").innerHTML = Node.toString().split("(")[1].split(")")[0];
                        document.getElementById("property").innerHTML = "";
                        for (var i = 0;i<test["layers"].length;i++){
                            if (layerId == test["layers"][i].id){
                                for (var j=0; j<test["layers"][i].layer_params.length; j++) {
                                    // document.getElementById("property").innerHTML = document.getElementById("property").innerHTML + test["layers"][i].layer_params[j].name + "(" + test["layers"][i].layer_params[j].translation + ")"
                                    //     + "：<input type='text'" + "id='" + test["layers"][i].layer_params[j].name + "%" + test["layers"][i].layer_params[j].name + "' name='" + test["layers"][i].name + "%" + test["layers"][i].layer_params[j].name + "' style='width: 160px'" + "placeholder='" + test["layers"][i].layer_params[j].default_value + "'/>";
                                    //<div class="layer_param">
                                    document.getElementById("property").innerHTML = document.getElementById("property").innerHTML + '<div style="margin-bottom: 15px;"><div style="font-size: 20px;margin-bottom: 5px;">'+ test["layers"][i].layer_params[j].name +'</div><input type="text" style="background: transparent;border: 0px;border-bottom: 1px solid grey;height: 35px;width: 100%;color: white;outline-style: none;" id="' +
                                        test["layers"][i].layer_params[j].name + "%" + test["layers"][i].layer_params[j].name + '" name="' + test["layers"][i].name + "%" + test["layers"][i].layer_params[j].name + '" placeholder="' + test["layers"][i].layer_params[j].default_value + '"/></div>';
                                }
                            }else {
                                continue;
                            }
                        }
//                        document.getElementById("test").innerHTML = Node.toString().split("(")[1].split(")")[0];
                        console.log("执行成功");
//                        console.log(test["layers"][0].layer_params[0].name);
                    }
                    }
                ));
//    myDiagram.nodeTemplateMap.add("Start",
//      $(go.Node, "Spot", nodeStyle(),
//        $(go.Panel, "Auto",
//          $(go.Shape, "Circle",
//            { minSize: new go.Size(40, 40), fill: "#79C900", stroke: null }),
//          $(go.TextBlock, "Start",
//            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
//            new go.Binding("text"))
//        ),
//        // three named ports, one on each side except the top, all output only:
//        makePort("L", go.Spot.Left, true, false),
//        makePort("R", go.Spot.Right, true, false),
//        makePort("B", go.Spot.Bottom, true, false)
//      ));
//    myDiagram.nodeTemplateMap.add("End",
//      $(go.Node, "Spot", nodeStyle(),
//        $(go.Panel, "Auto",
//          $(go.Shape, "Circle",
//            { minSize: new go.Size(40, 40), fill: "#DC3C00", stroke: null }),
//          $(go.TextBlock, "End",
//            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
//            new go.Binding("text"))
//        ),
//        // three named ports, one on each side except the bottom, all input only:
//        makePort("T", go.Spot.Top, false, true),
//        makePort("L", go.Spot.Left, false, true),
//        makePort("R", go.Spot.Right, false, true)
//      ));
//    myDiagram.nodeTemplateMap.add("Comment",
//      $(go.Node, "Auto", nodeStyle(),
//        $(go.Shape, "File",
//          { fill: "#EFFAB4", stroke: null }),
//        $(go.TextBlock,
//          {
//            margin: 5,
//            maxSize: new go.Size(200, NaN),
//            wrap: go.TextBlock.WrapFit,
//            textAlign: "center",
//            editable: true,
//            font: "bold 12pt Helvetica, Arial, sans-serif",
//            stroke: '#454545'
//          },
//          new go.Binding("text").makeTwoWay())
//        // no ports, because no links are allowed to connect with a comment
//      ));
            // replace the default Link template in the linkTemplateMap
            //连接线模板
            myDiagram.linkTemplate =
                $(go.Link,  // the whole link panel
                    {
                        routing: go.Link.AvoidsNodes,
                        curve: go.Link.JumpOver,
                        corner: 5, toShortLength: 4,
                        relinkableFrom: true,
                        relinkableTo: true,
                        reshapable: true,
                        resegmentable: true,
                        // mouse-overs subtly highlight links:
                        mouseEnter: function(e, link) {
                            // link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
                            link.findObject("HIGHLIGHT").stroke = "rgba(30,39,131,0.2)";
                        },
                        mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
                    },
                    new go.Binding("points").makeTwoWay(),
                    $(go.Shape,  // the highlight shape, normally transparent
                        { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
                    $(go.Shape,  // the link path shape
                        { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
                    $(go.Shape,  // the arrowhead
                        { toArrow: "standard", stroke: null, fill: "gray"}),
                    $(go.Panel, "Auto",  // the link label, normally not visible
                        { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
                        new go.Binding("visible", "visible").makeTwoWay(),
                        $(go.Shape, "RoundedRectangle",  // the label shape
                            { fill: "#F8F8F8", stroke: null }),
                        $(go.TextBlock, "Yes",  // the label
                            {
                                textAlign: "center",
                                font: "10pt helvetica, arial, sans-serif",
                                stroke: "#333333",
                                editable: true
                            },
                            new go.Binding("text").makeTwoWay())
                    )
                );
            // Make link labels visible if coming out of a "conditional" node.
            // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
            function showLinkLabel(e) {
                var label = e.subject.findObject("LABEL");
                if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
            }
            // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
            myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
            myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
            load();  // load an initial diagram from some JSON text
            //初始化面板左边界面
            myPalette =
                $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
                    {
                        "animationManager.duration": 800, // slightly longer than default (600ms) animation
                        nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
                        model: new go.GraphLinksModel(idArr)
                    });
            // 下面的代码覆盖GoJS阻止浏览器滚动
            // the page when either the Diagram or Palette are clicked or dragged onto.
            function customFocus() {
                var x = window.scrollX || window.pageXOffset;
                var y = window.scrollY || window.pageYOffset;
                go.Diagram.prototype.doFocus.call(this);
                window.scrollTo(x, y);
            }
            myDiagram.doFocus = customFocus;
            myPalette.doFocus = customFocus;
        } // end init

        // 鼠标在图形上方显示四角的圆点
        function showPorts(node, show) {
            var diagram = node.diagram;
            if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
            node.ports.each(function(port) {
                port.stroke = (show ? "white" : null);
            });
        }

        // 保存编辑的流程图
        function save() {
            document.getElementById("mySavedModel").value = myDiagram.model.toJson();
            myDiagram.isModified = false;
        }

        // 保存编辑的属性参数
        function saveParam() {
            var test = document.getElementById("property").getElementsByTagName("input");
            var str = "";
            var sep;
            for(var i = 0; i < test.length; i++) {
                if (str == ""){
                    sep = "";
                }else {
                    sep = ",";
                }
                str = str + sep + "'" + test[i].name + "'" + ":" + test[i].value;
            }
            str = "{" + str + "}";
            console.log(str);
        }

        //重新显示保存的流程图
        function load() {
            myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
        }
