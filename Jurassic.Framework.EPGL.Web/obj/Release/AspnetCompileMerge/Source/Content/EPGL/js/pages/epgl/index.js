var currentViewModel = null;

/*
*按图件分类统计
*/
var initChartSample1 = function (data) {

    var chart = AmCharts.makeChart("chart_1", {
        "type": "pie",
        "theme": "light",

        "fontFamily": 'Open Sans',

        "color": '#888',

        "dataProvider": data,
        "valueField": "count",
        "titleField": "typename",
        "outlineAlpha": 0.4,
        //"outlineThickness": 2,
        //"radius" : 50,
        "marginTop": 60,
        "startEffect": "elastic",
        "startDuration": 2,
        "labelRadius": 15,
        "innerRadius": "50%",
        "depth3D": 15,
        "labelText": "[[title]]: [[count]]张",
        "balloonText": "[[typename]]<br><span style='font-size:12px'><b>[[count]]</b> ([[percents]]%)</span>",
        //"radius" : 120,
        "angle": 30/*,
            "legend":{
                "position":"right",
                "marginRight":100,
                "autoMargins":false
            }*/
    });

    jQuery('.chart_1_chart_input').off().on('input change', function () {
        var property = jQuery(this).data('property');
        var target = chart;
        var value = Number(this.value);
        chart.startDuration = 0;

        if (property == 'innerRadius') {
            value += "%";
        }

        target[property] = value;
        chart.validateNow();
    });

    $('#chart_1').closest('.portlet').find('.fullscreen').click(function () {
        chart.invalidateSize();
    });

    // add click listener
    //chart.addListener("clickSlice", function (e) {
    //    var data = e.dataItem.dataContext;
    //    window.location.href = "/Search/Index?key=" + data.typename + "&typeid=" + data.typeid;
    //});
}

/*
*按年份统计
*/
var initChartSample2 = function (data) {
    
    var highcharts = $("#chart_2").highcharts({
        chart: {
            zoomType: 'x',
            style: {
                fontFamily: 'Open Sans'
            }
        },
        title: {
            text: '成果图件入库趋势统计'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    '点击并拖拽选择区域可放大' : '放大图表'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: '成果图件数量'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        tooltip: {
            formatter: function () {
                return '年份：' + this.x +
                    '<br/>' + this.series.name + '：' + this.y;
            }
        },
        series: [{
            type: 'area',
            name: '成果图件入库数量',
            data: data
        }]
    });
}

/*
*按研究目标统计
*/
var initChartSample3 = function (data) {
    var chart = AmCharts.makeChart("chart_3", {
        "type": "radar",
        "theme": "light",

        "fontFamily": 'Open Sans',

        "color": '#888',

        "dataProvider": data,
        "valueAxes": [{
            "axisTitleOffset": 20,
            "minimum": 0,
            "axisAlpha": 0.15
        }],
        "startDuration": 2,
        "graphs": [{
            "balloonText": "[[typename]]<br><span style='font-size:12px'><b>[[count]]</b> 张图件</span>",
            "bullet": "round",
            "fillAlphas": 0.3,
            "valueField": "count"
        }],
        "categoryField": "typename"
    });

    $('#chart_3').closest('.portlet').find('.fullscreen').click(function () {
        chart.invalidateSize();
    });
}
/*
*按研究过程统计
*/
var initChartSample4 = function (data) {
    var resgroup = Enumerable.From(data)
        .GroupBy("$.typename", null,
                function (key, g) {
                    return {
                        typename: key,
                        count: g.Sum("$.count"),
                        //count : Math.ceil(Math.random()*200),
                        lineColor: getRandomColor()
                    }
                })
        .ToArray();

    var chart = AmCharts.makeChart("chart_4", {
        "type": "serial",
        "theme": "light",

        "fontFamily": 'Open Sans',

        "color": '#888',

        "dataProvider": resgroup,
        "valueField": "count",
        "titleField": "typename",
        //"outlineAlpha": 0.4,
        //"marginTop": 60,
        //"startEffect": "elastic",
        "startDuration": 2,
        "valueAxes": [{
            "position": "left",
            "title": "成果数量"
        }],
        "graphs": [{
            "balloonText": "[[typename]]: <b>[[count]]</b>",
            "fillColorsField": "lineColor",
            "fillAlphas": 1,
            "lineAlpha": 0.1,
            "type": "column",
            "valueField": "count"
        }],
        "depth3D": 15,
        "angle": 20,
        "chartCursor": {
            "categoryBalloonEnabled": false,
            "cursorAlpha": 0,
            "zoomable": false
        },
        "categoryField": "typename",
        "categoryAxis": {
            "gridPosition": "start",
            "fontSize": 9,  //横坐标坐标轴字体大小
            "labelRotation": 20//倾斜角度
        }
    });

    $('#chart_4').closest('.portlet').find('.fullscreen').click(function () {
        chart.invalidateSize();
    });

    // add click listener
    chart.addListener("clickSlice", function (e) {
        var data = e.dataItem.dataContext;
        window.location.href = "/Search/Index?key=" + data.typename + "&typeid=" + data.typeid;
    });
}


//API获取数据
var getData = function (isChart,isTable,isLastMonth) {
    var param = null;
    if (isChart) {
        param = {
            "fields": {
                "groups.ep.producttype": 1,
                "groups.dc.year": 1,
                "groups.ep.bo.type": 1
            },
            "grouprule": {
                "top": 1000000,
                "gfields": [
                    "ep.producttype", "dc.year", "ep.bo.type"
                ]
            },
            "filter": {
                "$and": [
                    { "ep.producttype": { "$regex": "^(?!.*?导航图$)", "$options": "$i" } }
                ]
            }
        };
    }
    if (isTable) {
        param = {
            "filter": {
                "$and": [
                    { "source.url": { "$regex": "^((?!vmap).)*$", "$options": "$i" } },
                    { "ep.producttype": { "$regex": "^(?!.*?导航图$)", "$options": "$i" } }
                ]
            },
            "sortrules": {
                "indexeddate": {
                    "direction": -1
                }
            },
            "fields": {
                "iiid": 1,
                "dc.title": 1,
                "dc.contributor": 1,
                "dc.date": 1,
                "indexeddate": 1,
                "ep.productType": 1,                
                "source.url": 1                
            },
            "pager": {
                "from": 0,
                "size": 10
            }
        };
    }
    if (isLastMonth) {
        var lastMonth = new Date(getLastMonthDate());
        var nextDay = new Date(getTomorrow());
        param = {
            "filter":
            {
                "$and": [
                  {
                      "indexeddate": { "$gte": lastMonth, "$lte": nextDay }
                  },
                { "ep.producttype": { "$regex": "^(?!.*?导航图$)", "$options": "$i" } }]
            },
            "fields": {
                "iiid": 1
            }
        };        
    }
    
    $.ajax({
        url: global_api_url + "/SearchService/Match",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(param),
        success: function (result) {
            if (!result) {
                return;
            }
            var count = result.count;//总数量，并不是查询出来结果的数量            

            var data = result.metadatas;

            if (isChart) {
                if (result && result.groups) {
                    var producttype = result.groups["ep.producttype"];
                    if (producttype) {
                        var classifications = [];
                        for (var key in producttype) {
                            classifications.push({ typename: key, count: producttype[key] });
                        }
                        initChartSample1(classifications);
                    }
                    var year = result.groups["dc.year"];
                    if (year) {
                        var years = [];
                        for (var key in year) {
                            if (!key||key=="null") {
                                continue;
                            }
                            years.push([parseInt(key), year[key]]);
                        }
                        years.sort(function (a, b) {
                            return a[0] - b[0];
                        });
                        initChartSample2(years);
                    }
                    var bo = result.groups["ep.bo.type"];
                    if (bo) {
                        var targets = [];
                        for (var key in bo) {
                            targets.push({ typename: key, count: bo[key] });
                        }
                        initChartSample3(targets);
                    }

                }
            }
            if (isTable) {
                var datas = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var date = new Date(item.indexeddate).Format("yyyy-MM-dd hh:mm:ss");
                    var temp = {
                        index: i,
                        iiid: item.iiid,
                        indexedDate: item.indexeddate,
                        indexedDateShow:date,
                        name: "",
                        title: "",
                        sourceUrl: "",
                        author: "",
                        createdDate: "",
                        productType: ""
                    };

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
                    if (item.ep && item.ep.producttype) {
                        temp.productType = item.ep.producttype;
                    }
                    datas.push(temp);
                }
                if (datas.length>0) {
                    //更新结果
                    currentViewModel.lastStorage(datas);
                }
                //更新总入库数量
                $("#totalCount_counterUp").attr("data-value", count);
                $("#totalCount_counterUp").counterUp();
            }
            if (isLastMonth) {
                $("#lastMonth_counterUp").attr("data-value", data.length);
                
                $("#lastMonth_counterUp").counterUp();
                
            }
        },
        error: function (result) {


        }

    });

};
//获取近期收藏列表
var getFavoriteList = function () {
    $.ajax({
        url: "/UserBehaviorService/GetFavoriteList",
        type:"post",
        async: true,
        success: function (result) {
            if (result) {
                currentViewModel.favoriteList(result);               
            }           
        }
    });
};
//获取近期预览列表
var getLookList = function () {
    $.ajax({
        url: "/UserBehaviorService/GetLookList",
        type:"post",
        async: true,
        success: function (result) {
            if (result) {
                currentViewModel.lookList(result);
            }
        }
    });
};
//近期下载列表
var getDownloadList = function () {
    $.ajax({
        url: "/UserBehaviorService/GetDownloadList",
        type:"post",
        async: true,
        success: function (result) {
            if (result) {
                currentViewModel.downloadList(result);
            }
        }
    });
};
var ViewModel = function () {
    var self = this;
    //收藏列表
    self.favoriteList = ko.observableArray();
    //浏览列表
    self.lookList = ko.observableArray();
    //下载列表
    self.downloadList = ko.observableArray();
    //最新入库
    self.lastStorage = ko.observableArray();
    //转换json串中的datetime格式
    self.dateFormat = function (value) {
        var date = new Date(parseInt(value.substr(6)));
        return date.Format("yyyy-MM-dd");
    };
    //打开
    self.openDetailPage = function (data, event, type) {        
        //打开图件详情页面
        var dataList = null;
        //添加浏览记录参数
        var param={ updateType: 1, lookFlag: 1, lookCount: 1, iiid: data.IIID};
        switch (type) {           
            case 1://收藏列表
                dataList = self.favoriteList();                
                break;               
            case 2://浏览记录
                dataList = self.lookList();
                break;
            case 3://下载历史
                dataList = self.downloadList();
                break;
            case 4:
                dataList = self.lastStorage();
                param = { updateType: 1, lookFlag: 1, lookCount: 1, iiid: data.iiid, metaPT: data.productType, metaTitle: data.title, metaAuthor: data.author, metaSourceUrl: data.sourceUrl, metaCreateDate: data.createdDate, metaIndexDate: data.indexedDate };
                break;
            default:
                break;

        }

        //更新浏览记录
        $.ajax({
            url: "/UserBehaviorService/UpdateUserBehavior",
            async: true,
            type: "post",
            data: param,
            success: function (result) {
                if (result) {
                    var removeItems = self.lookList.remove(function (item) { return item.IIID==result.IIID});
                    self.lookList.unshift(result);

                    if (removeItems&&removeItems.length <= 0) {
                        self.lookList.pop();
                    }
                }
            }
        });
        var idsStr = ko.utils.arrayMap(dataList, function (item) {
            return item.IIID?item.IIID:item.iiid;
        });
        idsStr = idsStr.join(",");
        $("#mapId").val(data.IIID ? data.IIID : data.iiid);
        $("#mapData").val(idsStr);
        $("#resultForm").submit();
    };
};
jQuery(document).ready(function() {
	
	//document.onmousewheel = function() {return false;}//屏蔽鼠标滚轮
	document.onselectstart = function() {return false;}//禁止选取、防止复制 
	document.oncopy = function() {return false;}//禁止复制和剪切
	document.onpaste = function () { return false; }//禁止粘贴
    
    currentViewModel = new ViewModel();
    ko.applyBindings(currentViewModel);
    //渲染图表
    getData(true,false,false);
    //获取最近一个月内入库
    getData(false, false, true);
    //获取最新前十入库
    getData(false, true, false);
    //近期收藏列表
    getFavoriteList();
    //近期浏览记录
    getLookList();
    //近期下载列表
    getDownloadList();
});