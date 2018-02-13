
var $parent;
var labCurTargetName = $("#labCurTargetName");

var targetTree = $( "#targetTree" );
var catalogTree = $( "#catalogTree" );
var global_cur_target;
var global_cur_catalog;

// 正文高度
var fix_height = function() {
    var heightWithoutNavbar = $("body").height() - 40;
    //$("#joGIS1").css("height", heightWithoutNavbar);
    $("#table_list").css("height", heightWithoutNavbar);
}

var getCurTarget = function (jsonTragets, targetId) {
    //筛选
    var queryresult = Enumerable.From(jsonTragets)
        //.Where(function (i) { console.log(i.parent); return i.parent==parentid; });
        .Where("x=>x.id=='"+targetId+"'").ToArray();
    return queryresult[0];
}

var createTargetTree = function (jsonTragets) {
    //console.log(targetTree);
    targetTree.jstree({
        'core': {
            expand_selected_onload : false,
            multiple : false,
            animation : true,//动画
            data: jsonTragets
        },
        'plugins': ["dnd", "state", "types" ],
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
        }
    });

    //绑定事件
    targetTree.on('select_node.jstree', function (e, data) {
        var objId = data.node.id;
        //console.log(objId);
        global_cur_target = getCurTarget(jsonTragets, objId);
        // loadResultList();
        
        labCurTargetName.html( "当前正在查阅" + global_cur_target.text + "的相关成果" );

        //联动知识树
		loadTargetKl(jsonKLCatalog, global_cur_target);
    });
}

var createCatalogTree = function (data) {
	//console.log(catalogTree);
	catalogTree.jstree({
        'core': {
        	expand_selected_onload : false,
        	multiple : false,
			animation : true,//动画
            data: data
        },
        'plugins': ["dnd", "state", "types" ],
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
        }
    });

    // //绑定事件
	// catalogTree.on('select_node.jstree', function (e, data) {
	// 	// var catalogId = data.node.id;
	// 	// //console.log(targetId);
	// 	// global_cur_catalog  = getCurTarget(dataCatalogKnowledge, catalogId);
	// 	// //console.log(global_cur_catalog);

	// 	// loadResultList();
	// });
}


var loadTargetKl = function (jsonKnowledges, target) {
    //组合最终知识树数据
    var jsonCurTragKls = Enumerable.From(jsonKnowledges)
        .Where("x=>x.targtypeid=='"+target.typeid+"'")
        .GroupBy("$.topicid", null,
                    function (key, g) {
                        return {
                            id: key,
                            text: g.source[0].topictitle,
                            parent: g.source[0].parent, 
                            state: { opened: true },
                            topicid: key,
                            topictitle: g.source[0].topictitle,
                            count: g.source.length
                        }
            })
        .ToArray();

    //console.log(jsonCurTragKls);
	catalogTree.jstree(true).settings.core.data = jsonCurTragKls;
	//刷新数据
	catalogTree.jstree(true).refresh();

    //查询对应成果图件

}



var loadDocument = function() {
    createTargetTree(jsonTragets);
    createCatalogTree([]);

    
}

var ExploreViewModel = function () {
    var self = this;

    //结果分类
    self.classificationList = ko.observableArray();
        //成果图册
    self.resultAlbum = ko.observableArray();
    //成图图册分页页数
    self.numberOfPage = ko.observable(0);
        //成果列表
    self.resultList = ko.observableArray();
    //初始化model
    self.initPage = function () {
        self.loadClassification();
        self.loadResultAlbum();
        // init cubeportfolio
        $('#js-grid-juicy-projects').cubeportfolio({
            filters: '#js-filters-juicy-projects',
            loadMore: '#js-loadMore-juicy-projects',
            loadMoreAction: 'click',
            layoutMode: 'grid',
            defaultFilter: '*',
            animationType: 'quicksand',
            gapHorizontal: 35,
            gapVertical: 30,
            gridAdjustment: 'responsive',
            mediaQueries: [{
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
            }],
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
            singlePageCallback: function (url, element) {//点击浏览下一页
                // to update singlePage content use the following method: this.updateSinglePage(yourContent)
                var t = this;

                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'html',
                    timeout: 10000
                })
                    .done(function (result) {
                        t.updateSinglePage(result);
                    })
                    .fail(function () {
                        t.updateSinglePage('AJAX Error! Please refresh the page!');
                    });
            }
        });

        self.loadResultList();
    };
    //加载成果分类
    self.loadClassification = function() {
        var data = Enumerable.From(dataGdbThumbs)
            .Where(function(i) { return i.no >= 50 && i.typeid != 'zhzzt'; })
            .GroupBy("$.typename",
                null,
                function(key, g) {
                    return {
                        typeid: g.source[0].typeid,
                        typename: key
                    }
                }).ToArray();
        self.classificationList(data);
    };
    //加载成果图册
    self.loadResultAlbum = function() {
        var data = Enumerable.From(dataGdbThumbs)
        .Where(function (i) { return i.no >= 50 && i.typeid != 'zhzzt'; });

        data.ForEach(function (item) {
            item["previewtitle"] =item.name + "<br>制图人：" + item.author;
            item["titledesc"] = "制图人：" + item.author + " / 入库日期：" + item.createdate;
            item["src"] = "/DemoData/thumb/" + item.typename + "/" + item.src;
            item["thumbSrc"] = "/DemoData/thumb-sm/" + item.typename + "/" + item.thumb;
        });
        self.resultAlbum(data.ToArray());

    };
    //加载成果列表
    self.loadResultList = function() {
        self.resultList(dataGdbThumbs);
        $("#table_list").footable();
    };
    //打开
    self.openDetailPage = function() {

    };
    //收藏
    self.collectFavoriteList = function() {

    };
    //下载
    self.downloadAchieve = function() {

    };
    //成果图册加载更多
    self.albumLoadMore = function (data,event) {
        //页数+1
        var previousCount = self.numberOfPage();
        self.numberOfPage(previousCount + 1);

        var item = $(event.target);
        var parent = $(item.parent);

        event.preventDefault();

        if (parent.isAnimating || item.hasClass('cbp-l-loadMore-stop')) {
            return;
        }

        // set loading status
        item.addClass('cbp-l-loadMore-loading');
        //todo 加载数据
        var addClassificationList = [];
        var addResultAlbum = [];

        // put the original message back
        item.removeClass('cbp-l-loadMore-loading');
        //TODO stop怎么办？
        //if (itemsNext.length === 0) {
        //    item.addClass('cbp-l-loadMore-stop');
        //}
    };

}

//文档加载
$(document).ready(function () {
	$parent = $(window.parent.document);
	
	//document.onmousewheel = function() {return false;}//屏蔽鼠标滚轮
	document.onselectstart = function() {return false;}//禁止选取、防止复制 
	document.oncopy = function() {return false;}//禁止复制和剪切
	document.onpaste = function() {return false;}//禁止粘贴 

    $.jgrid.defaults.styleUI = 'Bootstrap';

    //初始化目标树
    loadDocument();
    //初始化成果展示
    var currentViewModel = new ExploreViewModel();
    ko.applyBindings(currentViewModel);
    currentViewModel.initPage();

    //修复菜单被Ocx遮挡
    fixOcxMask($("#layui-layer1"));

    //修复JoGis展示区
    $(window).bind("load resize click scroll", function () {
        if (!$("body").hasClass('body-small')) {
            fix_height();
        }
    });

    targetTree.slimScroll({
        height: '100%',
        railOpacity: 0.9//,
        //alwaysVisible: true
    });
    catalogTree.slimScroll({
        height: '100%',
        railOpacity: 0.9//,
        //alwaysVisible: true
    });
});

//页面加载完毕后执行
window.onload = function(){

    resizeWindow();
}