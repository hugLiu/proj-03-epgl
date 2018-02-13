
var urlType = '0';
var minZoom = 4;
var maxZoom = 17;
var centZoom = 7;
var centX = 87.0636145833334;
var centY = 44.8953563888889;
var format = '.jpg';
var epsgCode = '3857';
var epsg = "EPSG:" + epsgCode;
var pointsStr = '';
var map, view;


var ogis = null;
//目标树数据
var targetsData = null;
//投影目标全局变量
var projectKey = [];

var mapInit = function (maptype) {
    var outputPath = null;
    if (maptype === "terrain") {
        outputPath = gloabal_map_url + "/terrain/";
    } else {
        outputPath = gloabal_map_url + "/satellite/";
    }

    //TODO 改成盆地的两个角，经纬度分秒转换成度
    var extent = [82.19450361111112, 46.70785388888889, 91.93272555555555, 43.082858888888886];
    //var center = ol.extent.getCenter(extent);
    //center = proj4('EPSG:3857', center);
    var p1 = proj4('EPSG:3857', [82.19450361111112, 43.082858888888886]);
    var p2 = proj4('EPSG:3857', [91.93272555555555, 46.70785388888889]);

    // config
    var config = {
        control: {
            //customs: ["ResetZoom"],
            extend: ["ScaleLine", "MousePosition"]
        },
        //group: {
        //    buttons: [
        //{ id: 'ogis_land_target_button', img: '/Content/EPGL/css/shared/ogis/theme/groupbtn.png', text: '地质目标' },
        //{ id: 'ogis_relevant_map_button', text: '相关图件' },
        //{ id: 'ogis_tool_button', text: '工具' }
        //    ],
        //    drops: [
        //        { id: 'ogis_land_target_drop', html: '<div id="ogis_land_target_list"></div>' },
        //        { id: 'ogis_relevant_map_drop', html: '<ul id="ogis_relevant_map_list"></ul>' },
        //        { id: 'ogis_tool_drop', html: '<ul id="ogis_tool_list"></ul>' }
        //    ],
        //    binding: {
        //        ogis_land_target_button: 'ogis_land_target_drop',
        //        ogis_relevant_map_button: 'ogis_relevant_map_drop',
        //        ogis_tool_button: 'ogis_tool_drop'
        //    }
        //},
        contextMenu: {
            menus: [
                {
                    id: 'menu1',
                    menuItems: [
                        { id: 'menu1_1', text: 'menu1_first', click: function (f) { alert(f.data[0].get('title')) } },
                        { id: 'menu1_2', text: 'menu1_second', click: function (f) { alert(f.data[0].get('id')) } },
                        { id: 'menu1_3', text: 'menu1_third', click: function (f) { alert(f.data[0].get('type')) } }
                    ]
                },
                {
                    id: 'menu2',
                    menuItems: [
                        { id: 'menu2_1', text: 'menu2_first', click: function (f) { alert(f.data[0].get('title')) } },
                        { id: 'menu2_2', text: 'menu2_second', click: function (f) { alert(f.data[0].get('id')) } },
                        { id: 'menu2_3', text: 'menu2_third', click: function (f) { alert(f.data[0].get('type')) } }
                    ]
                }
            ],
            binding: {
                point: 'menu1',
                矿权区: 'menu1',
                井位: 'menu2'
            }
        },
        map: {
            baseLayerUrl: outputPath + "{z}/{y}/{x}" + format,
            extent: [p1[0], p1[1], p2[0], p2[1]],
            //center: ol.proj.transform([centX, centY], "EPSG:4326", epsg),
            projection: ol.proj.get(epsg),
            zoom: centZoom,
            minZoom: minZoom,
            maxZoom: maxZoom
        },
        style: {
            layer: {
                盆地: {
                    fillColor: [0, 191, 255, 0.2],
                    stroke: {
                        color: [0, 0, 0, 0.3],
                        width: 1
                    },
                    text: {
                        show: false,
                        size: 20,
                        color: [10, 10, 10, 1]
                    },
                    point: {
                        fillColor: [30, 30, 30, 0.3],
                        strokeColor: [1, 1, 255, 1],
                        radius: 5
                    },
                    showProperties: ["类型", "名称"]
                },
                区带: {
                    fillColor: [28, 120, 92, 0.7],
                    stroke: {
                        color: [0, 0, 0, 0.3],
                        width: 1
                    },
                    text: {
                        show: false,
                        size: 20,
                        color: [28, 180, 80, 1]
                    },
                    point: {
                        fillColor: [30, 30, 30, 0.3],
                        strokeColor: [1, 1, 255, 1],
                        radius: 5
                    },
                    showProperties: ["类型", "名称"]
                },
                油气田: {
                    fillColor: [255, 181, 197, 0.7],
                    stroke: {
                        color: [0, 0, 0, 0.3],
                        width: 1
                    },
                    text: {
                        show: false,
                        size: 20,
                        color: [10, 56, 112, 1]
                    },
                    point: {
                        fillColor: [30, 30, 30, 0.3],
                        strokeColor: [1, 1, 255, 1],
                        radius: 5
                    },
                    showProperties: ["类型", "油气田名称"]
                },
                油藏面积: {//2017-11-20 为了区分油藏、气藏FT
                    fillColor: [255, 0, 0, 0.9],
                    stroke: {
                        color: [0, 0, 0, 0.3],
                        width: 1
                    },
                    text: {
                        show: false,
                        size: 12,
                        color: [0, 0, 0, 1]
                    },
                    point: {
                        fillColor: [30, 30, 30, 0.3],
                        strokeColor: [1, 1, 255, 1],
                        radius: 5
                    },
                    showProperties: ["计算单元", "上报年度", "油气藏类型", "储层岩性", "资源类型", "驱动类型"]
                },
                气藏面积: {//2017-11-20 为了区分油藏、气藏FT
                    fillColor: [255, 0, 0, 0.9],
                    stroke: {
                        color: [0, 0, 0, 0.3],
                        width: 1
                    },
                    text: {
                        show: false,
                        size: 12,
                        color: [0, 0, 0, 1]
                    },
                    point: {
                        fillColor: [30, 30, 30, 0.3],
                        strokeColor: [1, 1, 255, 1],
                        radius: 5
                    },
                    showProperties: ["计算单元", "上报年度", "油气藏类型", "储层岩性", "资源类型", "驱动类型"]
                },
                井: {
                    fillColor: [10, 10, 10, 0.2],
                    stroke: {
                        color: [0, 0, 0, 1],
                        width: 1
                    },
                    text: {
                        showOnResolution: 320,
                        show: false,
                        size: 20,
                        color: [0, 0, 255, 1]
                    },
                    point: {
                        fillColor: [90, 255, 120, 0.8],
                        strokeColor: [0, 0, 255, 1],
                        radius: 4
                    }
                },
                地震工区: {
                    fillColor: [88, 188, 30, 0.7],
                    stroke: {
                        color: [0, 0, 0, 0.3],
                        width: 1
                    },
                    text: {
                        show: false,
                        size: 20,
                        color: [18, 250, 23, 1]
                    },
                    point: {
                        fillColor: [30, 30, 30, 0.3],
                        strokeColor: [1, 1, 255, 1],
                        radius: 5
                    }
                },
                探矿权区: {
                    fillColor: [0, 255, 0, 0.7],
                    stroke: {
                        color: [0, 0, 0, 0.3],
                        width: 1
                    },
                    text: {
                        show: false,
                        size: 20,
                        color: [188, 10, 60, 1]
                    },
                    point: {
                        fillColor: [30, 30, 30, 0.3],
                        strokeColor: [1, 1, 255, 1],
                        radius: 5
                    },
                    showProperties: ["类型", "矿权区名称"]
                },
                采矿权区: {
                    fillColor: [255, 255, 0, 0.7],
                    stroke: {
                        color: [0, 0, 0, 0.3],
                        width: 1
                    },
                    text: {
                        show: false,
                        size: 20,
                        color: [190, 23, 20, 1]
                    },
                    point: {
                        fillColor: [30, 30, 30, 0.3],
                        strokeColor: [1, 1, 255, 1],
                        radius: 8
                    },
                    showProperties: ["类型", "采矿权区名称"]
                }
            },
            selected: {
                fillColor: [36, 10, 10, 0.6],
                stroke: {
                    color: [255, 0, 0, 1],
                    width: 1
                },
                text: {
                    color: [255, 255, 255, 1],
                    show: true
                },
                point: {
                    fillColor: [255, 1, 30, 0],
                    strokeColor: [255, 0, 0, 1],
                    radius: 4
                }
            }
        }
    };
    // start
    $.ajax({
        url: "/UserDataAPI/GetTargStyleUConfByUser",
        type: "get",
        async: false,
        cache: false,
        success: function (result) {
            if (result) { 
                for (var i = 0; i < result.length; i++) {
                    var temp = result[i];
                    var key = temp.bot;
                    var fillcolor = temp.layerfillcolor;
                    var strokecolor = temp.strokecolor;
                    var textcolor = temp.textcolor;
                    config.style.layer[key].fillColor = fillcolor.split(',');
                    config.style.layer[key].stroke.color = strokecolor.split(',');
                    config.style.layer[key].text.color = textcolor.split(',');
                } 
            } 
        }
    });

    ogis = new jrsc.Ogis($('#gis'), config);

    if (currentMapRange) {
        viewExtent(currentMapRange);
    }
    //添加图层
    loadVecLayers("盆地", 0);
    loadVecLayers("区带", 1);
    loadVecLayers("油气田", 2);
    loadVecLayers("油藏面积", 3);//2017-11-20 为了区分油藏、气藏FT
    loadVecLayers("气藏面积", 4);//2017-11-20 为了区分油藏、气藏FT
    //loadVecLayers("井位", 5);

    //投影选中图元
    if (currentMapElement && currentTargetNode) {
        //todo level用来区分是油田，还是油藏，因为都是面
        addVecLayerByPoins(currentTargetNode.level, currentMapElement.elementType, currentMapElement.elementID, currentMapElement.elementName, currentMapElement.elementPolyCoords);
    }

    var formatTreeData = function (data) {
        var node;
        for (var i = 0, ii = data.length; i < ii; i++) {
            node = data[i];
            node.id = node.boid;
            node.parent = node.pid ? node.pid : '#';
            node.text = node.name;
        }
        return data;
    };

    //添加投影目标
    addProjectBO();
    //工具栏绑定
    mapEventBind();
};

var addProjectBO = function () {
    var len = projectKey.length;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            var key = projectKey[i];
            $.ajax({
                url: "/epgl/GetBoProject",
                type: "post",
                data: { pKey: key },
                success: function (result) {
                    if (result) {
                        importLayer(result);
                    }
                },
                error: function (message) {
                    console.log(message);
                }
            });
        }
    }
}
//加载投影
var loadVecLayers = function (ftName, index) {
    var param = {
        "ft": ftName
    };
    //2017-11-20 为了区分油藏、气藏FT
    if (ftName == '油藏面积') {
        param.ft = "含油气面积";
        //param['filter'] = { pname: "资源类型", pvalue: ftName.substr(0, 1) };
        param.filter = { "$and": [{ "基础参数.资源类型": "$in$稠油,稀油" }] };
    }
    if (ftName == '气藏面积') {
        param.ft = "含油气面积";
        param.filter = { "$and": [{ "基础参数.资源类型": "$in$气顶气,油环气,凝析气,气层气" }] };
    }
    $.ajax({
        url: "/BOAPI/GetFeatures",
        async: true,
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(param),
        success: function (result) {
            if ("盆地,油藏面积,气藏面积".indexOf(ftName) > -1) {
                ogis.addVecLayerByGml(ftName, ftName, true, false, true, result);
                global_layersdata.push({
                    id: "node_" + index,
                    text: ftName,
                    layId: ogis.addSuffix(ftName),
                    layName: ftName,
                    visable: 1,
                    unlocked: 0
                });
            } else {
                ogis.addVecLayerByGml(ftName, ftName, false, false, true, result);
                global_layersdata.push({
                    id: "node_" + index,
                    text: ftName,
                    layId: ogis.addSuffix(ftName),
                    layName: ftName,
                    visable: 0,
                    unlocked: 0
                });
            }

            loadGeoLayers(global_layersdata);

        }
    });
};
//更改图层可见状态
var changeLayerVisible = function (layerId, visable) {
    ogis.changeMapLayerVisibleById(layerId, visable);
};

//更改图层可编辑状态
var changeLayerFrozen = function (layerId, unlocked) {
    ogis.changeMapLayerFrozenById(layerId, !unlocked);
};


var treeNodeSelected = function (event, data) {

    var node = data.node.original;

    var action = data.action;
    if (action == "select_node") {
        var node = data.node.original;

        ogis.locateFeatureByName(node.text, node.level);

        loadRelevantMap(node.aliasnames);
    }


};


var mapEventBind = function () {
    var _move = false;//移动标记 
    var _x, _y;//鼠标离控件左上角的相对位置 
    $("#panelMap #tool_div").mousedown(function (e) {
        e.preventDefault();
        _move = true;
        _x = e.pageX - parseInt($(this).css("left"));
        _y = e.pageY - parseInt($(this).css("top"));
        $("#panelMap #tool_div").fadeTo(20, 0.5);//开始拖动并透明显示
    });
    $("#panelMap").mousemove(function (e) {
        if (_move) {
            var x = e.pageX - _x;
            var y = e.pageY - _y;
            $("#panelMap #tool_div").css({ top: y, left: x });//开始拖动并透明显示
        }
    }).mouseup(function (e) {
        e.preventDefault();
        _move = false;
        $("#panelMap #tool_div").fadeTo("fast", 1);
    });
    $("#ogis_line").click(function () {
        ogis.toolLine();
    });
    $("#ogis_area").click(function() {
        ogis.toolArea();
    });
    $("#changeStyleModal").on('show.bs.modal', function (event) {
        var layers = ogis.layerModel.data.layer;

        var id = null;
        var name = null;
        var key = null;
        var style = null;

        var fillColor = null;
        var fillOpacity = null;

        var strokeColor = null;
        var strokeOpacity = null;

        var textColor = null;
        var textOpacity = null;

        var domStr = null;

        var content$ = $("#styleModal_content");

        $("#styleModal_content div[class='row']:nth-of-type(n+2)").remove();//初始化

        for (var i = 0; i < layers.length; i++) {
            id = layers[i].get('id');
            name = layers[i].get('name');
            key=ogis.toRawId(id);
            style = ogis.options.style.layer[key];

            fillColor = style.fillColor.slice(0, style.fillColor.lastIndexOf(','));
            fillOpacity = style.fillColor.slice(-1);

            strokeColor = style.stroke.color.slice(0, style.stroke.color.lastIndexOf(','));
            strokeOpacity = style.stroke.color.slice(-1);

            textColor = style.text.color.slice(0, style.text.color.lastIndexOf(','));
            textOpacity = style.text.color.slice(-1);

            var domStr = '<div class="row">' +
                            '<div class="col-md-3 col-sm-3 col-xs-3">' +
                                '<span class="input-group-addon">' + name + '</span>' +
                            '</div>' +
                            '<div class="col-md-3 col-sm-3 col-xs-3">' +
                                '<div class="input-group colorpicker-component">' +
                                    '<input type="text" name="styleColor" class="form-control" data-key="' + key + '" data-caption="layerfillcolor" data-opacity="' + fillOpacity + '" value="rgb(' + fillColor + ')"/>' +
                                    '<span class="input-group-addon" style="border-left:1px;"><i></i></span>' +
                                '</div>' +
                            '</div>' +
                            '<div class="col-md-3 col-sm-3 col-xs-3">' +
                                '<div class="input-group colorpicker-component">' +
                                    '<input type="text" name="styleColor" class="form-control" data-key="' + key + '" data-caption="strokecolor" data-opacity="' + strokeOpacity + '" value="rgb(' + strokeColor + ')"/>' +
                                    '<span class="input-group-addon" style="border-left:1px;"><i></i></span>' +
                                '</div>' +
                            '</div>' +
                            '<div class="col-md-3 col-sm-3 col-xs-3">' +
                                '<div class="input-group colorpicker-component">' +
                                    '<input type="text" name="styleColor" class="form-control" data-key="' + key + '" data-caption="textcolor" data-opacity="' + textOpacity + '" value="rgb(' + textColor + ')"/>' +
                                    '<span class="input-group-addon" style="border-left:1px;"><i></i></span>' +
                                '</div>' +
                            '</div>' +
                         '</div>';
                        
            content$.append(domStr);

        }
    }).on('shown.bs.modal', function () {
        $(".colorpicker-component").colorpicker({ format: "rgb" });
    });
    $("#changeStyle_OK").click(function () {
        $("input[name='styleColor']").each(function (e) {
            var key = $(this).data("key");
            var caption = $(this).data("caption");            
            var opacity = $(this).data("opacity");

            var value = $(this).val();

            var len1 = value.indexOf('(');
            var len2 = value.indexOf(')');

            var colorValue = (value.slice(len1 + 1, len2) + "," + opacity).split(',');

            if (caption == "layerfillcolor") {
                ogis.options.style.layer[key].fillColor = colorValue;
            }
            if (caption == "strokecolor") {
                ogis.options.style.layer[key].stroke.color = colorValue;
            }
            if (caption == "textcolor") {
                ogis.options.style.layer[key].text.color = colorValue;
            }
        });
        var layers = ogis.layerModel.data.layer;
        var id = null;
        var styleFunc = null;
        for (var i = 0; i < layers.length; i++) {
            id = layers[i].get('id');
            styleFunc = ogis.getStyleFunction(id);
            styleFunc && layers[i].setStyle(styleFunc);
        }
        $("#changeStyleModal").modal('hide');
    });

    $("#ogis_reset").click(function () {
        ogis.toolReset();
    });
    $("#ogis_zoomin").click(function () {
        ogis.toolZoomIn();
    });
    $("#ogis_zoomout").click(function () {
        ogis.toolZoomOut();
    });
    $("#ogis_export").click(function () {
        ogis.toolExport_png();
    });
    //点击关闭图层颜色修改
    $('#hideColorBox').click(function () {
        $('#color-box').hide(300);
    })
    //上传文件
    var impfile = $("#file-input");
    var fileId = "p" + new Date().valueOf();
    impfile.fileinput({
        //todo自动上传设置
        language: 'zh',
        showPreview: false,
        showCaption: false,
        showUpload: false,
        showRemove: false,
        showPreview: false,
        showCancel: false,
        showClose: false,
        browseClass: '',
        browseLabel: '',
        browseIcon: '<button title="投影"><i class="fa fa-sign-in"></i></button>',
        enctype: 'multipart/form-data',
        uploadUrl: '/TargetNav/AddProject?id=' + fileId,
        allowedFileExtensions: ['xls', 'xlsx']//接收的文件后缀
    });
    //文件载入
    impfile.on('fileloaded', function (event, file, previewId, index) {
        var name = file.name;
        if (!name || name == "") {
            toastr["error"]("请选择文件!", "错误");
            return;
        }
        var type = name.substring(name.lastIndexOf('.'));
        if (type.toLowerCase() != ".xls" && type.toLowerCase() != ".xlsx") {
            toastr["error"]("请选择Excel类型文件!", "错误");
            return;
        }
    });
    //文件选择后
    impfile.on('filebatchselected', function (event, data, id, index) {
        $(this).fileinput("upload");
    });
    //导入文件上传完成之后的事件
    impfile.on("fileuploaded", function (event, data, previewId, index) {
        if (data.response) {
            //通过 data.response.Json对象属性 获得返回数据
            var gml = data.response;
            //console.log(gml);
            projectKey.push(fileId);
            importLayer(gml);
        }
    });
};
//投影用户导入数据
var importLayer = function (gml) {
    var id = "implayer" + new Date().valueOf();
    //console.log(layerid);
    var layername = "用户数据投影层" + new Date().valueOf();

    ogis.options.style.layer[id] = {
        fillColor: [0, 191, 255, 0.7],
        stroke: {
            color: [0, 0, 0, 0.3],
            width: 1
        },
        text: {
            show: false,
            size: 20,
            color: [10, 10, 10, 1]
        }
    };

    ogis.addVecLayerByGml(id, layername, true, false, true, gml);
    global_layersdata.push({
        id: id,
        text: layername,
        layId: ogis.addSuffix(id),
        layName: layername,
        visable: 1,
        unlocked: 1
    });
    loadGeoLayers(global_layersdata);
    
};







//视野自适应  
var viewExtent = function (mapRact) {
    if (!$.isEmptyObject(mapRact)) {
        //大地坐标系转经纬度
        //var bottomLeft = ol.proj.transform([mapRact.dLeft, mapRact.dBottom], "EPSG:900913", "EPSG:4326");
        //var topRight = ol.proj.transform([mapRact.dRight, mapRact.dTop], "EPSG:900913", "EPSG:4326");

        var coordinates = [
        	ol.proj.transform(mapRact.p1, "EPSG:4326", "EPSG:3857"),
        	ol.proj.transform(mapRact.p2, "EPSG:4326", "EPSG:3857")
        ];
        //var p1 = proj4('EPSG:3857', mapRact.p1);
        //var p2 = proj4('EPSG:3857', mapRact.p2);

        ogis.viewExtent(coordinates);
    }

};
/*
1：点
2：折线、曲线
3：面、多边形
4：矩形
5：椭圆
6：文字
7：比例尺
8：方向标
9：刻度轴
10：数据十字
11：井位
12：离散点
13：地名
14：标注；
16：地震测线
17：等值线
18：地震工区
19：边界
20：断层线
21：等值线渐变填充
22：地震剖面
23：图例
24：经纬网
25：方里网
27：箭头
28：直角网
29：油水柱子
30：图片
31：图例容器
32：OLE图元
33：三角图
35：剖面线
36：环形
37：共边面
39：插入单井、剖面、平面
40：责任表
41：责任表单元格
42：跟随文字
99：组合图元
*/
//添加投影,同步geoMap图，所以类型也一样
var addVecLayerByPoins = function (level, typeId, eleId, name, coors) {

    var type = null;
    var id = null;
    if (typeId == 11) {
        type = "Point";
        id = "井"
    } else if (typeId == 3) {
        type = "Polygon";
        if (level == 3) {
            id = "油田";
        } else if (level == 4) {
            id = "油藏";
        }
    }
    ogis.addVecLayerByCoordinates(id, eleId, name, true, false, true, type, coors);
}

