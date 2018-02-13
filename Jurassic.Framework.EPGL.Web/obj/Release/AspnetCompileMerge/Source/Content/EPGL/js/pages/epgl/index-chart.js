var myChart1, myChart2, myChart3, myChart4 ;
var data = [
                    // {name: '巴音郭楞蒙古自治州',value: Math.round(Math.random()*1000)},
					{name: '和田地区',value: Math.round(Math.random()*1000)},
					{name: '哈密地区',value: Math.round(Math.random()*1000)},
					{name: '阿克苏地区',value: Math.round(Math.random()*1000)},
					{name: '阿勒泰地区',value: Math.round(Math.random()*1000)},
					{name: '喀什地区',value: Math.round(Math.random()*1000)},
					{name: '塔城地区',value: Math.round(Math.random()*1000)},
					{name: '昌吉回族自治州',value: Math.round(Math.random()*1000)},
					// {name: '克孜勒苏柯尔克孜自治州',value: Math.round(Math.random()*1000)},
					{name: '吐鲁番地区',value: Math.round(Math.random()*1000)},
					{name: '伊犁哈萨克自治州',value: Math.round(Math.random()*1000)},
					// {name: '博尔塔拉蒙古自治州',value: Math.round(Math.random()*1000)},
					{name: '乌鲁木齐市',value: Math.round(Math.random()*1000)},
					{name: '克拉玛依市',value: Math.round(Math.random()*1000)},
					{name: '阿拉尔市',value: Math.round(Math.random()*1000)},
					{name: '图木舒克市',value: Math.round(Math.random()*1000)},
					{name: '五家渠市',value: Math.round(Math.random()*1000)},
					{name: '石河子市',value: Math.round(Math.random()*1000)},
					{name: '那曲地区',value: Math.round(Math.random()*1000)},
					{name: '阿里地区',value: Math.round(Math.random()*1000)},
					{name: '日喀则地区',value: Math.round(Math.random()*1000)},
					{name: '林芝地区',value: Math.round(Math.random()*1000)},
					{name: '昌都地区',value: Math.round(Math.random()*1000)},
					{name: '山南地区',value: Math.round(Math.random()*1000)},
            
                ];
var total = 0;

// 路径配置
require.config(
{
    paths :
    {
        echarts: '/Content/EPGL/js/plugins/echarts-2.2.7/build/dist'
    }
}
);

// 使用
require(
    [
        'echarts',
        'echarts/chart/map' // 使用柱状图就加载bar模块，按需加载
    ],
    function (ec) {
    // 基于准备好的dom，初始化echarts图表
    myChart1 = ec.init(document.getElementById('echarts-map-chart1'));
	myChart1.showLoading({  
		text: '正在努力的读取数据中...'    //loading话术  
	});
    
    var mapGeoData = require('echarts/util/mapData/params');
    // 自定义扩展图表类型
    mapGeoData.params.continent = {
        getGeoJson: function (callback) {
            $.getJSON('../../../../../DemoData/geojson/xinjiang.json', callback);
        }
    }
    //console.log(mapGeoData.params.continent);
	myChart1.hideLoading(); 
    
    $.each(data, function(index, entity){
        total += entity.value;
    });

    var option =
    {
        title :
        {
            text : '新疆各地区成果汇总',
            subtext : '2016年',
            //link : 'http://www.palmyou.com/',
            //sublink : 'http://weibo.com/u/2813464944'
        },
        tooltip :
        {
            trigger : 'item',
            formatter : function (params)
            {
				if(params.value == '-') {return params.name;}
                var value = params.value + '（份） （' + (params.value / total * 100).toFixed(2) + '%）';
                return params.seriesName + '<br/>' + params.name + ' : ' + value;
            }
        },
        toolbox :
        {
            show : true,
            orient : 'vertical',
            x : 'right',
            y : 'center',
            feature :
            {
                mark :
                {
                    show : false
                },
                dataView :
                {
                    show : false,
                    readOnly : false
                },
                restore :
                {
                    show : false
                },
                saveAsImage :
                {
                    show : false
                }
            }
        },
        dataRange :
        {
            min : 0,
            max : total,
            text : ['高', '低'],
            splitNumber : 0,
            color : ['orangered', 'yellow', 'lightskyblue']
        },
        series : [
            {
                name : '2016年新疆各地区成果汇总（行政地区统计）',
                type : 'map',
                mapType : 'continent', // 自定义扩展图表类型
				roam: true,
				selectedMode : 'single',
				itemStyle:{
					normal:{label:{show:false}},
					emphasis:{label:{show:true}}
				},
                data : data,
                // // 文本位置修正
                // textFixed :
                // {
                //     '大洋洲' : [265, 0],
                //     '非洲' : [10, -30],
                //     '北美洲' : [20, 0],
                //     '南美洲' : [0, -10],
                //     '亚洲' : [20, -30],
                //     '欧洲' : [200, -10],
                // }
            }
        ]
    };
    
    // 为echarts对象加载数据
    myChart1.setOption(option);
}
);
//$(window).resize(myChart.resize);
