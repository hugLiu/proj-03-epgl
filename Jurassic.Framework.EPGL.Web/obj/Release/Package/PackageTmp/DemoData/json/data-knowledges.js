/*
* json数据 - 导航菜单
* 结构：
*		id			菜单项标识
*		label		菜单名/标签
*		parent		父节点标识		#为顶级
*		href		菜单链接		#为无链接
*		iconClass	菜单项样式
*
*/

//地质目标
var jsonKLCatalog =
[
    {
        "topicid" : "01",
        "topictitle" : "开发规划",
        "parent" : "#",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
    },
    {
        "topicid" : "0101",
        "topictitle" : "“X五”油气勘探与生产业务规划",
        "parent" : "01",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
    },
    {
        "topicid" : "010101",
        "topictitle" : "盆地概况分析",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
    },
    {
        "topicid" : "01010101",
        "topictitle" : "勘探历程分析",
        "parent" : "010101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "gdb",
        "restypeid" : "yqktcgt",
        "restypename" : "油气勘探成果图"
    },
    {
        "topicid" : "01010101",
        "topictitle" : "勘探历程分析",
        "parent" : "010101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "gdb",
        "restypeid" : "dzktbst",
        "restypename" : "地震勘探部署图"
    },
    {
        "topicid" : "01010101",
        "topictitle" : "勘探历程分析",
        "parent" : "010101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "gdb",
        "restypeid" : "yqktbst",
        "restypename" : "油气勘探部署图"
    },
    {
        "topicid" : "01010101",
        "topictitle" : "勘探历程分析",
        "parent" : "010101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "gdb",
        "restypeid" : "yqtfbt",
        "restypename" : "油气田分布图"
    },
    {
        "topicid" : "01010102",
        "topictitle" : "矿权分析",
        "parent" : "010101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "gdb",
        "restypeid" : "yxkqfbt",
        "restypename" : "有效矿权分布图"
    },
    {
        "topicid" : "01010103",
        "topictitle" : "沉积分析",
        "parent" : "010101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "gdb",
        "restypeid" : "cjxtfbt",
        "restypename" : "沉积体系分布图"
    },
    {
        "topicid" : "01010104",
        "topictitle" : "构造分析",
        "parent" : "010101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "gdb",
        "restypeid" : "gzdyt",
        "restypename" : "构造单元图"
    },
    {
        "topicid" : "01010104",
        "topictitle" : "构造分析",
        "parent" : "010101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "gdb",
        "restypeid" : "pmt",
        "restypename" : "剖面图"
    },
    {
        "topicid" : "01010105",
        "topictitle" : "地层分析",
        "parent" : "010101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "gdb",
        "restypeid" : "zhzzt",
        "restypename" : "综合柱状图"
    },
    {
        "topicid" : "010102",
        "topictitle" : "上一期发展现状及主要成果",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "excel",
        "restypeid" : "pdktxmzyjclxlb",
        "restypename" : "盆地勘探项目资源及储量序列表"
    },
    {
        "topicid" : "010102",
        "topictitle" : "上一期发展现状及主要成果",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "excel",
        "restypeid" : "sjclhzb",
        "restypename" : "三级储量汇总表"
    },
    {
        "topicid" : "010102",
        "topictitle" : "上一期发展现状及主要成果",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "excel",
        "restypeid" : "gdtmsyyzqktjb",
        "restypename" : "滚动探明石油优质区块统计表"
    },
    {
        "topicid" : "010102",
        "topictitle" : "上一期发展现状及主要成果",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "excel",
        "restypeid" : "xyqlszyclcsb",
        "restypename" : "下一期落实主要储量参数表"
    },
    {
        "topicid" : "010103",
        "topictitle" : "下一期发展规划",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "excel",
        "restypeid" : "yqktzdlyhffab",
        "restypename" : "油气勘探重点领域划分方案表"
    },
    {
        "topicid" : "010103",
        "topictitle" : "下一期发展规划",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "doc",
        "restypeid" : "yykffa",
        "restypename" : "原油开发方案"
    },
    {
        "topicid" : "010103",
        "topictitle" : "下一期发展规划",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "doc",
        "restypeid" : "trqkffa",
        "restypename" : "天然气开发方案"
    },
    {
        "topicid" : "010104",
        "topictitle" : "投资与效益分析",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "excel",
        "restypeid" : "ytypjcb",
        "restypename" : "预探与评价成本"
    },
    {
        "topicid" : "010104",
        "topictitle" : "投资与效益分析",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "excel",
        "restypeid" : "yqcnjscb",
        "restypename" : "油气产能建设成本"
    },
    {
        "topicid" : "010104",
        "topictitle" : "投资与效益分析",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "excel",
        "restypeid" : "ytypjgzl",
        "restypename" : "预探与评价工作量"
    },
    {
        "topicid" : "010104",
        "topictitle" : "投资与效益分析",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "excel",
        "restypeid" : "yqcnjsgzl",
        "restypename" : "油气产能建设工作量"
    },
    {
        "topicid" : "010104",
        "topictitle" : "投资与效益分析",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "excel",
        "restypeid" : "ghfatzgsb",
        "restypename" : "规划方案投资估算表"
    },
    {
        "topicid" : "010104",
        "topictitle" : "投资与效益分析",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "excel",
        "restypeid" : "ghfaczcbgsb",
        "restypename" : "规划方案操作成本估算表"
    },
    {
        "topicid" : "010104",
        "topictitle" : "投资与效益分析",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "excel",
        "restypeid" : "ghqbtyjxclgmlrdb",
        "restypename" : "规划期不同油价下产量规模、利润对比"
    },
    {
        "topicid" : "010105",
        "topictitle" : "十年远景规划",
        "parent" : "0101",
        "targtypeid" : "pd",
        "targtypename" : "盆地",
        "ressort" : "doc",
        "restypeid" : "syythtrqktclyjzb",
        "restypename" : "石油预探和天然气勘探储量远景指标"
    }
]
;