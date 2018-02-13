var enumTargetType = {
    Basin: "Basin",
    Play: "Play",    
    Field: "Field",
    Pool: "Pool",
    Well: "Well"
};
var enumGeologySeriesType = {
    Erathem: "J",
    System: "X",
    Series: "T",
    Formation: "Z",
    Member: "C"
};

//收藏文件夹树
var favCatalogTree = null;

//图片展示控件设置的图件分类过滤值
var controlFilterValue = null;

// init cubeportfolio结果显示区域
var options = {
    filters: '#js-filters-juicy-projects',
    loadMore: '#js-loadMore-juicy-projects',
    loadMoreAction: 'click',
    layoutMode: 'grid',
    defaultFilter: '*',
    animationType: 'quicksand',
    gapHorizontal: 35,
    gapVertical: 30,
    gridAdjustment: 'responsive',
    mediaQueries: [
        {
            width: 1500,
            cols: 5
        }, {
            width: 1100,
            cols: 4
        }, {
            width: 800,
            cols: 3
        }, {
            width: 480,
            cols: 2
        }, {
            width: 320,
            cols: 1
        }
    ],
    caption: 'overlayBottomReveal',
    displayType: 'sequentially',
    displayTypeSpeed: 80,

    // lightbox
    lightboxDelegate: '.cbp-lightbox',
    lightboxGallery: true,
    lightboxTitleSrc: 'data-title',
    lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',

    // singlePage popup
    singlePageDelegate: '.cbp-singlePage',
    singlePageDeeplinking: true,
    singlePageStickyNavigation: true,
    singlePageCounter: '<div class="cbp-popup-singlePage-counter">{{current}} of {{total}}</div>',
    singlePageCallback: function (url, element) { //点击浏览下一页
        // to update singlePage content use the following method: this.updateSinglePage(yourContent)
        var t = this;

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'html',
            timeout: 10000
        })
            .done(function (info) {
                t.updateSinglePage(info);
            })
            .fail(function () {
                t.updateSinglePage('AJAX Error! Please refresh the page!');
            });
    }
};
var ids = [];//临时存储结果数据，为了打开详情页面使用
var productTypeIds = {};//全局图件分类Id
var scrollOffset = null;//全局滚动条偏移，加载更多时需要

var global_targets = null;//全局工区范围数据
var global_geologyseries = null;//全局地质层系数据
var global_targets_results = [];//全局工区范围级联结果
var global_geologyseries_results = [];//全局地址层系级联结果

//全局成果年份最大值和最小值
var maxYear = null;
var minYear = null;

var SearchSchemeViewModel = function (name, selectedBasin, selectedRegion,
    selectedOilField, selectedOilReservoir, selectedErathem, selectedSystem,
    selectedSeries, selectedFormation, selectedMember, selectedClassifications,
    fromYear, toYear) {

    var self = this;
    self.name = ko.observable(name);
    //高级搜索，工区范围
    self.basin = selectedBasin;
    self.region = selectedRegion;
    self.oilField = selectedOilField;
    self.oilReservoir = selectedOilReservoir;
    //地质层位
    self.erathem = selectedErathem;
    self.system = selectedSystem;
    self.series = selectedSeries;
    self.formation = selectedFormation;
    self.member = selectedMember;
    //图件分类
    self.classifications = selectedClassifications;
    //成果年份
    self.fromYear = fromYear;
    self.toYear = toYear;
    
};

var SearchViewModel = function () {
    var self = this;

    //id搜索，有些页面会跳转过来
    self.searchId = ko.observable(null);
    //搜索关键字
    self.searchKey = ko.observable(null);
    //加载搜索历史
    self.isHistoryLoading = ko.observable(true);
    //搜索历史
    self.historyResults = ko.observableArray();
    //搜索历史点击
    self.historyResultClick = function (item) {
        self.searchKey(item.KeyWord);
        $('#historyCollapse').collapse('hide');
    }

    //高级搜索，工区范围
    self.basins = ko.observableArray();//盆地
    self.selectedBasin = ko.observable(null);//默认值null
    self.regions = ko.observableArray();//区带
    self.selectedRegion = ko.observable(null);
    self.oilFields = ko.observableArray();//油田
    self.selectedOilField = ko.observable(null);
    self.oilReservoir = ko.observableArray();//油藏
    self.selectedOilReservoir = ko.observable(null);
    //地质层位
    self.erathem = ko.observableArray();//界
    self.selectedErathem = ko.observable(null);
    self.system = ko.observableArray(), //系
    self.selectedSystem = ko.observable(null);
    self.series = ko.observableArray(), //统
    self.selectedSeries = ko.observable(null);
    self.formation = ko.observableArray(), //组
    self.selectedFormation = ko.observable(null);
    self.member = ko.observableArray(), //段
    self.selectedMember = ko.observable(null);
    //图件分类
    self.classification = ko.observableArray();
    self.selectedClassifications = ko.observableArray();
    //成果年份
    self.fromYear = ko.observable(null);
    self.toYear = ko.observable(null);

    //高级搜索与油藏搜索切换
    self.advanceSwitch = function (data, event) {
        var flag = $(event.target).data("slide");
        var number = flag == "prev" ? 0 : 1;
        $("#advanceSearch_carousel").carousel(number);
        var left = $("#advanceSearch_left");
        var right = $("#advanceSearch_right");

        if (number === 0) {
            right.show();
            left.hide();
        } else {
            right.hide();
            left.show();
        }
    };
    //油藏属性
    self.poolparams = ko.observableArray();
    //油藏属性搜索
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

    //搜索参数
    self.searchParamObj = ko.observable(null);

    //搜索查询开始位置
    self.fromSize = ko.observable(0);
    //搜索结果查询条数
    self.sizeOfResult = ko.observable(20);
    //结果分类
    self.classificationList = ko.observableArray();
    //结果图册
    self.resultAlbum = ko.observableArray();

    //收藏文件夹
    self.favoriteFolders = ko.observableArray();

    //model初始化
    self.initPage = function () {
        var params = getUrlRequest(window.location);

        if (params.key && params.key != "") {
            self.searchId(params.key);
        }
        if (params.keyword && params.keyword != "") {
            self.searchKey(params.keyword);
        }

        self.searchResult("simple");

        self.eventBind();
    };
    self.eventBind = function () {
        //搜索历史
        $("#historyCollapse").on("shown.bs.collapse", function (e) {
            var param = {
                "userid": userid,
                "smode": 2,
                "top": 10
            }
            $.ajax({
                url: "/UserDataAPI/GetSearchHistoryByUser",
                async: true,
                type: "post",
                data: JSON.stringify(param),
                contentType: 'application/json',
                success: function (result) {
                    self.isHistoryLoading(false);
                    self.historyResults(result);
                }
            });
        });
        //点击页面其他地方（除了搜索输入框和展开），折叠关闭
        $("#txtKeyword,#historyCollapse").on("blur",function () {
            $("#historyCollapse").collapse("hide");
        });
        //收藏对话框
        $("#favCatalog_modal").on("show.bs.modal", function (event) {
            var button = $(event.relatedTarget) // Button that triggered the modal
            var iiid = button.data("iiid") // Extract info from data-* attributes
            $("#input_modal").val(iiid);
            //获取收藏文件夹树
            $.ajax({
                url: "/FavoriteCatalogService/GetFavoriteFolderTree",
                type: "post",
                async: false,
                success: function (result) {
                    if (!result) {
                        result = [];
                    }
                    if (!favCatalogTree) {
                        $("#favCatalog_jsTree").jstree({
                            "core": {
                                "animation": 0,
                                "check_callback": true,
                                "themes": { "stripes": true
                                },
                                "multiple": false,
                                "data": result
                            },
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
                            "unique": {
                                "duplicate": function (name, counter) {
                                    return name + " " +counter;
                                }
                            },
                            "plugins": ["contextmenu", "dnd", "search", "unique", "state", "types", "wholerow"]
                        }).on("create_node.jstree", function (e, data) { 


                        }).on("rename_node.jstree", function (e, data) {
                            if (data.old == data.text) {
                                return false;
                            }
                            var id = data.node.original.FAVCATALOGID;
                            if (!id) {
                                id =0
                            }

                            var name = data.node.text;

                            var parentId =data.node.parent;
                            parentId = parentId == "#" ? null : parentId;

                            updateFavoriteFolder(id, name, parentId, data.node);
                        }).on("move_node.jstree", function (e, data) {
                            var id = data.node.original.FAVCATALOGID;
                            if (!id) {
                                id = 0
                            }

                            var name = data.node.text;

                            var parentId = data.parent;
                            parentId = parentId == "#" ? null : parentId;

                            updateFavoriteFolder(id, name, parentId, data.node);

                        }).on("delete_node.jstree", function (e, data) {

                            $.ajax({
                                url: "/FavoriteCatalogService/DeleteFavoriteFolder",
                                async: true,
                                type: "post",
                                data: { favCatalogId: data.node.id
                                },
                                success: function (result) {
                                    if (result =="success") {
                                        //todo 删除成功提示！
                                    }
                                }
                            });
                        }).on("changed.jstree", function (e, data) {

                            if (data.action == "select_node") {
                                //当前选中节点
                                var sel = data.node;
                                var isLeaf = data.instance.is_leaf(sel);

                                //重命名和删除按钮可用状态
                                $("#favCatalog_rename").removeClass("disabled");
                                if (isLeaf) {
                                    $("#favCatalog_delete").removeClass("disabled");
                                } else {
                                    $("#favCatalog_delete").addClass("disabled");
                                }
                            } else if (data.action == "delete_node") {
                                //重命名和删除按钮不可用
                                $("#favCatalog_rename").addClass("disabled");
                                $("#favCatalog_delete").addClass("disabled");
                            }
                        });

                        favCatalogTree = $("#favCatalog_jsTree").jstree(true)
                    } else {
                        favCatalogTree.settings.core.data = result;
                        favCatalogTree.refresh();
                    }
                }
            });
        });
        //新增收藏文件夹兄弟节点
        $("#favCatalog_add_sibling").click(function () {
            var sel = favCatalogTree.get_selected(true)[0];

            var parent = null;
            if (sel && sel.parent) {
                parent = sel.parent;
            }
            favCatalogTree.create_node(parent, {
            }, "last", function (new_node) {
                favCatalogTree.edit(new_node);
            });
        });
        //新增收藏文件夹子节点
        $("#favCatalog_add_child").click(function () {
            var sel = favCatalogTree.get_selected(true)[0];

            if (!sel) {
                sel = null;
            }
            favCatalogTree.create_node(sel, {
            }, "last", function (new_node) {
                favCatalogTree.edit(new_node);
            });

        });
        //收藏文件夹重命名
        $("#favCatalog_rename").click(function () {
            var sel = favCatalogTree.get_selected(true);
            if (!sel.length) { return false;
            }
            sel = sel[0];
            favCatalogTree.edit(sel);
        });
        //删除收藏文件夹
        $("#favCatalog_delete").confirmation({
            title: "确定删除？该文件夹下的收藏记录也会删除",
            btnOkLabel: "确定",
            btnCancelLabel: "取消",
            container: "#favCatalog_modal",
            onConfirm: function (event, element) {
                $("#favCatalog_delete").confirmation("hide");

                var sel = favCatalogTree.get_selected(true);
                if (!sel.length) { return false;
                }

                favCatalogTree.delete_node(sel);
            }
        });
        //搜索框
        var to = false;
        $("#select_search").keyup(function () {
            if (to) { clearTimeout(to);
            }
            to = setTimeout(function () {
                var v = $("#select_search").val();
                $("#favCatalog_jsTree").jstree(true).search(v);
            }, 250);
        });
        //浏览模式切换按钮
        $("#gridMode").click(function () {
            $("#listModeResult_pane").hide();
            $("#gridModeResult_pane").show();
            self.renderCubePortfolio();
        });
        $("#listMode").click(function () {
            $("#gridModeResult_pane").hide();
            $("#listModeResult_pane").show();

        });
    };
    //获取搜索参数模板，高级搜索和简单搜索分开
    self.getSearchParamTemp = function (type) {
        var filterArray = [];
       //普通搜索和高级搜索不考虑控件过滤
        controlFilterValue = null;

        if (type === "simple") {
            //id搜索，一般是别的页面跳转过来
            if (self.searchId()) {
                filterArray.push(
                    { "iiid": self.searchId() });
            }
            //关键字搜索
            if (self.searchKey()) {
                filterArray.push(
                    { "dc.title": { "$elemMatch": { "text": { "$regex": self.searchKey(), "$options": "$i" }, "type": "Formal" } } });
            }
        }
        if (type === "advance") {

            var display = $("#advanceSearch_right").css("display");
            //油藏属性搜索            
            if (display=="none") {

                var reservoirFilter = [];
                var reservoirResult = [];

                if (self.currentAnnualReporting()) {
                    reservoirFilter.push({ "基础参数.上报年度": self.currentAnnualReporting() });
                }
                if (self.currentManageUnit()) {
                    reservoirFilter.push({ "基础参数.归属单位": self.currentManageUnit() });
                }
                if (self.currentManageMode()) {
                    reservoirFilter.push({ "基础参数.管理方式": self.currentManageMode() });
                }
                if (self.currentStorageType()) {
                    reservoirFilter.push({ "基础参数.储量类型": self.currentStorageType() });
                }
                if (self.currentStorageCategory()) {
                    reservoirFilter.push({ "基础参数.储量类别": self.currentStorageCategory() });
                }

                if (self.currentStorageSource()) {
                    reservoirFilter.push({ "基础参数.储量来源": self.currentStorageSource() });
                }
                if (self.currentReservoirType()) {
                    reservoirFilter.push({ "基础参数.油气藏类型": self.currentReservoirType() });
                }
                if (self.currentReservoirPhysical()) {
                    reservoirFilter.push({ "基础参数.储层物性": self.currentReservoirPhysical() });
                }
                if (self.currentReservoirLithology()) {
                    reservoirFilter.push({ "基础参数.储层岩性": self.currentReservoirLithology() });
                }
                if (self.currentSubdivisionLithology()) {
                    reservoirFilter.push({ "基础参数.岩性细分": self.currentSubdivisionLithology() });
                }

                if (self.currentReservesAbundance()) {
                    reservoirFilter.push({ "基础参数.储量丰度": self.currentReservesAbundance() });
                }
                if (self.currentCrudeType()) {
                    reservoirFilter.push({ "基础参数.资源类型": self.currentCrudeType() });
                }
                if (self.currentCrudeDensity()) {
                    reservoirFilter.push({ "基础参数.原油密度": self.currentCrudeDensity() });
                }
                if (self.currentEdgeBottomWater()) {
                    reservoirFilter.push({ "基础参数.边底水情况": self.currentEdgeBottomWater() });
                }
                if (self.currentDriveTypes()) {
                    reservoirFilter.push({ "基础参数.驱动类型": self.currentDriveTypes() });
                }

                if (self.currentSaveType()) {
                    reservoirFilter.push({ "基础参数.储集类型": self.currentSaveType() });
                }
                if (self.currentCementationType()) {
                    reservoirFilter.push({ "基础参数.胶结类型": self.currentCementationType() });
                }
                if (self.currentBurialDepth()) {
                    reservoirFilter.push({ "基础参数.埋藏深度": self.currentBurialDepth() });
                }
                if (self.currentHeterogeneous()) {
                    reservoirFilter.push({ "基础参数.储层非均质程度": self.currentHeterogeneous() });
                }
                if (self.currentFormationPressure()) {
                    reservoirFilter.push({ "基础参数.地层压力": self.currentFormationPressure() });
                }
                if (reservoirFilter.length > 0) {
                    var reservoirParam = {
                        "bot": "油气藏",
                        "filter": {
                            "$and": reservoirFilter
                        }
                    };

                    $.ajax({
                        url: "/BOAPI/GetBoListHasAliasByFilter",
                        async: false,
                        type: "post",
                        data: JSON.stringify(reservoirParam),
                        contentType: 'application/json',
                        success: function (result) {
                            /*返回值格式
                        *[
                        *  {
                        *    "boid": "cd9184cd-731d-4c3f-aec9-61cae67eab9e",
                        *    "name": "拉布达林盆地",
                        *    "bot": "盆地"
                        *  }]
                        */
                            if (result && result.length > 0) {
                                var aliasNameList = null;
                                for (var i = 0; i < result.length; i++) {
                                    aliasNameList = result[i].AliasName;
                                    if (aliasNameList && aliasNameList.length > 0) {
                                        reservoirResult = reservoirResult.concat(result[i].AliasName);
                                    }
                                }
                            }
                        },

                        error: function (ob, errStr) {
                            alert('The problem with sending it, please try again.');
                        }
                    });

                }

                if (reservoirResult.length > 0) {
                    filterArray.push({ "ep.bo": { "$elemMatch": { "value": { "$in": reservoirResult }, "type": "Pool" } } });

                }
            } else {
                //高级搜索，工区范围(考虑级联，从最小范围开始)
                var target = null;
                var geologyseries = null;
                //油藏
                if (self.selectedOilReservoir()) {
                    target = getTargetByBoId(self.selectedOilReservoir());
                    filterArray.push({ "ep.bo": { "$elemMatch": { "value": { "$in": target.aliasnames }, "type": "Pool" } } });

                } else if (self.selectedOilField()) {
                    //油田
                    target = getTargetByBoId(self.selectedOilField());
                    filterArray.push({ "ep.bo": { "$elemMatch": { "value": { "$in": target.aliasnames }, "type": "Field" } } });

                } else if (self.selectedRegion()) {
                    //区带
                    target = getTargetByBoId(self.selectedRegion());
                    filterArray.push({ "ep.bo": { "$elemMatch": { "value": { "$in": target.aliasnames }, "type": "Play" } } });

                } else if (self.selectedBasin()) {
                    //盆地
                    target = getTargetByBoId(self.selectedBasin());
                    filterArray.push({ "ep.bo": { "$elemMatch": { "value": { "$in": target.aliasnames }, "type": "Basin" } } });
                }

                //段
                if (self.selectedMember()) {
                    geologyseries = getGeologySeriesById(self.selectedMember());
                    filterArray.push({ "ep.geologyseries": { "$elemMatch": { "value": { "$in": geologyseries.seqname }, "type": "Member" } } });

                } else if (self.selectedFormation()) {
                    //组
                    geologyseries = getGeologySeriesById(self.selectedFormation());
                    filterArray.push({ "ep.geologyseries": { "$elemMatch": { "value": { "$in": geologyseries.seqname }, "type": "Formation" } } });
                } else if (self.selectedSeries()) {
                    //统
                    geologyseries = getGeologySeriesById(self.selectedSeries());
                    filterArray.push({ "ep.geologyseries": { "$elemMatch": { "value": { "$in": geologyseries.seqname }, "type": "Series" } } });
                } else if (self.selectedErathem()) {
                    //界
                    geologyseries = getGeologySeriesById(self.selectedErathem());
                    filterArray.push({ "ep.geologyseries": { "$elemMatch": { "value": { "$in": geologyseries.seqname }, "type": "Erathem" } } });

                } else if (self.selectedSystem()) {
                    //系
                    geologyseries = getGeologySeriesById(self.selectedSystem());
                    filterArray.push({ "ep.geologyseries": { "$elemMatch": { "value": { "$in": geologyseries.seqname }, "type": "System" } } });

                }

                //图件分类
                if (self.selectedClassifications().toString() !== "") {
                    filterArray.push({ "ep.producttype": { "$in": self.selectedClassifications() } });
                }
                //成果年份
                if (self.fromYear() != minYear || self.toYear() != maxYear) {
                    filterArray.push({ "dc.year": { "$gte": self.fromYear(), "$lte": self.toYear() } });
                }
            }
        }

        var param = {
            "pager": {
                "from": self.fromSize(),
                "size": self.sizeOfResult()
            },
            "sortrules": {
                "indexeddate": {
                    "direction": -1
                }
            }
        };
        //去除虚图
        filterArray.push({ "source.url": { "$regex": "^((?!VMap).)*$", "$options": "$i" } });
        //去除导航图
        filterArray.push({ "ep.producttype": { "$regex": "^(?!.*?导航图$)", "$options": "$i" } });
        if (filterArray.length > 0) {
            param.filter = {
                "$and": filterArray

            };
        }
        return param;

    };
    //获取高级搜索工区范围和地质层位数据参数模板
    //self.getAdvanceParamTemp = function (action, type) {
    //    var param = {
    //        "bot": ""
    //    };
    //    var filter = [];

    //    switch (type) {
    //        //盆地
    //        case "pd":
    //            param.bot = "盆地";//最高一层获取所有数据                
    //            break;
    //            //区带
    //        case "qd":
    //            param.bot = "区带";

    //            if (self.selectedBasin()) {
    //                filter.push({
    //                    "计算单元属性参数.盆地": { "$eq": self.selectedBasin() }
    //                });
    //            }
    //            break;
    //            //油田
    //        case "yt":
    //            param.bot = "油田";

    //            if (self.selectedBasin()) {
    //                filter.push({
    //                    "计算单元属性参数.盆地": { "$eq": self.selectedBasin() }
    //                });
    //            }
    //            if (self.selectedRegion()) {
    //                filter.push({
    //                    "计算单元属性参数.区带": { "$eq": self.selectedRegion() }
    //                });
    //            }
    //            break;
    //            //油藏
    //        case "yc":
    //            param.bot = "油藏";

    //            if (self.selectedBasin()) {
    //                filter.push({
    //                    "计算单元属性参数.盆地": { "$eq": self.selectedBasin() }
    //                });
    //            }
    //            if (self.selectedRegion()) {
    //                filter.push({
    //                    "计算单元属性参数.区带": { "$eq": self.selectedRegion() }
    //                });
    //            }
    //            if (self.selectedOilField()) {
    //                filter.push({
    //                    "计算单元属性参数.油田": { "$eq": self.selectedOilField() }
    //                });
    //            }

    //            break;
    //            //界
    //        case "j":
    //            param.bot = "界";//引起下一层改变
    //            break;
    //            //系
    //        case "x":
    //            param.bot = "系";

    //            if (self.selectedErathem()) {
    //                filter.push({
    //                    "计算单元属性参数.界": { "$eq": self.selectedErathem() }
    //                });
    //            }
    //            break;
    //            //统
    //        case "t":
    //            param.bot = "统";

    //            if (self.selectedErathem()) {
    //                filter.push({
    //                    "计算单元属性参数.界": { "$eq": self.selectedErathem() }
    //                });
    //            }
    //            if (self.selectedSystem()) {
    //                filter.push({
    //                    "计算单元属性参数.系": { "$eq": self.selectedSystem() }
    //                });
    //            }

    //            break;
    //            //组
    //        case "z":
    //            param.bot = "组";
    //            if (self.selectedErathem()) {
    //                filter.push({
    //                    "计算单元属性参数.界": { "$eq": self.selectedErathem() }
    //                });
    //            }
    //            if (self.selectedSystem()) {
    //                filter.push({
    //                    "计算单元属性参数.系": { "$eq": self.selectedSystem() }
    //                });
    //            }
    //            if (self.selectedSeries()) {
    //                filter.push({
    //                    "计算单元属性参数.统": { "$eq": self.selectedSeries() }
    //                });
    //            }
    //            break;
    //            //段
    //        case "d":
    //            param.bot = "段";

    //            if (self.selectedErathem()) {
    //                filter.push({
    //                    "计算单元属性参数.界": { "$eq": self.selectedErathem() }
    //                });
    //            }
    //            if (self.selectedSystem()) {
    //                filter.push({
    //                    "计算单元属性参数.系": { "$eq": self.selectedSystem() }
    //                });
    //            }
    //            if (self.selectedSeries()) {
    //                filter.push({
    //                    "计算单元属性参数.统": { "$eq": self.selectedSeries() }
    //                });
    //            }
    //            if (self.selectedFormation()) {
    //                filter.push({
    //                    "计算单元属性参数.组": { "$eq": self.selectedFormation() }
    //                });

    //            }
    //            break;
    //        default:
    //            break;
    //    }
    //    if (filter.length > 0) {
    //        param.filter = {
    //            "$and": filter
    //        };
    //    }
    //    return param;
    //};

    self.initAdvanceSearchData = function () {
        //加载图件分类和成果年份
        self.loadAdvanceClassifyAndYear();
        //加载目标和油藏属性
        self.loadAdvanceSelectDataOfMeta();
        //渲染下拉
        self.renderAdvanceSelect();
    };
    //目标级联
    self.targetSelectDataBind = function (event) {
        var target = event.currentTarget;

        var typeid = event.data;

        var queryresult = null;

        //todo考虑跨级级联和直接不选父级（应该按照类型过滤）
        var parentid = null;
        global_targets_results = [];

        if (typeid == enumTargetType.Basin) {
            parentid = ["#"];
        } else if (typeid == enumTargetType.Play) {
            if (self.selectedBasin()) {
                parentid = [self.selectedBasin()];
            }

        } else if (typeid == enumTargetType.Field) {
            if (self.selectedRegion()) {
                parentid = [self.selectedRegion()];
            }

        } else if (typeid == enumTargetType.Pool) {
            parentid = self.selectedOilField();
            if (!parentid && self.selectedRegion()) {
                getTargetIdByParentId(self.selectedRegion(), 1);
                parentid = global_targets_results;
            }
        }
        if (parentid && parentid.length > 0) {
            queryresult = getTargetByParent(parentid);
        } else {
            queryresult = getTargetByTypeId(typeid);
        }


        if (typeid == enumTargetType.Basin) {
            self.basins(queryresult);
        } else if (typeid == enumTargetType.Play) {
            self.regions(queryresult);
        } else if (typeid == enumTargetType.Field) {
            self.oilFields(queryresult);
        } else if (typeid == enumTargetType.Pool) {
            self.oilReservoir(queryresult);
        }
        $(target).trigger("chosen:updated");

    };
    //层系级联
    self.strataSelectDataBind = function (event) {
        var target = event.currentTarget;

        var typeid = event.data;

        var queryresult = null;

        var parentids = null;

        global_geologyseries_results = [];//初始化层系结果

        if (typeid == enumGeologySeriesType.Erathem) {
            global_geologyseries_results = [null];

        } else if (typeid == enumGeologySeriesType.System) {
            if (self.selectedErathem()) {
                global_geologyseries_results = [self.selectedErathem()];
            }

        } else if (typeid == enumGeologySeriesType.Series) {
            if (self.selectedSystem()) {
                global_geologyseries_results = [self.selectedSystem()];

            } else if (self.selectedErathem()) {
                getGeologySeriesByParentId(self.selectedErathem(), 1);
            }

        } else if (typeid == enumGeologySeriesType.Formation) {
            if (self.selectedSeries()) {
                global_geologyseries_results = [self.selectedSeries()];
            } else if (self.selectedSystem()) {

                getGeologySeriesByParentId(self.selectedSystem(), 1);

            } else if (self.selectedErathem()) {

                getGeologySeriesByParentId(self.selectedErathem(), 2);
            }
        } else {
            if (self.selectedFormation()) {
                global_geologyseries_results = [self.selectedFormation()];

            } else if (self.selectedSeries()) {
                getGeologySeriesByParentId(self.selectedSeries(), 1);

            } else if (self.selectedSystem()) {
                getGeologySeriesByParentId(self.selectedSystem(), 2);

            } else if (self.selectedErathem()) {
                getGeologySeriesByParentId(self.selectedErathem(), 3);

            }
        }
        parentids = global_geologyseries_results;

        if (parentids && parentids.length > 0) {
            queryresult = getGeologySeriesByParent(parentids);
        } else {
            queryresult = getGeologySeriesByTypeId(typeid);
        }

        if (typeid == enumGeologySeriesType.Erathem) {
            self.erathem(queryresult);
        } else if (typeid == enumGeologySeriesType.System) {
            self.system(queryresult);
        } else if (typeid == enumGeologySeriesType.Series) {
            self.series(queryresult);
        } else if (typeid == enumGeologySeriesType.Formation) {
            self.formation(queryresult);
        } else {
            self.member(queryresult);
        }

        $(target).trigger("chosen:updated");
    };

    self.renderAdvanceSelect = function () {
        //所有select渲染,工区范围，地质层位
        $(".chosen-select").each(function () {
            var currentDom = $(this);

            currentDom.chosen({
                allow_single_deselect: true,
                disable_search_threshold: 10,
                search_contains:true,
                no_results_text: '未找到此选项!',
                width: '100%'
            });


            var typeId = currentDom.attr("typeid");
            var typeName = currentDom.attr("typename");

            if (typeof (currentDom.attr("cascade")) != "undefined") {
                //目标
                if (typeof (currentDom.attr("target")) != "undefined") {
                    currentDom.bind('chosen:showing_dropdown', typeId, self.targetSelectDataBind);
                }
                //层系
                if (typeof (currentDom.attr("strata")) != "undefined") {
                    currentDom.bind('chosen:showing_dropdown', typeId, self.strataSelectDataBind);
                }
            } else {
                currentDom.trigger("chosen:updated");
            }
        });

    };

    //加载图件分类和成果年份
    self.loadAdvanceClassifyAndYear = function () {
        var param = {
            "filter": {
                "$and": [
                    { "source.url": { "$regex": "^((?!VMap).)*$", "$options": "$i" } },
                    { "ep.producttype": { "$regex": "^(?!.*?导航图$)", "$options": "$i" } }
                ]
            },
            "fields": {
                "groups.ep.producttype": 1,
                "groups.dc.year": 1
            },
            "grouprule": {
                "top": 1000000,
                "gfields": [
                    "ep.producttype", "dc.year"
                ]
            }
        };
        $.ajax({
            url: global_api_url + "/SearchService/Match",
            async: false,
            type: "post",
            data: JSON.stringify(param),
            contentType: "application/json",
            success: function (result) {
                if (result) {
                    //图件分类
                    var producttype = result.groups["ep.producttype"];
                    if (producttype) {
                        var classifications = [];
                        for (var key in producttype) {
                            if (key&&key!=""&&key!="null") {
                                classifications.push({ "name": key, "count": producttype[key] });
                            }                           
                        }
                        self.classification(classifications);
                    }
                    //成果年份
                    var year = result.groups["dc.year"];
                    if (year) {
                        var years = [];
                        for (var key in year) {
                            if (!key || key == "null") {
                                continue;
                            }
                            years.push(key);
                        }
                        years.sort(function (a, b) {
                            return a - b;
                        });

                        minYear = years[0];
                        maxYear = years[years.length - 1];
                        self.fromYear(minYear);
                        self.toYear(maxYear);

                        self.renderYearRange();
                    }
                }
            }
        });
    };

    //加载工区范围和地质层位下拉数据
    self.loadAdvanceSelectDataOfMeta = function () {
        var param = {
            "targets": {
                "query": {
                    "root": null
                }
            },
            "geologyseries": {
                "query": {
                    "root": null
                }
            },
            "poolparams": {
                "query": {
                    "bot": "油气藏",
                    "appdomain": "基础参数",
                    "names": [
                      {
                          "name": "上报年度",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "归属单位",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "管理方式",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "储量类型",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "储量类别",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "储量来源",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "油气藏类型",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "储层物性",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "储层岩性",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "岩性细分",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "储量丰度",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "资源类型",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "原油密度",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "边底水情况",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "驱动类型",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "储集类型",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "胶结类型",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "埋藏深度",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "储层非均质程度",
                          "valuetype": "Fact"
                      },
                      {
                          "name": "地层压力",
                          "valuetype": "Fact"
                      }
                    ]
                }
            }
        };
        $.ajax({
            url: "/SearchAPI/GetParameterItems",
            async: false,
            type: "post",
            data: JSON.stringify(param),
            contentType: "application/json",
            success: function (result) {
                if (result&&result.data) {
                    global_targets = result.data.targets;
                    global_geologyseries = result.data.geologyseries;
                    //油藏属性渲染
                    var poolparams=result.data.poolparams;
                    var item = null;
                    var name = null;
                    var value = null;
                    for (var i = 0; i < poolparams.length; i++) {
                        item = poolparams[i];
                        name = item.name;
                        value = item.values;
                        if (name == "上报年度") {
                            value.sort(function (a, b) {
                                return parseFloat(a) - parseFloat(b);
                            });
                            self.annualReporting(value);
                        } else if (name == "归属单位") {
                            self.manageUnits(value);
                        } else if (name == "管理方式") {
                            self.manageMode(value);
                        } else if (name == "储量类型") {
                            self.storageType(value);
                        } else if (name == "储量类别") {
                            self.storageCategories(value);

                        } else if (name == "储量来源") {
                            self.storageSource(value);
                        } else if (name == "油气藏类型") {
                            self.reservoirType(value);
                        } else if (name == "储层物性") {
                            self.reservoirPhysical(value);
                        } else if (name == "储层岩性") {
                            self.reservoirLithology(value);
                        } else if (name == "岩性细分") {
                            self.subdivisionLithology(value);

                        } else if (name == "储量丰度") {
                            self.reservesAbundance(value);
                        } else if (name == "资源类型") {
                            self.crudeTypes(value);
                        } else if (name == "原油密度") {
                            self.crudeDensity(value);
                        } else if (name == "边底水情况") {
                            self.edgeBottomWater(value);
                        } else if (name == "驱动类型") {
                            self.driveTypes(value);

                        } else if (name == "储集类型") {
                            self.saveType(value);
                        } else if (name == "胶结类型") {
                            self.cementationTypes(value);
                        } else if (name == "埋藏深度") {
                            self.burialDepth(value);
                        } else if (name == "储层非均质程度") {
                            self.heterogeneousDegree(value);
                        } else if (name == "地层压力") {
                            self.formationPressure(value);
                        }
                    }
                }
            }
        });
    };

    //加载成果年份数据
    self.renderYearRange = function () {
        $("#ionrange_1").ionRangeSlider({
            min: minYear,
            max: maxYear,
            from: minYear,
            to: maxYear,
            type: 'double',
            postfix: "年",
            prettify: false,
            maxPostfix: "+",
            onChange: function (data) {
                self.fromYear(data.from);
                self.toYear(data.to);
            }
        });
    };
    //高级搜索选项改变时，清除级联的值
    self.advanceSelectChanged = function (data, event) {
        var target$ = $(event.currentTarget);

        var typeid = target$.attr('typeid');

        if (typeid==enumTargetType.Basin) {
            self.selectedRegion(null);

        } else if (typeid == enumTargetType.Play) {
            self.selectedOilField(null);

        } else if (typeid==enumTargetType.Field) {
            self.selectedOilReservoir(null);

        } else if (typeid==enumGeologySeriesType.Erathem){
            self.selectedSystem(null);

        } else if (typeid==enumGeologySeriesType.System) {
            self.selectedSeries(null);

        } else if (typeid == enumGeologySeriesType.Series) {
            self.selectedFormation(null);

        } else if (typeid == enumGeologySeriesType.Formation) {
            self.selectedMember(null);

        } 
        target$.trigger('chosen:updated');
    };
    //获取用户行为记录
    self.getUserFavorite = function () {        
        $.ajax({
            url: "/UserBehaviorService/GetUserFavorite",
            type: "post",
            async: true,
            data: { ids: ids },
            success: function (data) {
                if (data && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        ko.utils.arrayFirst(self.resultAlbum(), function (item) {
                            if (data[i].IIID == item.iiid) {
                                item.favoriteFlag(1);
                            }
                        });
                    }
                    
                }
            }
        });
    };
    //搜索
    self.searchResult = function (type) {

        var param = self.searchParamObj();
        var paramJson = null;

        var pageIsInit = true;

        if (type === "loadmore") {
            pageIsInit = false;

            scrollOffset = $("#resultContent").scrollTop();
            param.pager.from = self.fromSize();

            controlFilterValue = getFilterType();
            if (controlFilterValue && param.filter["$and"]) {
                var productTypeFilter = ko.utils.arrayFirst(param.filter["$and"], function (item) {
                    return item["ep.producttype"];
                });
                productTypeFilter = productTypeFilter && productTypeFilter["ep.producttype"]["$in"];

                if (productTypeFilter) {
                    var tempType = productTypeFilter.push(controlFilterValue);
                    param.filter["$and"]["ep.producttype"]["$in"] = tempType;
                    
                } else {
                    param.filter["$and"].push({ "ep.producttype": {"$in":[controlFilterValue]}});
                }
            }
            paramJson = JSON.stringify(param);
        } else {
            //普通搜索
            if (type === "simple") {
                var key = self.searchKey();
                if (key && key != "") {
                    var param = {
                        "userid": userid,
                        "smode": 2,
                        "keyword": key
                    }
                    $.ajax({
                        url: "/UserDataAPI/AddSearchHistory",
                        async: true,
                        type: "post",
                        data: JSON.stringify(param),
                        contentType: 'application/json',
                        success: function (result) {
                            
                        }
                    });
                }
            }
            //高级搜索，将普通搜索的值抹掉
            if (type === "advance") {
                self.searchId(null);
                self.searchKey(null);

                $('#advanceSearchDrop').dropdown('toggle');
            }
            //搜索起始页还原
            self.fromSize(0);
            param = self.getSearchParamTemp(type);
            paramJson = JSON.stringify(param);

            var preventSearchParamJson = JSON.stringify(self.searchParamObj());
            //搜索时，搜索条件没有改变不用再次请求
            if (preventSearchParamJson === paramJson) {
                return;
            }
            //更新搜索参数(加载更多时，以之前的搜索参数为准)
            self.searchParamObj(param);
            //还原数据
            productTypeIds = {};
            self.classificationList([]);
            
            ids = [];
        }
        
        self.resultAlbum([]);

        $.ajax({
            url: global_api_url + "/SearchService/Match",
            async: true,
            type: "post",
            contentType: 'application/json',
            data: paramJson,
            success: function (result) {

                //if (!result || result.metadatas == 0) {
                //    return;
                //}
                var count = result.count;

                var data = result.metadatas;

                var dataResults =[];

                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var date = new Date(item.indexeddate).Format("yyyy-MM-dd hh:mm:ss");
                    var temp = {
                        iiid: item.iiid,
                        indexedDate: item.indexeddate,
                        indexedDateShow:date,
                        name: "",
                        title: "",
                        sourceUrl: "",
                        thumb: "",
                        author: "",
                        auditor: "",
                        drawer: "",
                        createdDate: "",
                        productType: "",
                        productTypeId: "*"
                    };

                    if (item.ep && item.ep.producttype) {
                        temp.productType = item.ep.producttype;
                        if (!productTypeIds[temp.productType]) {
                            productTypeIds[temp.productType] = Math.random().toString(36).substr(2);
                            temp.productTypeId = productTypeIds[temp.productType];
                            //更新分类
                            self.classificationList.push(temp);
                        } else {
                            temp.productTypeId = productTypeIds[temp.productType];
                        }

                    }

                    //收藏标记设置为监听
                    temp.favoriteFlag = ko.observable(0);                   

                    if (item.thumbnail) {
                        temp.thumb = item.thumbnail;
                    }
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
                            //绘图人
                            if (contributor.type === "Drawer") {
                                temp.drawer = contributor.name;
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
                    

                    //更新结果
                    dataResults.push(temp);

                    ids.push(item.iiid);
                }
                if (dataResults.length>0) {
                    self.resultAlbum(dataResults);
                }
                
                //恢复之前选中的控件过滤分类
                if (controlFilterValue) {
                    options.defaultFilter = "."+productTypeIds[controlFilterValue];
                }                
                if ($("#gridModeResult_pane").is(':visible')) {
                    self.renderCubePortfolio();
                }
                //加载数据显示和分页控件
                if (pageIsInit) {
                    var pageCount = 1;
                    if (count > 0) {
                        pageCount = Math.ceil(count / self.sizeOfResult());//设置页码值
                    }

                    self.renderPageNav(pageCount);

                }
                self.getUserFavorite();
            },
            error: function (result) {


            }
        });
    };
    self.resetSelect = function () {
        //会触发select的选中事件,联动
        //self.selectedBasin(null);
        //self.selectedErathem(null);

        //self.selectedClassifications([]);

        $(".chosen-select").each(function (e) {
            $(this).val(null);
            $(this).trigger('chosen:updated');
        });

        

        self.fromYear(minYear);
        self.toYear(maxYear);
        var slider = $("#ionrange_1").data("ionRangeSlider");
        slider.reset();
    };
    self.loadMoreResult = function (data, event) {

        var item = $(event.currentTarget);

        event.preventDefault();

        if (item.hasClass('cbp-l-loadMore-stop')) {
            return;
        }

        // set loading status(通过class组合控制是否显示)
        item.addClass('cbp-l-loadMore-loading');

        self.searchResult("loadmore");
    };
    
    //打开
    self.openDetailPage = function (item) {
        //添加浏览记录
        $.ajax({
            url: "/UserBehaviorService/UpdateUserBehavior",
            async: true,
            type: "post",
            data: { updateType:1,lookFlag: 1, lookCount: 1, iiid: item.iiid, metaPT: item.productType, metaTitle: item.title, metaAuthor: item.author, metaSourceUrl: item.sourceUrl, metaCreateDate: item.createdDate, metaIndexDate: item.indexedDate },
            success: function (result) {
                if (result == "success") {
                    
                }
            }

        });
        //打开图件详情页面
        var data = ids.join(",");
        $("#mapId").val(item.iiid);
        $("#mapData").val(data);
        $("#resultForm").submit();
    };
    //收藏
    self.addFavorite = function () {
        var iiid = $("#input_modal").val();
        var item = ko.utils.arrayFirst(self.resultAlbum(), function (data) {
            return data.iiid == iiid;
        });
        //获取当前选中文件夹
        var sel = favCatalogTree.get_selected(true)[0];

        $.ajax({
            url: "/UserBehaviorService/UpdateUserBehavior",
            type: "post",
            async: true,
            data: { updateType:2,favoriteFlag: 1, favCatalogId: sel.id,iiid: item.iiid, metaPT: item.productType, metaTitle: item.title, metaAuthor: item.author, metaSourceUrl: item.sourceUrl, metaCreateDate: item.createdDate, metaIndexDate: item.indexedDate },
            success: function (result) {
                if (result) {
                    item.favoriteFlag(1);
                    $("#favCatalog_modal").modal("hide");
                }
            }
        });
    };
    //取消收藏
    self.cancleFavorite = function (item) {
        $.ajax({
            url: "/UserBehaviorService/UpdateUserBehavior",
            async: true,
            type: "post",
            data: {updateType:2, favoriteFlag: 0, iiid: item.iiid },
            success: function (result) {
                if (result) {
                    item.favoriteFlag(0);
                }
            }
        });
    };
    //下载
    self.downloadMap = function (item) {        
        $.ajax({
            url: global_api_url + "/DataService/Retrieve?url=" + item.sourceUrl,
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
                var format = retrieveData[0].format.toLocaleLowerCase();
                $("#id").val(item.iiid);
                $("#title").val(item.title);
                $("#url").val(item.sourceUrl);
                $("#ticket").val(ticket);
                $("#format").val(format);
                $("#name").val(item.name);

                $("#formDown").submit();               
            }
        });
        //添加下载记录
        $.ajax({
            url: "/UserBehaviorService/UpdateUserBehavior",
            async: true,
            type: "post",
            data: { updateType:3,downloadFlag: 1, downloadCount: 1, iiid: item.iiid, metaPT: item.productType, metaTitle: item.title, metaAuthor: item.author, metaSourceUrl: item.sourceUrl, metaCreateDate: item.createdDate, metaIndexDate: item.indexedDate },
            success: function (result) {
                if (result) {

                }
            }
        });
    };

    //渲染缩略图控件
    self.renderCubePortfolio = function () {
        if ($('#js-grid-juicy-projects').length > 0) {
            var cubeportfolio = $.data($('#js-grid-juicy-projects')[0], 'cubeportfolio');

            if (cubeportfolio) {
                $('#js-grid-juicy-projects').cubeportfolio('destroy');

                $('#js-grid-juicy-projects').cubeportfolio('init', options);

            } else {
                $('#js-grid-juicy-projects').cubeportfolio('init', options);

            }
        }
    };

    //渲染分页组件
    self.renderPageNav = function (totalCount) {
        var options = {
            bootstrapMajorVersion: 3,
            alignment: "center",//居中显示
            numberOfPages: 10,
            currentPage: 1,
            totalPages: totalCount,
            useBootstrapTooltip: true,
            onPageChanged: function (e, oldPage, newPage) {
                self.fromSize((newPage-1) * self.sizeOfResult());
                self.searchResult("loadmore");
            }

        }
        $("#page_nav").bootstrapPaginator(options);
    };
};
//根据BoId查找bo
var getTargetByBoId = function (id) {
    var queryresult = Enumerable.From(global_targets)
            .Where(function (i) { return i.id == id; }).First();
    return queryresult;
};
//根据parentid查找当前级别的所有parentid
/*
*level:跨级级联等级
*result:最后结果
*/
var getTargetIdByParentId = function (parentid,level) {
    var queryresult = Enumerable.From(global_targets)
        .Where(function (i) { return i.parent == parentid; })
        .Select(function (j) { return j.id; }).ToArray();
    

    level--;
    if (level > 0) {
        for (var i = 0; i < queryresult.length; i++) {
            getTargetIdByParentId(queryresult[i], level);
        }
    } else {
        if (queryresult && queryresult.length>0) {
            global_targets_results = global_targets_results.concat(queryresult);
        }        
    }
};

//根据parentids查找bo
var getTargetByParent = function (parentids) {
    var queryresult = Enumerable.From(global_targets)
    .Where(function (i) { return parentids.indexOf(i.parent)>-1; }).ToArray();
    return queryresult;
};
//根据typeid查找bo
var getTargetByTypeId = function (typeid) {
    var queryresult = Enumerable.From(global_targets)
    .Where(function (i) { return i.typeid==typeid; }).ToArray();
    return queryresult;
};

//根据parentids查找层系
var getGeologySeriesByParent = function (parentids) {
    var queryresult = Enumerable.From(global_geologyseries)
    .Where(function (i) { return parentids.indexOf(i.seqpraent)>-1; }).ToArray();
    return queryresult;
};

//根据parentid查找当前级别的所有parentid
/*
*level:跨级级联等级
*/

var getGeologySeriesByParentId = function (parentid, level) {
    var queryresult = Enumerable.From(global_geologyseries)
        .Where(function (i) {
            return i.seqpraent == parentid;
        })
        .Select(function (j) { return j.seqid; }).ToArray();
    
    level--;
    if (level > 0) {
        for (var i = 0; i < queryresult.length; i++) {
            getGeologySeriesByParentId(queryresult[i], level);
        }
    } else {
        if (queryresult && queryresult.length > 0) {
            global_geologyseries_results = global_geologyseries_results.concat(queryresult);
        }       
    }
    
};

//根据seqid查找层系
var getGeologySeriesById = function (id) {
    var queryresult = Enumerable.From(global_geologyseries)
            .Where(function (i) { return i.seqid == id; }).First();
    return queryresult;
};

//根据typeid查找层系
var getGeologySeriesByTypeId = function (typeid) {
    var queryresult = Enumerable.From(global_geologyseries)
    .Where(function (i) { return i.typeid == typeid; }).ToArray();
    return queryresult;
};

//获取cubeportfolio的filter
var getFilterType = function () {
    var str = options.filters + ' .cbp-filter-item-active';
    var filterActive$ = $(str);

    var filterValue = null;

    if (filterActive$) {
        if (filterActive$.data('filter') != "*") {
            filterValue = filterActive$.data('type');
        }
    }
    return filterValue;
};


//更新收藏文件夹
var updateFavoriteFolder = function (id,name,parentId,node) {
    $.ajax({
        url: "/FavoriteCatalogService/UpdateFavoriteFolder",
        async: true,
        type: "post",
        data: { favCatalogId: id, favName: name, parentCatalogId: parentId },
        success: function (nodeId) {
            if (nodeId) {
                favCatalogTree.set_id(node, nodeId);
            }
        }
    });
};


$(document).ready(function() {
    //document.onmousewheel = function() {return false;}//屏蔽鼠标滚轮
    document.onselectstart = function () { return false; }//禁止选取、防止复制 
    document.oncopy = function () { return false; }//禁止复制和剪切
    document.onpaste = function () { return false; }//禁止粘贴

    currentViewModel = new SearchViewModel();
    ko.applyBindings(currentViewModel);
    currentViewModel.initPage();
});

//页面加载完毕后执行
window.onload = function(){
    

}