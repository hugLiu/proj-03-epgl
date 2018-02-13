var enumBoType = {
    Basin: "Basin",
    Play: "Play",
    Pool: "Pool",
    Field: "Field",
    Well: "Well"
};

var jogis4_options = {
    Style: { border: "solid 1px #666", width: "100%" },
    ShowEagleEye: true,
    GDBPath: null
};
var JoGis4;
var currentViewModel = null;
var targetTree = $("#targets_tree").jstree(true);
var targetsData = null;//目标树数据
var basinNode = null;//当前导航地图目标
var searchInput = $("#txtKeyword");

var ids = [];//相关图件iiid集合

var defaultThumbUrl = "/Content/EPGL/img/shared/end.jpg";
var baseThumbPath = "/Content/EPGL/img/pages/epgl/oilfields/";

//当前鼠标坐标
var mousePointX = 0;
var mousePointY = 0;

//当前高亮图元Id
var focuseEleId = [];

//冒泡井显示属性
var wellProperty = ["井号", "井型", "井别", "井深", "完钻井深", "完钻日期"];
//冒泡油藏显示属性
var reservoirProperty = ["计算单元名称", "上报年度", "油藏类型", "储层岩性", "原油类型", "驱动类型"];
//搜索井显示属性
var searchWellProperty = ["井名称", "井型", "井深", "完钻井深", "完钻日期"];
//搜索油藏显示属性
var searchReservoirProperty = ["计算单元", "上报年度", "油气藏类型", "储层岩性", "资源类型", "驱动类型"];



var GeoMapViewModel = function () {

    var self = this;
    //搜索类型（目标、图件）
    self.selectedSearchType = ko.observable(0);

    //搜索结果是否可见
    self.isSearchClick = ko.observable(false);
    //搜索结果加载
    self.isSearchLoading = ko.observable(true);
    //搜索框，油田快捷连接{ElementID:,ElementType:,ElementName:}
    self.hotSearchs = ko.observableArray();
    //热门搜索点击
    self.hotSearchClick = function (item) {
        if (!item.ElementID) {
            return;
        }
        var searchkey = searchInput.val();
        if (!searchkey || searchkey == "") {
            searchInput.val(item.ElementName);
        }

        selFindElement(item.ElementType, item.ElementID);

        //折叠面板折叠
        $("#historyCollapse").collapse("hide");
    };

    //搜索结果
    self.searchResults = ko.observableArray();
    //搜索显示属性
    self.searchDisplayProperties = ko.observable({ "Well": searchWellProperty.join(","), "Pool": searchReservoirProperty.join(",") });
    //搜索结果点击
    self.searchResultClick = function (item) {
        if (item.BOTNAME != enumBoType.Well) {
            var find = JoGis4.FindElementByNames(item.BONAME);
            if (find && !$.isEmptyObject(find)) {
                var status = joGIS1.PM_SetLayerStatus(find.LayerName, 1, 1);
                selFindElement(find.ElementType, find.ElementID);
            } else {
                $("#currentTarget").val(basinNode.id);
                $("#currentElementName").val(item.BONAME);
                $("#navigateForm").submit();
            }
           
        }
        
        //折叠面板折叠
        $("#historyCollapse").collapse("hide");
    }

    //当前导航级别{1:盆地级,1:区带级,3:油田级,4:油藏级，4:井}
    //必须监听，不然弹框信息只会在初始化时改变一次
    //跟目标树级别level不一致
    self.currentNavLevel = ko.observable(currentNavLevel);
    self.currentNodeLevel = ko.observable();


    //相关图件
    self.relevantMaps = ko.observableArray();
    //相关图件loading
    self.isMapLoading = ko.observable(true);

    //当前图件比例尺
    self.currentMapScale = ko.observable();

    /**
     * (冒泡使用)
     */
    //冒泡显示属性，记录当前图元显示属性
    self.displayProperties = ko.observable(null);
    //所有井位属性集合
    self.allWellProperties = ko.observableArray(null);
    //所有油藏属性集合
    self.allReservoirProperties = ko.observableArray(null);
    //所有可选择属性集合
    self.allProperties = ko.observable(null)

    //冒泡是否可见
    self.toolTipVisible = ko.observable(true);

    //图元位置
    self.toolTipX = ko.observable(0);
    self.toolTipY = ko.observable(0);

    //区带、油田
    //图元对应目标节点id
    self.targetId = ko.observable();
    //图元缩略图
    self.primitiveThumb = ko.observable();
    //图元名称
    self.primitiveName = ko.observable();
    //图元简单描述
    self.primitiveDescribe = ko.observable();
    //区带,油田,图元是否可导航
    self.isCanNav = ko.observable(false);

    //油藏、井
    //属性loading
    self.isPropertyLoading = ko.observable(true);
    //属性结果集合ProDataModel
    self.primitiveProperties = ko.observableArray();

    //图元导航事件，导航到下一级
    self.navigateTo = function (data) {

        
        $("#currentTarget").val(currentTargetNode.id);
        $("#navigateForm").submit();

    };
    //打开
    self.openDetailPage = function (item) {
        if (!item.iiid) {
            return;
        }

        var idsStr = ids.join(",");
        $("#mapId").val(item.iiid);
        $("#mapData").val(idsStr);
        $("#resultForm").submit();
    };

};

/**
 * joGis1每次是重新绘制上去的，所以需要每次重新配置
 * @returns {} 
 */
var configGeoMap = function () {
    JoGis4 = new JoGis(joGIS1, jogis4_options);
    joGIS1.SetWorkFlag(0, 0);
    joGIS1.IsTransparent = 1;
    joGIS1.PM_SetFocusMode(1);

    //正常绑定viewmodel,只能绑定一次
    //有两种选择，1.只调用一次ko.applyBindings();2.解除绑定后再绑定
    //这里采取第二种方法，因为只有调用绑定方法，knockout才会被激活
    //注意会清除jQuery的事件，所以事件绑定得放在后面
    ko.cleanNode(document.getElementById("mapIframe"));

    currentViewModel = new GeoMapViewModel();
    ko.applyBindings(currentViewModel, document.getElementById("mapIframe"));

    currentViewModel.toolTipVisible(false);

    initGeoMap();
    //加载事件
    eventBind();
};

//初始化地图
var initGeoMap = function () {
    if (currentTargetNode) {

        if (currentTargetNode.typeid == enumBoType.Play) {
            currentTargetNode = getParTargetNode(currentTargetNode.parent);
        }
        var eleName = null;
        if (currentMapElement) {
            eleName = currentMapElement.elementName || currentMapElement;
        }
        loadNavMap(currentTargetNode.typeid, currentTargetNode.aliasnames, eleName);
    } 
};


/**
*更新地图比例尺信息
*/
var loadMapScale = function () {
    var mapScale = joGIS1.PM_GetMapScale();
    var mapScaleInfo = null;
    if (mapScale > 1000) {
        mapScale = mapScale / 1000;
        mapScaleInfo = mapScale + "km";
    } else {
        mapScaleInfo = mapScale + "m";
    }
    currentViewModel.currentMapScale(mapScaleInfo);
};
/**
 * 加载JoGis组件
 * @returns {} 
 */
var loadGeoMap = function (url, name) {
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
            if (retrieveData && retrieveData.length > 0) {
                var ticket = retrieveData[0].ticket;

                var gdbFileUrl = encodeURI(global_api_url +
                    "/DataService/GetData?url=" +
                    url +
                    "&ticket=" +
                    ticket);               

                JoGis4.options.GDBPath = gdbFileUrl;

                ret = JoGis4.loadGeoMapFile();

                if (ret == "jogis001") {
                    //todo 搜索推荐图层名称
                    var hotSearchKey = null;                    

                    //2.如果需要选中图元，则选中
                    if (name) {
                        var find = JoGis4.FindElementByNames(name);
                        var status = joGIS1.PM_SetLayerStatus(find.LayerName, 1, 1);
                        selFindElement(find.ElementType, find.ElementID);
                    }

                    //1.更新图层列表
                    global_layersdata = getMapLayers();
                    loadGeoLayers(global_layersdata);

                    //3.更新右键菜单，主要是（返回上一级）
                    createContextMenu();

                    //4.更新地图比例尺信息
                    loadMapScale();

                    //5.存储当前地图范围
                    storeMapRect();

                    //6.清除上一图件中的选中图元
                    currentMapElement = null;
                }
            }

        }
    });
};

//根据图件获取导航图(向上导航)
var loadNavMap = function (boType, aliasNames, name) {
    //1.判断当前导航级别，如果目标所在导航图与当前导航图匹配则不需要重新加载图件
    var navInfo = getNavLevelAndMapTypeByBoType(boType);
    var navLevel = navInfo.navLevel;
    var mapType = navInfo.mapType;

    if (navInfo && navLevel && mapType) {
        var param = {
            "pager": {
                "from": 0,
                "size": 1
            },
            "filter": {
                "$and": [
                    { "ep.bo.type": boType },
                    { "ep.bo.value": { "$in": aliasNames } },
                    { "ep.producttype": mapType }
                ]
            },
            "sortrules": {
                "indexeddate": {
                    "direction": -1
                }
            }
        };
        $.ajax({
            url: global_api_url + "/SearchService/Match",
            async: false,
            type: "post",
            data: JSON.stringify(param),
            contentType: "application/json",
            success: function (result) {
                var sourceUrl = null;

                var count = result.count;
                var data = result.metadatas;

                if (data && data[0]) {
                    var item = data[0];
                    if (item.source && item.source.url) {
                        sourceUrl = item.source.url;
                    }
                }

                if (sourceUrl) {
                    //2.区带需要选中当前图元,因为图件加载是异步的，所以需要把选中图元放在loadGeoMap方法里
                    if (name) {
                        loadGeoMap(sourceUrl, name);
                    } else {
                        loadGeoMap(sourceUrl);
                    }
                }
            }
        });
        //3.更新当前导航级别
        currentViewModel.currentNavLevel(navLevel);
    }


};
//根据目标类型获取导航级别,isUp加载shang
var getNavLevelAndMapTypeByBoType = function (boType) {
    var navLevel = null;
    var mapType = null;
    switch (boType) {
        case enumBoType.Basin:
            navLevel = 1;
            mapType = "盆地导航图";
            break;
        case enumBoType.Play:
            navLevel = 1;
            mapType = "盆地导航图";
            break;
        case enumBoType.Field:
            navLevel = 3;
            mapType = "油田导航图";
            break;
        case enumBoType.Pool:
            navLevel = 4;
            mapType = "油藏导航图";
            break;
        case enumBoType.Well:
            navLevel = 4;
            mapType = "油藏导航图";
            break;
        default:
            break;
    }
    return { navLevel: navLevel, mapType: mapType };
};

/**
 * 加载JoGis组件,已知url和retrieve
 * @returns {} 
 */
var loadGeoMapFile = function (mapDataUrl, eleId) {
    JoGis4.options.GDBPath = encodeURI(global_api_url + mapDataUrl);

    ret = JoGis4.loadGeoMapFile();

    if (ret == "jogis001") {
        //todo 搜索推荐图层名称
        var hotSearchKey = null;
        //1.更新图层列表
        global_layersdata = getMapLayers();
        loadGeoLayers(global_layersdata);

        //2.如果需要选中图元，则选中
        if (eleId) {
            //todo 图元所在图层可编辑吗？
            var eleType = joGIS1.PM_GetElementType(eleId);
            var eleName = joGIS1.PM_GetElementCaption(eleId);
            selFindElement(eleType, eleId);
        }


        //3.更新右键菜单，主要是（返回上一级）
        createContextMenu();

        //4.更新地图比例尺信息
        loadMapScale();

        //5.存储当前地图范围
        storeMapRect();

    }
};

//树节点选择事件
var geoMapTargetSelected = function (event, data) {
    //3.直接点击树节点时，导航到对应导航图
    if (data.event && data.event.type == "click") {
        var boType = currentTargetNode.typeid;
        var aliasNames = currentTargetNode.aliasnames;
        var name = currentTargetNode.text;

        var navLevel = getNavLevelAndMapTypeByBoType(boType).navLevel;
        var currentNavLevel = currentViewModel.currentNavLevel();

        var find = JoGis4.FindElementByNames(name);
        var status = joGIS1.PM_SetLayerStatus(find.LayerName, 1, 1);//更新图层状态
        selFindElement(find.ElementType, find.ElementID);
    }
    currentViewModel.toolTipVisible(false);
};

//获取当前树节点
var getCurTargetNode = function (text) {
    //筛选
    var queryresult = Enumerable.From(targetsData)
        .Where("x=>x.aliasnames.indexOf('" + text + "')>-1").ToArray();
    return queryresult[0];
};
//获取当前树节点的父节点
var getParTargetNode = function (parentId) {
    if (parentId == '#')
        return null;

    //筛选
    var queryresult = Enumerable.From(targetsData)
        .Where("x=>x.id=='" + parentId + "'").ToArray();
    return queryresult[0];
};
//获取当前节点及子节点
var getTargetNodes = function (id) {
    //筛选
    var queryresult = Enumerable.From(targetsData)
        .Where("x=>x.parent=='" + id + "'").ToArray();
    var parent = getParTargetNode(id);
    parent.parent = '#';
    queryresult.push(parent);
    return queryresult;
};


//获取图件图层Json
var getMapLayers = function () {

    var json = []; // 定义一个json对象
    var entity = {}; // 实体
    var layerName = null;
    var count = joGIS1.PM_GetLayerCount();

    for (var i = 0; i < count; i++) {
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
//更改图件图层状态
var setLayerStatus = function (layName, visable, unlocked) {
    joGIS1.PM_SetLayerStatus(layName, visable, unlocked);
};


////显示无相关图件
//var showRelevantMap = function () {
//    currentViewModel.relevantMaps([{ name: "无相关图件！" }]);
//};
////加载相关图件
//var loadRelevantMap = function (boName) {
//    //先清除之前的值
//    currentViewModel.relevantMaps([]);

//    currentViewModel.isMapLoading(true);
//    var param = {
//        "filter": {
//            "$and": [
//                {"ep.bo":{"$elemMatch":{"value":{ "$in": boName },"type": "Target" }}},
//                { "ep.producttype": { "$regex": "^(?!.*?导航图$)", "$options": "$i" } }
//            ]
//        }
//    };
//    var paramJson = JSON.stringify(param);
//    $.ajax({
//        url: global_api_url + "/SearchService/Match",
//        async: true,
//        type: "post",
//        contentType: 'application/json',
//        data: paramJson,
//        success: function (result) {
//            currentViewModel.isMapLoading(false);

//            if (!result || result.metadatas.length == 0) {
//                showRelevantMap();
//                return;
//            }


//            var data = result.metadatas;
//            var results = [];
//            ids = [];
//            for (var i = 0; i < data.length; i++) {
//                var item = data[i];

//                var temp = {
//                    iiid: item.iiid,
//                    indexedDate: item.indexeddate,
//                    name: "",
//                    title: "",
//                    sourceUrl: "",
//                    //thumb: "",
//                    author: "",
//                    auditor: "",
//                    mapper: "",
//                    createdDate: "",
//                    productType: "",
//                    productTypeId: "*"
//                };

//                //if (item.thumbnail) {
//                //    temp.thumb = item.thumbnail;
//                //}
//                if (item.source && item.source.url) {
//                    temp.sourceUrl = item.source.url;
//                }
//                if (item.dc && item.dc.title) {
//                    for (var k = 0; k < item.dc.title.length; k++) {
//                        var title = item.dc.title[k];
//                        if (title.type === "Formal") {
//                            temp.title = title.text;
//                            temp.name = title.text ? title.text.split(".")[0] : "";
//                        }
//                    }
//                }
//                if (item.dc && item.dc.contributor) {
//                    for (var j = 0; j < item.dc.contributor.length; j++) {
//                        var contributor = item.dc.contributor[j];
//                        if (contributor.type === "Author") {
//                            temp.author = contributor.name;
//                        }
//                        if (contributor.type === "Auditor") {
//                            temp.auditor = contributor.name;
//                        }
//                        //TODO 绘图人
//                        if (contributor.type === "Mapper") {
//                            temp.auditor = contributor.name;
//                        }
//                    }
//                }
//                if (item.dc && item.dc.date) {
//                    for (var q = 0; q < item.dc.date.length; q++) {
//                        var date = item.dc.date[q];
//                        if (date.type === "Created") {
//                            temp.createdDate = date.value;
//                        }
//                    }
//                }
//                if (item.ep && item.ep.producttype) {
//                    temp.productType = item.ep.producttype;
//                }

//                results.push(temp);
//                ids.push(temp.iiid);
//            }

//            if (results.length > 0) {
//                currentViewModel.relevantMaps(results);
//            }

//        },
//        error: function (result) {


//        }
//    });
//};

//创建右键菜单
var createContextMenu = function () {
    joGIS1.PM_ResetTools();
    // 定制右键菜单测试
    joGIS1.PM_AddTool(0);//选择
    joGIS1.PM_AddTool(13);//放大
    joGIS1.PM_AddTool(14);//缩小
    joGIS1.PM_AddTool(15);//移动/手势
    joGIS1.PM_AddTool(17);//复位

    //if (currentViewModel.currentNavLevel() > 1) {
    //    joGIS1.PM_AddCustomTool("返回上一级", 100);
    //}

}

var zoomMap = function (flag) {
    //获取图件的用户坐标范围，按左、顶、右、底顺序组成的坐标串（空格分隔）
    var userRect = joGIS1.PM_GetUserRect();

    var points = userRect.split(" ");

    var centerY = (parseFloat(points[1]) + parseFloat(points[3])) / 2;
    var centerX = (parseFloat(points[2]) + parseFloat(points[0])) / 2;
    //有带号转无带号
    var szPoint = joGIS1.RPtoUP2(centerX, centerY);
    points = szPoint.split(' ');
    centerX = parseFloat(points[0]);
    centerY = parseFloat(points[1]);

    var zoomScale = joGIS1.ZoomScale;
    if (flag > 0) {
        zoomScale += 0.1;
    } else {
        zoomScale -= 0.1;
    }
    console.log(zoomScale);

    var a = joGIS1.SetVisibleRange(centerX, centerY, zoomScale);
    loadMapScale();
    console.log(a);
}

var eventBind = function () {
    var _move = false;//移动标记 
    var _x, _y;//鼠标离控件左上角的相对位置 
    $("#geoMapPane #tool_pane").mousedown(function (e) {
        e.preventDefault();
        _move = true;
        _x = e.pageX - parseInt($(this).css("left"));
        _y = e.pageY - parseInt($(this).css("top"));
        $("#geoMapPane #tool_pane").fadeTo(20, 0.5);//开始拖动并透明显示
    });
    $("#geoMapPane").mousemove(function (e) {
        if (_move) {
            var x = e.pageX - _x;
            var y = e.pageY - _y;
            $("#geoMapPane #tool_pane").css({ top: y, left: x });//开始拖动并透明显示
        }        
    }).mouseup(function (e) {
        _move = false;
        $("#geoMapPane #tool_pane").fadeTo("fast", 1);
    });



    $("#txtKeyword").keydown(function () {
        if (event.keyCode=="13") {
            $("#btnFindElement").click();
        }
    });


    $("#btnFindElement").on('click', function () {
        var keyword = searchInput.val();

        if (keyword.length <= 0) {
            currentViewModel.isSearchClick(false);
            return;
        }
        $("#historyCollapse").collapse("show");

        currentViewModel.isSearchClick(true);
        currentViewModel.isSearchLoading(true);
        //清空搜索结果
        currentViewModel.searchResults([]);

        if (currentViewModel.selectedSearchType() == 0) {
            $.ajax({
                url: "/BOAPI/SearchBODataByName",
                data: { BOName: keyword },
                type: "post",
                success: function (result) {
                    console.log(result);

                    //显示搜索结果
                    var target = null;
                    var entity = {};
                    var data = [];
                    if (result && result.length > 0) {
                        currentViewModel.searchResults(result);
                    } else {
                        currentViewModel.searchResults([{ boName: "没有相关目标！" }]);
                    }


                    currentViewModel.isSearchLoading(false);
                }
            });

            //艘目标
            //var find = JoGis4.FindElement(keyword);


        } else {
            //搜图件
            window.open("/Search/Index?keyword=" + keyword);
        }

    });
    searchInput.on('change ', function () {
        var val = $(this).val();
        if (!val || val == "") {
            currentViewModel.isSearchClick(false);
        }
    });

    //页面上每一个折叠打开时，先关闭其他折叠
    $("#geoMapPane .collapse").on("show.bs.collapse", function (e) {
        $("#geoMapPane .collapse").collapse("hide");

        if (currentViewModel.selectedSearchType() == 1) {
            return e.preventDefault();
        }
    });


    /**
        * 0：选择图元
        * 13：放大图件
        * 14：缩小图件
        * 15：移动图件
        * 17：复位图件
        * 28：裁剪
        */
    $("#btn_select").click(function () {
        joGIS1.PM_SetOperateState(0);
    });
    $("#btn_box_zoomin").click(function () {
        joGIS1.PM_SetOperateState(13);
    });
    $("#btn_box_zoomout").click(function () {
        joGIS1.PM_SetOperateState(14);
    });
    $("#btn_move").click(function () {
        joGIS1.PM_SetOperateState(15);
    });
    $("#tool_cut").click(function () {
        joGIS1.PM_SetOperateState(22);
    });
    $("#tool_clean").click(function () {
        joGIS1.PM_SelectElement("", -1);
        currentViewModel.toolTipVisible(false);
    });
    $("#btn_reset").click(function () {
        joGIS1.PM_SetOperateState(17);
    });
    $("#btn_zoomin").click(function () {
        zoomMap(1);
    });
    $("#btn_zoomout").click(function () {
        zoomMap(-1);
    });

    //joGIS1变了，需要重新绑定
    function joGIS1::SelectedElement(nCount, nKeyType) {
        console.log(nCount);
        console.log(nKeyType);

        if (nCount == 0) {
            deSelFindElement();
            return;
        }

        var navLevel = currentViewModel.currentNavLevel();

        var toolTipFlag = false;//判断冒泡信息是否显示标记
        var sID = null;//图元索引Id
        var nType = null;//图元类型
        var name = null;//图元名称（标注信息）

        for (i = 0; i < nCount; i++) {

            sID = joGIS1.PM_GetSelElementID(i);

            nType = joGIS1.PM_GetElementType(sID);

            name = joGIS1.PM_GetElementCaption(sID);

            //showRelevantMap();

            //2.如果选中图元不是面、多边形，也不是井位，则只更新图元名称
            //盆地级目标面积图元需要显示简介信息，油田级目标图元 （油藏和井位）需要显示相关属性信息
            if (nType != 3 && nType != 11) {
                toolTipFlag = false;
                continue;
            } else {
                //3.获取树节点,目标树里没有该节点就不需要弹出信息(井位需要特殊处理，在除了盆地级的导航图里，井位选中需要弹出信息)
                if (nType == 3) {

                    //4.选中的面积图元无法判断是否是目标，只能采用查找目标树的方式判断
                    var node = getCurTargetNode(name);
                    if (!node) {
                        toolTipFlag = false;
                        continue;
                    } else {
                        toolTipFlag = true;
                        //选中当前目标节点
                        targetTree.deselect_all(true);
                        targetTree.select_node(node);

                        //记录节点id
                        currentViewModel.targetId(node.id);

                        //判断当前面积图元是否可导航（区带不能导航，油田\油藏可以）
                        var isCanNav = false;
                        var nodeLevel = node.level;
                        currentViewModel.currentNodeLevel(nodeLevel);

                        if (nodeLevel == 3 || nodeLevel == 2) {
                            if (nodeLevel==3) {
                                isCanNav = true;
                            }                           

                            var des = oilfields_desdata[name];

                            currentViewModel.primitiveName(name);
                            currentViewModel.primitiveDescribe(des ? des : regions_desdata[name]);
                            //todo 这几个区带，油田暂时没有图片
                            if (",东部,腹部,南缘,西北缘,玛北油田,五彩湾气田,滴水泉油田,昌吉油田,金龙油田,艾湖油田,".indexOf("," + name + ",") > -1) {
                                currentViewModel.primitiveThumb(defaultThumbUrl);
                            } else {
                                currentViewModel.primitiveThumb(baseThumbPath + name + ".jpg");
                            }
                        } else if (nodeLevel == 4) {
                            isCanNav = true;

                            currentViewModel.isPropertyLoading(true);
                            getProDataInfoByType(nType, name);
                        } else {
                            //其他级别的面积图元不弹出信息
                            toolTipFlag = false;
                            continue;
                        }

                        currentViewModel.isCanNav(isCanNav);                        
                    }
                } else {
                    ////8.井位在油田级（不可导）和油藏级（可导）中需要显示属性信息
                    toolTipFlag = true;
                    currentViewModel.isPropertyLoading(true);
                    getProDataInfoByType(nType, name);
                }
            }

            //显示冒泡信息
            currentViewModel.toolTipVisible(toolTipFlag);
            if (toolTipFlag) {
                currentViewModel.toolTipX(mousePointX + "px");
                currentViewModel.toolTipY(mousePointY + "px");
            }

        }
    }

    //鼠标按下事件
    function joGIS1::OnMouseDown(button, shift, x, y) {
        mousePointX = x;
        mousePointY = y;
    }

    //自定义菜单事件
    function joGIS1::CustomMenu(nID) {
        switch (nID) {
            case 100: {//返回上一级
                joGIS1.ResetContent();

                searchInput.val("");

                //1.加载父级节点导航图，区带需要再跳一级
                var typeId = currentTargetNode.typeid;
                var aliasNames = currentTargetNode.aliasnames;
                var name = currentTargetNode.text;                

                var parentNode = targetTree.get_node(currentTargetNode.parent).original;

                if (parentNode.typeid == enumBoType.Play) {
                    parentNode = targetTree.get_node(parentNode.parent).original;
                    typeId = parentNode.typeid;
                    aliasNames = parentNode.aliasnames;
                }
                loadNavMap(parentNode.typeid, parentNode.aliasnames);

                //2.选中当前导航图目标
                targetTree.deselect_all(true);
                targetTree.select_node(parentNode);

                
               
                break;
            }
        }
    }
    //多选中事件
    function joGIS1::OnSelectedElement(nCount) {
        console.log(nCount);
    }
    //选中图元之后事件	
    function joGIS1::OnSelectOneElement(nType, sID) {
        selFindElement(nType, sID);
    }

    function joGIS1::DblClick(e) {
        var sID = joGIS1.PM_GetSelElementID(0);
        if (sID && sID != "") {
            joGIS1.Locate(sID, 1);
        }
    }

    //缩放事件
    function joGIS1::ScaleChanged(fScale) {

    }

    function joGIS1::VisibleRangeChanged() {

    }

    function joGIS1::OnError(nErrorID, lpszMsg) {
        alert(lpszMsg);
    }

}
/**
 * 获取油藏和井位的属性信息
 * @returns {} 
 */
var getProDataInfoByType = function (nType, boId) {

    var typeId = nType == 11 ? 1 : 2;
    if (typeId == 1) {
        currentViewModel.displayProperties(wellProperty.join(","));
    }
    if (typeId == 2) {
        currentViewModel.displayProperties(reservoirProperty.join(","));
    }

    $.ajax({
        url: "/BOAPI/GetProDataInfoByType",
        type: "post",
        data: { typeId: typeId, boId: boId },
        success: function (result) {
            currentViewModel.isPropertyLoading(false);
            //数据先清空
            currentViewModel.primitiveProperties([]);
            if (result) {
                if (result.ProData) {
                    if (result.ProData.length > 0) {
                        currentViewModel.primitiveProperties(result.ProData);
                    }
                }
                if (result.ProColumns && result.ProColumns.length > 0) {
                    currentViewModel.allProperties(result.ProColumns);
                }
                if (result.AliasName && nType == 11) {
                    //井位比较特殊，虽然在目标树里没有，却是一个目标，相关图件也应该跟着一起改变
                    loadRelevantMap(result.AliasName);
                }
                //var results = [];
                //for (var i = 0; i < properties.length; i++) {
                //    var item = properties[i];
                //    var temp = {
                //        elementType: nType,
                //        propertyName: item,
                //        propertyValue: result[item],
                //        isCanNav: false
                //    };
                //    if (currentNavLevel == 3) {
                //        if (item == reservoirProperty[0]) {
                //            temp.isCanNav = true;
                //        }
                //    } else if (currentNavLevel == 4) {
                //        if (item == wellProperty[0]) {
                //            temp.isCanNav = true;
                //        }
                //    }

                //    results.push(temp);
                //}

            }
        }
    });
}

/**
 * 选中图元,并高亮（单选）
 * @returns {} 
 */
var selFindElement = function (nType, sID) {
    //1.JoGis上选中目标
    joGIS1.PM_SelectElement(sID, 0);

    //2.增加选中高亮闪烁 by panxiang 2017.8.4 begin
    //删除之前高亮的图元
    if (focuseEleId.length > 0) {
        for (var i = 0; i < focuseEleId.length; i++) {
            joGIS1.PM_RemoveFocusElement(focuseEleId[i]);
        }
        focuseEleId = [];
    }
    //添加当前选中图元到高亮
    var r = joGIS1.PM_AddFocusElement(sID);
    r = joGIS1.PM_SetFocusStyle(0, 0xFFFF00, 0, 2);
    
    focuseEleId.push(sID);
    //end

    //4.存储当前目标信息
    storeElementInfo(nType, sID);

    //图元操作时关闭所有折叠
    $("#geoMapPane .collapse").collapse("hide");
};
/**
 * 清除选中图元，目标树定位到当前导航图所在目标节点
 * @returns {} 
 */
var deSelFindElement = function () {
    //1.清除选中的图元
    var count = joGIS1.PM_GetSelElementCount();
    if (count > 0) {
        joGIS1.PM_SelectElement("", -1);
    }

    //2.删除高亮的图元
    if (focuseEleId.length > 0) {
        for (var i = 0; i < focuseEleId.length; i++) {
            joGIS1.PM_RemoveFocusElement(focuseEleId[i]);
        }
        focuseEleId = [];
    }
    //3.目标树清除当前选中，选中当前图件所在节点
    var nodeLevel = currentTargetNode.level;
    var navLevel = currentViewModel.currentNavLevel();
    var parentNode = null;

    while (nodeLevel > navLevel) {
        parentNode = targetTree.get_node(currentTargetNode.parent).original;
        currentTargetNode = parentNode;
        nodeLevel = parentNode.level;
    }
    if (parentNode) {
        //选中当前节点的父节点
        targetTree.deselect_all(true);
        targetTree.select_node(parentNode);
        //加载相关图件
        loadRelevantMap(parentNode.aliasnames);
    } 
    //4.清除存储的目标信息
    currentMapElement = null;

    currentViewModel.toolTipVisible(false);
    //空白处关闭所有折叠
    $("#geoMapPane .collapse").collapse("hide");
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

//运行选中的图元，去掉井，油藏怎么去？油田是文字？
//var getAllwFocusEles = function () {
//    var allowFocusEles = "";

//    if (currentNavLevel == 1) {
//        allowFocusEles = ",3,";
//    } else if (currentNavLevel == 3) {
//        allowFocusEles = ",3,11,";
//    } else {
//        allowFocusEles = ",11,";
//    }
//    return allowFocusEles;
//}

/*
*存储当前地图范围
*/
var storeMapRect = function () {
    //var sRange = joGIS1.PM_GetMapRect();
    var sRange = joGIS1.PM_GetUserRect();
    var sCoord = sRange.split(' ');

    if (sCoord.length >= 4) {
        var mapRact = {};
        mapRact.dLeft = parseFloat(sCoord[0]);
        mapRact.dTop = parseFloat(sCoord[1]);
        mapRact.dRight = parseFloat(sCoord[2]);
        mapRact.dBottom = parseFloat(sCoord[3]);

        var p1 = joGIS1.PM_UPtoLL(mapRact.dLeft, mapRact.dBottom).split(" ");
        var p2 = joGIS1.PM_UPtoLL(mapRact.dRight, mapRact.dTop).split(" ");

        mapRact.p1 = [parseFloat(p1[0]), parseFloat(p1[1])];
        mapRact.p2 = [parseFloat(p2[0]), parseFloat(p2[1])];

        console.log(mapRact);
        currentMapRange = mapRact;
    }
};
/*
*存储当前图元信息
*1．	符号图元：一个控制点；
2．	文字图元：一个控制点；
3．	地名图元：一个控制点；
4．	图例图元：一个控制点；
5．	比例尺图元：一个控制点；
6．	井位图元：二个控制点；0：井口；1：井底；
7．	矩形类图元：二个控制点：0：左上角；1：右下角；
注：矩形类图元包括：图框、矩形、圆角矩形、线段、元文件、位图图元等；
8．	曲线类图元：全部边界控制点；
注：曲线类图元包括：等值线、断层线、曲线、面、地震测线图元等；
*/
var storeElementInfo = function (nType, sID) {
    var name = joGIS1.PM_GetElementCaption(sID);
    //获取目标控制点坐标
    //当前目标的点数量
    var polyCoords = [];
    var pointcount = joGIS1.PM_GetPointCount(sID);
    var point = null;
    for (var j = 0; j < pointcount; j++) {
        point = joGIS1.PM_GetPoint(sID, j).split(' ');
        //大地坐标转经纬度坐标
        var p = joGIS1.PM_UPtoLL(parseFloat(point[0]), parseFloat(point[1])).split(" ");

        coord = [parseFloat(p[0]), parseFloat(p[1])];

        polyCoords.push(coord);
    }

    currentMapElement = {
        elementID: sID, elementType: nType, elementName: name, elementPolyCoords: polyCoords
    };
};
/**
获取当前导航等级
*/
var getNavLevel = function () {
    return currentViewModel.currentNavLevel();
}
////页面加载完毕后执行
window.onload = function () {
}