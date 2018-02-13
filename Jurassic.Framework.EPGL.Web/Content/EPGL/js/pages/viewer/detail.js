
var jogis4_options = {
    Style: { border: "solid 1px #666", width: "100%" },
    ShowEagleEye: true
};
var JoGis4;
var tabIndex = "1";//当前tab的信息，默认是第一个drilling
var currentViewModel = null;//当前页面模型

var global_layersdata = null;//全局，图件图层数据
var projectionLaysers = null;//全局，投影图层

var layerTable = $("#mapLayer_table");//图层表格容器 
var splitter = null;//页面分割，kendo splitter
var drillingBaseTable = $("#drilling_base_table");//钻井基础数据
var reservesOilTable = $("#reserves_oil_table");//油藏储量数据
var reservesGasTable = $("#reserves_gas_table");//气藏储量数据
var capacityHeavyTable = $("#capacity_heavy_table");//稠油采油井产量数据
var capacityDiluteTable = $("#capacity_dilute_table");//稀油采油井产量数据
var capacityWaterTable = $("#capacity_water_table");//注水井产量数据
var capacityGasTable = $("#capacity_gas_table");//采气井产量数据

var drillingBaseTableType = 1;//表格对应数据库类型
var reservesOilTableType = 2;
var reservesGasTableType = 3;
var capacityHeavyTableType = 4;
var capacityDiluteTableType = 5;
var capacityWaterTableType = 6;
var capacityGasTableType = 7;

var wellElements = null;//选中的井位名称数组
var wellBoData = null;//搜索bo的相关井位信息数据

var MapViewModel = function (iiid, name, title, sourceUrl, thumb, author, auditor, drawer, createdDate, productType) {
    var self = this;
    self.iiid = iiid;
    self.name = name;
    self.title = title;
    self.sourceUrl = sourceUrl;
    self.thumb = thumb;
    self.author = author;
    self.auditor = auditor;
    self.drawer = drawer;
    self.createdDate = createdDate;
    self.productType = productType;

    //因为加载地图的时候会获取一次，在下载地图的时候也需要，所以保存下来
    self.ticket = null;
    self.format = null;
}
/**
 * 页面model
 * @param {当前显示map的iiid} iiid 
 * @param {所有等待显示的map的iiid集合} ids 
 * @returns {} 
 */
var ViewModel = function (iiid, ids) {
    var self = this;

    self.mapTabItems = ko.observableArray();

    self.wellResults = ko.observableArray();//井位搜索结果
    self.curveMode = ko.observableArray();//开发曲线数据模型
    self.curveTemplate = ko.observableArray();//开发曲线模板

    //井型、井别
    self.availaleWellTypes = ko.observableArray();//如果选项不变，可以不用设置成监听类型
    self.availaleWellBlocks = ko.observableArray();

    //** 面积投影参数
    self.zone = ko.observableArray();//区带

    self.secondaryStructure = ko.observableArray();//二级构造

    self.oilfield = ko.observableArray();//油田

    self.wellBlocks = ko.observableArray();//井区块

    self.horizon = ko.observableArray();//层位

    self.sector = ko.observableArray();//界

    self.series = ko.observableArray();//系

    self.gather = ko.observableArray();//统

    self.formation = ko.observableArray();//组

    self.annualReporting = ko.observableArray();//上报年度

    self.manageUnits = ko.observableArray();//归属单位

    self.manageMode = ko.observableArray();//管理方式

    self.storageType = ko.observableArray();//储量类型

    self.storageCategories = ko.observableArray();//储量类别


    self.storageSource = ko.observableArray();//储量来源

    self.reservoirType = ko.observableArray();//油气藏类型

    self.reservoirPhysical = ko.observableArray();//储层物性

    self.reservoirLithology = ko.observableArray();//储层岩性

    self.subdivisionLithology = ko.observableArray();//岩性细分


    self.reservesAbundance = ko.observableArray();//储量丰度

    self.crudeTypes = ko.observableArray();//资源类型

    self.crudeDensity = ko.observableArray();//原油密度

    self.edgeBottomWater = ko.observableArray();//边底水情况

    self.driveTypes = ko.observableArray();//驱动类型


    self.saveType = ko.observableArray();//储集类型

    self.cementationTypes = ko.observableArray();//胶结类型

    self.burialDepth = ko.observableArray();//埋藏深度

    self.heterogeneousDegree = ko.observableArray();//储层非均质程度

    self.formationPressure = ko.observableArray();//地层压力

    //地图信息集合
    self.resultMaps = ko.utils.arrayMap(ids, function (id) {
        return { iiid: id };
    });
    //更新地图数组信息
    self.updateResultMaps = function (item) {
        var index = ko.utils.arrayIndexOf(ids, item.iiid);

        self.resultMaps.splice(index, 1, item);
    };
    //当前地图iiid
    self.currentMapId = ko.observable(iiid);
    //根据iiid查找map
    self.findMapById = function (id) {
        var result = ko.utils.arrayFirst(self.resultMaps,
            function (item) {
                return item.iiid == id;
            });
        return result;
    };
    //当前地图信息
    self.currentMap = ko.computed(function () {
        var result = self.findMapById(self.currentMapId());
        if (result) {
            if (result.name) {
                return result;
            } else {
                var temp = getMapInfo(result.iiid);
                if (temp) {
                    self.updateResultMaps(temp);
                }
                return temp;
            }

        } else {
            var temp = getMapInfo(self.currentMapId());
            if (temp) {
                self.updateResultMaps(temp);
            }
            return temp;
        }
    });
    //当前地图位置
    self.currentMapIndex = ko.computed(function () {
        if (!self.currentMap()) {
            return -1;
        }
        return ko.utils.arrayIndexOf(ids, self.currentMap().iiid);
    });
    //当前地图名称
    self.currentMapName = ko.computed(function () {
        var result = self.currentMap();
        if (result && result.name) {
            return result.name;
        } else {
            return "";
        }
    });
    //当前地图编图人
    self.currentMapAuthor = ko.computed(function () {
        var result = self.currentMap();
        if (result && result.author) {
            return result.author;
        } else {
            return "";
        }
    });
    //当前地图绘图人
    self.currentMapDrawer = ko.computed(function () {
        var result = self.currentMap();
        if (result && result.drawer) {
            return result.drawer;
        } else {
            return "";
        }
    });
    //当前地图审核人
    self.currentMapAuditor = ko.computed(function () {
        var result = self.currentMap();
        if (result && result.auditor) {
            return result.auditor;
        } else {
            return "";
        }
    });
    //当前地图制图日期
    self.currentMapCreatedDate = ko.computed(function () {
        var result = self.currentMap();
        if (result && result.createdDate) {
            return toDateTime(result.createdDate, "yyyy-MM-dd hh:mm:ss", new Date()).Format("yyyy-MM-dd hh:mm:ss");
        } else {
            return "";
        }
    });
    //上一幅图
    self.toLastMap = function () {
        var currentMapIndex = self.currentMapIndex();
        if (currentMapIndex < 0) {
            return;
        }
        var index = currentMapIndex - 1;
        if (index >= 0) {
            var result = self.resultMaps[index];
            self.loadMapInfo(result);
            //图数联动默认隐藏
            var pane = $("#verticalSplitter").children(".k-pane")[1];
            if (!pane) return;

            splitter.toggle(pane, false);
            //增加用户浏览记录
            addUserBehavior(result);
        }
    };
    //下一幅图
    self.toNextMap = function () {
        var currentMapIndex = self.currentMapIndex();
        if (currentMapIndex < 0) {
            return;
        }
        var index = currentMapIndex + 1;
        if (index < self.resultMaps.length) {
            var result = self.resultMaps[index];
            self.loadMapInfo(result);
            //图数联动默认隐藏
            var pane = $("#verticalSplitter").children(".k-pane")[1];
            if (!pane) return;

            splitter.toggle(pane, false);
            //增加用户浏览记录
            addUserBehavior(result);
        }
    };

    //加载当前地图信息
    self.loadMapInfo = function (data) {
        self.currentMapId(data.iiid);//其他属性都是依赖监听        
        if (data.url && data.ticket) {
            loadMapFile(url, ticket);
        } else {
            data = self.currentMap();
            loadGeoMap(data.sourceUrl);
        }
    };
};
//加载开发曲线模型数据
var loadCurveMode = function () {
    $.ajax({
        url: "/Viewer/GetMiningChartModel",
        async: true,
        type: "post",
        success: function (result) {
            currentViewModel.curveMode(result);
        }
    });
};
//加载开发曲线模板
var loadCurveTemplate = function () {
    $.ajax({
        url: "/UserDataAPI/GetAppDProfileUserTemplate",
        async: true,
        type: "get",
        success: function (result) {

            if (result && result.length > 0) {
                currentViewModel.curveTemplate(result);
            }

        }
    });
};

//获取图件中的所有井位
var getWellElements = function () {
    var wells = JoGis4.getElementsNameProByType(11);
    if (wells && wells.length > 0) {
        return wells;
    } else {
        return null;
    }
};
//初始配置地图
var initGeoMap = function () {
    JoGis4 = new JoGis(joGIS1, jogis4_options);

    joGIS1.IsTransparent = true;

    mapToolEventBind();
    //todo 测试重新load地图，右键菜单是否存在
    createContextMenu();
};

//地图工具条事件绑定
var mapToolEventBind = function () {
    /**
        * 0：选择图元
        * 13：放大图件
        * 14：缩小图件
        * 15：移动图件
        * 17：复位图件
        * 22：多边形选择
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
        joGIS1.PM_SetOperateState(22);
    });
    $("#tool_clean").click(function () {
        joGIS1.PM_SelectElement("", -1);
        //清除表格数据
        drillingBaseTable.jqGrid("clearGridData");
        reservesOilTable.jqGrid("clearGridData");
        reservesGasTable.jqGrid("clearGridData");
        capacityHeavyTable.jqGrid("clearGridData");
        capacityDiluteTable.jqGrid("clearGridData");
        capacityWaterTable.jqGrid("clearGridData");
        capacityGasTable.jqGrid("clearGridData");
    });
    //图数
    $("#tool_mapdata").click(function () {
        var pane = $("#verticalSplitter").children(".k-pane")[1];
        if (!pane) return;

        splitter.toggle(pane, $(pane).height() <= 0);
    });
    //现状
    $("#status_popover").popover({
        trigger: "click",
        placement: "left",
        template: '<div class="popover" role="tooltip"><div class="arrow"><iframe scrolling=no style="background-color: transparent; position: absolute; z-index: 0; width: 11px; height: 22px;; top: -11px; left: -11px;border:1px solid transparent;border-top:0;"></iframe></div><div class="popover-content" style="position:relative;z-index:2;"></div>' +
            '<iframe scrolling=no style="background-color: transparent; position: absolute; z-index: 0; width: 100%; height: 100%; top: 1px; left: 0;border:none;"></iframe></div>',
        html: true,
        content: function () {
            return $("#status_content").html();
        }
    }).on("shown.bs.popover", function () {
        //生产现状事件绑定
        statusEventBind();

    });

    //开发曲线
    $("#curve_popover").popover({
        trigger: "click",
        placement: "left",
        template: '<div class="popover" role="tooltip"><div class="arrow"><iframe scrolling=no style="background-color: transparent; position: absolute; z-index: 0; width: 11px; height: 22px;; top: -11px; left: -11px;border:1px solid transparent;border-top:0;"></iframe></div><div class="popover-content" style="position:relative;z-index:2;"></div>' +
            '<iframe scrolling=no style="background-color: transparent; position: absolute; z-index: 0; width: 100%; height: 100%; top: 1px; left: 0;border:none;"></iframe></div>',
        html: true,
        content: function () {
            return $("#curve_content").html();
        }
    }).on("shown.bs.popover", function () {
        var popover = $('#curve_popover').data('popover');
        //获取井位数据
        getWellData();
        //开发曲线事件绑定
        curveEventBind();
    });

    //下载
    $("#tool_download").click(function () {
        var path = getFileFolderPath(); //文件夹目录选择
        var name = currentViewModel.currentMapName();
        var url = path + name + "(1).GDBX";
        //PM_SaveMap (ByVal lpszName As  String,  ByVal  nFlag As Long) As String  
        //lpszName –nFlag为0时，指要保存的本地文件路径；nFlag为1时，没定义 //nFlag -- 保存标志，0--保存到磁盘文件，1--保存成二进制内存流返回。
        joGIS1.PM_SaveMap(url, 0);

    });
    //更新
    $("#tool_update").click(function () {
        //todo 跳转到更新页面
    });

    $("#bottom_pane li>a").click(function (e) {
        var activeTabIndex = parseInt($(e.target).attr("tabindex"));

    });

    //解决popover隐藏之后需要点击两次才会出现的错误
    $("body").on("hidden.bs.popover", function (e) {
        $(e.target).data("bs.popover").inState = { click: false, hover: false, focus: false }
    });

    //上传文件
    var impfile = $("#file-input0");
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
        browseIcon: '<a id="tool_impselect"><i class="fa fa-sign-in"></i>&nbsp;导入选取</a>',
        enctype: 'multipart/form-data',
        uploadUrl: '/Viewer/ImportTo3GX?id=' + fileId,
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
        if (data.response.xmlfile) {
            //通过 data.response.Json对象属性 获得返回数据
            var gmlfile = data.response.xmlfile;
            //gmlfile = "/XMLFile/c4643d87-398d-4d03-87b6-65055dc8ea2f.xml";
            gmlfile = canonical_uri(encodeURI(gmlfile)).replace("Viewer/", "").replace("file:///", "");
            //console.log(gmlfile);
            var layerid = "imptoSelectlayer";
            //console.log(layerid);
            var layername = "导入面积选取目标";

            joGIS1.PM_RemoveLayer(layername);
            joGIS1.PM_CreateLayer(layername, 0);
            joGIS1.PM_SetCurrentLayer(layername);

            var url = "DemoData/xml/StyleSheet/GeoMapUseSelected.css";
            var styleSheet = canonical_uri(encodeURI(url)).replace("Viewer/", "").replace("file:///", "");
            var r = joGIS1.PM_LoadStyleSheet(styleSheet, 0);
            //console.log(r);
            r = joGIS1.PM_Load3GXData(layername, gmlfile, 0);
            //console.log(r);

            //获取加入的图元
            var lpszID = joGIS1.PM_GetElementID(layername, 0);
            var lpszLayers = "";

            //设置图层
            for (var i = 0; i < joGIS1.PM_GetLayerCount() ; i++) {
                layer = joGIS1.PM_GetLayerName(i);
                joGIS1.PM_SetLayerStatus(layer, 1, 1);

                if (layer != layer)
                    lpszLayers += layer + ",";
            }
            //console.log(lpszLayers);

            //多边形选择
            var sel = joGIS1.SelectWithinPolygon(lpszID, 9, 1, lpszLayers);//只能选择井位
            //console.log(sel);
            var selcount = joGIS1.PM_GetSelElementCount();
            //console.log(selcount);

            //隐藏多边形图层
            //joGIS1.PM_SetLayerStatus(layername, 0, 0);

            //加载图层
            global_layersdata = getMapLayers();
            loadTable(layerTable, global_layersdata);
        }
    });

    var $inputfile = $("#file-input");
    var fileid = "p" + new Date().valueOf();
    $inputfile.fileupload({
        acceptFileTypes: /(\.|\/)(xls|xlsx)$/i,
        autoUpload: true,
        sequentialUploads: true,
        enctype: 'multipart/form-data',
        url: '/Viewer/ImportTo3GX',
        formData: { 'id': fileid },
        maxNumberOfFiles: 1,
        maxFileSize: 5000000,
        add: function (e, data) {
            var flag = false;
            $.each(data.files, function (index, file) {
                var name = file.name;
                if (!name || name == "") {
                    alert("请选择文件!");
                    flag = true;
                }
                var type = name.substring(name.lastIndexOf('.'));
                if (type.toLowerCase() != ".xls" && type.toLowerCase() != ".xlsx") {
                    alert("请选择Excel类型文件!");
                    flag = true;
                }
            });
            if (flag) return;
            data.submit(); //this will 'force' the submit in IE < 10  
        }
    });

    $inputfile.on('fileuploaddone', function (e, data) {
        $inputfile.val("");
        var str = "";
        if (typeof data.result != "string") {
            str = data.result[0].body.innerText;
        }
        else {
            str = data.result;
        }
        if (str) {
            //通过 data.response.Json对象属性 获得返回数据
            var gmlfile = str;
            //gmlfile = "/XMLFile/c4643d87-398d-4d03-87b6-65055dc8ea2f.xml";
            gmlfile = canonical_uri(encodeURI(gmlfile)).replace("Viewer/", "").replace("file:///", "");
            //console.log(gmlfile);
            var layerid = "imptoSelectlayer";
            //console.log(layerid);
            var layername = "导入面积选取目标";

            joGIS1.PM_RemoveLayer(layername);
            joGIS1.PM_CreateLayer(layername, 0);
            joGIS1.PM_SetCurrentLayer(layername);

            var url = "DemoData/xml/StyleSheet/GeoMapUseSelected.css";
            var styleSheet = canonical_uri(encodeURI(url)).replace("Viewer/", "").replace("file:///", "");
            var r = joGIS1.PM_LoadStyleSheet(styleSheet, 0);
            //console.log(r);
            r = joGIS1.PM_Load3GXData(layername, gmlfile, 0);
            //console.log(r);

            //获取加入的图元
            var lpszID = joGIS1.PM_GetElementID(layername, 0);
            var lpszLayers = "";

            //设置图层
            for (var i = 0; i < joGIS1.PM_GetLayerCount() ; i++) {
                layer = joGIS1.PM_GetLayerName(i);
                joGIS1.PM_SetLayerStatus(layer, 1, 1);

                if (layer != layer)
                    lpszLayers += layer + ",";
            }
            //console.log(lpszLayers);

            //多边形选择
            var sel = joGIS1.SelectWithinPolygon(lpszID, 9, 1, lpszLayers);//只能选择井位
            //console.log(sel);
            var selcount = joGIS1.PM_GetSelElementCount();
            //console.log(selcount);

            //隐藏多边形图层
            //joGIS1.PM_SetLayerStatus(layername, 0, 0);

            //加载图层
            global_layersdata = getMapLayers();
            loadTable(layerTable, global_layersdata);
        }
    }); 

    //井投影
    $("#well_popover").popover({
        trigger: "click",
        placement: "left",
        template: '<div class="popover" role="tooltip"><div class="arrow"><iframe scrolling=no style="background-color: transparent; position: absolute; z-index: 0; width: 11px; height: 22px;; top: -11px; left: -11px;border:1px solid transparent;border-top:0;"></iframe></div><div class="popover-content" style="position:relative;z-index:2;"></div>' +
            '<iframe scrolling=no style="background-color: transparent; position: absolute; z-index: 0; width: 100%; height: 100%; top: 1px; left: 0;border:none;"></iframe></div>',
        html: true,
        content: function () {
            return $("#well_content").html();
        }
    }).on("shown.bs.popover", function () {
        //井投影 确定按钮 
        $("#well_sure").click(function () {
            $("#well_popover").popover("hide");
            newLayer();
        });
        //井投影 取消按钮 
        $("#well_cancel").click(function () {
            $("#well_popover").popover("hide");
        });
    });
    //面积投影
    $("#area-popover").popover({
        trigger: "click",
        placement: "left",
        template: '<div class="popover" role="tooltip"><div class="arrow"><iframe scrolling=no style="background-color: transparent; position: absolute; z-index: 0; width: 11px; height: 22px;; top: -11px; left: -11px;border:1px solid transparent;border-top:0;"></iframe></div><div class="popover-content" style="position:relative;z-index:2;"></div>' +
            '<iframe scrolling=no style="background-color: transparent; position: absolute; z-index: 0; width: 100%; height: 100%; top: 1px; left: 0;border:none;"></iframe></div>',
        html: true,
        content: function () {
            return $("#area_content").html();
        }
    }).on("shown.bs.popover", function () {
        //面积投影 确定按钮 
        $("#area_sure").click(function () {
            $("#area-popover").popover("hide");
            newAreaLayer(); //创建新图层 
        });
        //面积投影 取消按钮 
        $("#area_cancel").click(function () {
            $("#area-popover").popover("hide");
        });
    });

    var $uploader = $("#file-input3");
    $uploader.fileupload({
        acceptFileTypes: '.gdbx',
        autoUpload: true,
        maxNumberOfFiles: 1,
        maxFileSize: 5000000
    });

    $uploader.on('fileuploaddone', function (e, data) {
        var flag = false;
        $uploader.val("");
        $.each(data.files, function (index, file) {
            var name = file.name;
            if (!name || name == "") {
                alert("请选择文件!");
                flag = true;
            }
            var type = name.substring(name.lastIndexOf('.'));
            if (type.toLowerCase() != ".gdbx") {
                alert("请选择GDBX图件!");
                flag = true;
            }
        });
        if (flag) return;
        var url = $uploader.val();
        importMap(url);
        reloadDataLayer();
    });

    //上传文件
    var $fileInput = $("#file-input2");
    $fileInput.fileinput({
        language: 'zh',
        showPreview: false,
        showCaption: false,
        showUpload: false,
        showRemove: false,
        showPreview: false,
        browseClass: '',
        browseLabel: '',
        browseIcon: '<a><i class="fa fa-folder-open"></i>&nbsp;数据投影</a>'
    });

    $fileInput.on('fileloaded', function (event, file, previewId, index) {
        var name = file.name;
        if (!name || name == "") {
            toastr["error"]("请选择文件!", "错误");
            return;
        }
        var type = name.substring(name.lastIndexOf('.'));
        if (type.toLowerCase() != ".gdbx") {
            toastr["error"]("请选择GDBX图件!", "错误");
            return;
        }
        var url = $("#file-input2").val();
        importMap(url);
        reloadDataLayer();
    });
}

var importMap = function (url) {
    //PM_ImportMap (ByVal lpszFileAs  String,  ByVal  nFlag  As Long,  ByVal  nShowDlg As Long) As Long
    //lpszFile ——要加载的图件路径(URL)；  nFlag  ——加载标志，0加载磁盘文件，1加载Base64编码的内存流；nShowDlg ——是否显示图层列表对话框，0不显示，1显示  
    joGIS1.PM_ImportMap(url, 0, 1);
}

var reloadDataLayer = function () {
    mapLayerStyle();
    updateMapLayerTable();
}

var getFileFolderPath = function () {
    var Folder = null;
    try {
        var Message = "\u8bf7\u9009\u62e9\u6587\u4ef6\u5939"; //选择框提示信息
        var Shell = new ActiveXObject("Shell.Application");
        Folder = Shell.BrowseForFolder(0, Message, 64, 17); //起始目录为：我的电脑 //Folder = Shell.BrowseForFolder(0, Message, 0); //起始目录为：桌面 
        if (Folder) {
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
        alert("请添加本站点为受信任的站点，并将‘对未标记为可安全执行脚本的ActiveX控件初始化并执行脚本’设置为启用");
    }
};
/**
*开采现状事件绑定
*/
var statusEventBind = function (target) {
    //初始化时间选择器和颜色选择器

    $("#specifiedDate", ".popover-content").datetimepicker({
        startView: 3,
        minView: 3,
        viewSelect: 3,
        language: "zh-CN",
        format: "yyyy-mm",
        autoclose: true,
        pickerPosition: "bottom-left"
    });
    var date = new Date();
    $("#specifiedDate", ".popover-content").data("datetimepicker").setDate(date);

    $("#oilColor", ".popover-content").colorpicker({ format: 'rgb' });
    $("#gasColor", ".popover-content").colorpicker({ format: 'rgb' });
    $("#waterColor", ".popover-content").colorpicker({ format: 'rgb' });
    $("#inWaterColor", ".popover-content").colorpicker({ format: 'rgb' });
    //数字选择
    $('.spinner .btn:first-of-type', ".popover-content").on('click', function () {
        var btn = $(this);
        var input = btn.closest(".spinner").find("input");
        input.val(parseInt(input.val(), 10) + 1);
    });
    $('.spinner .btn:last-of-type', ".popover-content").on('click', function () {
        var btn = $(this);
        var input = btn.closest(".spinner").find("input");
        var curValue = parseInt(input.val(), 10) - 1;
        if (curValue < 0) {
            curValue = 0;
        }
        input.val(curValue);
    });

    //确定、取消按钮事件
    $("#tool_status_ok", ".popover-content").click(function () {
        $("#status_popover").popover("hide");
        loadThemeData();
    });
    $("#tool_status_cancel", ".popover-content").click(function () {
        $("#status_popover").popover("hide");
    });
};
//专题图投影
var loadThemeData = function () {
    if (!wellElements) {
        wellElements = getWellElements();
    }
    //经过上面填充数据还是不存在井位，则不进行投影
    if (!wellElements) {
        return;
    }

    //井型：采油井，采气井
    var wellType = $("#wellType").val();
    //数据类型：日产图，累产图
    var status = $("#dataType").val();
    //数据源，数组
    var dataSouce = [];
    //缩小dom范围，因为页面有隐藏的部分
    $(".popover-content input[name='checkWellData']:checked").each(function () {
        dataSouce.push($(this).val());
    });


    //日期
    var date = $("#specifiedDate").data("datetimepicker").getDate();
    var month = date.getMonth() + 1;
    var specifiedDate = date.getFullYear() + ((month < 10 ? "0" : "") + month);

    //图型
    var patternType = $("#patternType").val();
    //颜色
    var oilColor = $("#oilColor input:first").val();
    var gasColor = $("#gasColor input:first").val();
    var waterColor = $("#waterColor input:first").val();
    var inWaterColor = $("#inWaterColor input:first").val();
    //缩放比例
    var oilDisPar = $("#oilDisPar").val();
    var gasDispPar = $("#gasDispPar").val();
    var waterDispPar = $("#waterDispPar").val();
    var inWaterDispPar = $("#inWaterDispPar").val();

    //获取不同图型的样式表路径
    var themeTempletData = {
        PatternType: patternType,
        OilColor: oilColor,
        GasColor: gasColor,
        WaterColor: waterColor,
        inWaterColor: inWaterColor,
        OilDispPar: oilDisPar,
        GasDispPar: gasDispPar,
        WaterDispPar: waterDispPar,
        inWaterDispPar: inWaterDispPar,
        SourceData: dataSouce
    };
    //var themeTemp = canonical_uri(encodeURI("DemoData/xml/ThemTemeplet/ThemeTemplet-全饼图.xml")).replace("Viewer/", "").replace("file:///", "");
    //var themeData = canonical_uri(encodeURI("DemoData/xml/ThemTemeplet/LinkTableTheme.xml")).replace("Viewer/", "").replace("file:///", "");

    //joGIS1.PM_CreateLayer("生产现状图", 0);
    //joGIS1.PM_SetCurrentLayer("生产现状图");

    //var ret = joGIS1.PM_LoadThemeData("生产现状图", themeTemp, themeData, 0);
    //console.log(ret);
    //global_layersdata = getMapLayers();
    //loadTable(layerTable, global_layersdata);
    $.ajax({
        url: "/Viewer/GetThematicMapXml",
        type: "post",
        data: { boId: wellElements, columns: status, date: specifiedDate, themeTempletJson: JSON.stringify(themeTempletData) },
        success: function (result) {
            //var themeTemp = canonical_uri(encodeURI("DemoData/xml/ThemTemeplet/ThemeTemplet-全饼图.xml")).replace("Viewer/", "").replace("file:///", "");
            var themeTemp = canonical_uri(encodeURI(result.stylePath)).replace("Viewer/", "").replace("file:///", "");
            var themeData = canonical_uri(encodeURI(result.dataPath)).replace("Viewer/", "").replace("file:///", "");

            //joGIS1.PM_RemoveLayer("生产现状图");
            joGIS1.PM_CreateLayer("生产现状图", 0);
            joGIS1.PM_SetCurrentLayer("生产现状图");

            var ret = joGIS1.PM_LoadThemeData("生产现状图", themeTemp, themeData, 0);
            console.log(ret);
            joGIS1.PM_RemoveLayer("生产现状图");

            //加载图层
            global_layersdata = getMapLayers();
            loadTable(layerTable, global_layersdata);
        },
        error: function (message) {
            console.log(message);
        }
    });
};
var getWellData = function () {
    var point = joGIS1.PM_GetUserRect().split(' ');
    if (!(point && point.length > 1)) return;
    var a = joGIS1.PM_UPtoLL(point[0], point[1]);
    var b = joGIS1.PM_UPtoLL(point[2], point[1]);
    var c = joGIS1.PM_UPtoLL(point[2], point[3]);
    var d = joGIS1.PM_UPtoLL(point[0], point[3]);
    var e = joGIS1.PM_UPtoLL(point[0], point[1]);
    var bboxStr = "POLYGON((" + a + "," + b + "," + c + "," + d + "," + e + "))";
    var param = {
        "bot": "井",
        "bbox": bboxStr
    };
    if (!wellElements) {
        wellElements = getWellElements();
    }
    if (wellElements) {
        param.bos = wellElements;
    }
    $.ajax({
        url: "/BOAPI/GetBOListByFilter",
        type: "post",
        data: JSON.stringify(param),
        contentType: 'application/json',
        success: function (result) {
            wellBoData = result;


            //井别
            var wellClass$ = $(".popover [name='wellClass']");
            var wellClass = Enumerable.From(result).GroupBy("$.WELLCLASS", null,
                function (key, g) {
                    if (key) {
                        wellClass$.append("<option value='" + key + "'>" + key + "</option>");
                        return key;
                    }
                }).ToArray();

            //井型
            //var wellModel$ = $(".popover [name='wellModel']");
            //var wellModel = Enumerable.From(result).GroupBy("$.WELLMODEL", null,
            //                function (key, g) {
            //                    if (key) {
            //                        wellModel$.append("<option value='" + key + "'>" + key + "</option>");
            //                        return key;
            //                    }

            //                }).ToArray();

            //井位结果显示
            var wellResult$ = $(".popover [name='wellResult']");
            var item = null;
            for (var i = 0; i < result.length; i++) {
                item = result[i];
                wellResult$.append("<label class='checkbox-inline'><input type='checkbox' name='wellDataSource' value='" + item.NAME + "'>" + item.NAME + "</label>")
            }
        }
    });
};

//开发曲线事件绑定
var curveEventBind = function () {
    //全选
    $(".popover-content input[name='checkAll']").click(function (e) {
        $(".popover-content input[name='wellDataSource']").prop("checked", $(this).is(':checked'));
    });


    $("#wellSearch").click(function () {
        if (wellBoData) {
            var wellClass = $(".popover [name='wellClass']").val();
            var resultDom = "";
            var wellResult$ = $(".popover [name='wellResult']");

            if (wellClass && wellClass!="") {

                Enumerable.From(wellBoData)
                    .Where("x=>x.WELLCLASS=='" + wellClass + "'")
                    .ForEach(function (item) {
                        resultDom += "<label class='checkbox-inline'><input type='checkbox' name='wellDataSource' value='" + item.NAME + "'>" + item.NAME + "</label>";
                    });
                
            } else {

                Enumerable.From(wellBoData).ForEach(function (item) {
                    resultDom += "<label class='checkbox-inline'><input type='checkbox' name='wellDataSource' value='" + item.NAME + "'>" + item.NAME + "</label>";
                });
            }

            wellResult$.html(resultDom);
        }
    });

    $("#fromDate").datetimepicker({
        startView: 3,
        minView: 3,
        language: "zh-CN",
        format: "yyyy-mm",
        initialDate: lastYear,
        autoclose: true,
        pickerPosition: "bottom-left"
    });
    $("#toDate").datetimepicker({
        startView: 3,
        minView: 3,
        language: "zh-CN",
        format: "yyyy-mm",
        initialDate: date,
        autoclose: true,
        pickerPosition: "bottom-left"
    });

    var date = new Date();
    var year = date.getFullYear() - 1;
    var month = date.getMonth();

    var lastYear = new Date(year, month, date.getDate());


    $("#fromDate").data("datetimepicker").setDate(lastYear);
    $("#toDate").data("datetimepicker").setDate(date);

    $(".popover .colorpicker-component").colorpicker({ format: "hex" });

    //开发曲线模板值更改事件
    $(".popover select[name='curveTemplat']").change(function (e) {

        //先恢复默认设置，因为模板并不是存储所有的值
        $(".popover input[name='checkDataSouce']").prop("checked", false);
        var curveDefaultColors = currentViewModel.curveMode();
        if (curveDefaultColors && curveDefaultColors.length > 0) {
            var colorItem = null;
            for (var i = 0; i < curveDefaultColors.length; i++) {
                colorItem = curveDefaultColors[i];
                $(".popover input[name='checkDataSouce'][value='" + colorItem.KEY + "']").parent().parent().find(".colorpicker-component").colorpicker('setValue', colorItem.VALFORMAT);

            }
        }
        var dptempid = $(e.target).val();
        $.ajax({
            url: "/UserDataAPI/GetAppDProfileByUser",
            async: true,
            type: "get",
            data: { dptempid: dptempid },
            success: function (result) {

                if (result && result.length > 0) {
                    var item = null;
                    var check$ = null
                    for (var i = 0; i < result.length; i++) {
                        item = result[i];

                        check$ = $(".popover input[name='checkDataSouce'][value='" + item.key + "']");

                        check$.prop("checked", true)
                        check$.parent().parent().find(".colorpicker-component").colorpicker('setValue', item.valformat);
                    }
                }
            }
        });
    });

    //开发曲线模板选中默认值
    var selectedTemplate = ko.utils.arrayFirst(currentViewModel.curveTemplate(), function (item) {
        return item.isdefault == 1;
    });
    if (selectedTemplate) {
        $(".popover select[name='curveTemplat']").val(selectedTemplate.dptempid);
        $(".popover select[name='curveTemplat']").change();
    }


    $("#tool_curve_cancel").click(function () {
        $("#curve_popover").popover("hide");
    });

    $("#curve_modal").on("show.bs.modal", function (e) {
        var options = {};
        var wellDataSource = [];
        var dataSource = [];
        //井位数据源
        var wellCheckDataSouce$ = $(".popover-content input[name='wellDataSource']:checked");
        if (!wellCheckDataSouce$ || wellCheckDataSouce$.length == 0) {
            return e.preventDefault();
        } else {
            wellCheckDataSouce$.each(function () {
                var key = $(this).val();
                wellDataSource.push(key);
            });
        }
        //曲线显示数据源
        var checkDataSouce$ = $(".popover-content input[name='checkDataSouce']:checked");
        if (!checkDataSouce$ || checkDataSouce$.length == 0) {
            return e.preventDefault();
        } else {
            checkDataSouce$.each(function () {
                var key = $(this).val();
                dataSource.push(key);
                var color = $(this).parent().siblings().find("input").val();
                options[key] = { "color": color, "type": $(this).data("type"), "name": $(this).data("name") };
            });
        }

        //时间范围
        var fromDate = $("#fromDate").data("datetimepicker").getDate();
        var fromMonth = fromDate.getMonth() + 1;
        var fromDateData = fromDate.getFullYear() + (fromMonth < 10 ? "0" : "") + fromMonth;

        var toDate = $("#toDate").data("datetimepicker").getDate();
        var toMonth = toDate.getMonth() + 1;
        var toDateData = toDate.getFullYear() + (toMonth < 10 ? "0" : "") + toMonth;

        var dataclassId = 8;
        var boId = wellDataSource.join(',');
        var column = dataSource.join(',');
        var keyCount = dataSource.length;

        echarts.dispose($("#curve_pane")[0]);

        var data = { dataclassId: dataclassId, boId: boId, column: column, startNY: fromDateData, endNY: toDateData };
        $.ajax({
            url: "/Viewer/GetMiningChart",
            type: "post",
            data: data,
            dataType: "json",
            success: function (result) {
                if (result && result.length > 0) {
                    drawOmbinedCurve(options, result, keyCount);
                }
            }
        });
    });

};

/**
 * 开发曲线图
 * @returns {} 
 */
var drawOmbinedCurve = function (options, result, keyCount) {
    if (!options) {
        return;
    }

    var grid = [];
    var xAxis = [];
    var yAxis = [];
    var series = [];
    var colors = [];

    var dataZoomIndex = [];
    var avgHeight = 90 / keyCount;
    var height = (avgHeight - 5) + "%";
    var y = 0;

    var i = 0;
    var xData = [];
    for (var key in result[0]) {
        var yData = [];
        for (var j = 0; j < result.length; j++) {
            var temp = result[j];
            if (key == "NY") {
                xData.push(temp[key]);
            } else {
                yData.push(temp[key]);
            }
        }
        if (key == "NY") continue;

        y = (avgHeight * i + 2) + "%";
        var option = options[key];
        var color = option.color;
        var name = option.name;
        var type = option.type;

        dataZoomIndex.push(i);
        grid.push({
            left: "10%", top: y, right: "2%", height: height
        });
        colors.push(color);
        xAxis.push({
            gridIndex: i, type: "category", data: xData
        });
        yAxis.push({
            gridIndex: i, type: "value", name: name, nameLocation: "middle", nameRotate: "90", nameGap: 50, splitNumber: 2, minInterval: 1
        });
        series.push({
            name: name, type: type, xAxisIndex: i, yAxisIndex: i, data: yData
        });
        i++;
    }


    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init($("#curve_pane")[0]);

    var option = {
        tooltip: {
            trigger: "axis",
            formatter: "{a} {b}: ({c})"
        },
        grid: grid,
        axisPointer: {
            link: { xAxisIndex: 'all' }
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show: true,
                    pixelRatio: 1,
                    iconStyle: {
                        normal: {
                            textPosition: 'top'
                        }
                    }
                }
            },
            right: 20,
            top: -10,
            zlevel: 1
        },
        dataZoom: [
            {
                type: 'slider',
                show: true,
                orient: 'horizontal',
                xAxisIndex: dataZoomIndex

            }
        ],
        xAxis: xAxis,
        yAxis: yAxis,
        series: series,
        color: colors
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    myChart.resize();
};

//创建右键菜单
var createContextMenu = function () {
    //joGIS1.PM_ResetTools();
    // 定制右键菜单测试
    joGIS1.PM_AddTool(0);//选择
    joGIS1.PM_AddTool(13);//放大
    joGIS1.PM_AddTool(14);//缩小
    joGIS1.PM_AddTool(15);//移动/手势
    joGIS1.PM_AddTool(17);//复位
    // 定制自定义菜单测试
    joGIS1.PM_AddCustomTool("下载", 99);//菜单开始
}
//获取图件信息
var getMapInfo = function (iiid) {
    var data = null;
    $.ajax({
        url: global_api_url + "/SearchService/GetMetadata?iiid=" + iiid,
        async: false,
        type: "get",
        success: function (result) {
            if (result) {
                data = { iiid: result.iiid };

                if (result.source && result.source.url) {
                    data.sourceUrl = result.source.url;
                }
                if (result.dc && result.dc.title) {
                    for (var k = 0; k < result.dc.title.length; k++) {
                        var title = result.dc.title[k];
                        if (title.type === "Formal") {
                            data.title = title.text;
                            data.name = title.text ? title.text.split(".")[0] : "";
                        }
                    }
                }
                if (result.dc && result.dc.contributor) {
                    for (var j = 0; j < result.dc.contributor.length; j++) {
                        var contributor = result.dc.contributor[j];
                        if (contributor.type === "Author") {
                            data.author = contributor.name;
                        }
                        if (contributor.type === "Auditor") {
                            data.auditor = contributor.name;
                        }
                        if (contributor.type === "Drawer") {
                            data.drawer = contributor.name;
                        }
                    }
                }
                if (result.dc && result.dc.date) {
                    for (var q = 0; q < result.dc.date.length; q++) {
                        var date = result.dc.date[q];
                        if (date.type === "Created") {
                            data.createdDate = date.value;
                        }
                    }
                }
                if (result.ep && result.ep.producttype) {
                    data.productType = result.ep.producttype;
                }
            }
        }
    });
    return data;
};
/**
 * 加载JoGis组件
 * @returns {} 
 */
var loadGeoMap = function (url) {
    $.ajax({
        url: global_api_url + "/DataService/Retrieve?url=" + url,
        type: "get",
        success: function (retrieveData) {
            /**返回值样式
             * [
                  {
                    "name": "TRC48.ppt",
                    "ticket": "SQL适配器域1___SUQ9NTg2Mw==___5853",
                    "major": true,
                    "format": "PPT",
                    "total": -1,
                    "unit": "None"
                  }
                ]
             */
            var ticket = retrieveData[0].ticket;
            var format = retrieveData[0].format;
            currentViewModel.currentMap().ticket = ticket;
            currentViewModel.currentMap().format = format;

            currentViewModel.updateResultMaps(currentViewModel.currentMap());

            loadMapFile(url, ticket);

        }
    });

};
//加载地图文件
var loadMapFile = function (url, ticket) {
    var gdbFileUrl = encodeURI(global_api_url +
                    "/DataService/GetData?url=" +
                    url +
                    "&ticket=" +
                    ticket);

    JoGis4.options.GDBPath = gdbFileUrl;

    JoGis4.loadGeoMapFile();
    //加载图层
    global_layersdata = getMapLayers();
    loadTable(layerTable, global_layersdata);
};
//加载图层表格数据
var loadTable = function (table, jsondata) {
    table.jqGrid("clearGridData");
    table.jqGrid("setGridParam", { data: jsondata }).trigger("reloadGrid");
};
//获取图件图层Json
var getMapLayers = function () {
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

        var statuse = joGIS1.PM_GetLayerStatus_S(layerName).split(" ");
        //是否可见
        entity.visable = statuse[0];
        //是否可选
        entity.unlocked = statuse[1];

        json.push(entity);

        //重新计算图元记录号        
        joGIS1.RecalcRecNo(layerName);

        entity = {};
    }
    return json;
};

//加载图层表格
var renderMapLayerTable = function () {


    function visableFmatter(cellvalue, options, rowObject) {
        if (cellvalue == 1) {
            return '<a href="javascript:void(0);" data-value="' + cellvalue + '" title="显示/隐藏"><i class="fa fa-eye"></i></a>';
        } else {
            return '<a href="javascript:void(0);" data-value="' + cellvalue + '" title="显示/隐藏"><i class="fa fa-eye-slash"></i></a>';
        }
    }

    function visibleUnFmatter(cellvalue, options, cell) {
        return $("a", cell).data("value");
    }
    function lockFmatter(cellvalue, options, rowObject) {
        if (cellvalue == 1) {
            return '<a href="javascript:void(0);" data-value="' + cellvalue + '" title="解锁/锁定"><i class="fa fa-unlock"></i></a>';
        }
        else {
            return '<a href="javascript:void(0);" data-value="' + cellvalue + '" title="解锁/锁定"><i class="fa fa-lock"></i></a>';
        }
    }
    function lockUnFmatter(cellvalue, options, rowObject) {
        return $("a", cell).data("value");
    }
    // Configuration for jqGrid
    layerTable.jqGrid({
        //data: jsondata,
        datatype: "local",
        //height:480,
        autowidth: true,
        shrinkToFit: true,
        rowNum: 1000,
        //rowList: [10, 20, 30],
        rownumbers: true,
        rownumWidth: 25, // the width of the row numbers columns
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
                width: 108,
                sortable: false
            },
			{
			    name: 'visable',
			    index: 'visable',
			    label: "见",
			    width: 40,
			    align: "center",
			    formatter: visableFmatter,
			    unformat: visibleUnFmatter,
			    sortable: false
			},
			{
			    name: 'unlocked',
			    index: 'unlocked',
			    label: "选",
			    width: 40,
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
                entity.visable = entity.visable == 1 ? 0 : 1;

                joGIS1.PM_SetLayerStatus(entity.layName, entity.visable, entity.unlocked);
                //更新jqgrid值
                $(this).jqGrid("setCell", rowid, 'visable', entity.visable);
            }
            if (icol == 4) {
                //更新GeoMapJson
                entity.unlocked = entity.unlocked == 1 ? 0 : 1;

                joGIS1.PM_SetLayerStatus(entity.layName, entity.visable, entity.unlocked);
                //更新jqgrid值
                $(this).jqGrid("setCell", rowid, 'unlocked', entity.unlocked);
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
/**
 * 同步grid与map图层数据
 * @param {} data 
 * @param {} layId 
 * @returns {} 
 */
var getCurLayer = function (data, layId) {
    //筛选
    var queryresult = Enumerable.From(data)
        //.Where(function (i) { console.log(i.parent); return i.parent==parentid; });
        .Where("x=>x.layId=='" + layId + "'").ToArray();
    return queryresult[0];
}

//初始渲染图数表格
var initDataTable = function () {
    $.ajax({
        url: "/Viewer/GetDataColumns",
        type: "post",
        success: function (result) {
            //var data = result.data;
            var data = JSON.parse(result);

            var drillBase = data[drillingBaseTableType];
            if (drillBase) {
                renderTable(drillingBaseTable, drillBase.colNames, drillBase.colModel, "#drilling_base_pager");
            }

            var reservesOil = data[reservesOilTableType];
            if (reservesOil) {
                renderTable(reservesOilTable, reservesOil.colNames, reservesOil.colModel, "#reserves_oil_pager");
            }

            var reservesGas = data[reservesGasTableType];
            if (reservesGas) {
                renderTable(reservesGasTable, reservesGas.colNames, reservesGas.colModel, "#reserves_gas_pager");
            }

            var capacityHeavy = data[capacityHeavyTableType];
            if (capacityHeavy) {
                renderTable(capacityHeavyTable, capacityHeavy.colNames, capacityHeavy.colModel, "#capacity_heavy_pager");
            }

            var capacityDilute = data[capacityDiluteTableType]
            if (capacityDilute) {
                renderTable(capacityDiluteTable, capacityDilute.colNames, capacityDilute.colModel, "#capacity_dilute_pager");
            }

            var capacityWater = data[capacityWaterTableType];
            if (capacityWater) {
                renderTable(capacityWaterTable, capacityWater.colNames, capacityWater.colModel, "#capacity_water_pager");
            }

            var capacityGas = data[capacityGasTableType];
            if (capacityGas) {
                renderTable(capacityGasTable, capacityGas.colNames, capacityGas.colModel, "#capacity_gas_pager");
            }

        },
        error: function (message) {
            console.log(message);
        }
    });
};

var renderTable = function (table, colNames, colModel, pagerFlag) {
    table.jqGrid({
        datatype: "local",
        colNames: colNames,
        colModel: colModel,
        rowNum: 10,
        autowidth: true,
        rowList: [10, 20, 30],
        pager: pagerFlag,
        viewrecords: true,
        autoresizeOnLoad: true,
        cmTemplate: { autoResizable: true },
        sortorder: "desc",
        guiStyle: "bootstrap",
        iconSet: "fontAwesome"
    });
    table.jqGrid('navGrid', pagerFlag, { add: false, edit: false, del: false, search: false, refresh: false });
    table.jqGrid('navButtonAdd', pagerFlag, {
        caption: "显示隐藏列",
        title: "选择列",
        buttonicon: "fa-window-maximize",
        onClickButton: function () {
            table.jqGrid('columnChooser', {
                width: 550,
                dialog_opts: {
                    modal: true,
                    minWidth: 470,
                    height: 350,
                    show: 'blind',
                    hide: 'explode',
                    dividerLocation: 0.5
                }
            });
        }
    });
    table.jqGrid('navButtonAdd', pagerFlag, {
        caption: "导出表格",
        title: "导出",
        onClickButton: function () {
            var id$ = "#" + table.attr("id");
            ExportJQGridDataToExcel(id$, "CustomerOrders.xlsx");
        }
    });
};

//加载图数表格数据
var getTableDataByBo = function (typeId, boId, table) {
    var boid = boId.join(',');

    $.ajax({
        url: "/Viewer/GetDataByType",
        type: "post",
        data: { typeId: typeId, boId: boid },
        success: function (result) {
            if (result && result.length > 0) {
                loadTable(table, result);
            } else {
                loadTable(table, []);
            }
        },
        error: function (message) {
            console.log(message);
        }
    });
}
//选择图件上的图元 事件
function joGIS1::OnSelectOneElement(type, id) {

}
//选择图件上的图元 事件
function joGIS1::SelectedElement(nCount) {
    if (nCount == 0) {
        //重置井位选中值
        wellElements = null;
        return;
    }
    var wellBoIds = [];
    var resBoIds = [];
    var sID = "";
    var caption = "";
    var typeId = "";
    for (var i = 0; i < nCount; i++) {
        sID = joGIS1.PM_GetSelElementID(i);
        typeId = joGIS1.PM_GetElementType(sID);
        caption = joGIS1.PM_GetElementCaption(sID);
        if (typeId == 11) {
            wellBoIds.push(caption);
        }
        if (typeId == 3) {
            resBoIds.push(caption);
        }
    }
    if (wellBoIds.length > 0) {
        wellElements = wellBoIds;

        getTableDataByBo(drillingBaseTableType, wellElements, drillingBaseTable);

        getTableDataByBo(capacityHeavyTableType, wellElements, capacityHeavyTable);
        getTableDataByBo(capacityDiluteTableType, wellElements, capacityDiluteTable);
        getTableDataByBo(capacityWaterTableType, wellElements, capacityWaterTable);
        getTableDataByBo(capacityGasTableType, wellElements, capacityGasTable);


        //var activeTabIndex = parseInt($("#bottom_pane .active").children(":first").attr("tabindex"));
        //var table = null;
        //switch (activeTabIndex) {
        //    case drillingBaseTableType:
        //        table = drillingBaseTable;
        //        break;
        //    case reservesOilTableType:
        //        table = reservesOilTable;
        //        break;
        //    case reservesGasTableType:
        //        table = reservesGasTable;
        //        break;
        //    case capacityHeavyTableType:
        //        table = capacityHeavyTable;
        //        break;
        //    case capacityDiluteTableType:
        //        table = capacityDiluteTable;
        //        break;
        //    case capacityWaterTableType:
        //        table = capacityWaterTable;
        //        break;
        //    case capacityGasTableType:
        //        table = capacityGasTable;
        //        break;
        //    default:
        //        break;
        //}
        //getTableDataByBo(activeTabIndex, wellElements, table);
    }
    if (resBoIds.length > 0) {
        getTableDataByBo(reservesOilTableType, resBoIds, reservesOilTable);
        getTableDataByBo(reservesGasTableType, resBoIds, reservesGasTable);
    }
}

//添加用户浏览记录
var addUserBehavior = function (item) {
    $.ajax({
        url: "/Viewer/UpdateLook",
        async: true,
        type: "post",
        data: { iiid: item.iiid, metaPT: item.productType, metaTitle: item.title, metaAuthor: item.author, metaSourceUrl: item.sourceUrl, metaCreateDate: item.createdDate, metaIndexDate: item.indexedDate },
        success: function (result) {
            if (result) {

            }
        }
    });
};

// 井位数据投影新增层
function newLayer() {
    mapLayerStyle();
    var d = new Date();
    var strDate = "" + d.getHours() + "时" + d.getMinutes() + "分" + d.getSeconds() + "秒";
    var name = "井位投影" + strDate;
    createLayer(name);
}

// 面积投影新增层
function newAreaLayer() {
    mapLayerStyle();
    var d = new Date();
    var strDate = "" + d.getHours() + "时" + d.getMinutes() + "分" + d.getSeconds() + "秒";
    var name = "面积投影" + strDate;
    createAreaLayer(name);
}

/// 创建井动态图层
function createLayer(name) {
    joGIS1.PM_RemoveLayer(name);
    joGIS1.PM_CreateLayer(name, 0);
    joGIS1.PM_SetCurrentLayer(name);

    var point = joGIS1.PM_GetUserRect().split(' ');
    if (!(point && point.length > 1)) return;
    var a = joGIS1.PM_UPtoLL(point[0], point[1]);
    var b = joGIS1.PM_UPtoLL(point[2], point[1]);
    var c = joGIS1.PM_UPtoLL(point[2], point[3]);
    var d = joGIS1.PM_UPtoLL(point[0], point[3]);
    var e = joGIS1.PM_UPtoLL(point[0], point[1]);
    var bboxStr = "POLYGON((" + a + "," + b + "," + c + "," + d + "," + e + "))";
    var obj = {
        "ft": "井位",
        "bbox": bboxStr
    };
    var filterArray = [];

    var value = null;
    var filter = null;
    //弹出层下拉选项
    $(".popover select[name='wellSelect']").each(function () {
        value = $(this).val();
        filter = {};
        if (value && value != "") {
            filter["基础参数." + $(this).data("type")] = value;
            filterArray.push(filter);
        }
    });


    if (filterArray && filterArray.length > 0) {
        obj.filter = {
            "$and": filterArray
        };
    }

    var json = JSON.stringify(obj);
    $.ajax({
        type: "post",
        url: "/BOAPI/GetFeatures",
        data: json,
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        success: function (strXml) {
            var currentBOT = "";
            var style = "";
            switch (currentBOT) {
                case "盆地":
                    style = "盆地";
                    break;
                case "油田":
                    break;
                case "油藏":
                    break;
                case "":
                    style = "s200000";
                    break;
            }
            var url = "DemoData/xml/StyleSheet/GeoMap_" + style + ".css";
            var styleSheet = canonical_uri(encodeURI(url)).replace("Viewer/", "").replace("file:///", "");
            console.log(joGIS1.PM_LoadStyleSheet(styleSheet, 0));
            console.log(joGIS1.PM_Load3GXData(name, strXml, 1));

            updateMapLayerTable();
        },
        error: function (ob, errStr) {
            console.log(errStr);
        }
    });
}
//创建面积动态图层
var createAreaLayer = function (name) {
    joGIS1.PM_RemoveLayer(name);
    joGIS1.PM_CreateLayer(name, 0);
    joGIS1.PM_SetCurrentLayer(name);

    var point = joGIS1.PM_GetUserRect().split(' ');
    if (!(point && point.length > 1)) return;
    var a = joGIS1.PM_UPtoLL(point[0], point[1]);
    var b = joGIS1.PM_UPtoLL(point[2], point[1]);
    var c = joGIS1.PM_UPtoLL(point[2], point[3]);
    var d = joGIS1.PM_UPtoLL(point[0], point[3]);
    var e = joGIS1.PM_UPtoLL(point[0], point[1]);
    var bboxStr = "POLYGON((" + a + "," + b + "," + c + "," + d + "," + e + "))";
    var obj = {
        "ft": "含油气面积",
        "bbox": bboxStr
    };

    var filterArray = [];

    var value = null;
    var filter = null;
    //弹出层下拉选项
    $(".popover select[name='areaSelect']").each(function () {
        value = $(this).val();
        filter = {};
        if (value && value != "") {
            filter["基础参数." + $(this).data("type")] = value;
            filterArray.push(filter);
        }
    });

    if (filterArray && filterArray.length > 0) {
        obj.filter = {
            "$and": filterArray
        }
    };

    var json = JSON.stringify(obj);
    $.ajax({
        type: "post",
        url: "/BOAPI/GetFeatures",
        data: json,
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        success: function (strXml) {
            //面积，井的样式单不一样，要区别处理
            var currentBOT = "";
            var style = "";
            switch (currentBOT) {
                case "盆地":
                    style = "盆地";
                    break;
                case "油田":
                    break;
                case "油藏":
                    break;
                case "":
                    style = "s200000";
                    break;
            }
            var url = "DemoData/xml/StyleSheet/GeoMap_" + style + ".css";
            var styleSheet = canonical_uri(encodeURI(url)).replace("Viewer/", "").replace("file:///", "");
            console.log(joGIS1.PM_LoadStyleSheet(styleSheet, 0));
            console.log(joGIS1.PM_Load3GXData(name, strXml, 1));

            //更新表格数据
            updateMapLayerTable();
        },
        error: function (ob, errStr) {
            console.log(errStr);
        }
    });
}


var loadWellData = function () {
    var para =
        {
            "bot": "井",
            "appdomain": "基础参数",
            "names": [
                { "name": "井型", "valuetype": "Fact" },
                { "name": "目前井别", "valuetype": "Fact" }
            ]
        };
    var json = JSON.stringify(para);
    $.ajax({
        type: "post",
        url: "/BOAPI/GetPropertyParams",
        data: json,
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        success: function (json) {
            if (json && json.length > 0) {
                for (var i = 0; i < json.length; i++) {
                    var name = json[i].name;
                    var value = json[i].values;
                    if (name == "井型") {
                        currentViewModel.availaleWellTypes(value);
                    }
                    if (name == "目前井别") {
                        currentViewModel.availaleWellBlocks(value);
                    }
                }
            }
        },
        error: function (ob, errStr) {
            console.log(errStr)
        }
    });
};
var loadAreaData = function () {
    var param =
        {
            "bot": "油气藏",
            "appdomain": "基础参数",
            "names": [
                { "name": "区带", "valuetype": "Fact" },
                { "name": "二级构造单元", "valuetype": "Fact" },
                { "name": "油气田", "valuetype": "Fact" },
                { "name": "井区块", "valuetype": "Fact" },
                { "name": "层位", "valuetype": "Fact" },
                { "name": "界", "valuetype": "Fact" },
                { "name": "系", "valuetype": "Fact" },
                { "name": "统", "valuetype": "Fact" },
                { "name": "组", "valuetype": "Fact" },
                { "name": "上报年度", "valuetype": "Fact" },
                { "name": "归属单位", "valuetype": "Fact" },
                { "name": "管理方式", "valuetype": "Fact" },
                { "name": "储量类型", "valuetype": "Fact" },
                { "name": "储量类别", "valuetype": "Fact" },
                { "name": "储量来源", "valuetype": "Fact" },
                { "name": "油气藏类型", "valuetype": "Fact" },
                { "name": "储层物性", "valuetype": "Fact" },
                { "name": "储层岩性", "valuetype": "Fact" },
                { "name": "岩性细分", "valuetype": "Fact" },
                { "name": "储量丰度", "valuetype": "Fact" },
                { "name": "资源类型", "valuetype": "Fact" },
                { "name": "原油密度", "valuetype": "Fact" },
                { "name": "边底水情况", "valuetype": "Fact" },
                { "name": "驱动类型", "valuetype": "Fact" },
                { "name": "储集类型", "valuetype": "Fact" },
                { "name": "胶结类型", "valuetype": "Fact" },
                { "name": "埋藏深度", "valuetype": "Fact" },
                { "name": "储层非均质程度", "valuetype": "Fact" },
                { "name": "地层压力", "valuetype": "Fact" }
            ]
        };
    var json = JSON.stringify(param);
    $.ajax({
        type: "post",
        async: true,
        url: "/BOAPI/GetPropertyParams",
        data: json,
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        success: function (result) {
            if (result) {
                for (var i = 0; i < result.length; i++) {
                    var name = result[i].name;
                    var value = result[i].values;
                    if (name == "区带") {
                        currentViewModel.zone(value);
                    } else if (name == "二级构造单元") {
                        currentViewModel.secondaryStructure(value);
                    } else if (name == "油气田") {
                        currentViewModel.oilfield(value);
                    } else if (name == "井区块") {
                        currentViewModel.wellBlocks(value);
                    } else if (name == "层位") {
                        currentViewModel.horizon(value);
                    } else if (name == "界") {
                        currentViewModel.sector(value);
                    } else if (name == "系") {
                        currentViewModel.series(value);
                    } else if (name == "统") {
                        currentViewModel.gather(value);
                    } else if (name == "组") {
                        currentViewModel.formation(value);
                    } else if (name == "段") {
                    }
                    else if (name == "上报年度") {
                        currentViewModel.annualReporting(value);
                    } else if (name == "归属单位") {
                        currentViewModel.manageUnits(value);
                    } else if (name == "管理方式") {
                        currentViewModel.manageMode(value);
                    } else if (name == "储量类型") {
                        currentViewModel.storageType(value);
                    } else if (name == "储量类别") {
                        currentViewModel.storageCategories(value);
                    } else if (name == "储量来源") {
                        currentViewModel.storageSource(value);
                    } else if (name == "油气藏类型") {
                        currentViewModel.reservoirType(value);
                    } else if (name == "储层物性") {
                        currentViewModel.reservoirPhysical(value);
                    } else if (name == "储层岩性") {
                        currentViewModel.reservoirLithology(value);
                    } else if (name == "岩性细分") {
                        currentViewModel.subdivisionLithology(value);
                    } else if (name == "储量丰度") {
                        currentViewModel.reservesAbundance(value);
                    } else if (name == "资源类型") {
                        currentViewModel.crudeTypes(value);
                    } else if (name == "原油密度") {
                        currentViewModel.crudeDensity(value);
                    } else if (name == "边底水情况") {
                        currentViewModel.edgeBottomWater(value);
                    } else if (name == "驱动类型") {
                        currentViewModel.driveTypes(value);
                    } else if (name == "储集类型") {
                        currentViewModel.saveType(value);
                    } else if (name == "胶结类型") {
                        currentViewModel.cementationTypes(value);
                    } else if (name == "埋藏深度") {
                        currentViewModel.burialDepth(value);
                    } else if (name == "储层非均质程度") {
                        currentViewModel.heterogeneousDegree(value);
                    } else if (name == "地层压力") {
                        currentViewModel.formationPressure(value);
                    }
                }
            }
        },
        error: function (ob, errStr) {

        }
    });
}

// 显示图层列表tab
function mapLayerStyle() {
    $(".tab-content").find("#mapTarget").removeClass("active");
    $(".tab-content").find("#mapLayer").addClass("active");

    $(".nav-tabs").find("#nav-1").removeClass("active");
    $(".nav-tabs").find("#nav-2").addClass("active");
}

var updateMapLayerTable = function () {
    //更新表格数据
    global_layersdata = getMapLayers();
    loadTable(layerTable, global_layersdata);
}