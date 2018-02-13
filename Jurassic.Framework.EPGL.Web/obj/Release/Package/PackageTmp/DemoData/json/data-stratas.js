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
var jsonStratas =
[
    {
        "id" : "01",
        "text" : "新生界Kz",
        "parent" : "#",
        "level" : "1",
        "typeid" : "j",
        "typename" : "界"
    },
    {
        "id" : "0101",
        "text" : "第四系Q",
        "parent" : "01",
        "level" : "2",
        "typeid" : "x",
        "typename" : "系"
    },
    {
        "id" : "010101",
        "text" : "下更新统",
        "parent" : "0101",
        "level" : "3",
        "typeid" : "t",
        "typename" : "统"
    },
    {
        "id" : "01010101",
        "text" : "西域组Q1x",
        "parent" : "010101",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "0102",
        "text" : "第三系R",
        "parent" : "01",
        "level" : "2",
        "typeid" : "x",
        "typename" : "系"
    },
    {
        "id" : "010201",
        "text" : "上新统",
        "parent" : "0102",
        "level" : "3",
        "typeid" : "t",
        "typename" : "统"
    },
    {
        "id" : "01020101",
        "text" : "独山子组N2d",
        "parent" : "010201",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "010202",
        "text" : "中新统",
        "parent" : "0102",
        "level" : "3",
        "typeid" : "t",
        "typename" : "统"
    },
    {
        "id" : "01020201",
        "text" : "塔西河组N1t",
        "parent" : "010202",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "01020202",
        "text" : "沙湾组N1s",
        "parent" : "010202",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "010203",
        "text" : "渐新—始新统",
        "parent" : "0102",
        "level" : "3",
        "typeid" : "t",
        "typename" : "统"
    },
    {
        "id" : "01020301",
        "text" : "安集海河组E2-3a",
        "parent" : "010203",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "0102030101",
        "text" : "E2-3a3",
        "parent" : "01020301",
        "level" : "5",
        "typeid" : "d",
        "typename" : "段"
    },
    {
        "id" : "0102030102",
        "text" : "E2-3a2",
        "parent" : "01020301",
        "level" : "5",
        "typeid" : "d",
        "typename" : "段"
    },
    {
        "id" : "0102030103",
        "text" : "E2-3a1",
        "parent" : "01020301",
        "level" : "5",
        "typeid" : "d",
        "typename" : "段"
    },
    {
        "id" : "01020302",
        "text" : "乌伦古河组E2-3w",
        "parent" : "010203",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "010204",
        "text" : "古新统",
        "parent" : "0102",
        "level" : "3",
        "typeid" : "t",
        "typename" : "统"
    },
    {
        "id" : "01020401",
        "text" : "紫泥泉子组E1-2z",
        "parent" : "010204",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "0102040101",
        "text" : "E1-2z3",
        "parent" : "01020401",
        "level" : "5",
        "typeid" : "d",
        "typename" : "段"
    },
    {
        "id" : "0102040102",
        "text" : "E1-2z2",
        "parent" : "01020401",
        "level" : "5",
        "typeid" : "d",
        "typename" : "段"
    },
    {
        "id" : "0102040103",
        "text" : "E1-2z1",
        "parent" : "01020401",
        "level" : "5",
        "typeid" : "d",
        "typename" : "段"
    },
    {
        "id" : "02",
        "text" : "中生界Mz",
        "parent" : "#",
        "level" : "1",
        "typeid" : "j",
        "typename" : "界"
    },
    {
        "id" : "0201",
        "text" : "白垩系K",
        "parent" : "02",
        "level" : "2",
        "typeid" : "x",
        "typename" : "系"
    },
    {
        "id" : "020101",
        "text" : "上统K2",
        "parent" : "0201",
        "level" : "3",
        "typeid" : "t",
        "typename" : "统"
    },
    {
        "id" : "02010101",
        "text" : "东沟组K2d",
        "parent" : "020101",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "02010102",
        "text" : "红砾山组K2h",
        "parent" : "020101",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "02010103",
        "text" : "艾里克湖组K2a",
        "parent" : "020101",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "020102",
        "text" : "下统K1",
        "parent" : "0201",
        "level" : "3",
        "typeid" : "t",
        "typename" : "统"
    },
    {
        "id" : "02010201",
        "text" : "连木沁组K1l",
        "parent" : "020102",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "02010202",
        "text" : "胜金口组K1s",
        "parent" : "020102",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "02010203",
        "text" : "呼图壁河组K1h",
        "parent" : "020102",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "0201020301",
        "text" : "K1h2",
        "parent" : "02010203",
        "level" : "5",
        "typeid" : "d",
        "typename" : "段"
    },
    {
        "id" : "0201020302",
        "text" : "K1h1",
        "parent" : "02010203",
        "level" : "5",
        "typeid" : "d",
        "typename" : "段"
    },
    {
        "id" : "02010204",
        "text" : "清水河组K1q",
        "parent" : "020102",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "0201020401",
        "text" : "K1q2",
        "parent" : "02010204",
        "level" : "5",
        "typeid" : "d",
        "typename" : "段"
    },
    {
        "id" : "0201020402",
        "text" : "K1q1",
        "parent" : "02010204",
        "level" : "5",
        "typeid" : "d",
        "typename" : "段"
    },
    {
        "id" : "0202",
        "text" : "侏罗系J",
        "parent" : "02",
        "level" : "2",
        "typeid" : "x",
        "typename" : "系"
    },
    {
        "id" : "020201",
        "text" : "上统J3",
        "parent" : "0202",
        "level" : "3",
        "typeid" : "t",
        "typename" : "统"
    },
    {
        "id" : "02020101",
        "text" : "喀拉扎组J3k",
        "parent" : "020201",
        "level" : "4",
        "typeid" : "z",
        "typename" : "组"
    },
    {
        "id" : "0202010101",
        "text" : "J3k2",
        "parent" : "02020101",
        "level" : "5",
        "typeid" : "d",
        "typename" : "段"
    },
    {
        "id" : "0202010102",
        "text" : "J3k1",
        "parent" : "02020101",
        "level" : "5",
        "typeid" : "d",
        "typename" : "段"
    }
]
;