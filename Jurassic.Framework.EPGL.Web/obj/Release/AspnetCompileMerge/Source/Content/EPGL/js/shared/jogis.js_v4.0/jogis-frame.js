/*
 * Global Begin
 */
var JoGisRef;
/*
 * Global End
 */

/*
 * JoGis封装组件
 * @param {[dom对象]} el      [容器对象]
 * @param {[json对象]} options [属性参数]
 */
function JoGis(_el, _options) {
    this.el = _el;
    JoGisRef = _el;
    this.options = {
        Style: { border: "solid 1px #666", width: "100%" },
        ShowEagleEye: true,
        GDBPath: "",
        LoadType: 0//加载标志，0同步加载磁盘文件，1同步加载内存流
    };

    if (_options) {
        if (_options.Style) {
            this.options.Style = _options.Style;
        }
        if (_options.ShowEagleEye) {
            this.options.ShowEagleEye = _options.ShowEagleEye;
        }
        if (_options.GDBPath) {
            this.options.GDBPath = _options.GDBPath;
        }
        if (_options.LoadType) {
            this.options.LoadType = _options.LoadType;
        }
    }
        

    this.init();
}

//JoGis初始化
JoGis.prototype.init = function () {
    //console.log(this);
}

/**
 * 获取图件图层Json数组
 * @return {[type]} [description]
 * 格式 [{index:0, name:""}, {index:0, name:""}]
 * index : 图层索引
 * name : 图层名称
 */
JoGis.prototype.getGeoLayersJson = function () {
    if (!this.el.LayerCount) return [];
    if (this.el.LayerCount == 0) return [];

    var json = [];// 定义一个json对象
    var entity = {};// 实体

    for (var i = 0; i < this.el.LayerCount; i++) {
        entity.index = i;
        entity.name = this.el.GetLayerName(i);
        json.push(entity);
        entity = {};
    }
    return json;
}

/**
 * 获取指定图层图元的数组
 * @return {[type]} [description]
 * 格式 [{ElementID:0, ElementType:"",ElementName:""}, {ElementID:0, ElementType:"",ElementName:""}]
 * ElementID : 图元索引ID
 * ElementType：图元类型
 * ElementName : 图元名称
 */
JoGis.prototype.getElementsByLayer = function (layerName) {
    //if (!this.el.LayerCount) return [];
    //if (this.el.LayerCount == 0) return [];

    var json = [];// 定义一个json对象
    var entity = {};// 实体

    var count = this.el.PM_GetElementCount(layerName);
    for (var j = 0; j < count; j++) {
        var vElementID = this.el.PM_GetElementID(layerName, j);
        entity.ElementID = vElementID;
        entity.ElementName = this.el.PM_GetElementCaption(entity.ElementID); //图元名称
        entity.ElementType = this.el.PM_GetElementType(vElementID);

        json.push(entity);
        entity = {};
    }

    return json;
}
/**
*获取所有指定类型图元名称
*/
JoGis.prototype.getElementsNameProByType = function (typeId) {
    var count = this.el.PM_GetLayerCount();
    var json = [];// 定义一个json对象

    var sId = null;
    var sName = null;
    var sType = null;

    if (count> 0) {

        for (var i = 0; i < count; i++) {
            var layerName = this.el.PM_GetLayerName(i);
            var eleCount = this.el.PM_GetElementCount(layerName);
            for (var j = 0; j < eleCount; j++) {
                sId = this.el.PM_GetElementID(layerName,j);
                sName = this.el.PM_GetElementCaption(sId);
                sType = this.el.PM_GetElementType(sId);
                if (sType == typeId) {
                    json.push(sName);
                }
            }
        }
    }
    return json;
}

/**
 * 加载图件
 * @return {[string]}      [result code]
 *
 * result code
 * jogis000 : file参数为空
 * jogis001 : 加载成功
 * jogis002 : gdb路径无效
 * jogis003 : LoadMapFile函数调用错误
 */
JoGis.prototype.loadGeoMapFile = function () {
    if (this.options.GDBPath.length == 0)
        return "jogis000";

    //this.options.GDBPath = decodeURI( this.options.GDBPath );

    //加载图件
    var ret = true;
    try {
        //console.log('GDBPath:'+this.options.GDBPath);

        this.el.SetWorkFlag(0, 0);

        ret = this.el.PM_LoadMap(this.options.GDBPath, this.options.LoadType);
        
        //console.log('result:'+ret);

        //设置是否可移动曲线类图元
        //this.el.MoveStatus = false;
        //设置默认操作状态为选择
        this.el.PM_SetOperateState(0);
        ////设置图元单选模式
        //this.el.SelectMode = 0;
        ////设置聚焦闪烁模式（0：不激活；1：激活）
        //this.el.PM_SetFocusMode(1);
        //this.el.FocusMode = 1;
        //设置选中图元的突出显示方式  会导致浏览器崩溃
        //this.el.SetFocusStyle(3, 255, 0, 1);
        //this.el.PM_SetFocusStyle(3, 255, 0, 1);
    }
    catch (e) {
        console.log(e);
        alert("当前浏览器不是 IE9+ 版本！无法使用ActiveX组件。请用IE9、10、11打开。");
    }
    if (!ret) return "jogis003";
    return "jogis001";
}

JoGis.prototype.GetProjection = function () {
}

//返回图元类型名称
JoGis.prototype.GetElementTypeByTypeNum = function (typeNum) {
    var formatElementType = "";
    switch (typeNum) {
        case 3:
            formatElementType = "离散点图元";
            break;
        case 4:
            formatElementType = "文字图元";
            break;
        case 5:
            formatElementType = "图例图元";
            break;
        case 6:
            formatElementType = "比例尺图元";
            break;
        case 9:
            formatElementType = "井位图元";
            break;
        case 10:
            formatElementType = "地名图元";
            break;
        case 12:
            formatElementType = "图框图元";
            break;
        case 15:
            formatElementType = "矩形图元";
            break;
        case 16:
            formatElementType = "圆角矩形图元";
            break;
        case 17:
            formatElementType = "椭圆图元";
            break;
        case 18:
            formatElementType = "线段图元";
            break;
        case 19:
            formatElementType = "位图图元";
            break;
        case 20:
            formatElementType = "元文件图元";
            break;
        case 26:
            formatElementType = "曲线图元";
            break;
        case 27:
            formatElementType = "等值线图元";
            break;
        case 28:
            formatElementType = "断层线图元";
            break;
        case 29:
            formatElementType = "面图元";
            break;
        case 31:
            formatElementType = "地震测线图元";
            break;
        case 48:
            formatElementType = "动态标注";
            break;
        case 65:
            formatElementType = "文字图元";
            break;
    }
    return formatElementType;
}

//获取选中的图元信息返回Json对象
JoGis.prototype.GetSelElmentInfo = function () {
    //this.el = $("#JoGisOcxAreCharts").get(0);
    var selCount = this.el.PM_GetSelElementCount();
    var vSelElement = "[";
    if (selCount > 0) {
        for (var num = 0; num < selCount; num++) {
            var vElementID = this.el.PM_GetSelElementID(num);//图元ID
            var vElementName = this.el.PM_GetElementCaption(vElementID); //图元名称
            var vElementDesc = this.el.PM_GetElementCaption(vElementID); //图元名称
            var type = this.el.PM_GetElementType (vElementID);
            var vElementType = this.GetElementTypeByTypeNum(type); //图元类型
            var vBelongLayer = "";
            if (vElementID != "") {
                var arr = vElementID.split('-');
                for (var i = 0; i < arr.length - 1; i++) {
                    vBelongLayer = arr[i] + "-";
                }
                vBelongLayer = vBelongLayer.substr(0, vBelongLayer.length - 1);
            }
            //            if (vElementName == "") {
            //                continue;
            //            }
            var vTempElement = "{\"ElementID\":\"" + vElementID + "\",\"ElementName\": \"" + vElementName + "\",\"ElementDesc\": \"" + vElementDesc + "\",\"ElementType\": \"" + vElementType + "\",\"BelongLayer\": \"" + vBelongLayer + "\"},";
            vTempElement = vTempElement.replace(/[\r\n]/g, "");
            vSelElement += vTempElement;
        }
        if (vSelElement.indexOf(",") > -1) {
            vSelElement = vSelElement.substr(0, vSelElement.length - 1); //去掉最后一个逗号
        }
    }
    vSelElement += "]";
    return vSelElement;
}

//移动图元到控件中心
JoGis.prototype.RemoveElement = function (elementID) {
    this.el.PM_SelectElement(elementID,0);
    //this.el.ZoomScale = 1.5;
    //this.el.AddFocusElement(elementID);
    //this.el.SetFocusStyle(2, 0xFFFF00, 2, 10);
    this.el.SetFocusStyle(5, 0xFFFF00, 2, 10);
    this.el.FocusMode = 1;
    //this.el.Locate(ElementID, 3);
}

JoGis.prototype.FindElementByLayer = function (layerName, keyWord) {
    if (layerName == "" || keyWord == "") return [];
    var queryElement = "";
    var queryTemp = this.el.FindElementByName(keyWord, -1, layerName); // axJoGISXJW.Invoke("FindElementByName", xmlParameterPath);
    queryElement += queryTemp;

    if (queryElement != "") {
        var strQuery = queryElement.split(';');
        for (var j = 0; j < strQuery.length; j++) {
            if (strQuery[j] != "") {
                var queryText = this.el.PM_GetElementCaption(strQuery[j]);
                queryText = queryText.replace(/[\r\n]/g, "");
                entity = { ElementID: strQuery[j], ElementName: queryText };
                results.push(entity);
            }
        }
    }
    return results;
}

//移动图元到控件中心
JoGis.prototype.FindElement = function (keyWord) {
    if (keyWord == "") return [];
    var queryElement = "";
    var entity = {};
    var results = [];
    var count = this.el.PM_GetLayerCount();
    for (var i = 0; i < count; i++) {
        var layerName = this.el.PM_GetLayerName(i);
        
        var queryTemp = this.el.FindElementByName(keyWord, -1, layerName); // axJoGISXJW.Invoke("FindElementByName", xmlParameterPath);
        queryElement += queryTemp;
    }
    if (queryElement != "") {
        var strQuery = queryElement.split(';');
        for (var j = 0; j < strQuery.length; j++) {
            if (strQuery[j] != "") {
                var queryText = this.el.PM_GetElementCaption(strQuery[j]);
                var nType = this.el.PM_GetElementType(strQuery[j]);
                queryText = queryText.replace(/[\r\n]/g, "");
                //result += "<span class=\"spQueryResultItem\"><a id=\"" + queryText + "\" onclick=\"RemoveElement('" + strQuery[j] + "')\" href=\"#\">" + queryText + "</a></span>";
                //result += "<span class=\"spQueryResultItem\" id=\"" + queryText + "\" onclick=\"RemoveElement('" + strQuery[j] + "')\">" + queryText + "</span>";
                entity = { ElementID: strQuery[j], ElementName: queryText, ElementType: nType };
                results.push(entity);
            }
        }
    }
    // else if (queryElement == "") {
    // 	result += "<span class=\"spQueryResultItemNoData\">未查询到图元信息！</span>";
    // }

    return results;
}
//根据图元名称查找图元(单个)
JoGis.prototype.FindEleByName = function (name) {
    if (!name || name=="") return [];
    var queryElement = "";
    var layerName = "";
    var entity = {};
    var results = [];
    var count = this.el.PM_GetLayerCount();
    for (var i = 0; i < count; i++) {
        layerName = this.el.PM_GetLayerName(i);
        var queryTemp = this.el.FindElementByName(name, -1, layerName);
        if (queryTemp && queryTemp !== "") {
            queryElement += queryTemp;
            break;
        }
    }
    if (queryElement != "") {
        var strQuery = queryElement.split(';');
        for (var j = 0; j < strQuery.length; j++) {
            if (strQuery[j] != "") {
                var queryText = this.el.PM_GetElementCaption(strQuery[j]);
                if (queryText == name) {
                    var nType = this.el.PM_GetElementType(strQuery[j]);
                    queryText = queryText.replace(/[\r\n]/g, "");

                    entity = { ElementID: strQuery[j], ElementName: queryText, ElementType: nType, LayerName: layerName };

                    return entity;
                }                
            }
        }
        
    }
    return null;
}
//根据别名查找图元
JoGis.prototype.FindElementByAliasNames = function (nameArray) {
    if (!nameArray || nameArray == []) return [];
    var queryElement = "";
    var entity = {};
    var results = [];
    var count = this.el.PM_GetLayerCount();
    for (var i = 0; i < count; i++) {
        var layerName = this.el.PM_GetLayerName(i);
        for (var j = 0; j < nameArray.length; j++) {
            var keyWord = nameArray[j];
            var queryTemp = this.el.FindElementByName(keyWord, -1, layerName);
            if (queryTemp && queryTemp!=="") {
                queryElement += queryTemp;
            }
        }
       
    }
    if (queryElement != "") {
        var strQuery = queryElement.split(';');
        for (var j = 0; j < strQuery.length; j++) {
            if (strQuery[j] != "") {
                var queryText = this.el.PM_GetElementCaption(strQuery[j]);
                var nType = this.el.PM_GetElementType(strQuery[j]);
                queryText = queryText.replace(/[\r\n]/g, "");
                //result += "<span class=\"spQueryResultItem\"><a id=\"" + queryText + "\" onclick=\"RemoveElement('" + strQuery[j] + "')\" href=\"#\">" + queryText + "</a></span>";
                //result += "<span class=\"spQueryResultItem\" id=\"" + queryText + "\" onclick=\"RemoveElement('" + strQuery[j] + "')\">" + queryText + "</span>";
                entity = { ElementID: strQuery[j], ElementName: queryText, ElementType: nType };
                results.push(entity);
            }
        }
    }
    // else if (queryElement == "") {
    // 	result += "<span class=\"spQueryResultItemNoData\">未查询到图元信息！</span>";
    // }

    return results;
}

/**
 * param = {nDatus, a, b}
 * nDatus —— 球体类型参数。球体类型含义可参见附录9。
 * a ——  椭球体的长轴
 * b ——  椭球体的短轴
 */
JoGis.prototype.SetDatum = function (param) {
    try {
        return this.el.PM_SetDatum(param.nDatus,
                                param.a, param.b
        );
    }
    catch (e) { console.log(e); }
    return false;
}

/**
 * param = {nType, lon0, lat0, lon1, lat1, lon2, lat2, azimuth, k0, x0, y0, Zab}
 * nType —— 投影类型参数。参数含义参见附录10。
 * lon0, lat0 —— 投影的中央经线及中央纬线。
 * lon1, lat1 —— 投影的割线1。
 * lon2, lat2 —— 投影的割线2。
 * azimuth  —— 投影的方位角。
 * k0   —— 投影的斜率。
 * x0, y0 —— 投影参数。
 * ZAB —— 投影参数。
 */
JoGis.prototype.SetProjection = function (param) {
    try {
        return this.el.PM_SetProjection(param.nType,
                                    param.lon0, param.lat0,
                                    param.lon1, param.lat1,
                                    param.lon2, param.lat2,
                                    param.azimuth,
                                    param.k0,
                                    param.x0, param.y0,
                                    param.ZAB
        );
    }
    catch (e) { console.log(e); }
    return false;
}

//添加焦点
JoGis.prototype.AddFouce = function (ElementID) {
    this.el.PM_SelectElement(ElementID,0);
    this.el.SetFocusStyle(2, 0xFFFF00, 2, 10);
    this.el.FocusMode = 1;
}