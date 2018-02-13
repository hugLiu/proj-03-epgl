var basinTypes = [
    "勘探部署图",
    "油气田分布图",
    "有效矿权分布图",
    "沉积体系分布图",
    "地理信息图",
    "构造单元图",
    "柱状图",
    "剖面图"
];
var zoneTypes = [
    "油气勘探部署图",
    "柱状图",
    "剖面图"
];
var fieldTypes = [
    "含油气面积图",
    "柱状图",
    "剖面图"
];
var reserveTypes = [
    "含油气面积图",
    "单井控制面积图",
    "有效厚度图",
    "开发部署图",
    "调整部署图",
    "开发井位图",
    "评价成果图",
    "储量综合图",
    "剖面图",
    "柱状图"
];

var currentBo = "";//当前选中bo的值
var currentBoType = "";//当前选中bo的类型
var mapScales = [25000, 100000, 500000];

var productTypeIds = {};//全局图件分类Id,为了不重复根据图件类型获取图件
// 用于恢复原始状态
var initLeft = 0, initTop = 0, initRight = 0, initBottom = 0;

var jogis4_options = {
    Style: { border: "solid 1px #666", width: "100%" },
    ShowEagleEye: true,
    GDBPath: null
};
var JoGis4 = null;

var currentViewModel = null;

//盆地地质图
var basinMapUrl = encodeURI("DemoData/gdb/navmap/盆地级/准噶尔盆地.GDBX");

var global_layersdata = null;
var layerTable = $("#mapLayer_table");
var targetTree = null;
/**
 * 每一个map tab的初始值
 * @param {} isActive 
 * @param {} mapType 
 * @param {} mapScale 
 * @param {} mapTitle 
 * @param {} pointLeft 
 * @param {} pointBottom 
 * @param {} pointRight 
 * @param {} pointTop 
 * @returns {} 
 */
var MapItemViewModel = function (isActive, mapType, mapName, mapScale, mapTitle, pointLeft, pointBottom, pointRight, pointTop) {

    var self = this;
    self.index = ko.observable();

    self.title = ko.pureComputed(function () {
        return self.index() == 0 ? "原图" : "新图";
    });

    self.isActive = ko.observable(isActive);

    self.mapName = mapName;
    self.mapType = mapType;
    self.mapScale = mapScale;

    self.mapTitle = ko.pureComputed(function () {
        return mapTitle + self.index();
    });
    self.pointLeft = pointLeft;
    self.pointBottom = pointBottom;
    self.pointRight = pointRight;
    self.pointTop = pointTop;
};

var ViewModel = function () {
    var self = this;

    self.isOriginalMap = ko.observable(true);//默认为原图
    self.isRMap = ko.observable(false);//是否为实图，默认没有加载，为false

    self.mapTabItems = ko.observableArray();

    self.availableMapTypes = ko.observableArray();
    self.availableMapTypes2 = ko.observableArray();
    self.availaleMapNames = ko.observableArray();
    self.availaleMapScale = ko.observableArray(mapScales);

    self.currentMapType = ko.observable(null);
    self.currentMapType2 = ko.observable(null);
    self.currentMapName = ko.observable(null);
    self.currentNewMapName = ko.observable(null);
    self.currentMapScale = ko.observable(null);
    self.currentMapTitle = ko.observable("原图");//tab标题

    self.currentPointLeft = ko.observable();
    self.currentPointBottom = ko.observable();
    self.currentPointRight = ko.observable();
    self.currentPointTop = ko.observable();


    self.addMapTabItem = function () {
        var newItem = new MapItemViewModel(true,
            self.currentMapType(),
            self.currentMapName(),
            self.currentMapScale(),
            self.currentMapTitle(),
            self.currentPointLeft(),
            self.currentPointBottom(),
            self.currentPointRight(),
            self.currentPointTop());

        newItem.index(self.mapTabItems().length);
        self.mapTabItems.push(newItem);
    }

    self.addTab = function () {
        var length = self.mapTabItems().length;
        if (length > 1) {// 目前只生成2个tab页
            return;
        }
        var result = ko.utils.arrayFirst(self.mapTabItems(), function (item) {
            return item.isActive();
        });
        result.isActive(false);
        //新添加的标签页显示图件名称输入
        self.isOriginalMap(false);
        self.addMapTabItem();
        joGIS1.ResetContent();
    }

    self.closeTab = function (data) {
        var index = data.index();
        self.mapTabItems.remove(data);
        //删除之后length改变了
        var length = self.mapTabItems().length;
        //如果是最后一个tab页，将此tab页之前的tab设置选中，之后没有tab不需要更改index
        if (index == length) {
            var lastItem = self.getTabByIndex(index - 1);
            lastItem.isActive(true);
            self.updateInfo(lastItem);
            if (index - 1 == 0) {
                self.isOriginalMap(true);
            } else {
                self.isOriginalMap(false);
            }
        } else {
            //将该tab页之后的tab选中
            ko.utils.arrayForEach(self.mapTabItems(), function (item) {
                var oldIndex = item.index();
                if (oldIndex > index) {
                    if (oldIndex == index + 1) {
                        item.isActive(true);
                        self.updateInfo(item);
                    }
                    item.index(oldIndex--);
                }
            });
        }
    }

    self.getTabByIndex = function (index) {
        var result = ko.utils.arrayFirst(self.mapTabItems(), function (item) {
            return item.index() == index;
        });
        return result;
    }

    self.updateMapItem = function (id) {
        var index = $("#contentCenter_middle li[class='active']").data("index");
        var currentItem = self.getTabByIndex(index);
        if (currentItem) {
            switch (id) {
                case "mapType":
                    currentItem.mapType = self.currentMapType();
                    self.mapTabItems()[index].mapType = self.currentMapType();
                    //原图加载图件名称 
                    var type = self.currentMapType();
                    if (type) {
                        if (index == 0) {
                            var datas = productTypeIds[currentItem.mapType];
                            if (datas) {
                                self.availaleMapNames(datas);
                            } else {
                                setMapNamesByType(currentItem.mapType);
                            }
                        }
                    } else {
                        self.currentMapName(null);
                        self.availaleMapNames([]);
                    }
                    break;
                case "mapType2":
                    currentItem.mapType2 = self.currentMapType2();
                    //原图加载图件名称 
                    var type = self.currentMapType2();
                    if (type) {
                        if (index == 1) {
                            getVMapEvent(type);
                        }
                    }
                    else {
                        joGIS1.ResetContent();
                    }
                    break;
                case "mapName":
                    var mapName = self.currentMapName();
                    currentItem.mapName = mapName;
                    if (mapName) {
                        if (index == 0) {
                            getRMapEvent(mapName ? mapName.sourceUrl : ""); // 加载实图
                            self.isRMap(true)
                        } else {
                            self.isRMap(false)
                        }
                        //新图名赋值
                        var name = mapName.name + "(1)";
                        self.currentNewMapName(name);
                    } else {
                        joGIS1.ResetContent();
                        initMapPoints();
                        global_layersdata = null;
                        loadLayerTable([]);
                        self.isRMap(false)
                    }
                    //如果存在新图，去掉新图tab
                    self.closeAllNewTab();
                    break;
                case "mapScale":
                    currentItem.mapScale = self.currentMapScale();
                    var scale = self.currentMapScale();
                    //加载虚图样式单
                    if (scale) {
                        getVMapStyleEvent(scale);
                    }
                    break;
                case "pointLeft":
                    currentItem.pointLeft = self.currentPointLeft();
                    break;
                case "pointBottom":
                    currentItem.pointBottom = self.currentPointBottom();
                    break;
                case "pointRight":
                    currentItem.pointRight = self.currentPointRight();
                    break;
                case "pointTop":
                    currentItem.pointTop = self.currentPointTop();
                    break;
                default:
                    break;
            }
        }
    }

    // 通过坐标刷新图件
    self.refresh = function () {
        clipEvent();
    }

    self.closeAllNewTab = function () {
        ko.utils.arrayForEach(self.mapTabItems(), function (mapTab) {
            if (mapTab.index() > 0) {
                self.mapTabItems.remove(mapTab);
            } else {
                mapTab.isActive(true);
            }
        });
    }

    self.updateInfo = function (currentItem) {
        self.currentMapType(currentItem.mapType);
        self.currentMapType2(currentItem.mapType2);
        self.currentMapName(currentItem.mapName);
        self.currentMapScale(currentItem.mapScale);
        self.currentMapTitle(currentItem.mapTitle);

        self.currentPointLeft(currentItem.pointLeft);
        self.currentPointBottom(currentItem.pointBottom);
        self.currentPointRight(currentItem.pointRight);
        self.currentPointTop(currentItem.pointTop);
    };

    self.changeTab = function (item) {
        var index = item.index();
        if (index == 0) {
            self.isOriginalMap(true);
            centerHeightMinusEvent();
            var mapName = item.mapName;
            getRMapEvent(mapName ? mapName.sourceUrl : ""); // 加载实图
            self.isRMap(true)
            self.refresh();
        } else {
            self.isOriginalMap(false);
            self.isRMap(false)
            //调整中间内容高度
            centerHeightPlusEvent();
            //加载虚图
            var type = item.mapType2;
            if (type) { 
                getVMapEvent(type); 
            }
            else {
                joGIS1.ResetContent();
            }
            //加载比例尺样式单

        }
        self.updateInfo(item);
    }
};

var centerHeightPlusEvent = function () {
    var bottom = $("#contentCenter_bottom").height() + 6.5; // padding:6.5px
    var middle = $("#contentCenter_middle").height();
    //$("#contentCenter_middle").height(middle + bottom); 
}
var centerHeightMinusEvent = function () {
    var bottom = $("#contentCenter_bottom").height() + 6.5;// padding:6.5px
    var middle = $("#contentCenter_middle").height();
    //$("#contentCenter_middle").height(middle - bottom);
}

//根据图件类型查找图件
var setMapNamesByType = function (type) {
    var param = {
        "filter": {
            "$and": [
                { "ep.producttype": type },
                { "ep.bo": { "$elemMatch": { "value": { "$in": currentBo }, "type": "Target" } } },
                { "source.url": { "$regex": "^((?!VMap).)*$", "$options": "$i" } }
            ]
        }
    };
    $.ajax({
        url: global_api_url + "/SearchService/Match",
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify(param),
        success: function (result) {
            if (!result || result.count == 0||result.metadatas.length==0) {
                return;
            }
            var data = result.metadatas;
            var temps = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (!item) break;
                var temp = {
                    iiid: item.iiid,
                    indexedDate: item.indexeddate,
                    name: "",
                    title: "",
                    sourceUrl: item.source.url ? item.source.url : "", //todo 原图重新加载的时候需要 
                    productType: item.ep.producttype ? item.ep.producttype : "",
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
                temps.push(temp);
            }
            currentViewModel.availaleMapNames(temps);
        }
    });
};

var getRMapEvent = function (url) {
    var a = url;
    $.ajax({
        url: global_api_url + "/DataService/Retrieve?url=" + url,
        type: "get",
        success: function (retrieveData) {
            if (retrieveData && retrieveData.length > 0) {
                var ticket = retrieveData[0].ticket;
                var gdbFileUrl = encodeURI(global_api_url + "/DataService/GetData?url=" + url + "&ticket=" + ticket);
                JoGis4.options.GDBPath = gdbFileUrl;
                JoGis4.loadGeoMapFile();
                doOtherEvent();
            }
        }
    });
}

var getVMapStyleEvent = function (scale) {
    if (scale == 10000) {

    }
}

var doOtherEvent = function () {
    global_layersdata = initGeoLayers();
    loadLayerTable(global_layersdata);
    initMapPoints(); // 更新图件坐标信息
}

//根据对象，图件类型获取虚图id
var getVMapEvent = function (type) {
    var param = {
        "filter": {
            "$and": [
                { "ep.producttype": type },
                { "ep.bo": { "$elemMatch": { "value": { "$in": currentBo }, "type": currentBoType } } },
                { "source.url": { "$regex": "VMap", "$options": "$i" } }
            ]
        }
    };
    $.ajax({
        url: global_api_url + "/SearchService/Match",
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify(param),
        success: function (result) {
            if (!result || result.count == 0) {
                return;
            }
            var data = result.metadatas;
            if (data && data.length) {
                var url = data[0].source.url ? data[0].source.url : "";
                if (url) {
                    var id = url.split("VMap/") ? url.split("VMap/")[1] : "";
                    if (id) {
                        loadVMap(id);
                    }
                }
            }
        }
    });
}

var loadVMap = function (id) {
    $.ajax({
        url: "/FlexDraw/GetVMap",
        type: "get",
        data: { vMapId: id },
        success: function (result) {
            console.log(joGIS1.PM_LoadMap(result, 1));
            joGIS1.PM_SetOperateState(17);
            clipEvent();
        },
        error: function (message) {
            console.log(message)
        }
    });
}

$(document).ready(function () {
    //初始化map对象
    initGeoMap();
    //工具栏事件
    mapToolEventBind();
    loadTargetTree(); //加载目标树
    //渲染图层表
    renderMapLayerTable();
    currentViewModel = new ViewModel();
    ko.applyBindings(currentViewModel);
    //先添加原图tab项
    currentViewModel.addMapTabItem();
});

var initGeoMap = function () {
    JoGis4 = new JoGis(joGIS1, jogis4_options);
};

var loadGeoMap = function (url) {
    JoGis4.options.GDBPath = canonical_uri(url).replace("FlexDraw/", "").replace("file:///", "");
    JoGis4.loadGeoMapFile();
};

var mapToolEventBind = function () {
    /**
        * 0：选择图元
        * 13：放大图件
        * 14：缩小图件
        * 15：移动图件
        * 17：复位图件
        * 28：裁剪 （3.6版本）
        */
    $("#tool_select").click(function () {
        joGIS1.PM_SetOperateState(0);
    });
    $("#tool_zoomin").click(function () {
        joGIS1.PM_SetOperateState(13);
    });
    $("#tool_zoomout").click(function () {
        joGIS1.PM_SetOperateState(14);
    });
    $("#tool_move").click(function () {
        joGIS1.PM_SetOperateState(15);
    });
    $("#tool_reset").click(function () {
        joGIS1.PM_SetOperateState(17);
    });
    $("#tool_cut").click(function () {
        joGIS1.OperateState = 28;
    });
    $("#tool_new").click(function () {
        //新增tab页，隐藏功能键，保存按钮除外
        currentViewModel.addTab();
        centerHeightPlusEvent()
    });
    $("#tool_clean").click(function () {
        //清除截取的动作，还原图件
        var mapName = currentViewModel.currentMapName();
        getRMapEvent(mapName ? mapName.sourceUrl : ""); // 加载实图，重新加载图件
    });
    $("#save_new").click(function () {
        saveNewMap();
    });
};

var cnt = 1000;
var i = 0;
// 定义全局变量，跨事件调用。
var left = 0, top = 0;
// 操作事件
// 鼠标按键按下
function joGIS1::OnMouseDown(button, shift, x, y) {
    var up = joGIS1.LPtoUP(x, y).split(' '); // 鼠标事件逻辑坐标（mm）转用户坐标（m） 
    var state = joGIS1.PM_GetOperateState();
    switch (state) {
        case 28: {
            if (up && up.length > 0) {
                currentViewModel.currentPointLeft(up[0]);
                currentViewModel.currentPointTop(up[1]);
            }
            break;
        }
    }
}
// 鼠标按键释放
function joGIS1::OnMouseUp(button, shift, x, y) {
    var up = joGIS1.LPtoUP(x, y).split(' '); // 鼠标事件逻辑坐标（mm）转用户坐标（m） 
    var state = joGIS1.PM_GetOperateState();
    switch (state) {
        case 28: {
            if (up && up.length > 0) {
                currentViewModel.currentPointRight(up[0]);
                currentViewModel.currentPointBottom(up[1]);
            }
            clipEvent();
            joGIS1.PM_SetOperateState(0);
            break;
        }
    }
}

function clipEvent() {
    var cnt = joGIS1.PM_GetLayerCount();
    var temp = [];
    for (var i = 0; i < cnt; i++) {
        temp.push(joGIS1.PM_GetLayerName(i));
    }
    var name = temp.join(',');
    var cm = joGIS1.ClipMap(currentViewModel.currentPointLeft(), currentViewModel.currentPointTop(), currentViewModel.currentPointRight(), currentViewModel.currentPointBottom(), name, 1);
    console.log(joGIS1.PM_GetUserRect());
    console.log(cm);
    //var ret = joGIS1.PM_SetMapRect(currentViewModel.currentPointLeft(), currentViewModel.currentPointTop(), currentViewModel.currentPointRight(), currentViewModel.currentPointBottom());
    //console.log(ret);
    //joGIS1.PM_SetMapRect( 36469531.36,36488015.58,4066973.76,4048833.39);
    // console.log(joGIS1.Zoom(currentViewModel.currentPointLeft(), currentViewModel.currentPointTop(), currentViewModel.currentPointRight(), currentViewModel.currentPointBottom()));
    //var a = joGIS1.PM_SetMapRect(6149850.281236, 2863403.052568, 7233904.191406, 2295397.018284);
    //console.log(a)
}

function saveNewMap() {
    var name = currentViewModel.currentNewMapName();
    if (name != "") {
        var path = getFileFolderPath(); //文件夹目录选择 
        var url = path + name + ".GDBX";
        //PM_SaveMap (ByVal lpszName As  String,  ByVal  nFlag As Long) As String  
        //lpszName –nFlag为0时，指要保存的本地文件路径；nFlag为1时，没定义 //nFlag -- 保存标志，0--保存到磁盘文件，1--保存成二进制内存流返回。
        joGIS1.PM_SaveMap(url, 0);
    } else {
        alert("请填写新图件名称");
    }
}

var getFileFolderPath = function () {
    var Folder = null;
    try {
        var Message = "\u8bf7\u9009\u62e9\u6587\u4ef6\u5939"; //选择框提示信息
        var Shell = new ActiveXObject("Shell.Application");
        Folder = Shell.BrowseForFolder(0, Message, 64, 17); //起始目录为：我的电脑 //Folder = Shell.BrowseForFolder(0, Message, 0); //起始目录为：桌面 
        if (Folder != null) {
            Folder = Folder.items(); // 返回 FolderItems 对象
            Folder = Folder.item(); // 返回 Folderitem 对象
            Folder = Folder.Path; // 返回路径
            if (Folder.charAt(Folder.length - 1) != "\\") {
                Folder = Folder + "\\";
            }
            return Folder;
        }
    }
    catch (e) {
        console.log(e.message);
    }
}

/**
 * 初始化地图范围坐标
 * @returns {} 
 */
var initMapPoints = function () {
    //获取图件的用户坐标范围，按左、顶、右、底顺序组成的坐标串（空格分隔）
    var userRect = joGIS1.PM_GetUserRect();
    var points = userRect.split(" ");
    currentViewModel.currentPointLeft(points[0]);
    currentViewModel.currentPointBottom(points[3]);
    currentViewModel.currentPointRight(points[2]);
    currentViewModel.currentPointTop(points[1]);
};

/**
 * 设置图件坐标范围
 * @param {} data 
 * @returns {} 
 */
var setMapRect = function (data) {
    joGIS1.SetUserRect(data.pointLeft, data.pointTop, data.pointRight, data.pointBottom);
};

var loadTargetTree = function () {
    $.ajax({
        url: "/BOAPI/GetBOTree",
        type: "post",
        contentType: 'application/json',
        success: function (dataJson) {
            renderTargetTree(dataJson);
        }
    });
};
var renderTargetTree = function (dataJson) {
    $("#mapTarget_tree").jstree({
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
            "animation": true,//动画
            "data": dataJson
        }
    }).on('loaded.jstree', function (e, data) {
        targetTree = data.instance;
        targetTree.deselect_all(true);
    }).on('changed.jstree', targetSelected);
};

//目标树选中事件
var targetSelected = function (e, data) {
    var action = data.action;
    if (action == "select_node") {
        var node = data.node;
        var name = node.original.text;
        var bo = node.original.aliasnames;
        currentBo = bo;
        var boType = node.original.typeid;
        currentBoType = boType;
        //1.加载图件类型，改变的时候  
        var type = "";
        switch (boType) {
            case "Basin":
                type = basinTypes;
                break;
            case "Play":
                type = zoneTypes;
                break;
            case "Field":
                type = fieldTypes;
                break;
            default:
                type = reserveTypes;
                break;
        }
        currentViewModel.availableMapTypes(type);
        currentViewModel.availableMapTypes2(type);
        //2.清空图件内容
        joGIS1.ResetContent();
        
        //4.删除新图tab
        var item = currentViewModel.getTabByIndex(1);
        if (item) {
            currentViewModel.closeTab(item);
        }
        //5.图件类型清空
        currentViewModel.currentMapType(null);
        //3.初始化图件坐标
        initMapPoints();
    }
};

var renderMapLayerTable = function () {
    function visableFmatter(cellvalue, options, rowObject) {
        if (cellvalue) {
            return '<a href="javascript:void(0);" data-value="' + cellvalue + '" title="显示/隐藏"><i class="fa fa-eye"></i></a>';
        } else {
            return '<a href="javascript:void(0);" data-value="' + cellvalue + '" title="显示/隐藏"><i class="fa fa-eye-slash"></i></a>';
        }
    }

    function visibleUnFmatter(cellvalue, options, cell) {
        return $("a", cell).data("value");
    }
    function lockFmatter(cellvalue, options, rowObject) {
        if (cellvalue) {
            return '<a href="javascript:void(0);" data-value="' + cellvalue + '" title="解锁/锁定"><i class="fa fa-lock"></i></a>';
        }
        else {
            return '<a href="javascript:void(0);" data-value="' + cellvalue + '" title="解锁/锁定"><i class="fa fa-unlock"></i></a>';
        }
    }
    function lockUnFmatter(cellvalue, options, rowObject) {
        return $("a", cell).data("value");
    }

    layerTable.jqGrid({
        datatype: "local",
        autowidth: true,
        shrinkToFit: true,
        rowNum: 1000,
        rownumbers: true,
        rownumWidth: 35, // the width of the row numbers columns
        colModel: [
            {
                name: "layId",
                hidden: true
            },
            {
                name: 'layName',
                index: "layName",
                sorttype: "string",
                label: "图层",
                width: 100,
                sortable: false
            },
			{
			    name: 'visable',
			    index: 'visable',
			    label: "见",
			    width: 25,
			    align: "center",
			    formatter: visableFmatter,
			    unformat: visibleUnFmatter,
			    sortable: false
			},
			{
			    name: 'locked',
			    index: 'locked',
			    label: "选",
			    width: 25,
			    align: "center",
			    formatter: lockFmatter,
			    unformat: lockUnFmatter,
			    sortable: false
			}
        ],
        onCellSelect: function (rowid, icol, cellcontent, e) {
            var row = $(this).getLocalRow(rowid);//获取行数据（原始数据）
            var entity = getCurLayer(global_layersdata, row.layId);//获取GeoMap数据
            if (icol == 3) {
                //更新GeoMapJson               
                entity.visable = !entity.visable;

                joGIS1.PM_SetLayerStatus(entity.layName, entity.visable ? 1 : 0, entity.locked ? 0 : 1);
                //更新jqgrid值
                $(this).jqGrid("setCell", rowid, 'visable', entity.visable);
            }
            if (icol == 4) {
                //更新GeoMapJson
                entity.locked = !entity.locked;

                joGIS1.PM_SetLayerStatus(entity.layName, entity.visable ? 1 : 0, entity.locked ? 0 : 1);
                //更新jqgrid值
                $(this).jqGrid("setCell", rowid, 'locked', entity.locked);
            }
        },
        viewrecords: false,
        gridview: true,
        hidegrid: false,
        scrollrows: true,
        //pager: "#pager_new_layers",
        pgbuttons: false,
        pginput: false,
        guiStyle: "bootstrap",
        iconSet: "fontAwesome"
    });


};
//加载图层表格
var loadLayerTable = function (jsondata) {
    layerTable.jqGrid("clearGridData");
    layerTable.jqGrid("setGridParam", { data: jsondata }).trigger("reloadGrid");
};
//获取图件图层Json
var initGeoLayers = function () {
    //if (!joGIS1.LayerCount) return [];
    //if (joGIS1.LayerCount == 0) return [];

    var json = []; // 定义一个json对象
    var entity = {}; // 实体
    var layerName = null;

    for (var i = 0; i < joGIS1.PM_GetLayerCount() ; i++) {
        layerName = joGIS1.PM_GetLayerName(i);
        entity.id = 'node_' + i;
        entity.text = layerName;
        entity.layId = i;
        entity.layName = layerName;
        entity.visable = true;
        entity.locked = false; //默认都可以选中
        entity.edited = true;

        joGIS1.PM_SetLayerStatus(layerName, entity.visable ? 1 : 0, 1);//设置可见

        json.push(entity);
        entity = {};
    }
    return json;
};
/**
 * 同步grid与map图层数据
 * @param {} data 
 * @param {} layId 
 * @returns {} 
 */
var getCurLayer = function (data, layId) {
    //筛选
    var queryresult = Enumerable.From(data)
        .Where("x=>x.layId=='" + layId + "'").ToArray();
    return queryresult[0];
}