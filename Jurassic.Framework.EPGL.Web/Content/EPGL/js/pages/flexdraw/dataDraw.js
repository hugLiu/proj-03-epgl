var mapTypes = [
    "储量综合图",
    "开发部署图",
    "开发井位图",
    "评价成果图",
    "剖面图",
    "油气勘探部署图",
    "油气田分布图",
    "有效厚度图",
    "有效矿权分布图",
    "综合柱状图",
    "沉积体系分布图",
    "地理信息图",
    "地震勘探部署图",
    "构造单元图",
    "含油气面积图"
];


var productTypeIds = {};//全局图件分类Id,为了不重复根据图件类型获取图件

var jogis4_options = {
    Style: { border: "solid 1px #666", width: "100%" },
    ShowEagleEye: true,
    GDBPath: null
};
var JoGis4 = null;

var currentViewModel = null;

//盆地地质图
var basinMapUrl = encodeURI("DemoData/gdb/navmap/盆地级/XX气田XX气藏含气面积图.GDBX");

var global_layersdata = null;
//目标树
var targetTree = null;
//图层列表
var layerTable = $("#mapLayer_table");
//当前图件上的井位图元id集合字符串以,分割
var wellElements = null;
//生产现状新增图层
var statusLayers =null;
/**
 * 每一个map tab的初始值
 * @param {} isActive 
 * @param {} mapType 
 * @param {} mapName {iiid:,name:}
 * @returns {} 
 */
var MapItemViewModel = function (isActive, mapType, mapName) {

    var self = this;
    self.index = ko.observable();

    self.title = ko.pureComputed(function () {
        return self.index() == 0 ? "原图" : "新图"; //return self.index() == 0 ? "原图" : "新图" + self.index();
    });

    self.isActive = ko.observable(isActive);

    self.mapName = mapName;
    
    self.mapType = mapType;
};

var ViewModel = function () {
    var self = this;

    self.isOriginalMap = ko.observable(true);
    self.isCanAddTab = ko.observable(false);

    self.mapTabItems = ko.observableArray();

    self.availableMapTypes = ko.observableArray();
    self.availaleMapNames = ko.observableArray();

    self.currentMapType = ko.observable(null);
    self.currentMapName = ko.observable(null);

    self.addMapTabItem = function () {
        var newItem = new MapItemViewModel(true,
            self.currentMapType(),
            self.currentMapName());

        newItem.index(self.mapTabItems().length);
        self.mapTabItems.push(newItem);
    }

    self.addTab = function () {
        var result = ko.utils.arrayFirst(self.mapTabItems(), function (item) {
            return item.isActive();
        });
        result.isActive(false);
        //新添加的标签页显示图件名称输入
        self.isOriginalMap(false);
        
        self.addMapTabItem();
        //获取虚图

       var length = self.mapTabItems().length;

       if (length > 1) {// 目前只生成2个tab页
           self.isCanAddTab(false);//更新按钮不可点击
       }
        
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
        //新图选中井位投影清空
        wellElements = null;
        //新图专题图投影清空
        statusLayers =null;
    }
    self.getTabByTitle = function (title) {
        var result = ko.utils.arrayFirst(self.mapTabItems(), function (item) {
            return item.title() == title;
        });
        return result;
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
                    var mapType = self.currentMapType();
                    currentItem.mapType = mapType;
                    if (!mapType) {
                        currentViewModel.availaleMapNames([]);                        
                    } else {
                        //原图加载图件名称
                        if (index == 0) {
                            var datas = productTypeIds[currentItem.mapType];
                            if (datas) {
                                self.availaleMapNames(datas);
                            } else {
                                var node = targetTree.get_selected(true)[0].original
                                var names = getMapNamesByType(currentItem.mapType, node.aliasnames);
                                if (names && names.length > 0) {
                                    currentViewModel.availaleMapNames(names);
                                } else {
                                    currentViewModel.availaleMapNames([]);
                                }
                            }
                        }
                    }
                    self.currentMapName(null);
                    break;
                case "mapName":
                    var mapName = self.currentMapName();
                    currentItem.mapName = mapName;

                    if (!mapName) {
                        joGIS1.ResetContent();
                        global_layersdata = null;
                        loadMapLayerTable([]);
                    } else {
                        if (index == 0) {
                            //加载地图
                            loadGeoMap(mapName.sourceUrl);
                        }
                    }
                    //如果存在新图，去掉新图tab
                    var item = currentViewModel.getTabByIndex(1);
                    if (item) {
                        self.closeTab(item);
                    }
                    
                    break;
                case "newMapName":
                    currentItem.mapName = self.currentMapName();
                    break;
                default:
                    break;
            }
        }
    }

    self.updateInfo = function (currentItem) {
        self.currentMapType(currentItem.mapType);
        self.currentMapName(currentItem.mapName);
    };

    self.changeTab = function(item) {
        var index = item.index();
        if (index == 0) {
            changeLayerStatus(statusLayers,false);
            self.isOriginalMap(true);
            
        } else {
            changeLayerStatus(statusLayers, true);
            self.isOriginalMap(false);
        }
        self.updateInfo(item);
    };
};

//根据图件类型查找图件
var getMapNamesByType = function (type,boNames) {
    var param = {
        "filter": {
            "$and": [
                { "ep.producttype": type },
                { "ep.bo": { "$elemMatch": { "value": { "$in": boNames }, "type": "Target" } } },
                { "source.url": { "$regex": "^((?!VMap).)*$", "$options": "$i" } }
            ]
        }
    };
    var results = [];
    $.ajax({
        url: global_api_url + "/SearchService/Match",
        async: false,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify(param),
        success: function (result) {
            /**结果格式
                 * {
  "count": 28223,
  "metadatas": [
    {
      "source": {
        "url": "ADP://SQL适配器多域测试/SQL适配器域1/SUQ9NTkxOA==",
        "type": "MockGB",
        "name": "SQL测试库",
        "format": "PPT",
        "media": "Online Storage"
      },
      "iiid": "EC7A9B793052F0A29C5443A82BB0131E",
      "indexeddate": "2017-02-22T12:02:50.775Z",
      "dc": {
        "title": [
          {
            "type": "Formal",
            "text": "test"
          }
        ],
        "contributor": [
          {
            "type": "Author",
            "name": "test"
          },
          {
            "type": "Auditor",
            "name": "test"
          }
        ],
        "subject": [
          "主题1"
        ],
        "description": [
          {
            "type": "Catalogue",
            "text": "test"
          },
          {
            "type": "Introduction",
            "text": "test"
          },
          {
            "type": "Summary",
            "text": "test"
          }
        ],
        "type": "test",
        "language": "en",
        "relation": [
          "关系1"
        ],
        "period": [
          "小,中,大"
        ],
        "rights": "test",
        "status": "草稿",
        "date": [
          {
            "type": "Created",
            "value": "2016-12-15T17:42:59Z"
          },
          {
            "type": "Valid",
            "value": "2016-12-27T17:42:57Z"
          },
          {
            "type": "Available",
            "value": "2016-12-01T17:43:01Z"
          },
          {
            "type": "Issued",
            "value": "2016-12-05T17:43:03Z"
          },
          {
            "type": "Submitted",
            "value": "2016-12-14T17:43:25Z"
          }
        ]
      },
      "ep": {
        "project": "test",
        "producttype": "test",
        "tool": "test",
        "scope": "tes"
      }
    }}
 */
            if (!result || result.length == 0) {
                return;
            }

            var data = result.metadatas;

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

                //todo 原图重新加载的时候需要
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

                if (item.ep && item.ep.producttype) {
                    temp.productType = item.ep.producttype;
                    if (!productTypeIds[temp.productType]) {
                        productTypeIds[temp.productType] = [{ iiid: temp.iiid, name: temp.name, sourceUrl: temp.sourceUrl }];
                    } else {
                        productTypeIds[temp.productType].push({ iiid: temp.iiid, name: temp.name, sourceUrl: temp.sourceUrl });
                    }

                }

                results.push(temp);
            }
        }
    });
    return results;
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
            global_layersdata = getMapLayers();
            loadMapLayerTable(global_layersdata);
            
            //3.更新按钮可点击
            currentViewModel.isCanAddTab(true);
        }
    });

};
//隐藏指定图件
var changeLayerStatus = function (data,isShow) {
    if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (!isShow) {
                joGIS1.PM_SetLayerStatus(item.layName, 0, 1);
                delLayerTableRowData(item.id);
            } else {
                joGIS1.PM_SetLayerStatus(item.layName, 1, 0);
                addLayerTableRowData(item);
            }
        }
        loadMapLayerTable(global_layersdata);
    }
};
//选择图件上的图元 事件
function joGIS1::SelectedElement(nCount) {
    if (nCount == 0) {
        return;
    }
    var boIds = [];
    var sID = "";
    var caption = "";
    var typeId = "";
    for (var i = 0; i < nCount; i++) {
        sID = joGIS1.PM_GetSelElementID(i);
        typeId = joGIS1.PM_GetElementType(sID);
        caption = joGIS1.PM_GetElementCaption(sID);
        if (typeId == 11) {
            boIds.push(caption);
        }
    }
    if (boIds.length > 0) {
        wellElements = boIds.join(",");
    }
}

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
    $("#tool_clean").click(function () {
        joGIS1.PM_SelectElement("", -1);
    });
    //现状
    $("#status_popover").popover({
        trigger: "click",
        placement: "left",
        template: '<div class="popover" role="tooltip"><div class="arrow"><iframe scrolling=no allowTransparency="true" style="background-color: transparent; position: absolute; z-index: 0; width: 11px; height: 22px;; top: -11px; left: -11px;border:1px solid transparent;border-top:0;"></iframe></div><div class="popover-content" style="position:relative;z-index:2;"></div>' +
            '<iframe scrolling=no allowTransparency="true" style="background-color: transparent; position: absolute; z-index: 0; width: 100%; height: 100%; top: 1px; left: 0;border:none;"></iframe></div>',
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
        template: '<div class="popover" role="tooltip"><div class="arrow"><iframe scrolling=no allowTransparency="true" style="background-color: transparent; position: absolute; z-index: 0; width: 11px; height: 22px;; top: -11px; left: -11px;border:1px solid transparent;border-top:0;"></iframe></div><div class="popover-content" style="position:relative;z-index:2;"></div>' +
    '<iframe scrolling=no allowTransparency="true" style="background-color: transparent; position: absolute; z-index: 0; width: 100%; height: 100%; top: 1px; left: 0;border:none;"></iframe></div>',
        html: true,
        content: function () {
            return $("#curve_content").html();
        }
    }).on("shown.bs.popover", function () {
        //开发曲线事件绑定
        curveEventBind();
    });
    
    //保存按钮
    $("#save_new").click(function () {
        //PM_SaveMap (ByVal lpszName As  String,  ByVal  nFlag As Long) As String
        //lpszName –nFlag为0时，指要保存的本地文件路径；nFlag为1时，没定义
        //nFlag -- 保存标志，0--保存到磁盘文件，1--保存成二进制内存流返回。
        joGIS1.PM_SaveMap("c:\新图.GDBX", 0);
    });

    //解决popover隐藏之后需要点击两次才会出现的错误
    $("body").on("hidden.bs.popover", function (e) {
        $(e.target).data("bs.popover").inState = { click: false, hover: false, focus: false }
    });
};

/**
*生产现状事件绑定
*/
var statusEventBind = function () {
    //初始化时间选择器和颜色选择器

    $("#specifiedDate").datetimepicker({
        startView: 3,
        minView: 3,
        language: "zh-CN",
        format: "yyyy-mm",
        autoclose: true,
        pickerPosition: "bottom-left"
    });
    var date = new Date();
    $("#specifiedDate").data("datetimepicker").setDate(date);

    $("#oilColor").colorpicker({ format: 'rgb' });
    $("#gasColor").colorpicker({ format: 'rgb' });
    $("#waterColor").colorpicker({ format: 'rgb' });

    //数字选择
    $('.spinner .btn:first-of-type').on('click', function () {
        var btn = $(this);
        var input = btn.closest(".spinner").find("input");
        input.val(parseInt(input.val(), 10) + 1);
    });
    $('.spinner .btn:last-of-type').on('click', function () {
        var btn = $(this);
        var input = btn.closest(".spinner").find("input");
        var curValue = parseInt(input.val(), 10) - 1;
        if (curValue < 0) {
            curValue = 0;
        }
        input.val(curValue);
    });

    //确定、取消按钮事件
    $("#tool_status_ok").click(function () {
        $("#status_popover").popover("hide");
        loadThemeData();
    });
    $("#tool_status_cancel").click(function () {
        $("#status_popover").popover("hide");
    });
};
//专题图投影
var loadThemeData = function () {
    if (!wellElements) {
        var wells = JoGis4.getElementsNameProByType(11);

        if (wells && wells.length > 0) {
            wellElements = wells.join(",");
        }
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
    var dataSouce = $("#dataSouce").val();
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
    //缩放比例
    var oilDisPar = $("#oilDisPar").val();
    var gasDispPar = $("#gasDispPar").val();
    var waterDispPar = $("#waterDispPar").val();

    //获取不同图型的样式表路径
    var themeTempletData = {
        PatternType: patternType,
        OilColor: oilColor,
        GasColor: gasColor,
        WaterColor: waterColor,
        OilDispPar: oilDisPar,
        GasDispPar: gasDispPar,
        WaterDispPar: waterDispPar,
        SourceData: dataSouce
    };

    $.ajax({
        url: "/Viewer/GetThematicMapXml",
        type: "post",
        data: { boId: wellElements, columns: status, date: specifiedDate, themeTempletJson: JSON.stringify(themeTempletData) },
        success: function (result) { 
            //var themeTemp = canonical_uri(encodeURI("DemoData/xml/ThemTemeplet/ThemeTemplet-全饼图.xml")).replace("Viewer/", "").replace("file:///", "");
            var themeTemp = canonical_uri(encodeURI(result.stylePath)).replace("Viewer/", "").replace("file:///", "");
            var themeData = canonical_uri(encodeURI(result.dataPath)).replace("Viewer/", "").replace("file:///", "");

            //joGIS1.PM_RemoveLayer("生产现状图");
            joGIS1.PM_CreateLayer("生产现状图",0);
            joGIS1.PM_SetCurrentLayer("生产现状图");

            var ret = joGIS1.PM_LoadThemeData("生产现状图", themeTemp, themeData, 0);
            console.log(ret);
            joGIS1.PM_RemoveLayer("生产现状图");

            //加载图层
            global_layersdata = getMapLayers(true);
            loadMapLayerTable(global_layersdata);
        },
        error: function (message) {
            console.log(message);
        }
    });
};
//开发曲线事件绑定
var curveEventBind = function () {
    $("#fromDate").datetimepicker({
        startView: 3,
        minView: 3,
        language: "zh-CN",
        format: "yyyy-mm",
        autoclose: true,
        pickerPosition: "top-left"
    });
    $("#toDate").datetimepicker({
        startView: 3,
        minView: 3,
        language: "zh-CN",
        format: "yyyy-mm",
        autoclose: true,
        pickerPosition: "top-left"
    });
    var date = new Date();
    var year = date.getFullYear()-1;
    var month = date.getMonth();

    if (month == 0) {
        month = 12;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var lastYear = new Date(year+"-" + month+"-"+date.getDate());

    $("#fromDate").data("datetimepicker").setDate(lastYear);
    $("#toDate").data("datetimepicker").setDate(date);

    //颜色设置初始化
    $("#totalWellCount").colorpicker({ format: "hex" });
    $("#openWellCount").colorpicker({ format: "hex" });
    $("#staticPressure").colorpicker({ format: "hex" });
    $("#flowPressure").colorpicker({ format: "hex" });
    $("#totalDailyOil").colorpicker({ format: "hex" });
    $("#totalDailyWater").colorpicker({ format: "hex" });
    $("#integratedWater").colorpicker({ format: "hex" });
    $("#avgDailyOilPerWell").colorpicker({ format: "hex" });


    $("#tool_curve_cancel").click(function () {
        $("#curve_popover").popover("hide");
    });

    $("#curve_modal").on("show.bs.modal", function (e) {
        var options = {};
        //数据源
        var dataSource = $("#curveDataSource").val();
        if (!dataSource || dataSource.length == 0) {
            return e.preventDefault();
        }
        options["dataSource"] = dataSource;
        //时间范围
        var fromDate = $("#fromDate").data("datetimepicker").getDate();
        var fromMonth=fromDate.getMonth()+1;
        var fromDateData = fromDate.getFullYear() + (fromMonth < 10 ? "0" : "") + fromMonth;
        options["fromDate"] = fromDateData;

        var toDate = $("#toDate").data("datetimepicker").getDate();
        var toMonth = toDate.getMonth() + 1;
        var toDateData = toDate.getFullYear() + (toMonth < 10 ? "0" : "") + toMonth;
        options["toDate"] = toDateData;
        
        //颜色选择
        var colors = {};
        colors["0"] = $("#totalWellCount input:first").val();
        colors["1"] = $("#openWellCount input:first").val();
        colors["2"] = $("#staticPressure input:first").val();
        colors["3"] = $("#flowPressure input:first").val();
        colors["4"] = $("#totalDailyOil input:first").val();
        colors["5"] = $("#totalDailyWater input:first").val();
        colors["6"] = $("#integratedWater input:first").val();
        colors["7"] = $("#avgDailyOilPerWell input:first").val();

        options["colors"] = colors;

        drawOmbinedCurve(options);
    });

};
/**
 * 开发曲线图
 * @returns {} 
 */
var drawOmbinedCurve = function (options) {
    if (!options) {
        return;
    }
    var count = options.dataSource.length;
    var fromDate=options.fromDate;
    var toDate=options.toDate;
    var optionsColors = options.colors;

    var name = null;//图表名称

    var type = null;//图表类型
    var data = null;//图表数据
    var grid = [];
    var xAxis = [];
    var yAxis = [];
    var series = [];
    var colors = [];

    var dataZoomIndex = [];
    var avgHeight = 90 / count;
    var height = (avgHeight - 5) + "%";
    var y = 0;
    var item = null;

    for (var i = 0; i < count; i++) {
       
        y = (avgHeight * i + 2) + "%";
        
        item = options.dataSource[i];

        colors.push(optionsColors[item]);

        var xData=combinedCurveData.yearData.filter(function(item){
            return item>=fromDate&&item<=toDate;
        });

        switch (item) {
            case "0"://总井数                
                name = "总井数(口)";
                type = "bar";
                data = combinedCurveData.totalWellCount;               
                break;
            case "1"://开井数
                name = "油井开井数(口)";
                type = "bar";
                data = combinedCurveData.oilWellCount;
                break;
            case "2"://静压
                name = "静压(mpa)";
                type = "line";
                data = [];
                break;
            case "3"://流压
                name = "流压(mpa)";
                type = "line";
                data = [];
                break;
            case "4"://总日产油
                name = "日产油(t)";
                type = "line";
                data = combinedCurveData.dailyOilOutput;
                break;
            case "5"://总日注水
                name = "日注水(m^3)";
                type = "line";
                data = combinedCurveData.dailyWaterInjection;
                break;
            case "6"://综合含水
                name = "含水(%)";
                type = "line";
                data = combinedCurveData.waterContent;
                break;
            case "7"://单井平均日产油
                name = "平均单井日产油(t)";
                type = "line";
                data = combinedCurveData.dailyOilOutputOneWell;
                break;
            default:
                break;
        }

        grid.push({
            left: "10%", top: y, right: "2%", height: height
        });

        dataZoomIndex.push(i);

        xAxis.push({
            gridIndex: i, type: "category", data: xData
        });
        yAxis.push({
            gridIndex: i, type: "value", name: name, nameLocation: "middle", nameRotate: "90", nameGap: 50, splitNumber: 2, minInterval: 1
        });
        series.push({
            name: name, type: type, xAxisIndex: i, yAxisIndex: i, data: data
        });
    }

    echarts.dispose($("#curve_pane")[0]);
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init($("#curve_pane")[0]);

    var option = {
        tooltip:{
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

var loadTargetTree = function () {
    $.ajax({
        url: "/BOAPI/GetBOTree",
        async: true,
        type: "post",
        contentType: 'application/json',
        success: function (dataJson) {
            console.log(dataJson);
            renderTargetTree(dataJson);
        }
    });
};
var renderTargetTree = function (dataJson) {
    $("#mapTarget_tree").jstree({
        "plugins": ["types", "dnd", "search"],
        "types": {
            "default": {
                "icon": "fa fa-folder"
            },
            "html": {
                "icon": "fa fa-file-code-o"
            },
            "svg": {
                "icon": "fa fa-file-picture-o"
            },
            "css": {
                "icon": "fa fa-file-code-o"
            },
            "img": {
                "icon": "fa fa-file-image-o"
            },
            "js": {
                "icon": "fa fa-file-text-o"
            }
        },
        "core": {
            "animation": true,//动画     
            "data": dataJson
        }
    }).on('loaded.jstree', function (e, data) {
        targetTree = data.instance;
        targetTree.deselect_all(true);
        targetTree.select_node(dataJson[0]);
    }).on('changed.jstree', targetSelected);   
};
//目标树选中事件
var targetSelected = function (e, data) {
    var action = data.action;
    if (action == "select_node") {
        var node = data.node.original;
        //1.还原图件类型2.还原图件名称3.清空图件内容4.删除新图tab，因为点击更新按钮才会出现新图   
        //todo maptype需要API获取
        currentViewModel.availableMapTypes(mapTypes);
        currentViewModel.currentMapType(null);
        joGIS1.ResetContent();
        var item = currentViewModel.getTabByIndex(1);
        if (item) {
            currentViewModel.closeTab(item);
        }        
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
    // Configuration for jqGrid
    layerTable.jqGrid({
        //data: jsondata,
        datatype: "local",
        height: "100%",
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
                name: "layName",
                index: "layName",
                sorttype: "string",
                label: "图层",
                width: 108,
                sortable: false
            },
			{
			    name: "visable",
			    index: "visable",
			    label: "见",
			    width: 40,
			    align: "center",
			    formatter: visableFmatter,
			    unformat: visibleUnFmatter,
			    sortable: false
			},
			{
			    name: "locked",
			    index: "locked",
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

                joGIS1.PM_SetLayerStatus(entity.layName, entity.visable ? 1 : 0, entity.locked ? 0 : 1);
                //更新jqgrid值
                $(this).jqGrid("setCell", rowid, "visable", entity.visable);
            }
            if (icol == 4) {
                //更新GeoMapJson
                entity.locked = !entity.locked;

                joGIS1.PM_SetLayerStatus(entity.layName, entity.visable ? 1 : 0, entity.locked ? 0 : 1);
                //更新jqgrid值
                $(this).jqGrid("setCell", rowid, "locked", entity.locked);
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
var loadMapLayerTable = function (jsondata) {
    layerTable.jqGrid("clearGridData");
    layerTable.jqGrid("setGridParam", { data: jsondata }).trigger("reloadGrid");
};
//删除表格某一行
var delLayerTableRowData = function (layId) {
    //layerTable.jqGrid("delGridRow", id);//会弹框
    global_layersdata.splice(layId,1);
};
//表格新增某一行
var addLayerTableRowData = function (data) {
    //layerTable.jqGrid("addRowData", data.id, data, "first", { reloadAfterSubmit: true });
    global_layersdata.splice(data.layId, 0, data);
};

/*获取图件图层Json
*isThemeData,是否专题图投影后获取图层数据，保存专题图图层需要
*/
var getMapLayers = function (isThemeData) {
    var count = joGIS1.PM_GetLayerCount();

    if (count == 0) return [];

    var json = []; // 定义一个json对象
    var entity = {}; // 实体
    var layerName = null;

    var newLayers=[];//存储专题图图层名称

    for (var i = 0; i < count; i++) {

        layerName = joGIS1.PM_GetLayerName(i);
        
        entity.id = "node_" + i;
        entity.text = layerName;
        entity.layId = i;
        entity.layName = layerName;
        entity.visable = true;
        entity.locked = false; //默认都可以选中
        entity.edited = true;

        joGIS1.PM_SetLayerStatus(layerName, entity.visable ? 1 : 0, entity.locked ? 0 : 1); //设置可见/可选择

        json.push(entity);
        //获取专题图投影图层
        if (isThemeData && layerName.indexOf("生产现状图") > -1) {
            newLayers.push(entity);
        }
        entity = {};
    }
    //存储专题图投影图层
    if (newLayers.length > 0) {
        statusLayers = newLayers;
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
        //.Where(function (i) { console.log(i.parent); return i.parent==parentid; });
        .Where("x=>x.layId=='" + layId + "'").ToArray();
    return queryresult[0];
}

$(document).ready(function () {
    currentViewModel = new ViewModel();
    ko.applyBindings(currentViewModel);
    //初始化map对象
    initGeoMap();
    //工具栏事件
    mapToolEventBind();
    //加载目标树
    loadTargetTree();
    //渲染图层列表
    renderMapLayerTable();

    
    //先添加原图tab项
    currentViewModel.addMapTabItem();

});