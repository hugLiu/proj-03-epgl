
var $parent;
var base_dir = "FlexDraw/";
var gdb_url;
var jogis4_options = {
	Style: { border: "solid 1px #666", width:"100%" },
	ShowEagleEye : true
};
var JoGis4;

var txtGdbTitle = $( "#txtGdbTitle" );
var txtGdbType = $( "#txtGdbType" );
var gridNewLayers = $('#table_new_layers');

var global_cur_target;
var global_cur_gdbtype;
var global_cur_gdb;
var global_cur_lay;
var global_cur_lay_list_rowid = null;

// 正文高度
var fix_height = function() {
    var heightWithoutNavbar = $("body").height();
    $("#joGIS1").css("height", heightWithoutNavbar - 80);
    $("#panelBtns").css("height", $("#panelWork").height() + 13);
}

var getCurTarget = function (data, targetId) {
    //筛选
    var queryresult = Enumerable.From(data)
        //.Where(function (i) { console.log(i.parent); return i.parent==parentid; });
        .Where("x=>x.id=='"+targetId+"'").ToArray();
    return queryresult[0];
}

var getCurLayer = function (data, layId) {
	//筛选
    var queryresult = Enumerable.From(data)
        //.Where(function (i) { console.log(i.parent); return i.parent==parentid; });
        .Where("x=>x.id=='"+layId+"'").ToArray();
    return queryresult[0];
}

var clickShowLayer = function(clickobj, layId) {
	//console.log(layId);
	var entity = getCurLayer(jsonTargLayerTypes, layId);
	console.log(entity);
    var visable = joGIS1.IsShow(entity.layer);
	console.log(visable);
	joGIS1.ShowLayer( entity.layer, !visable );

	//console.log(visable);
	if (!visable)
		$(clickobj).html('<i class="fa fa-eye"></i>');
	else
		$(clickobj).html('<i class="fa fa-eye-slash"></i>');
}

var clickCascadeWin = function(clickobj, layId) {
    if (global_cur_target == null) return;
	global_cur_lay = getCurLayer(jsonTargLayerTypes, layId);
    if (global_cur_lay == null) return;

    var panellayer;
    panellayer = layer.open({
        type: 2,
        //skin: 'layui-layer-lan',
        title: "自由成图 - 当前工区："+global_cur_target.text+"，编辑中的图层：" + global_cur_lay.layer,
        fix: true,
        shadeClose: true,
        //maxmin: true,
        area: ['1000px', '620px'],
        //content: 'laySelector.html?targetid='+global_cur_target.id+"&targetname="+global_cur_target.text+"&typeid="+global_cur_target.typeid+"&layerid="+global_cur_lay.id+"&layername="+global_cur_lay.layer,
        content: '/FlexDraw/laySelector?targetid='+global_cur_target.id+"&targetname="+global_cur_target.text+"&typeid="+global_cur_target.typeid+"&layerid="+global_cur_lay.id+"&layername="+global_cur_lay.layer,
        btn: ['确定叠加', '重置条件', '关闭窗口'],
        btnAlign: 'c',
        success: function(layero, index){
            //joGIS1.style.display = "none";
        },
        end: function(){
            //joGIS1.style.display = "";
        },
        yes: function(index, layero){
            //layer.iframeSrc(index, 'http://sentsin.com');
            layer.closeAll();
        },//按钮1和按钮2的回调分别是yes和cancel
        cancel: function(){
            //layer.iframeSrc(index, 'http://baidu.com');
            layer.closeAll();
        },//而从按钮3开始，则回调为btn3: function(){}，以此类推。
        btn3: function(index, layero){
            layer.closeAll();
        }
    });

    //修复菜单被Ocx遮挡
    var menuitem = $(".layui-layer");
    //alert(menuitem);
    fixOcxMask(menuitem);

    //layer.full(panellayer);
}


function visableFmatter(cellvalue, options, rowObject){
    var ele = '<a href="javascript:void(0);" onclick="clickShowLayer(this, ';
    ele += "'"+ rowObject.id +"'";
    ele += ')" title="显示/隐藏"><i class="fa fa-eye"></i></a>';
    return ele;
}
function cascadeFmatter(cellvalue, options, rowObject){
    global_cur_lay = rowObject;
    if (!rowObject.allowOverlay) return '';
    
    var ele = '<a href="javascript:void(0);" onclick="clickCascadeWin(this, ';
    ele += "'"+ rowObject.id +"'";
    ele += ')" title="自由叠加"><i class="fa fa-clone"></i></a>';
    return ele;
}
var colModel = [
    {
        name: "id",
        hidden: true
    },
    {
        name: 'layer',
        index: "layer",
        sorttype: "string",
        label: "图层",
        width: 50,
        sortable: false
    },
    {
        name:'id',
        //index:'id',
        label: "显",
        width:10,
        align:"center",
        formatter:visableFmatter,
        sortable: false
    },
    {
        name:'id',
        //index:'cascade',
        label: "叠",
        width:10,
        align:"center",
        formatter:cascadeFmatter,
        sortable: false
    },
    {
        name: "parent",
        hidden: true
    }
]
;
//新图的图层
var reloadDataGirdByNewLayers = function (jsondata) {
    gridNewLayers.jqGrid("clearGridData");
    gridNewLayers.jqGrid("setGridParam", { data: jsondata }).trigger("reloadGrid");
}

var loadGdbFile = function(url) {
	url = canonical_uri(url).replace(base_dir, "").replace("file:///", "");
	//url = url.replaceAll("/", "\\\\");
	//console.log(url);
	jogis4_options.GDBPath = url;

	JoGis4 = new JoGis(joGIS1, jogis4_options);
	var reslut = JoGis4.loadGeoMapFile(jogis4_options.GDBPath);
/*
	var param = {nDatus:28, a:0, b:0};//28 WGS 84
	var b = JoGis4.SetDatum(param);
	console.log(b);
	param = {nType:5, lon0:0, lat0:0, lon1:0, lat1:0, lon2:0, lat2:0, azimuth:0, k0:0, x0:0, y0:0, Zab:0};
	b = JoGis4.SetProjection(param);
	console.log(b);
*/
	return reslut;
}

var loadBaseGdbFile = function (target, gdbtype) {
    //console.log(gdbtype);
    var gdbname = target.text + gdbtype.typename;
    gdb_url = "DemoData/gdb/basemap/";
	gdb_url += gdbname + '.GDB';
    gdb_url = encodeURI( gdb_url );//中文字符处理
    //console.log(gdb_url);
	var result = loadGdbFile(gdb_url);
	if (result != 'jogis001') return;
	//console.log(gdb_url);
    
	//var xml = joGIS1.GetMapInformationEx(2);
	//console.log(xml);
}

var loadDataGirdByNewLayers = function (jsondata) {
    // Configuration for jqGrid
    gridNewLayers.jqGrid({
        //data: jsondata,
        datatype: "local",
        height: $("#joGIS1").height() - 80,
        autowidth: true,
        shrinkToFit: true,
        rowNum: 1000,
        //rowList: [10, 20, 30],
        rownumbers: true,
        rownumWidth: 35, // the width of the row numbers columns
        colModel: colModel,
        viewrecords: false,
        gridview: true,
        hidegrid: false,
        scrollrows: true,
        pager: "#pager_new_layers",
        pgbuttons: false,
        pginput: false,
        onSelectRow: function(rowid){
            global_cur_lay_list_rowid = rowid;
            var entity = $(this).getLocalRow(rowid);//获取行数据（原始数据）
            //console.log(entity);
            
            global_cur_lay = entity;
        }
    });
    // We need to have a navigation bar in order to add custom buttons to it
    gridNewLayers.navGrid('#pager_new_layers', {
        edit: false, add: false, del: false, search: false, refresh: false, view: false, position: "left", cloneToTop: false,
    });

    var separator_parameters = {sepclass : "ui-separator", sepcontent: ''};

    // add first custom button
    gridNewLayers.navButtonAdd('#pager_new_layers', {
        buttonicon: "fa fa-plus-circle",
        title: "增加图层",
        caption: "增加",
        position: "last",
        onClickButton: function(event){
        }
    }).navSeparatorAdd("#pager", separator_parameters);

    // add first custom button
    gridNewLayers.navButtonAdd('#pager_new_layers', {
        buttonicon: "fa fa-minus-circle",
        title: "删除图层",
        caption: "删除",
        position: "last",
        onClickButton: function(event){
            if (global_cur_lay_list_rowid == null) return;
            var entity = $(this).getLocalRow(global_cur_lay_list_rowid);//获取行数据（原始数据）
            if (!entity.allowDelete) {
                toastr.options = {
                    "closeButton": true,
                    "debug": false,
                    "progressBar": true,
                    "positionClass": "toast-bottom-right",
                    "onclick": null,
                    "showDuration": "400",
                    "hideDuration": "1000",
                    "timeOut": "7000",
                    "extendedTimeOut": "400",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                }
                toastr.error('当前图层不可删除！', '系统提示');
                
                //修复菜单被Ocx遮挡
                fixOcxMask($(".toast"));
                return;
            }

            global_cur_lay = null;
            $('#table_new_layers').delRowData(global_cur_lay_list_rowid);
        }
    }).navSeparatorAdd("#pager", separator_parameters);

    // Add responsive to jqGrid
    $(window).bind('resize', function () {
        var width = $('.jqGrid_wrapper').width();
        gridNewLayers.setGridWidth(width);
    });

}

//新图的图元
var loadDataGirdByNewItems = function (jsondata) {
    // Configuration for jqGrid
    $("#table_new_items").jqGrid({
        data: jsondata,
        datatype: "local",
        height: 150,
        autowidth: true,
        shrinkToFit: true,
        rowNum: 1000,
        //rowList: [10, 20, 30],
        colNames: ["#", '图元'],
        colModel: [
            {
                name: 'layId',
                index: "layId",
                width: 10,
                sortable: true
            },
            {
                name: 'layName',
                index: "layName",
                width: 30,
                sortable: true
            }
        ],
        //pager: "#pager_new_items",
        viewrecords: true,
        add: false,
        edit: false,
        hidegrid: false,
        onSelectRow: function(rowid){
            // var entity = $("#table_new_items").getLocalRow(rowid);//获取行数据（原始数据）
            // console.log(entity);
            
            // global_cur_lay = entity;
        }
    });

    // Add responsive to jqGrid
    $(window).bind('resize', function () {
        var width = $('.jqGrid_wrapper').width();
        $('#table_new_items').setGridWidth(width);
    });

}

var loadDocument = function() {
    loadDataGirdByNewLayers([]);//加载空数据
    loadDataGirdByNewItems([]);//加载空数据

    $("#btnSelTraget").on("click", function(){
        var panellayer;
        panellayer = layer.open({
            type: 2,
            //skin: 'layui-layer-lan',
            title: "自由成图 - 选择工区、图件分类",
            fix: true,
            shadeClose: true,
            //maxmin: true,
            area: ['360px', '560px'],
            content: '/FlexDraw/laySelTarget',
            btn: ['确定', '取消'],
            btnAlign: 'c',
            success: function(layero, index){
                //joGIS1.style.display = "none";
            },
            end: function(){
                //joGIS1.style.display = "";
            },
            yes: function(index, layero){
                //layer.iframeSrc(index, 'http://sentsin.com');
                loadBaseGdbFile(global_cur_target, global_cur_gdbtype);
                layer.closeAll();
            },//按钮1和按钮2的回调分别是yes和cancel
            cancel: function(){
                //layer.iframeSrc(index, 'http://baidu.com');
                layer.closeAll();
            }//而从按钮3开始，则回调为btn3: function(){}，以此类推。
        });

        //修复菜单被Ocx遮挡
        fixOcxMask($(".layui-layer"));
    });
}

var flexDrawViewModel = {
    
};

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
    
    //修复JoGis展示区
    $(window).bind("load resize click scroll", function () {
        if (!$("body").hasClass('body-small')) {
            fix_height();
        }
    });
});

//页面加载完毕后执行
window.onload = function () {
    ko.applyBindings(document.body,flexdrawViewModel);
}