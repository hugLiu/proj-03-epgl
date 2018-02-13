var currentModel = null;
var $parent;
var $figure = $("#file-input");


//选择收藏文件夹树
var favCatSelectTree = null;
var fileId = null; //提交图件ID
var filePath = null; //提交图件路径
var gMapType = ""; //图件类型字符串

//默认开发曲线颜色设置
var curveDefaultColors = null;
//开发曲线模板编号
var num = 0;

var UserBehaviorModel = function (data) {
    var self = this;
    if (!data) {
        data = {};
    }
    self.IIID = data.IIID;
    self.USERID = data.USERID;
    self.METAPT = data.METAPT;
    self.METATITLE = data.METATITLE;
    self.METAAUTHOR = data.METAAUTHOR;
    self.METASOURCEURL = data.METASOURCEURL;
    self.METADESC = data.METADESC;
    self.METACREATEDATE = data.METACREATEDATE;
    self.METAINDEXDATE = data.METAINDEXDATE;
    self.FAVCATALOGID = data.FAVCATALOGID;
    self.FAVORITEFLAG = ko.observable(data.FAVORITEFLAG);
    self.FAVORITEDATE = ko.observable(data.FAVORITEDATE);
    self.LOOKFLAG = data.LOOKFLAG;
    self.LOOKCOUNT = ko.observable(data.LOOKCOUNT);
    self.LOOKDATE = ko.observable(data.LOOKDATE);
    self.DOWNLOADFLAG = data.DOWNLOADFLAG;
    self.DOWNLOADCOUNT = ko.observable(data.DOWNLOADCOUNT);
    self.DOWNLOADDATE = ko.observable(data.DOWNLOADDATE);
    self.STATE = data.STATE;
};

var MySpaceViewModel = function () {
    var self = this;

    //最近浏览
    self.myLookList = ko.observableArray();
    //我的收藏文件夹
    self.favoriteFolders = ko.observableArray();
    //我的收藏
    self.myFavoriteList = ko.observableArray();
    //我的下载
    self.myDownloadList = ko.observableArray();
    //我的提交
    self.mySubmitList = ko.observableArray();
    //我的自定义图件
    self.myCustomList = ko.observableArray();
    //样式配置模型
    self.projectMode = ko.observableArray();
    //开发曲线模板
    self.curveTemplate = ko.observableArray();
    self.curveMode = ko.observableArray();

    //图数联动
    self.dataLink = ko.observableArray();
    //钻井基础
    self.drillingBase = ko.observableArray();


    //元数据定义模型
    self.metadataDefintionList = ko.observableArray();
    //审核
    self.myUnauthenticList = ko.observableArray();
    //转换json串中的datetime格式
    self.dateFormat = function (value) {
        if (value) {
            var date = new Date(parseInt(value.substr(6)));
            return date.Format("yyyy-MM-dd");
        }
        return "";
    };
    //加载我的最近浏览
    self.loadLookList = function () {
        $.ajax({
            url: "/UserBehaviorService/GetLookList",
            type: "post",
            async: true,
            success: function (result) {
                if (result) {
                    var data = ko.utils.arrayMap(result, function (item) {
                        return new UserBehaviorModel(item);
                    });
                    self.myLookList(data);
                    $("#table_list1").footable();
                }
            }
        });

    };
    //加载我的下载
    self.loadDownloadList = function () {
        $.ajax({
            url: "/UserBehaviorService/GetDownloadList",
            type: "post",
            async: true,
            success: function (result) {
                if (result) {
                    var data = ko.utils.arrayMap(result, function (item) {
                        return new UserBehaviorModel(item);
                    });
                    self.myDownloadList(data);
                    $("#table_list3").footable();
                }
            }
        });
    };
    //加载用户投影样式配置数据
    self.loadTargStyleUConfByUser = function () {
        $.ajax({
            url: "/UserDataAPI/GetTargStyleUConfByUser",
            type: "get",
            cache: false,
            success: function (result) {
                if (result) {
                    self.projectMode(result);
                    $("#tb4 .colorpicker-component").colorpicker({ format: "rgb" });
                }
            }
        });
    };
    //加载开发曲线模板
    self.loadCurveTemplate = function () {
        var url = "/UserDataAPI/GetAppDProfileUserTemplate?" + Math.round(Math.random() * 10000);
        $.ajax({
            url: url,
            async: true,
            type: "get",
            success: function (result) {

                console.log(result)

                if (result && result.length > 0) {

                    self.curveTemplate(result);

                    $("#tb5 .list-group .changeName").each(function (i, v) {
                        if ($(v).data("isdefault") == 1) {
                            $(v).click();
                        }
                    });
                }

            }
        });
    };

    //加载开发曲线模型数据
    self.loadCurveMode = function () {
        self.curveMode([]);
        $.ajax({
            url: "/Viewer/GetMiningChartModel",
            async: true,
            type: "post",
            success: function (result) {
                curveDefaultColors = result;
                self.curveMode(result);
                $("#tb5 .colorpicker-component").colorpicker({ format: "hex" });
            }
        });
    };


    //加载图数联动

    self.loadDataLinkage = function () {
        $.ajax({
            url: "/MySpace/GetDataColumns",
            async: true,
            type: "post",
            success: function (result) {
                if (result) {

                    self.dataLink(result);
                }
            }
        });
    };


    //加载我的提交
    self.loadSubmitList = function () {
        $.ajax({
            url: "/FigureService/GetSubmissionInfo",
            type: "post",
            success: function (obj) {
                loding("tb7", false);
                self.mySubmitList(obj);
                $("#table_list7").footable();               
            }
        });
    };
    //加载元数据
    self.loadMetadataDefintion = function () {
        $.ajax({
            url: "/FigureService/GetMetadataDefintion",
            type: "get",
            success: function (result) {
                if (result) {
                    result = eval('(' + result + ')');
                    self.metadataDefintionList(result);

                    $("#submit_add_modal .date").datetimepicker({
                        startView: 2,
                        minView: 2,
                        viewSelect: 2,
                        language: "zh-CN",
                        format: "yyyy-mm-dd",
                        autoclose: true,
                        pickerPosition: "bottom-left"
                    });
                    $("#submit_edit_modal .date").datetimepicker({
                        startView: 2,
                        minView: 2,
                        viewSelect: 2,
                        language: "zh-CN",
                        format: "yyyy-mm-dd",
                        autoclose: true,
                        pickerPosition: "bottom-left"
                    });
                }
            },
            error: function (e) {
                console.log(e);
            }
        });
    };
    //加载所有未审核的记录
    self.loadUnauthenticList = function () {
        $.ajax({
            url: "/FigureService/GetUnauthenticList",
            type: "post",
            success: function (obj) {
                loding("tb8", false);
                self.myUnauthenticList(obj);
                $("#table_list8").footable();
            }
        });
    };

    //打开浏览图件
    self.openDetailPage = function (data, event, tabindex) {
        //添加浏览记录
        $.ajax({
            url: "/UserBehaviorService/UpdateUserBehavior",
            async: true,
            type: "post",
            data: {
                updateType: 1, iiid: data.IIID, lookFlag: 1, lookCount: 1
            },
            success: function (result) {
                if (result) {
                    data.LOOKCOUNT(result.LOOKCOUNT);
                }
            }
        });

        //打开图件详情页面
        var dataList = null;
        switch (tabindex) {
            case 1:
                dataList = self.myLookList();
                break;
            case 2:
                dataList = self.myFavoriteList();
                break;
            case 3:
                dataList = self.myDownloadList();
                break;
            default:
                break;

        }
        var idsStr = ko.utils.arrayMap(dataList, function (item) {
            return item.IIID;
        });
        idsStr = idsStr.join(",");
        $("#mapId").val(data.IIID);
        $("#mapData").val(idsStr);
        $("#resultForm").submit();
    };
    //添加收藏
    self.addFavorite = function () {
        var iiid = $("#input_iiid").val();
        var tabindex = $("#input_tabIndex").val();

        //获取当前选中文件夹
        var treeInstance = $("#favCatalogSelect_jsTree").jstree(true);
        var sel = treeInstance.get_selected(true)[0];

        var results = null;

        if (tabindex == 1) {
            results = self.myLookList();

        } else if (tabindex == 2) {
            results = self.myFavoriteList();
            //在收藏列表页面，只可能是移动
            if (self.myFavoriteList()[0].FAVCATALOGID == sel.id) {
                return;
            }

        } else if (tabindex == 3) {
            results = self.myDownloadList();
        }

        var item = ko.utils.arrayFirst(results, function (data) {
            return data.IIID == iiid;
        });
        if (item) {

            $.ajax({
                url: "/UserBehaviorService/UpdateUserBehavior",
                type: "post",
                async: true,
                data: {
                    updateType: 2, iiid: item.IIID, favoriteFlag: 1, favCatalogId: sel.id
                },
                success: function (result) {
                    if (result) {
                        item.FAVORITEFLAG(result.FAVORITEFLAG);

                        $("#favCatalog_modal").modal("hide");
                        //刷新收藏文件夹树（不是选择树）
                        loadFavoriteFolder();

                    }
                }
            });
        }


    };
    //取消收藏
    self.cancleFavorite = function (item) {

        $.ajax({
            url: "/UserBehaviorService/UpdateUserBehavior",
            async: true,
            type: "post",
            data: {
                updateType: 2, favoriteFlag: 0, iiid: item.IIID
            },
            success: function (result) {
                if (result) {
                    self.myFavoriteList.remove(function (data) {
                        return data.IIID == item.IIID
                    });
                    item.FAVORITEFLAG(0);
                }
            }
        });
    };
    //下载
    self.downloadFile = function (item) {

        //添加下载记录
        $.ajax({
            url: "/UserBehaviorService/UpdateUserBehavior",
            async: true,
            type: "post",
            data: {
                updateType: 3, iiid: item.IIID, downloadFlag: 1, downloadCount: 1
            },
            success: function (result) {
                if (result) {
                    item.DOWNLOADDATE(result.DOWNLOADDATE);
                    item.DOWNLOADCOUNT(result.DOWNLOADCOUNT);
                }
            }
        });

        //下载图件
        $.ajax({
            url: global_api_url + "/DataService/Retrieve?url=" + item.METASOURCEURL,
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
                var name = item.METATITLE ? item.METATITLE.split(".")[0] : ""
                $("#id").val(item.IIID);
                $("#title").val(item.METATITLE);
                $("#url").val(item.METASOURCEURL);
                $("#ticket").val(ticket);
                $("#format").val(format);
                $("#name").val(name);

                $("#formDown").submit();
            }
        });
    };
    //新提交图件
    self.figureSubmitForAdd = function () {
        if (!fileId) {
            toastr["error"]("请上传GDBX图件!", "错误");
            return;
        }
        var obj = {
        };
        var $dom = $("#submit_add_modal").find("input");
        var flag = true, figureName = "";
        $dom.each(function () {
            var name = $(this).data("name");
            var value = $(this).val().trim();
            if (value) {
                obj[name] = value;
                flag = false;
                if (name == "FormalTitle") {
                    figureName = value;
                }
            }
        });
        if (!figureName) {
            toastr["error"]("请填写图件的名称!", "错误");
            return;
        }
        if (flag) {
            toastr["error"]("请填写图件的属性值!", "错误");
            return;
        }
        $("#submit_add_modal").modal('hide');
        var json = JSON.stringify(obj);
        loding("tb7");
        $.ajax({
            url: "/FigureService/BatchOne",
            type: "post",
            data: {
                metadata: json, fileId: fileId, filePath: filePath
            },
            success: function (result) {
                if (result == "success") {
                    toastr["success"]("提交成功!", "成功");
                    //关闭模态框
                } else {
                    toastr["error"]("提交失败!", "失败");
                }
                self.mySubmitList([]);
                self.loadSubmitList();
            }
        });
    };
    //图件元数据编辑
    self.figureSubmitForUpdate = function () {
        var iiid = $("#submit_edit_modal #metaIIId").val();
        var $dom = $("#submit_edit_modal .form-inline").find("input");
        var obj = {}, flag = true;
        $dom.each(function () {
            var name = $(this).data("name");
            var value = $(this).val().trim();
            if (value) {
                obj[name] = value;
                flag = false;
            }
        });
        if (flag) {
            toastr["error"]("请填写图件的属性值!", "错误");
            return;
        }
        $("#submit_edit_modal").modal('hide');
        var json = JSON.stringify(obj);
        loding("tb7");
        $.ajax({
            url: "/FigureService/ReplaceOne",
            type: "post",
            data: {
                iiid: iiid, metadata: json
            },
            success: function (result) {
                toastr["success"]("编辑成功!", "成功");
                self.mySubmitList([]);
                self.loadSubmitList();
            }
        });
    };
    //图件元数据删除
    self.deleteOne = function ($parent) {
        if (confirm("确定要删除此图件吗？")) {
            var iiid = $parent && $parent.KMD && $parent.KMD.IIId ? $parent.KMD.IIId : "";
            loding("tb7");
            if (iiid) {
                $.ajax({
                    url: "/FigureService/DeteleOne",
                    type: "post",
                    data: {
                        iiid: iiid
                    },
                    success: function (result) {
                        toastr["success"]("删除成功!", "成功");
                        self.mySubmitList([]);
                        self.loadSubmitList();
                    }
                });
            }
        }
    };
    //图件审核
    self.authenticOne = function ($parent) {
        var iiid = $parent && $parent.KMD && $parent.KMD.IIId ? $parent.KMD.IIId : "";
        loding("tb8");
        if (iiid) {
            $.ajax({
                url: "/FigureService/AuthenticOne",
                type: "post",
                data: { natureKey: iiid },
                success: function (result) {
                    toastr["success"]("审核成功!", "成功");
                    self.myUnauthenticList([]);
                    self.loadUnauthenticList();
                }
            });
        }
    };
};
var eventBind = function () {

    //页面上每一个折叠打开时，先关闭其他折叠
    $("#wrapper .collapse").on("show.bs.collapse", function (e) {
        $("#wrapper .collapse").collapse("hide");
    });
    //我的收藏展开加载收藏文件夹树
    $("#collapseFavTree").on("shown.bs.collapse", function (e) {
        switchtab(2);
    });

    $("#submit_edit_modal").on("shown.bs.modal", function (e) { 
        var iiid = $(e.relatedTarget).data('iiid');
        if (iiid) {
            var file = ko.utils.arrayFirst(currentModel.mySubmitList(), function (item) {
                return item.KMD.IIId == iiid;
            });
            if (file) {
                var modal = $(this);
                modal.find('#metaIIId').val(iiid);
                modal.find('.form-inline input').each(function () {

                    var keys = $(this).data('key').replace('@.','').split('.');

                    var value = file.KMD;

                    var keyItem = null;
                    var start = null;

                    var typeKey = null;
                    var typeValue = null;

                    var flag = false;
                    
                    for (var i = 0; i < keys.length; i++) {
                        if (value) {
                            keyItem = keys[i].toLowerCase();
                            start = keyItem.indexOf('[');
                            
                            if (start > -1) {
                                flag = false;
                                for (var objkey in value) {
                                    if (objkey.toLowerCase() == keyItem.slice(0, start)) {
                                        flag = true;
                                        value = value[objkey];
                                        break;
                                    }
                                }
                                if (!flag) {
                                    value = null;
                                }
                               
                                if (value) {
                                    typeKey = keyItem.slice(keyItem.indexOf('(') + 1, keyItem.indexOf('==')).toLowerCase();
                                    typeValue = keyItem.slice(keyItem.indexOf('\'') + 1, keyItem.lastIndexOf('\'')).toLowerCase();

                                    flag = false;
                                    for (var j = 0; j < value.length; j++) {
                                        for (var objkey in value[j]) {
                                            if (objkey.toLowerCase() == typeKey) {
                                                if (value[j][objkey].toLowerCase() == typeValue) {
                                                    flag = true;
                                                    value = value[j];
                                                    break;
                                                }                                               
                                            }
                                        }                                        
                                    }
                                    if (!flag) {
                                        value = null;
                                    }
                                }

                            } else {
                                flag = false;
                                for (var objkey in value) {
                                    if (objkey.toLowerCase() == keyItem) {
                                        flag = true;
                                        value = value[objkey];
                                        break;
                                    }
                                }
                                if (!flag) {
                                    value = null;
                                }
                            }
                        } else {
                            value = null;
                        }


                    }
                    if (value) {
                        if (value.indexOf("Date") > -1) {
                            value = currentModel.dateFormat(value);
                        }                        
                    }
                    $(this).val(value);
                });
            }

        }
        var selTarget = $("#submit_edit_modal #producttypes_edit select");
        if (selTarget) {
            selTarget.append(gMapType);

            var producttype = $("#submit_edit_modal #myProductType_edit").val();

            if (producttype && producttype!="") {
                selTarget.val(producttype);
            }
        } else {
            $("#submit_edit_modal #producttypes_edit").append(gMapType);
        }
        
    });

    $("#submit_add_modal").on("shown.bs.modal", function (e) {
        $(this).find(".form-inline input").val(null);
        $figure.fileinput('clear');

        var selTarget=$("#submit_add_modal #producttypes_add select");
        if (selTarget) {
            selTarget.append(gMapType);
        } else {
            $("#submit_add_modal #producttypes_add").append(gMapType);
        }
    });

    $(document).on('change', 'datalist select', function () {
        var listAttribute = $(this).parent().attr('id');
        $("input[list='" + listAttribute + "']").val($(this).val());
    });

    $("#favCatalog_add_sibling").click(function () {
        addFavCatNodeSibling($("#favCatalog_jsTree").jstree(true));

    });

    $("#favCatalog_add_child").click(function () {
        addFavCatNodeChild($("#favCatalog_jsTree").jstree(true));

    });

    $("#favCatalog_rename").click(function () {
        editFavCatNode($("#favCatalog_jsTree").jstree(true));
    });

    $("#favCatalog_delete").confirmation({
        title: "确定删除？该文件夹下的收藏记录也会删除",
        btnOkLabel: "确定",
        btnCancelLabel: "取消",
        container: "body",
        onConfirm: function (event, element) {
            $("#favCatalog_delete").confirmation("hide");

            deleteFavCatNode($("#favCatalog_jsTree").jstree(true));
        }
    });
    //收藏夹搜索
    var favTo = false;
    $("#favSelect_search").keyup(function () {
        if (favTo) {
            clearTimeout(to);
        }
        favTo = setTimeout(function () {
            var v = $("#favSelect_search").val();
            $("#favCatalog_jsTree").jstree(true).search(v);
        }, 250);
    });

    //收藏文件夹选择弹框
    $("#favCatalog_modal").on("show.bs.modal", function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var iiid = button.data("iiid"); // Extract info from data-* attributes
        var favFolderId = button.data("favcatalogid");//data-*属性注意是小写
        var favFlag = button.data("favoriteflag");
        $("#input_iiid").val(iiid);
        $("#input_tabIndex").val(button.data("tabindex"));

        if (favFlag == 1) {
            loadFavoriteFolder(favFolderId);
        } else {
            loadFavoriteFolder(0);
        }


    });
    $("#favCatalogSelect_add_sibling").click(function () {
        addFavCatNodeSibling($("#favCatalogSelect_jsTree").jstree(true));

    });
    $("#favCatalogSelect_add_child").click(function () {
        addFavCatNodeChild($("#favCatalogSelect_jsTree").jstree(true));

    });

    $("#favCatalogSelect_rename").click(function () {
        editFavCatNode($("#favCatalogSelect_jsTree").jstree(true));
    });

    $("#favCatalogSelect_delete").confirmation({
        title: "确定删除？该文件夹下的收藏记录也会删除",
        btnOkLabel: "确定",
        btnCancelLabel: "取消",
        container: "#favCatalog_modal",
        onConfirm: function (event, element) {
            $("#favCatalogSelect_delete").confirmation("hide");

            deleteFavCatNode($("#favCatalogSelect_jsTree").jstree(true));
        }
    });
    //搜索框
    var to = false;
    $("#select_search").keyup(function () {
        if (to) {
            clearTimeout(to);
        }
        to = setTimeout(function () {
            var v = $("#select_search").val();
            $("#favCatalogSelect_jsTree").jstree(true).search(v);
        }, 250);
    });
    // file input
    $figure.fileinput({
        language: 'zh',
        showPreview: false,
        showUpload: false,
        showRemove: false,
        browseClass: "btn btn-success",
        browseLabel: "浏览图件",
        browseIcon: "<i class=\"glyphicon glyphicon-picture\"></i> ",
        removeClass: "btn btn-danger",
        removeLabel: "删除",
        removeIcon: "<i class=\"glyphicon glyphicon-trash\"></i> ",
        uploadClass: "btn btn-info",
        uploadLabel: "上传",
        uploadIcon: "<i class=\"glyphicon glyphicon-upload\"></i> ",
        maxFileSize: 5000,
        maxFileCount: 1,
        initialCaption: "请选择图件",
        uploadUrl: '/FigureService/FigureUpload',
        allowedFileExtensions: ['gdbx']//接收的文件后缀
    });
    $figure.on('filebatchselected', function (event, data, id, index) {
        $(this).fileinput("upload");
    });
    $figure.on('fileloaded', function (event, file, previewId, index) {
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
    });
    $figure.on("fileuploaded", function (event, data, previewId, index) {
        if (data.response) {
            //通过 data.response.Json对象属性 获得返回数据
            if (data && data.response) {
                fileId = data.response.fileId;
                filePath = data.response.path;
            }
        }
    });

    //保存开发曲线模板
    $('#saveModel').click(function () {
        var tmdata = [];
        $('#modelList .tempItem').each(function (i, v) {

            console.log($(v).find('.changeName').data('id'))

            var a = {
            };
            a.userid = 0;
            a.dptempid = $(v).find('.changeName').data('id');
            a.dptempname = $(v).find('.changeName').text();
            // a.isdefault = $(v).find('.changeName').attr('data-isdefault');
            if ($(v).find('input').prop('checked')) {
                a.isdefault = 1;
            } else {
                a.isdefault = 0;
            }
            a.actiontime = '';
            tmdata[i] = a;
        });

        $.ajax({
            url: "/UserDataAPI/SaveAppDProfileUserTemplate",
            async: true,
            data: {
                request: tmdata
            },
            type: "post",
            success: function (result) {
                //console.log(result)
                if (result) {
                    currentModel.curveTemplate(result);
                }
                toastr["success"]("模板保存成功!", "成功");
            }
        });

    });
    //添加开发曲线模板

    $('#addModel').click(function () {
        $("#CurveBox input[name='checkDataSouce']").prop("checked", false);

        num++;

        currentModel.curveTemplate.push({
            userid: 0,
            dptempid: 0,
            dptempname: ("新建模板" + num),
            isdefault: 0
        });

    });
    //删除开发曲线模板
    $('#removeModel').click(function () {
        var tmdata = [];
        var data = {
        };

        if (confirm("是否删除此模板！")) {
            $('#modelList .tempItem').each(function (i, v) {
                if ($(this).hasClass('active')) {
                    $(this).remove();

                    data.userid = $(this).find('.changeName').data('userid');
                    data.dptempid = $(this).find('.changeName').data('id');
                    data.dptempname = $(this).find('.changeName').text();
                    data.isdefault = $(this).find('.changeName').data('isdefault');
                    data.actiontime = '';

                    tmdata[0] = data;
                }
            });

            $.ajax({
                url: "/UserDataAPI/DelAppDProfileUserTemplate",
                async: true,
                data: {
                    request: tmdata
                },
                type: "post",
                success: function (result) {
                    if (result > -1) {
                        toastr["success"]("删除成功!", "成功");
                    } else {
                        toastr["error"]("删除失败!", "错误");
                    }

                }
            });
        }

    });
    //模板激活状态
    $(document).on('click', '.list-group .tempItem', function () {
        $(this).addClass('active').siblings().removeClass('active');
    });

    //双击开发曲线模板更改名字
    $(document).on('dblclick', '.changeName', function () {
        var text = $(this).text();
        var $self = $(this);
        var input = '<input type="text" style="color:black;height:46px;width:250px;position: absolute;left:10px;top:0;" value=' + text + '>'
        $(this).parent().append(input);
        $(this).parent().find('input')[1].focus();

        $(this).parent().find('input')[1].onblur = function () {
            if ($(this).val() && $(this).val().length > 0) {
                $self.text($(this).val());
                $(this).remove();
            } else {
                $(this).remove();
            }

        }
    });

    //曲线模板样式保存
    $(document).on('click', '#saveStyle', function () {
        var tmdata = [];

        if ($('.list-group .active .changeName').data('id') > 0 && $('.keyName:checked').length > 0) {
            //alert(123)
            $('#CurveBox input[name="checkDataSouce"]:checked').each(function (i, v) {
                var data = {
                };
                data.USERID = 0;
                data.DPTEMPID = $('.list-group .active .changeName').data('id');
                data.DATACLASSID = $(v).data('classid');
                data.KEY = $(v).val();
                data.CAPTION = $(v).data('caption');
                data.VALTYPE = $(v).data('type');

                data.VALFORMAT = $(v).parent().parent().find(".colorpicker-component").colorpicker('getValue');
                data.KEYINDEX = $(v).data('keyindex');
                data.DESHOW = 1;
                data.CAPTIONEXTEND = $(v).data('captionindex');
                data.ACTIONTIME = '';
                tmdata[i] = data;

            });

            $.ajax({
                url: "/UserDataAPI/SaveAppDProfileByUser",
                async: true,
                data: {
                    request: tmdata
                },
                type: "post",
                success: function (result) {
                    toastr["success"]("样式配置保存成功!", "成功");

                }
            });
        } else {
            toastr["success"]("请选择模板!", "错误");
        }
    });

    //图数联动tab
    $('#tsld-tab li').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('#tb6 .tab-content .tab-pane:eq(' + $(this).index() + ')').addClass('active').siblings().removeClass('active')

    });

    //保存修改后的图数联动数据
    $(document).on('click', '#saveLinkage', function () {
        var tmdata = [];

        $('#tb6 .tab-content .active input[name="checkDataLink"]:checked').each(function (i, v) {
            var data = {
            };
            data.USERID = 0;
            data.DPTEMPID = 0;
            data.DATACLASSID = $(v).data('classid');
            data.KEY = $(v).val();
            data.CAPTION = $(v).data('caption');
            data.VALTYPE = $(v).data('type');
            data.VALFORMAT = $(v).data('formate');
            data.DEFSHOW = 1;
            data.KEYINDEX = $(v).data('keyindex');
            data.CAPTIONEXTEND = $(v).data('captionindex');
            data.ACTIONTIME = '';
            tmdata[i] = data;
            //console.log(data.DEFSHOW);
        });
        $.ajax({
            url: "/UserDataAPI/SaveAppDProfileByUser",
            async: true,
            type: "post",
            data: {
                request: tmdata
            },
            success: function (result) {
                toastr["success"]("保存成功!", "成功");

            }
        });

    });
};

var getMapTypeFromMongo = function () {
    var param = {
        "filter":
        {
            "$and": [
                {
                    "ep.producttype": {
                        "$regex": "^(?!.*?导航图$)", "$options": "$i"
                    }
                }]
        },
        "fields": {
            "ep.producttype": 1
        }
    };
    $.ajax({
        url: global_api_url + "/SearchService/Match",
        type: "post",
        data: JSON.stringify(param),
        contentType: "application/json",
        success: function (result) {
            if (result && result.metadatas) {
                var temp = result.metadatas;
                for (var i = 0; i < temp.length; i++) {
                    var producttype = temp[i].ep && temp[i].ep.producttype ? temp[i].ep.producttype : "";
                    if (producttype && gMapType.indexOf(producttype) < 0) {
                        gMapType += "<option value='" + producttype + "'>" + producttype + "</option>";
                    }
                }
            }
        }
    });
};

var getMapTypeFromGMS = function () {
    $.ajax({
        url: '/FlexDraw/GetMapTypeName',
        type: 'post',
        success: function (result) {
            if (result) {
                for (var i = 0; i < result.length; i++) {
                    var temp = result[i];
                    if (gMapType.indexOf(temp) < 0) {
                        gMapType += "<option value='" + temp + "'>" + temp + "</option>";
                    }
                }
            }
        }
    });
};

//全选按钮
var checkAll = function (obj) {
    var $dom = $("#table_list8 #authentic-checkboxs").find("input");
    $dom.each(function (index, value) {
        value.checked = obj.checked;
    });
};

var checkOne = function (obj) {
    if (obj.checked) {
        var $dom = $("#table_list8 #authentic-checkboxs").find("input");
        var flag = true;
        $dom.each(function (index, value) {
            if (!value.checked) {
                flag = false;
                return;
            }
        });
        $("#table_list8 #checkall")[0].checked = flag;
    } else {
        $("#table_list8 #checkall")[0].checked = false;
    }
};
var authenticList = function () {
    var $dom = $("#table_list8 #authentic-checkboxs").find("input");
    var iiids = [];
    $dom.each(function (index, value) {
        if (value.checked) {
            iiids.push($(value).val());
        }
    });
    iiids = iiids.join(',');
    loding("tb8");
    if (iiids) {
        $.ajax({
            url: "/FigureService/AuthenticList",
            type: "post",
            data: { natureKeys: iiids },
            success: function (result) {
                toastr["success"]("审核成功!", "成功");
                currentModel.myUnauthenticList([]);
                currentModel.loadUnauthenticList();
            }
        });
    }
};

//加载我的收藏文件夹
var loadFavoriteFolder = function (favFolderId) {
    $.ajax({
        url: "/FavoriteCatalogService/GetFavoriteFolderTree",
        type: "post",
        async: true,
        success: function (result) {
            if (result) {
                var tempTree = null;
                if (favFolderId >= 0) {
                    tempTree = $("#favCatalogSelect_jsTree").jstree(true);
                    if (tempTree) {
                        tempTree.settings.core.data = result;
                        tempTree.refresh();
                    } else {
                        renderFavFolderTree($("#favCatalogSelect_jsTree"), result, favFolderId);
                    }

                } else {
                    tempTree = $("#favCatalog_jsTree").jstree(true);
                    if (tempTree) {
                        tempTree.settings.core.data = result;
                        tempTree.refresh();
                    } else {
                        renderFavFolderTree($("#favCatalog_jsTree"), result);
                    }
                }
            }
        }
    });
};
//创建收藏文件夹树
var renderFavFolderTree = function (targetDom, data, favFolderId) {
    targetDom.jstree({
        "core": {
            "animation": 0,
            "check_callback": true,
            "multiple": false,
            "data": data
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
                return name + " " + counter;
            }
        },
        "plugins": ["dnd", "search", "state", "unique", "types", "wholerow"]
    }).on("loaded.jstree", function (e, data) {
        if (favFolderId) {
            data.instance.select_node(favFolderId);
        }
    }).on("create_node.jstree", function (e, data) {


    }).on("rename_node.jstree", function (e, data) {
        var id = data.node.id;
        id = id > 0 ? id : 0;

        var name = data.node.text;

        var parentId = data.node.parent;
        parentId = parentId == "#" ? null : parentId;

        updateFavoriteFolder(id, name, parentId, data.node, data.instance);
    }).on("move_node.jstree", function (e, data) {
        var id = data.node.id;
        id = id > 0 ? id : 0;

        var name = data.node.text;

        var parentId = data.parent;
        parentId = parentId == "#" ? null : parentId;

        updateFavoriteFolder(id, name, parentId, data.node, data.instance);

    }).on("delete_node.jstree", function (e, data) {
        $.ajax({
            url: "/FavoriteCatalogService/DeleteFavoriteFolder",
            async: true,
            type: "post",
            data: {
                favCatalogId: data.node.id
            },
            success: function (result) {
                if (result == "success") {
                    //todo 删除成功提示！
                }
            }
        });
    }).on("changed.jstree", function (e, data) {
        var targetId = e.currentTarget.id;

        if (data.action == "select_node") {
            //当前选中节点
            var sel = data.node;
            var isLeaf = data.instance.is_leaf(sel);

            if (targetId == "favCatalog_jsTree") {
                //重命名和删除按钮可用状态
                $("#favCatalog_rename").removeClass("disabled");
                if (isLeaf) {
                    $("#favCatalog_delete").removeClass("disabled");
                } else {
                    $("#favCatalog_delete").addClass("disabled");
                }
                $("#table_list2").footable();
                var favFolder = sel.id;
                if (favFolder > 0) {
                    $.ajax({
                        url: "/UserBehaviorService/GetFavoriteList",
                        async: true,
                        type: "post",
                        data: {
                            favCatalogId: favFolder
                        },
                        success: function (result) {
                            currentModel.myFavoriteList([]);

                            var data = ko.utils.arrayMap(result, function (item) {
                                return new UserBehaviorModel(item);
                            });
                            currentModel.myFavoriteList(data);
                            $("#table_list2").trigger('footable_redraw');
                        }
                    });
                } else {
                    currentModel.myFavoriteList([]);
                    $("#table_list2").trigger('footable_redraw');
                }

            } else {
                //重命名和删除按钮可用
                $("#favCatalogSelect_rename").removeClass("disabled");
                if (isLeaf) {
                    $("#favCatalogSelect_delete").removeClass("disabled");
                } else {
                    $("#favCatalogSelect_delete").addClass("disabled");
                }
            }

        } else if (data.action == "delete_node") {
            if (targetId == "favCatalog_jsTree") {
                //重命名和删除按钮不可用状态
                $("#favCatalog_rename").addClass("disabled");
                $("#favCatalog_delete").addClass("disabled");
            } else {
                $("#favCatalogSelect_rename").addClass("disabled");
                $("#favCatalogSelect_delete").addClass("disabled");
            }
        }
    });
};
//更新收藏文件夹
var updateFavoriteFolder = function (id, name, parentId, node, treeInstance) {
    $.ajax({
        url: "/FavoriteCatalogService/UpdateFavoriteFolder",
        async: true,
        type: "post",
        data: {
            favCatalogId: id, favName: name, parentCatalogId: parentId
        },
        success: function (nodeId) {
            if (nodeId) {
                treeInstance.set_id(node, nodeId);
            }
        }
    });
};
//新增收藏文件夹兄弟节点
var addFavCatNodeSibling = function (instance) {
    var sel = instance.get_selected(true)[0];
    var parent = null;
    if (sel && sel.parent) {
        parent = sel.parent;
    }
    instance.create_node(parent, {}, "last", function (new_node) {
        instance.edit(new_node);
    });
};
//新增收藏文件夹子节点
var addFavCatNodeChild = function (instance) {
    var sel = instance.get_selected(true)[0];
    if (!sel) {
        sel = null;
    }
    instance.create_node(sel, {}, "last", function (new_node) {
        instance.edit(new_node);
    });
};

var modifyUserStyleConfig = function () {
    var proMode = currentModel.projectMode();
    if (!(proMode && proMode.length > 0)) return;
    var p$ = $("input[name='pData']");
    var layerTransparency = 0.7, strokeTransparency = 0.7, textTransparency = 0.7;
    try {
        p$.each(function () {
            var val = $(this).val();
            var key = $(this).data("key");
            var caption = $(this).data("caption");
            var value = "";
            var len1 = val.indexOf('(');
            var len2 = val.indexOf(')');
            if (caption == "layerfillcolor") {
                value = val.slice(len1 + 1, len2) + "," + strokeTransparency;
            }
            if (caption == "strokecolor") {
                value = val.slice(len1 + 1, len2) + "," + layerTransparency;
            }
            if (caption == "textcolor") {
                value = val.slice(len1 + 1, len2) + "," + textTransparency;
            }
            for (var i = 0; i < proMode.length; i++) {
                var temp = proMode[i];
                if (temp.bot == key) {
                    temp[caption] = value;
                }
            }
        });
    } catch (ex) {
        toastr["error"]("颜色样式格式不正确!", "错误");
        return;
    }

    $.ajax({
        url: "/UserDataAPI/SaveTargStyleUConfig",
        type: "post",
        data: {
            request: proMode
        },
        success: function (result) {
            toastr["success"]("样式配置保存成功!", "成功");
        }
    });
}
//编辑收藏夹文件节点
var editFavCatNode = function (instance) {
    var sel = instance.get_selected(true);
    if (!sel.length) {
        return false;
    }
    sel = sel[0];
    instance.edit(sel);
};
//删除收藏文件夹节点
var deleteFavCatNode = function (instance) {
    var sel = instance.get_selected(true);
    if (!sel.length) {
        return false;
    }
    instance.delete_node(sel);
};


//加载开发曲线颜色数据
var loadCurveTemplateData = function (item) {

    $("#CurveBox input[name='checkDataSouce']").prop("checked", false);

    if (curveDefaultColors && curveDefaultColors.length > 0) {
        var colorItem = null;
        for (var i = 0; i < curveDefaultColors.length; i++) {
            colorItem = curveDefaultColors[i];
            $("#CurveBox input[name='checkDataSouce'][value='" + colorItem.KEY + "']").parent().parent().find(".colorpicker-component").colorpicker('setValue', colorItem.VALFORMAT);

        }
    }

    var url = "/UserDataAPI/GetAppDProfileByUser?" + Math.round(Math.random() * 10000);
    $.ajax({
        url: url,
        async: true,
        type: "get",
        data: { dptempid: item.dptempid },
        success: function (result) {
            //console.log(result)
            if (result && result.length > 0) {
                var item = null;
                for (var i = 0; i < result.length; i++) {
                    item = result[i];

                    $("#CurveBox input[name='checkDataSouce'][value='" + item.key + "']").prop("checked", true);

                    $("#CurveBox input[name='checkDataSouce'][value='" + item.key + "']").parent().parent().find(".colorpicker-component").colorpicker('setValue', item.valformat);
                }
            }
        }
    });
};

//加载图数联动数据
var loadUserDataLinkage = function (item) {

    var url = "/UserDataAPI/GetAppDProfileByUser?" + Math.round(Math.random() * 10000);
    $.ajax({
        url: url,
        async: true,
        type: "get",
        success: function (result) {

            if (result && result.length > 0) {

                var groups = Enumerable.From(result)
                        .GroupBy("$.dataclassid", null,
                                function (key, g) {
                                    return {
                                        dataclassid: key,
                                        data: g.source
                                    }
                                })
                        .ToArray();

                var item = null;
                for (var i = 0; i < groups.length; i++) {
                    item = groups[i].data;

                    if (item && item.length > 0) {

                        $("#tb6 .tab-content input[name='checkDataLink'][data-classid='" + groups[i].dataclassid + "']").prop("checked", false);

                        for (var j = 0; j < item.length; j++) {                           

                            $("#tb6 .tab-content input[name='checkDataLink'][value='" + item[j].key + "'][data-classid='" + item[j].dataclassid + "']").prop("checked", true);
                        }
                    }
                    
                }
            }
        }
    });
};
function switchtab(curIndex) {

    if (curIndex == 1) {
        //加载浏览数据
        currentModel.loadLookList();
        //清除上次输入的搜索条件
        $("#myLookTable").val("");
    } else if (curIndex == 2) {
        //清除上次输入的搜索条件
        $("#myFavoriteTable").val("");
        //加载收藏文件夹
        loadFavoriteFolder();
    } else if (curIndex == 3) {
        //加载下载数据
        currentModel.loadDownloadList();
        //清除上次输入的搜索条件
        $("#myDownloadTable").val("");
    } else if (curIndex == 4) {
        //加载用户投影样式配置数据
        currentModel.loadTargStyleUConfByUser();

    } else if (curIndex == 5) {
        currentModel.loadCurveTemplate();

    } else if (curIndex == 6) {
        loadUserDataLinkage();
    } else if (curIndex == 7) {
        //加载下载数据
        loding("tb7");
        currentModel.loadSubmitList();
        currentModel.loadMetadataDefintion();
        //清除上次输入的搜索条件
        $("#mySubmitTable").val("");
    } else if (curIndex == 8) {
        //加载数据
        loding("tb8");
        currentModel.loadUnauthenticList();
        //清除上次输入的搜索条件
        $("#myUnauthenticTable").val("");
    }
    var dis = null;
    var tbIndex = null;
    $("#content").find(".ibox").each(function () {
        tbIndex = $(this).attr("tbindex");
        dis = (tbIndex != curIndex) ? "none" : "block";
        $(this).attr("style", "display:" + dis);
    });


}

//文档加载
$(document).ready(function () {
    $parent = $(window.parent.document);

    //document.onmousewheel = function() {return false;}//屏蔽鼠标滚轮
    document.onselectstart = function () {
        return false;
    };//禁止选取、防止复制
    document.oncopy = function () {
        return false;
    };//禁止复制和剪切
    document.onpaste = function () {
        return false;
    };//禁止粘贴

    currentModel = new MySpaceViewModel();
    ko.applyBindings(currentModel);
    switchtab(1);

    eventBind();
    //加载开发曲线颜色设置
    currentModel.loadCurveMode();
    //加载图数联动数据
    currentModel.loadDataLinkage();

    getMapTypeFromMongo();
    getMapTypeFromGMS();

});

//页面加载完毕后执行
window.onload = function () {

};
var firstUpperCase = function (str) {
    return str.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
        return $1.toUpperCase() + $2.toLowerCase();
    })
};



