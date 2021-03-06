﻿//钻井表数据
var drillingData = [];
var drillingColumnNames = [
    "井号",
    "纵坐标X",
    "横座标Y",
    "井型",
    "开钻日期",
    "完钻日期",
    "完井日期",
    "建成日期",
    "开窗侧钻日期",
    "完钻井深",
    "油补距 ",
    "套补距 ",
    "地面海拔",
    "气层顶深",
    "气层底深",
    "油层顶深",
    "油层底深",
    "水层顶深",
    "人工井底",
    "井底位移",
    "位移方位",
    "水泥上返深度",
    "标准接箍深度",
    "固井质量",
    "完井方法",
    "目前射孔井段顶深",
    "目前射孔井段底深",
    "目前射开油层顶深",
    "目前射开油层底深",
    "目前解释厚度",
    "目前有效厚度",
    "层数"
];
//钻井表头
var drillingColumns = [
    { index: "wellNumber", name: "井号" },
    { index: "", name: "纵坐标X" },
    { index: "", name: "横坐标Y" },
    { index: "", name: "井型" },
    { index: "", name: "开钻日期", hidden: true },
    { index: "", name: "完钻日期" },
    { index: "", name: "完井日期" },
    { index: "", name: "完井方法" },
    { index: "", name: "建成日期", hidden: true },
    { index: "", name: "开窗侧钻日期", hidden: true },
    { index: "", name: "完钻井深" },
    { index: "", name: "油补距", hidden: true },
    { index: "", name: "套补距", hidden: true },
    { index: "", name: "地面海拔" },
    { index: "", name: "气层顶深", hidden: true },
    { index: "", name: "气层底深", hidden: true },
    { index: "", name: "油层顶深", hidden: true },
    { index: "", name: "油层底深", hidden: true },
    { index: "", name: "水层顶深", hidden: true },
    { index: "", name: "人工井底", hidden: true },
    { index: "", name: "井底位移", hidden: true },
    { index: "", name: "位移方位", hidden: true },
    { index: "", name: "水泥上返深度", hidden: true },
    { index: "", name: "标准接箍深度", hidden: true },
    { index: "", name: "固井质量", hidden: true },
    { index: "", name: "目前射孔井段顶深", hidden: true },
    { index: "", name: "目前射孔井段底深", hidden: true },
    { index: "", name: "目前射开油层顶深", hidden: true },
    { index: "", name: "目前射开油层底深", hidden: true },
    { index: "", name: "目前解释厚度", hidden: true },
    { index: "", name: "目前有效厚度", hidden: true },
    { index: "", name: "层数", hidden: true }
];
//采油井
//产能表数据
var capacityData = [];
//产能表头
var capacityColumns = [
    { index: "", name: "井号" },
    { index: "", name: "层位" },
    { index: "", name: "区块" },
    { index: "", name: "年月" },
    { index: "", name: "采油方式" },
    { index: "", name: "投产年度" },
    { index: "", name: "生产天数" },
    { index: "", name: "油嘴", hidden: true },
    { index: "", name: "泵径", hidden: true },
    { index: "", name: "排量", hidden: true },
    { index: "", name: "冲程", hidden: true },
    { index: "", name: "冲数", hidden: true },
    { index: "", name: "油压", hidden: true },
    { index: "", name: "套压", hidden: true },
    { index: "", name: "回压", hidden: true },
    { index: "", name: "流压", hidden: true },
    { index: "", name: "静压", hidden: true },
    { index: "", name: "动液面" , hidden: true},
    { index: "", name: "静液面", hidden: true },
    { index: "", name: "泵效" },
    { index: "", name: "泵深" },
    { index: "", name: "月产油量" },
    { index: "", name: "月扣油量", hidden: true },
    { index: "", name: "月产水量" },
    { index: "", name: "月产气量" },
    { index: "", name: "累积产油量" },
    { index: "", name: "累积产水量" },
    { index: "", name: "累积产气量" },
    { index: "", name: "累积生产天数" },
    { index: "", name: "探井底", hidden: true },
    { index: "", name: "含砂量", hidden: true }
];
//注水井
//产能表数据
var capacityWaterData = [];
//产能表头
var capacityWaterColumns = [
    { index: "", name: "井号" },
    { index: "", name: "层位名称" },
    { index: "", name: "区块" },
    { index: "", name: "年月" },
    { index: "", name: "采油方式" },
    { index: "", name: "投产年度" },
    { index: "", name: "生产天数" },
    { index: "", name: "干线压力 ", hidden: true },
    { index: "", name: "油压" },
    { index: "", name: "套压" },
    { index: "", name: "同心管压", hidden: true },
    { index: "", name: "静压", hidden: true },
    { index: "", name: "井口含铁", hidden: true },
    { index: "", name: "井口杂质", hidden: true },
    { index: "", name: "日配注水量" },
    { index: "", name: "配注层段数", hidden: true },
    { index: "", name: "月注水量" },
    { index: "", name: "月增减量", hidden: true },
    { index: "", name: "累积注水量" },
    { index: "", name: "累注水天数" },
    { index: "", name: "探井底", hidden: true }
];
//储量表数据
var reservesData = [];
//储量表头
var reservesColumns = [
    { index: "", name: "计算单元名称" },
    { index: "", name: "统计年度" },
    { index: "", name: "上报年度" },
    { index: "", name: "油田名称" },
    { index: "", name: "发现年度", hidden: true },
    { index: "", name: "二级构造单元", hidden: true },
    { index: "", name: "圈闭类型", hidden: true },
    { index: "", name: "圈闭面积", hidden: true },
    { index: "", name: "闭合幅度", hidden: true },
    { index: "", name: "最低圈闭线海拔", hidden: true },
    { index: "", name: "探井总数", hidden: true },
    { index: "", name: "探井总进尺", hidden: true },
    { index: "", name: "开发井井数", hidden: true },
    { index: "", name: "获工业油气流井数", hidden: true },
    { index: "", name: "区块名称", hidden: true },
    { index: "", name: "井区块", hidden: true },
    { index: "", name: "层位名称", hidden: true },
    { index: "", name: "储量类型", hidden: true },
    { index: "", name: "储量类别" },
    { index: "", name: "储量来源", hidden: true },
    { index: "", name: "净增面积" },
    { index: "", name: "计算面积" },
    { index: "", name: "区块叠合面积" },
    { index: "", name: "区块间叠合面积" },
    { index: "", name: "有效厚度" },
    { index: "", name: "有效孔隙度" },
    { index: "", name: "原始含油饱和度" },
    { index: "", name: "地面原油密度" },
    { index: "", name: "原始原油体积系数", hidden: true },
    { index: "", name: "地质储量计算方法", hidden: true },
    { index: "", name: "原始溶解气油比", hidden: true },
    { index: "", name: "原油地质储量重量" },
    { index: "", name: "原油地质储量体积", hidden: true },
    { index: "", name: "原油技术采收率" },
    { index: "", name: "原油技术可采储量重量" },
    { index: "", name: "原油技术可采储量体积", hidden: true },
    { index: "", name: "原油经济可采储量重量" },
    { index: "", name: "原油经济可采储量体积", hidden: true },
    { index: "", name: "溶解气地质储量" },
    { index: "", name: "溶解气技术采收率" },
    { index: "", name: "溶解气技术可采储量" },
    { index: "", name: "溶解气经济可采储量", hidden: true },
    { index: "", name: "原油技术可采储量计算方法" },
    { index: "", name: "原油经济可采储量评价方法", hidden: true },
    { index: "", name: "地层总厚度", hidden: true },
    { index: "", name: "储层厚度", hidden: true },
    { index: "", name: "油层厚度", hidden: true },
    { index: "", name: "最大单层有效厚度", hidden: true },
    { index: "", name: "储层岩性", hidden: true },
    { index: "", name: "储集类型", hidden: true },
    { index: "", name: "孔隙度最大值", hidden: true },
    { index: "", name: "孔隙度最小值", hidden: true },
    { index: "", name: "平均孔隙度", hidden: true },
    { index: "", name: "裂缝孔隙度平均值", hidden: true },
    { index: "", name: "洞穴孔隙度平均值", hidden: true },
    { index: "", name: "平均空气渗透率", hidden: true },
    { index: "", name: "空气渗透率最大值", hidden: true },
    { index: "", name: "空气渗透率最小值", hidden: true },
    { index: "", name: "有效渗透率", hidden: true },
    { index: "", name: "裂缝渗透率", hidden: true },
    { index: "", name: "储层渗透率分类", hidden: true },
    { index: "", name: "沉积相", hidden: true },
    { index: "", name: "沉积亚相", hidden: true },
    { index: "", name: "泥质含量", hidden: true },
    { index: "", name: "碳酸盐含量", hidden: true },
    { index: "", name: "胶结类型", hidden: true },
    { index: "", name: "储层非均质程度", hidden: true },
    { index: "", name: "油藏类型", hidden: true },
    { index: "", name: "原油类型", hidden: true },
    { index: "", name: "驱动类型", hidden: true },
    { index: "", name: "边底水情况", hidden: true },
    { index: "", name: "油藏高点埋藏深度", hidden: true },
    { index: "", name: "油藏中部埋藏深度", hidden: true },
    { index: "", name: "油藏中部海拔", hidden: true },
    { index: "", name: "含油高度", hidden: true },
    { index: "", name: "油水界面海拔", hidden: true },
    { index: "", name: "原始地层压力", hidden: true },
    { index: "", name: "压力系数", hidden: true },
    { index: "", name: "地层压力梯度", hidden: true },
    { index: "", name: "饱和压力", hidden: true },
    { index: "", name: "地层温度", hidden: true },
    { index: "", name: "地温梯度", hidden: true },
    { index: "", name: "原油性质", hidden: true },
    { index: "", name: "地层原油密度", hidden: true },
    { index: "", name: "地层原油粘度", hidden: true },
    { index: "", name: "原油凝固点", hidden: true },
    { index: "", name: "原油沥青质含量", hidden: true },
    { index: "", name: "原油胶质含量", hidden: true },
    { index: "", name: "原油含蜡量", hidden: true },
    { index: "", name: "原油含硫量", hidden: true },
    { index: "", name: "溶解气相对密度", hidden: true },
    { index: "", name: "溶解气硫化氢含量", hidden: true },
    { index: "", name: "溶解气甲烷含量", hidden: true },
    { index: "", name: "地层水密度", hidden: true },
    { index: "", name: "地层水粘度", hidden: true },
    { index: "", name: "氯离子含量", hidden: true },
    { index: "", name: "地层水水型", hidden: true },
    { index: "", name: "地层水矿化度", hidden: true },
    { index: "", name: "地层水电阻率", hidden: true },
    { index: "", name: "试油井号", hidden: true },
    { index: "", name: "合资合作单位", hidden: true },
    { index: "", name: "合作方式", hidden: true },
    { index: "", name: "合作现状", hidden: true },
    { index: "", name: "合作类型", hidden: true }
];
