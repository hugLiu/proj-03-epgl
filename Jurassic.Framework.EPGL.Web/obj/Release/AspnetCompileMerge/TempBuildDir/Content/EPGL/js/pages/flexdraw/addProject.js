var jogis4_options = {
    Style: { border: "solid 1px #666", width: "100%" },
    ShowEagleEye: true,
    GDBPath: null
};
var JoGis4 = null;

var currentViewModel = null;

var global_layersdata = null;//全局，图件图层数据
var projectionLaysers = null;//全局，投影图层

var layerTable = $("#mapLayer_table"); //图层列表
/**
 * 每一个map tab的初始值
 * @param {} isActive 
 * @param {} mapName 
 * @returns {} 
 */
var MapItemViewModel = function (isActive, mapName) {

    var self = this;
    self.index = ko.observable();//算上原图，从0开始

    self.title = ko.pureComputed(function () {
        return self.index() == 0 ? "原图" : "新图";
    });

    self.isActive = ko.observable(isActive);

    self.mapName = ko.pureComputed(function () {
        return mapName + self.index();
    });
};

var ViewModel = function () {
    var self = this;

    self.mapTabItems = ko.observableArray([]);

    self.availaleWellTypes = ko.observableArray();//如果选项不变，可以不用设置成监听类型
    self.availaleWellBlocks = ko.observableArray();

    self.availaleMapNames = ko.observableArray();

    self.isOriginalMap = ko.observable(true);//默认为原图

    self.currentWellType = ko.observable();
    self.currentWellBlock = ko.observable();
    self.currentMapName = ko.observable(null);
    self.currentNewMapName = ko.observable(null);

    //** 面积投影参数
    self.zone = ko.observableArray();//区带
    self.currentZone = ko.observable(null);
    self.secondaryStructure = ko.observableArray();//二级构造
    self.currentSecondaryStructure = ko.observable(null);
    self.oilfield = ko.observableArray();//油田
    self.currentOilfield = ko.observable(null);
    self.wellBlocks = ko.observableArray();//井区块
    self.currentWellBlocks = ko.observable(null);
    self.horizon = ko.observableArray();//层位
    self.currentHorizon = ko.observable(null);
    self.sector = ko.observableArray();//界
    self.currentSector = ko.observable(null);
    self.series = ko.observableArray();//系
    self.currentSeries = ko.observable(null);
    self.gather = ko.observableArray();//统
    self.currentGather = ko.observable(null);
    self.formation = ko.observableArray();//组
    self.currentFormation = ko.observable(null);
    self.annualReporting = ko.observableArray();//上报年度
    self.currentAnnualReporting = ko.observable(null);
    self.manageUnits = ko.observableArray();//归属单位
    self.currentManageUnit = ko.observable(null);
    self.manageMode = ko.observableArray();//管理方式
    self.currentManageMode = ko.observable(null);
    self.storageType = ko.observableArray();//储量类型
    self.currentStorageType = ko.observable(null);
    self.storageCategories = ko.observableArray();//储量类别
    self.currentStorageCategory = ko.observable(null);

    self.storageSource = ko.observableArray();//储量来源
    self.currentStorageSource = ko.observable(null);
    self.reservoirType = ko.observableArray();//油气藏类型
    self.currentReservoirType = ko.observable(null);
    self.reservoirPhysical = ko.observableArray();//储层物性
    self.currentReservoirPhysical = ko.observable(null);
    self.reservoirLithology = ko.observableArray();//储层岩性
    self.currentReservoirLithology = ko.observable(null);
    self.subdivisionLithology = ko.observableArray();//岩性细分
    self.currentSubdivisionLithology = ko.observable(null);

    self.reservesAbundance = ko.observableArray();//储量丰度
    self.currentReservesAbundance = ko.observable(null);
    self.crudeTypes = ko.observableArray();//资源类型
    self.currentCrudeType = ko.observable(null);
    self.crudeDensity = ko.observableArray();//原油密度
    self.currentCrudeDensity = ko.observable(null);
    self.edgeBottomWater = ko.observableArray();//边底水情况
    self.currentEdgeBottomWater = ko.observable(null);
    self.driveTypes = ko.observableArray();//驱动类型
    self.currentDriveTypes = ko.observable(null);

    self.saveType = ko.observableArray();//储集类型
    self.currentSaveType = ko.observable(null);
    self.cementationTypes = ko.observableArray();//胶结类型
    self.currentCementationType = ko.observable(null);
    self.burialDepth = ko.observableArray();//埋藏深度
    self.currentBurialDepth = ko.observable(null);
    self.heterogeneousDegree = ko.observableArray();//储层非均质程度
    self.currentHeterogeneous = ko.observable(null);
    self.formationPressure = ko.observableArray();//地层压力
    self.currentFormationPressure = ko.observable(null);
    //** 面积投影参数

    self.addMapTabItem = function () {
        var newItem = new MapItemViewModel(true,self.currentMapName());
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
        if (result) {
            result.isActive(false);            
        }
        
        self.addMapTabItem();
        self.updateInfoByIndex(self.mapTabItems().length-1);
    }

    self.closeTab = function (data) {
        var index = data.index();
        self.mapTabItems.remove(data);

        //删除之后length改变了
        var length = self.mapTabItems().length;
        //如果是最后一个tab页，将此tab页之前的tab设置选中，之后没有tab不需要更改index
        if (index == length) {
            var lastItem = self.getTabByIndex(index-1);
            lastItem.isActive(true);

            self.updateInfoByIndex(index-1);
           
        } else {
            //将该tab页之后的tab选中
            ko.utils.arrayForEach(self.mapTabItems(), function (item) {
                var oldIndex = item.index();
                if (oldIndex > index) {
                    if (oldIndex == index + 1) {
                        item.isActive(true);
                        self.updateInfoByIndex(oldIndex);
                    }
                    item.index(oldIndex--);
                }
            });
        }
    };
    //设置当前index为激活状态
    self.updateActiveByIndex = function (index) {
        var currentTab = self.getTabByIndex(index);
        //当前tab本来就是激活状态不用更改
        if (!currentTab.isActive()) {
            ko.utils.arrayForEach(self.mapTabItems(), function (item) {
                var itemIndex = item.index();
                if (itemIndex == index) {
                    item.isActive(true);
                    self.updateInfoByIndex(index);
                } else {
                    item.isActive(false);
                }
            });
        }        
    };
    //根据tab项index更新图层名称显示方式和图层显示状态
    self.updateInfoByIndex = function (index) {
        //原图，隐藏投影图层
        if (index == 0) {
            changeLayerStatus(projectionLaysers, false);
            self.isOriginalMap(true);
            $("#save_new").addClass("disabled");
        } else {
            changeLayerStatus(projectionLaysers, true);
            self.isOriginalMap(false);
            $("#save_new").removeClass("disabled");
        }

        
    };
    //关闭所有新的tab
    self.closeAllNewTab = function () {
        ko.utils.arrayForEach(self.mapTabItems(), function (mapTab) {
            if (mapTab.index() > 0) {
                self.mapTabItems.remove(mapTab);
            } else {
                mapTab.isActive(true);
            }
        });
    }

    self.getTabByIndex = function (index) {
        var result = ko.utils.arrayFirst(self.mapTabItems(), function (item) {
            return item.index() == index;
        });
        return result;
    }

    self.updateWell = function (id) {
        var index = $("#contentCenter_middle li[class='active']").data("index");
    }

    // 更新图件名称
    self.updateMapName = function () {
        var map = self.currentMapName();
        
        if (!map) {
            joGIS1.ResetContent();// 清除图件

            global_layersdata = null;//清除图层
            projectionLaysers = null;
            loadLayerTable([]);

            $("#save_new").addClass("disabled");
            $("#tool_select").addClass("disabled");
            $("#tool_zoomin").addClass("disabled");
            $("#tool_zoomout").addClass("disabled");
            $("#tool_move").addClass("disabled");
            $("#tool_reset").addClass("disabled");
            $("#tool_well").addClass("disabled");
            $("#tool_area").addClass("disabled");
            $("#tool_data").addClass("disabled");
            
        } else {
            var name = map.name + "(1)";
            self.currentNewMapName(name);

            //JoGis4.options.GDBPath = canonical_uri(basinMapUrl).replace("FlexDraw/", "").replace("file:///", "");
            //JoGis4.loadGeoMapFile();
            ////2.加载图层
            //global_layersdata = initGeoLayers(true);
            //loadLayerTable(global_layersdata);
            loadGeoMap(map.sourceUrl);

            $("#tool_select").removeClass("disabled");
            $("#tool_zoomin").removeClass("disabled");
            $("#tool_zoomout").removeClass("disabled");
            $("#tool_move").removeClass("disabled");
            $("#tool_reset").removeClass("disabled");
            $("#tool_well").removeClass("disabled");
            $("#tool_area").removeClass("disabled");
            $("#tool_data").removeClass("disabled");
        }
        //如果存在新图，去掉新图tab
        self.closeAllNewTab();
        //更新
    };

    self.changeTab = function (item) {
        var index = item.index();
        self.updateInfoByIndex(index);
    };

    self.advanceSelectChanged = function () {
        //面积参数的change事件
    }
};

function importMap(url) {
    //PM_ImportMap (ByVal lpszFileAs  String,  ByVal  nFlag  As Long,  ByVal  nShowDlg As Long) As Long
    //lpszFile ——要加载的图件路径(URL)；  nFlag  ——加载标志，0加载磁盘文件，1加载Base64编码的内存流；nShowDlg ——是否显示图层列表对话框，0不显示，1显示  
    joGIS1.PM_ImportMap(url, 0, 1);
}

function reloadDataLayer() {
    mapLayerStyle();
    global_layersdata = initGeoLayers(false,true);
    loadLayerTable(global_layersdata);
}

//隐藏指定图层
var changeLayerStatus = function (data, isShow) {
    if (data && data.length > 0) {
        var len=data.length-1;
        for (var i = len; i >=0; i--) {
            var item = data[i];
            if (!isShow) {
                joGIS1.PM_SetLayerStatus(item.layName, 0, 1);
                delLayerTableRowData(item.layId);
            } else {
                joGIS1.PM_SetLayerStatus(item.layName, 1, 0);
                addLayerTableRowData(item);
            }
        }
        loadLayerTable(global_layersdata);
    }
};

var initGeoMap = function () {
    JoGis4 = new JoGis(joGIS1, jogis4_options);
};

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
            //1.加载图件
            var gdbFileUrl = encodeURI(global_api_url +
                "/DataService/GetData?url=" +
                url +
                "&ticket=" +
                ticket);

            JoGis4.options.GDBPath = gdbFileUrl;

            JoGis4.loadGeoMapFile();
            //2.加载图层
            global_layersdata = initGeoLayers(true);
            loadLayerTable(global_layersdata);
        }
    });
};

var mapToolEventBind = function () {
    /**
        * 0：选择图元
        * 13：放大图件
        * 14：缩小图件
        * 15：移动图件
        * 17：复位图件
        * 28：裁剪
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
    //井投影
    $("#well_popover").popover({
        trigger: "click",
        placement: "left",
        template: '<div class="popover" role="tooltip"><div class="arrow"><iframe scrolling=no allowTransparency="true" style="background-color: transparent; position: absolute; z-index: 0; width: 11px; height: 22px;; top: -11px; left: -11px;border:1px solid transparent;border-top:0;"></iframe></div><div class="popover-content" style="position:relative;z-index:2;"></div>' +
            '<iframe scrolling=no allowTransparency="true" style="background-color: transparent; position: absolute; z-index: 0; width: 100%; height: 100%; top: 1px; left: 0;border:none;"></iframe></div>',
        html: true,
        content: function () {
            return $("#well_content").html();
        }
    }).on("shown.bs.popover", function () {
        //井投影 确定按钮 
        $("#well_sure").click(function () {
            $("#well_popover").popover("hide");
            var len = currentViewModel.mapTabItems() ? currentViewModel.mapTabItems().length : 0;
            if (len < 2) {
                currentViewModel.addTab();
            } else {
                var index = $("#contentCenter_middle li[class='active']").data("index");
                currentViewModel.updateActiveByIndex(index);
            }
            newLayer();
        });
        //井投影 取消按钮 
        $("#well_cancel").click(function () {
            $("#well_popover").popover("hide");
        });
    });
    //面积投影
    $("#tool_area").popover({
        trigger: "click",
        placement: "left",
        template: '<div class="popover" role="tooltip"><div class="arrow"><iframe scrolling=no allowTransparency="true" style="background-color: transparent; position: absolute; z-index: 0; width: 11px; height: 22px;; top: -11px; left: -11px;border:1px solid transparent;border-top:0;"></iframe></div><div class="popover-content" style="position:relative;z-index:2;"></div>' +
            '<iframe scrolling=no allowTransparency="true" style="background-color: transparent; position: absolute; z-index: 0; width: 100%; height: 100%; top: 1px; left: 0;border:none;"></iframe></div>',
        html: true,
        content: function () {
            return $("#area_content").html();
        }
    }).on("shown.bs.popover", function () {
        //面积投影 确定按钮 
        $("#area_sure").click(function () {
            $("#tool_area").popover("hide");
            var len = currentViewModel.mapTabItems() ? currentViewModel.mapTabItems().length : 0;
            if (len < 2) {
                currentViewModel.addTab();
            } else {
                var index = $("#contentCenter_middle li[class='active']").data("index");
                currentViewModel.updateActiveByIndex(index);
            }
            newAreaLayer(); //创建新图层 
        });
        //面积投影 取消按钮 
        $("#area_cancel").click(function () {
            $("#tool_area").popover("hide");
        });
    });
    //上传文件
    $("#file-input").fileinput({
        language: 'zh',
        showPreview: false,
        showCaption: false,
        showUpload: false,
        showRemove: false,
        showPreview: false,
        browseClass: ''
    }).on('fileloaded', function (event, file, previewId, index) {
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
        var len = currentViewModel.mapTabItems() ? currentViewModel.mapTabItems().length : 0;
        if (len < 2) {
            currentViewModel.addTab();
        } else {
            var index = $("#contentCenter_middle li[class='active']").data("index");
            currentViewModel.updateActiveByIndex(index);
        }
        
        var url = $("#file-input").val();
        importMap(url);
        reloadDataLayer();
    });
    
    //成图 保存按钮
    $("#save_new").click(function () {
        var name = $("#mapName_new").val().trim() ? $("#mapName_new").val().trim() : "";
        if (name != "") {
            var path = getFileFolderPath(); //文件夹目录选择
            currentViewModel.currentNewMapName = name;
            var url = path + name + ".GDBX";
            //PM_SaveMap (ByVal lpszName As  String,  ByVal  nFlag As Long) As String  
            //lpszName –nFlag为0时，指要保存的本地文件路径；nFlag为1时，没定义 //nFlag -- 保存标志，0--保存到磁盘文件，1--保存成二进制内存流返回。
            joGIS1.PM_SaveMap(url, 0);
        } else {
            alert("请填写新图件名称");
        }
    });

    //解决popover隐藏之后需要点击两次才会出现的错误
    $("body").on("hidden.bs.popover", function (e) {
        $(e.target).data("bs.popover").inState = { click: false, hover: false, focus: false }
    });
};

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
        alert("请添加本站点为受信任的站点，并将‘对未标记为可安全执行脚本的ActiveX控件初始化并执行脚本’设置为启用");
    }
};
/**
 * 初始化地图信息
 * @returns {} 
 */
var initMapTabInfo = function () {
    //todo maptype需要API获取
    currentViewModel.currentWellType(null);
    currentViewModel.currentWellBlock(null);
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

// 显示图层列表tab
function mapLayerStyle() {
    $(".tab-content").find("#mapTarget").removeClass("active");
    $(".tab-content").find("#mapLayer").addClass("active");

    $(".nav-tabs").find("#nav-1").removeClass("active");
    $(".nav-tabs").find("#nav-2").addClass("active");
}


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
    var targetTree = $("#mapTarget_tree");
    targetTree.jstree({
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
        var bo = data.node.original.aliasnames;
        var boType = data.node.original.typeid;
        //1.加载图件名称    
        getMapNames(bo);

        //3.清空图件内容
        joGIS1.ResetContent();
        //4.删除新图tab
        var item = currentViewModel.getTabByIndex(1);
        if (item) {
            currentViewModel.closeTab(item);
        }
    }
};

var getMapNames = function (bo) {
    var param = {
        "filter": {
            "$and": [
                { "ep.bo": { "$elemMatch": { "value": { "$in": bo }, "type": "Target" } } },
                { "ep.producttype": { "$regex": "^(?!.*?导航图$)", "$options": "$i" } }
            ]
        }
    };
    $.ajax({
        url: global_api_url + "/SearchService/Match",
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify(param),
        success: function (result) {

            if (!result || result.length == 0) {
                currentViewModel.availaleMapNames([]);
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
}

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
    // Configuration for jqGrid
    layerTable.jqGrid({
        datatype: "local",
        height: "100%",
        autowidth: true,
        shrinkToFit: true,
        rowNum: 1000,
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
			    name: 'locked',
			    index: 'locked',
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
                entity.visable = !entity.visable;
                //更新jqgrid值
                $(this).jqGrid("setCell", rowid, 'visable', entity.visable);
            }
            if (icol == 4) {
                //更新GeoMapJson
                entity.locked = !entity.locked;
                //更新jqgrid值
                $(this).jqGrid("setCell", rowid, 'locked', entity.locked);
            }
            joGIS1.PM_SetLayerStatus(entity.layName, entity.visable, entity.locked); //bVisible, bSelectable  
        },
        viewrecords: false,
        gridview: true,
        hidegrid: false,
        scrollrows: true,
        pgbuttons: false,
        pginput: false,
        guiStyle: "bootstrap",
        iconSet: "fontAwesome"
    });
};

var loadLayerTable = function (jsondata) {
    layerTable.jqGrid("clearGridData");
    layerTable.jqGrid("setGridParam", { data: jsondata }).trigger("reloadGrid");
};

//删除表格某一行
var delLayerTableRowData = function (layId) {
    global_layersdata.splice(layId, 1);
};
//表格新增某一行
var addLayerTableRowData = function (data) {
    global_layersdata.splice(0, 0, data);
};

//获取图件图层Json
var initGeoLayers = function (isMapChanged,isDataProject) {
    projectionLaysers = [];

    if (!joGIS1.PM_GetLayerCount() || joGIS1.PM_GetLayerCount() == 0) return [];
    var json = []; // 定义一个json对象 
    for (var i = 0; i < joGIS1.PM_GetLayerCount() ; i++) {
        var entity = {};
        var layerName = joGIS1.PM_GetLayerName(i);
        entity.id = 'node_' + i;
        entity.text = layerName;
        entity.layId = i;
        entity.layName = layerName;
        entity.visable = true;
        entity.locked = false; //默认都可以选中
        entity.edited = true;
        //PM_SetLayerStatus (ByVal lpszName As  String,  ByVal bVisible As Long,  ByVal bSelectable As Long) As Long
        //lpszName ——图层的名称。bVisible -- 图层是否可见（1是，0否）bSelectable -- 图层是否可选择（1是，0否）
        joGIS1.PM_SetLayerStatus(layerName, 1, 0); //bVisible, bSelectable  
        json.push(entity);

        if (!isMapChanged) {
            if (layerName.indexOf("井位投影") > -1) {
                projectionLaysers.push(entity);
            } else if (layerName.indexOf("面积投影") > -1) {
                projectionLaysers.push(entity);
            } else {
                if (isDataProject) {
                    if (global_layersdata && global_layersdata.length > 0) {
                        if (!getCurLayerByName(global_layersdata, layerName)) {
                            projectionLaysers.push(entity);
                        }
                    }
                }                
            }
        }       
    }
    if (projectionLaysers.length==0) {
        projectionLaysers = null;
    }
    return json;
};
/**
 * 同步grid与map图层数据
 * @param {} data 
 * @param {} layId 
 * @returns {} 
 */
var getCurLayerByName = function (data, layName) {
    //筛选
    var queryresult = Enumerable.From(data)
        .Where("x=>x.layName=='" + layName + "'").ToArray();
    return queryresult[0];
}
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

    if (currentViewModel.currentWellBlock()) {
        filterArray.push({ "基础参数.井类别": currentViewModel.currentWellBlock() });
    }

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

    if (currentViewModel.currentZone()) {
        filterArray.push({ "基础参数.区带": currentViewModel.currentZone() });
    }
    if (currentViewModel.currentSecondaryStructure()) {
        filterArray.push({ "基础参数.二级构造": currentViewModel.currentSecondaryStructure() });
    }
    if (currentViewModel.currentOilfield()) {
        filterArray.push({ "基础参数.油田": currentViewModel.currentOilfield() });
    }
    if (currentViewModel.currentWellBlocks()) {
        filterArray.push({ "基础参数.井区块": currentViewModel.currentWellBlocks() });
    }
    if (currentViewModel.currentHorizon()) {
        filterArray.push({ "基础参数.层位": currentViewModel.currentHorizon() });
    }
    if (currentViewModel.currentSector()) {
        filterArray.push({ "基础参数.界": currentViewModel.currentSector() });
    }
    if (currentViewModel.currentSeries()) {
        filterArray.push({ "基础参数.系": currentViewModel.currentSeries() });
    }
    if (currentViewModel.currentGather()) {
        filterArray.push({ "基础参数.统": currentViewModel.currentGather() });
    }
    if (currentViewModel.currentFormation()) {
        filterArray.push({ "基础参数.组": currentViewModel.currentFormation() });
    }
    if (currentViewModel.currentAnnualReporting()) {
        filterArray.push({ "基础参数.上报年度": currentViewModel.currentAnnualReporting() });
    }
    if (currentViewModel.currentManageUnit()) {
        filterArray.push({ "基础参数.归属单位": currentViewModel.currentManageUnit() });
    }
    if (currentViewModel.currentManageMode()) {
        filterArray.push({ "基础参数.管理方式": currentViewModel.currentManageMode() });
    }
    if (currentViewModel.currentStorageType()) {
        filterArray.push({ "基础参数.储量类型": currentViewModel.currentStorageType() });
    }
    if (currentViewModel.currentStorageCategory()) {
        filterArray.push({ "基础参数.储量类别": currentViewModel.currentStorageCategory() });
    }
    if (currentViewModel.currentStorageSource()) {
        filterArray.push({ "基础参数.储量来源": currentViewModel.currentStorageSource() });
    }
    if (currentViewModel.currentReservoirType()) {
        filterArray.push({ "基础参数.油气藏类型": currentViewModel.currentReservoirType() });
    }
    if (currentViewModel.currentReservoirPhysical()) {
        filterArray.push({ "基础参数.储层物性": currentViewModel.currentReservoirPhysical() });
    }
    if (currentViewModel.currentReservoirLithology()) {
        filterArray.push({ "基础参数.储层岩性": currentViewModel.currentReservoirLithology() });
    }
    if (currentViewModel.currentSubdivisionLithology()) {
        filterArray.push({ "基础参数.岩性细分": currentViewModel.currentSubdivisionLithology() });
    }
    if (currentViewModel.currentReservesAbundance()) {
        filterArray.push({ "基础参数.储量丰度": currentViewModel.currentReservesAbundance() });
    }
    if (currentViewModel.currentCrudeType()) {
        filterArray.push({ "基础参数.资源类型": currentViewModel.currentCrudeType() });
    }
    if (currentViewModel.currentCrudeDensity()) {
        filterArray.push({ "基础参数.原油密度": currentViewModel.currentCrudeDensity() });
    }
    if (currentViewModel.currentEdgeBottomWater()) {
        filterArray.push({ "基础参数.边底水情况": currentViewModel.currentEdgeBottomWater() });
    }
    if (currentViewModel.currentDriveTypes()) {
        filterArray.push({ "基础参数.驱动类型": currentViewModel.currentDriveTypes() });
    }
    if (currentViewModel.currentSaveType()) {
        filterArray.push({ "基础参数.储集类型": currentViewModel.currentSaveType() });
    }
    if (currentViewModel.currentCementationType()) {
        filterArray.push({ "基础参数.胶结类型": currentViewModel.currentCementationType() });
    }
    if (currentViewModel.currentBurialDepth()) {
        filterArray.push({ "基础参数.储层非均质程度": currentViewModel.currentBurialDepth() });
    }
    if (currentViewModel.currentFormationPressure()) {
        filterArray.push({ "基础参数.地层压力": currentViewModel.currentFormationPressure() });
    }

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
                { "name": "井类别", "valuetype": "Fact" }
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
                    if (name == "井类别") {
                        currentViewModel.availaleWellBlocks(value);
                    }
                }
            }
        },
        error: function (ob, errStr) {
            console.log(errStr)
        }
    });
}
var loadAreaData = function () {
    var param =
        {
            "bot": "油气藏",
            "appdomain": "基础参数",
            "names": [
                { "name": "区带", "valuetype": "Fact" },
                { "name": "二级构造", "valuetype": "Fact" },
                { "name": "油田", "valuetype": "Fact" },
                { "name": "井区块", "valuetype": "Fact" },
                { "name": "层位", "valuetype": "Fact" },
                { "name": "界", "valuetype": "Fact" },
                { "name": "系", "valuetype": "Fact" },
                { "name": "统", "valuetype": "Fact" },
                { "name": "组", "valuetype": "Fact" },
                { "name": "段", "valuetype": "Fact" },
                { "name": "上报年度", "valuetype": "Fact" },
                { "name": "归属单位", "valuetype": "Fact" },
                { "name": "管理方式", "valuetype": "Fact" },
                { "name": "储量类型", "valuetype": "Fact" },
                { "name": "储量类别", "valuetype": "Fact" },
                { "name": "储量来源", "valuetype": "Fact" },
                { "name": "油气藏类型", "valuetype": "Fact" },
                { "name": "储层物性", "valuetype": "Fact" },
                { "name": "储层岩性", "valuetype": "Fact" },
                { "name": "岩性细分", "valuetype": "Fact"},
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
                    } else if (name == "二级构造") {
                        currentViewModel.secondaryStructure(value);
                    } else if (name == "油田") {
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

$(document).ready(function () {    
    initGeoMap();//jogis初始化    

    renderMapLayerTable();//渲染图层列表

    loadTargetTree(); //加载目标树 

    mapToolEventBind();//工具栏事件绑定    
    
    currentViewModel = new ViewModel();//viewmodel绑定
    ko.applyBindings(currentViewModel);
    
    currentViewModel.addMapTabItem();//添加原图tab页

    loadWellData(); // 初始加载井(属性)下拉列表数据 
    loadAreaData(); // 初始加载面积(属性)下拉列表数据 

});
