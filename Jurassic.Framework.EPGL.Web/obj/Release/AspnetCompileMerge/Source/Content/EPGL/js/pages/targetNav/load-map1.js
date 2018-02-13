
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
var marklayers = [];
var ogis = null;
//目标树数据
var targetsData = null;

var mapInit = function (maptype) {
    var outputPath =null ;
    if (maptype === "terrain") {
        outputPath=gloabal_map_url + "/terrain/";
    } else {
        outputPath=gloabal_map_url + "/satellite/";
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
            customs: ["ResetZoom"],
            extend: ["ScaleLine", "MousePosition"]
        },
        group: {
            buttons: [
        { id: 'ogis_land_target_button', img: '/Content/EPGL/css/shared/ogis/theme/groupbtn.png', text: '地质目标' },
        { id: 'ogis_relevant_map_button', text: '相关图件' },
        { id: 'ogis_tool_button', text: '工具' }
            ],
            drops: [
                { id: 'ogis_land_target_drop', html: '<div id="ogis_land_target_list"></div>' },
                { id: 'ogis_relevant_map_drop', html: '<ul id="ogis_relevant_map_list"></ul>' },
                { id: 'ogis_tool_drop', html: '<ul id="ogis_tool_list"></ul>' }
            ],
            binding: {
                ogis_land_target_button: 'ogis_land_target_drop',
                ogis_relevant_map_button: 'ogis_relevant_map_drop',
                ogis_tool_button: 'ogis_tool_drop'
            }
        },
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
                    showProperties: ["类型","油气田名称"]
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
    

    ogis = new jrsc.Ogis($('#gis'), config);
    if (currentMapRange) {
        viewExtent(currentMapRange);
    }
    //添加图层
    loadVecLayers("盆地");
    loadVecLayers("区带");
    loadVecLayers("油气田");
    loadVecLayers("油藏面积");//2017-11-20 为了区分油藏、气藏FT
    loadVecLayers("气藏面积");//2017-11-20 为了区分油藏、气藏FT
    loadVecLayers("井位");

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
    //渲染目标树
    loadLandTarget(); 

    var toolPaneConfig = [
        { id: 'ogis_project', className: '', html: '<input id="file-input" name="file-input" type="file" class="file-loading" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">' },
        { id: 'ogis_zoomin', className: 'fa fa-plus', html: '放大' },
        { id: 'ogis_zoomout', className: 'fa fa-minus', html: '缩小' },
        { id: 'ogis_reset', className: 'fa fa-circle-o-notch', html: '复位' },
        { id: 'ogis_export', className: 'fa fa-sign-out', html: '导出' }
    ];
    renderToolPane(toolPaneConfig);
};
//加载投影
var loadVecLayers = function (ftName) {
    var param = {
        "ft": ftName
    };
	//2017-11-20 为了区分油藏、气藏FT
	if (ftName == '油藏面积' || ftName == '气藏面积')
	{
		param['ft'] = "含油气面积";
		param['filter'] = {pname:"资源类型", pvalue:ftName.substr(0,1)};
	}
    $.ajax({
        url: global_api_url + "/GGGXService/GetFeatures",
        async: true,
        type: "post",
        contentType: "application/json",
        data:JSON.stringify(param),
        success: function (result) {
            if ("盆地,油藏面积,气藏面积".indexOf(ftName) > -1) {
                ogis.addVecLayerByGml(ftName, ftName, true, false, true, result);
            } else {
                ogis.addVecLayerByGml(ftName, ftName, false, false, true, result);
            }
            
            
        }
    });
};
var loadLandTarget = function () {
    $.ajax({
        url: "/BOAPI/GetBOTree",
        async: true,
        type: "post",
        contentType: "application/json",
        success: function (dataJson) {
            //console.log(dataJson);
            renderLandTarget(dataJson);
            targetsData = dataJson;
        }
    });
};
var renderLandTarget = function(jsonData) {
    $('#ogis_land_target_list')
        .jstree({
            'plugins': ['types', 'dnd', 'search'],
            'types': {
                'default': {
                    'icon': 'fa fa-folder'
                },
                'html': {
                    'icon': 'fa fa-file-code-o'
                },
                'svg': {
                    'icon': 'fa fa-file-picture-o'
                },
                'css': {
                    'icon': 'fa fa-file-code-o'
                },
                'img': {
                    'icon': 'fa fa-file-image-o'
                },
                'js': {
                    'icon': 'fa fa-file-text-o'
                }
            },
            'core': {
                "animation": true, //动画
                "data": jsonData
            }
        }).on('loaded.jstree',function(e, data) {
                //var targetList = data.instance;
                //targetList.deselect_all(true);
                //if (currentTargetNode) {
                //    targetList.select_node(currentTargetNode);
                //} else {
                //    //targetList.select_node(jsonData[0]);
                //}
        }).on('changed.jstree', treeNodeSelected);
};

var treeNodeSelected = function (event, data) {
    var action = data.action;    
    if (action == "select_node") {
        var node = data.node.original;

        renderRelevantMap(node.aliasnames);
        ogis.locateFeatureByName(node.text,node.level);
        //if (data.event && data.event.type == "click") {
            
        //}
    }
    
};

var renderRelevantMap = function (boName) {
    var loadingHtml = '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>';
    $('#ogis_relevant_map_list').addClass("list-group");
    $('#ogis_relevant_map_list').html(loadingHtml);

    var param = {
        "filter": {
            "$and": [
                { "ep.bo": { "$elemMatch": { "value": { "$in": boName }, "type": "Target" } } },
                { "ep.producttype": { "$regex": "^(?!.*?导航图$)", "$options": "$i" } }
            ]
        }
    };
    var paramJson = JSON.stringify(param);
    $.ajax({
        url: global_api_url + "/SearchService/Match",
        async: true,
        type: "post",
        contentType: "application/json",
        data: paramJson,
        success: function (result) {
            var html = "";
            if (!result || result.metadatas.length == 0) {
                html += '<li class="list-group-item">无相关图件！</li>';
                return;
            }

            var data = result.metadatas;
            var results = [];
            var ids = [];

            
            for (var i = 0; i < data.length; i++) {
                var item = data[i];

                var temp = {
                    iiid: item.iiid,
                    indexedDate: item.indexeddate,
                    name: "",
                    title: "",
                    sourceUrl: "",
                    author: "",
                    auditor: "",
                    mapper: "",
                    createdDate: "",
                    productType: "",
                    productTypeId: "*"
                };

                if (item.source && item.source.url) {
                    temp.sourceUrl = item.source.url;
                }
                if (item.dc && item.dc.title) {
                    for (var k = 0; k < item.dc.title.length; k++) {
                        var title = item.dc.title[k];
                        if (title.type === "Formal") {
                            temp.title = title.text;
                            temp.name = title.text ? title.text.split(".")[0] : "";
                        }
                    }
                }
                if (item.dc && item.dc.contributor) {
                    for (var j = 0; j < item.dc.contributor.length; j++) {
                        var contributor = item.dc.contributor[j];
                        if (contributor.type === "Author") {
                            temp.author = contributor.name;
                        }
                        if (contributor.type === "Auditor") {
                            temp.auditor = contributor.name;
                        }
                        //TODO 绘图人
                        if (contributor.type === "Mapper") {
                            temp.auditor = contributor.name;
                        }
                    }
                }
                if (item.dc && item.dc.date) {
                    for (var q = 0; q < item.dc.date.length; q++) {
                        var date = item.dc.date[q];
                        if (date.type === "Created") {
                            temp.createdDate = date.value;
                        }
                    }
                }
                if (item.ep && item.ep.producttype) {
                    temp.productType = item.ep.producttype;
                }
                
                results.push(temp);

                ids.push(temp.iiid);

                html += '<li class="list-group-item"><a data-type="relevantmap" data-id="'+temp.id+'">' +
                    temp.name +
                    '</a></li>';

            }
            $('#ogis_relevant_map_list').html(html);

            ids = ids.join(',');
            bindMapEvent(ids);
        },
        error: function (result) {


        }
    });
}

var bindMapEvent = function (data) {
    $("[data-type='relevantmap']").each(function () {
        var iiid=$(this).data("id");
        $(this).click(function(e) {
            $("#mapId").val(iiid);
            $("#mapData").val(data);
            $("#resultForm").submit();
        });
    });
};

var renderToolPane = function(data) {
    $("[class='ogis-group-drop'][id^='ogis_tool_drop_']").css({ "width": "110px", "right": "0" });
    var html = '';
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        html += '<li class="list-group-item"><a id="' +
            item.id +
            '"><i class="' +
            item.className +
            '"></i>&nbsp;' +
            item.html +
            '</a></li>';
    }
    $('#ogis_tool_list').addClass("list-group");
    $('#ogis_tool_list').html(html);

    mapEventBind();
};

var mapEventBind = function () {
    $("#ogis_project").click(function (e) {
        ogis.toolReset();
    });
    $("#ogis_reset").click(function() {
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

    //上传文件
    var impfile = $("#file-input");
    impfile.fileinput({
        //todo自动上传设置
        language:'zh',
        showPreview: false,
        showCaption: false,
        showUpload: false,
        showRemove: false,
        showPreview: false,
        browseClass: '',
        browseIcon: '<i class="fa fa-file-image-o"></i>',
        enctype: 'multipart/form-data',
        uploadUrl: '/EPGL/AddProject',
        allowedFileExtensions: ['xls', 'xlsx']//接收的文件后缀
    });
    //文件载入
    impfile.on('fileloaded', function (event, file, previewId, index) {
        var name = file.name;
        if (!name || name == "") {
            toastr["error"]("请选择文件!","错误");
            return;
        }
        var type = name.substring(name.lastIndexOf('.'));
        if (type.toLowerCase() != ".xls" && type.toLowerCase() != ".xlsx") {
            toastr["error"]("请选择Excel类型文件!","错误");
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
            var layerid = "implayer" + new Date().valueOf();
            //console.log(layerid);
            var layername = "用数据投影层" + new Date().valueOf();
            ogis.addVecLayerByGml(layerid, layername, true, false, true, gml);
        }
    });
};

//视野自适应  
var viewExtent = function(mapRact) {
    if (!$.isEmptyObject(mapRact)) {
        //大地坐标系转经纬度
        //var bottomLeft = ol.proj.transform([mapRact.dLeft, mapRact.dBottom], "EPSG:900913", "EPSG:4326");
        //var topRight = ol.proj.transform([mapRact.dRight, mapRact.dTop], "EPSG:900913", "EPSG:4326");

        //var coordinates = [
        //	ol.proj.transform(bottomLeft, "EPSG:4326", "EPSG:3857"),
        //	ol.proj.transform(topRight, "EPSG:4326", "EPSG:3857")
        //];
        var p1 = proj4('EPSG:3857', mapRact.p1);
        var p2 = proj4('EPSG:3857', mapRact.p2);

        ogis.viewExtent([p1, p2]);
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
        id="井"
    } else if(typeId==3) {
        type = "Polygon";
        if (level == 3) {
            id = "油田";
        } else if (level == 4) {
            id = "油藏";
        }
    }
    ogis.addVecLayerByCoordinates(id, eleId, name, true, false, true, type, coors);
}

