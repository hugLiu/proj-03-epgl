/*
 * json数据 - 目标
 * 结构：
 *		id			菜单项标识
 *		label		菜单名/标签
 *		parent		父节点标识		#为顶级
 *		state		节点状态
 *		gdb			gdb文件
 *		lpszID		图层编号
 *
 */
var jsonTragets = [
    {
        "id": "01",
        "text": "准噶尔盆地",
        "parent": "#",
        "level": "1",
        "typeid": "pd",
        "typename": "盆地",
        "dir": "盆地级",
        "state": { opened: true }
    },
    {
        "id": "0101",
        "text": "东部",
        "parent": "01",
        "level": "2",
        "typeid": "qd",
        "typename": "区带",
        "dir": "区带级"
    },
    {
        "id": "010101",
        "text": "三台",
        "parent": "0101",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01010101",
        "text": "北32井区块C2b",
        "parent": "010101",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010102",
        "text": "北4井区块P3wt",
        "parent": "010101",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010103",
        "text": "台3井断块J3q",
        "parent": "010101",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010104",
        "text": "台3井断块T2k",
        "parent": "010101",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010105",
        "text": "台6井区块J3q",
        "parent": "010101",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010106",
        "text": "台13井断块J3q",
        "parent": "010101",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010107",
        "text": "台13井断块J1b",
        "parent": "010101",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010108",
        "text": "台14井断块J1b",
        "parent": "010101",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010109",
        "text": "台20井区块J3q",
        "parent": "010101",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010110",
        "text": "台28井区块J2t2",
        "parent": "010101",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010111",
        "text": "北83井区块P3wt",
        "parent": "010101",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010112",
        "text": "五梁山J2t",
        "parent": "010101",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010102",
        "text": "五彩湾",
        "parent": "0101",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "010103",
        "text": "北三台",
        "parent": "0101",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01010301",
        "text": "北16井断鼻T1j",
        "parent": "010103",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010302",
        "text": "北16井断鼻P3wt1",
        "parent": "010103",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010303",
        "text": "北16井断鼻P3wt2",
        "parent": "010103",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010304",
        "text": "北211井区块P3wt11",
        "parent": "010103",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010305",
        "text": "北307井区块P3wt1",
        "parent": "010103",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010306",
        "text": "北31井断鼻P3wt1",
        "parent": "010103",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010307",
        "text": "北75井断块P3wt1",
        "parent": "010103",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010308",
        "text": "北90井区块P3wt1",
        "parent": "010103",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010309",
        "text": "西泉1井P3wt",
        "parent": "010103",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010104",
        "text": "彩南",
        "parent": "0101",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01010401",
        "text": "彩017井区块J2-3sh",
        "parent": "010104",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010402",
        "text": "彩10井区块J2x",
        "parent": "010104",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010403",
        "text": "彩10井区块J1s",
        "parent": "010104",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010404",
        "text": "彩133井区块J2x2",
        "parent": "010104",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010405",
        "text": "彩135井区块J1s",
        "parent": "010104",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010406",
        "text": "彩31井区块J2x",
        "parent": "010104",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010407",
        "text": "彩43井区块J1s",
        "parent": "010104",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010408",
        "text": "彩8井区块J1s",
        "parent": "010104",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010409",
        "text": "彩9井区块J2x",
        "parent": "010104",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010410",
        "text": "彩9井区块J1s",
        "parent": "010104",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010411",
        "text": "彩参2井区块J2x",
        "parent": "010104",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010412",
        "text": "彩参2井区块J1s",
        "parent": "010104",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010413",
        "text": "彩508断鼻J1s2",
        "parent": "010104",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010105",
        "text": "昌吉",
        "parent": "0101",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01010501",
        "text": "吉7井区块P3wt",
        "parent": "010105",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010106",
        "text": "沙北",
        "parent": "0101",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01010601",
        "text": "沙19井区块J2x",
        "parent": "010106",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010602",
        "text": "沙20井区块J2x1",
        "parent": "010106",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010107",
        "text": "沙南",
        "parent": "0101",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01010701",
        "text": "沙丘3井区块T1j",
        "parent": "010107",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010702",
        "text": "沙丘3井区块P3wt",
        "parent": "010107",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010703",
        "text": "沙丘5井区块T1j",
        "parent": "010107",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010704",
        "text": "沙丘5井区块P3wt",
        "parent": "010107",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010705",
        "text": "沙102井区块P3wt1",
        "parent": "010107",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010706",
        "text": "沙112井区块P3wt",
        "parent": "010107",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010707",
        "text": "沙114井区块P3wt",
        "parent": "010107",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010708",
        "text": "沙109井区P3wt",
        "parent": "010107",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010108",
        "text": "火烧山",
        "parent": "0101",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01010801",
        "text": "火H1P2p",
        "parent": "010108",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010802",
        "text": "火H2P2p",
        "parent": "010108",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010803",
        "text": "火H3P2p",
        "parent": "010108",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010804",
        "text": "火H41P2p",
        "parent": "010108",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010805",
        "text": "火H42P2p",
        "parent": "010108",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010806",
        "text": "火8井区块P2p",
        "parent": "010108",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010807",
        "text": "火南P2p",
        "parent": "010108",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010808",
        "text": "沙东1井区块P2p",
        "parent": "010108",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01010809",
        "text": "沙东2井区块P2p",
        "parent": "010108",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010109",
        "text": "甘河",
        "parent": "0101",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01010901",
        "text": "小泉沟J1s",
        "parent": "010109",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "0102",
        "text": "腹部",
        "parent": "01",
        "level": "2",
        "typeid": "qd",
        "typename": "区带",
        "dir": "区带级"
    },
    {
        "id": "010201",
        "text": "克拉美丽",
        "parent": "0102",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01020101",
        "text": "滴西12井区块K1h",
        "parent": "010201",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010202",
        "text": "滴水泉",
        "parent": "0102",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01020201",
        "text": "滴2井区块J1b",
        "parent": "010202",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020202",
        "text": "滴12井区块J1b",
        "parent": "010202",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020203",
        "text": "滴20井区块J1b1",
        "parent": "010202",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010203",
        "text": "石南",
        "parent": "0102",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01020301",
        "text": "石南4井区块J2t",
        "parent": "010203",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020302",
        "text": "基002井区块J1s2",
        "parent": "010203",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020303",
        "text": "石南7井区块J2x",
        "parent": "010203",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020304",
        "text": "石南10井区块J2x",
        "parent": "010203",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020305",
        "text": "石南21井区块J2t1",
        "parent": "010203",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020306",
        "text": "石南21井区块J2t2",
        "parent": "010203",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020307",
        "text": "石南31井区块K1q11",
        "parent": "010203",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020308",
        "text": "石204井区块J2x4",
        "parent": "010203",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010204",
        "text": "石西",
        "parent": "0102",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01020401",
        "text": "石西10井区块K1q12",
        "parent": "010204",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020402",
        "text": "石西10井区块J1s21",
        "parent": "010204",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020403",
        "text": "石西1井区块C",
        "parent": "010204",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020404",
        "text": "石西2井区块J2x",
        "parent": "010204",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020405",
        "text": "石西2井区块J1s2",
        "parent": "010204",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020406",
        "text": "石014井区块J2x",
        "parent": "010204",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020407",
        "text": "石002井区块K1q1",
        "parent": "010204",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020408",
        "text": "石002井区块J1s",
        "parent": "010204",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020409",
        "text": "石西7井区块J1s2",
        "parent": "010204",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020410",
        "text": "陆南1井区块J1s2",
        "parent": "010204",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020411",
        "text": "石南44井区块K1q1",
        "parent": "010204",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010205",
        "text": "莫北",
        "parent": "0102",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01020501",
        "text": "莫116井区块J1s21",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020502",
        "text": "莫116井区块J1s22",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020503",
        "text": "莫北2井区块J1s21",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020504",
        "text": "莫北2井区块J1s22",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020505",
        "text": "莫005井区块J1s21",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020506",
        "text": "莫005井区块J1s22",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020507",
        "text": "莫8井区块J1s2",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020508",
        "text": "莫11井区块J1s22",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020509",
        "text": "莫北9井区块J1s21",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020510",
        "text": "莫北9井区块J1s22",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020511",
        "text": "莫北10井区块J1s",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020512",
        "text": "莫北11井区块J1s22",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020513",
        "text": "莫109井区块J1s21",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020514",
        "text": "莫115井区块J1s2",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020515",
        "text": "莫118井区块J1s22",
        "parent": "010205",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010206",
        "text": "莫索湾",
        "parent": "0102",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01020601",
        "text": "盆5井区块J1s2",
        "parent": "010206",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010207",
        "text": "陆梁",
        "parent": "0102",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01020701",
        "text": "陆9井区块J2t",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020702",
        "text": "陆9井区块J2x1",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020703",
        "text": "陆9井区块J2x4",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020704",
        "text": "陆9井区块K1h1s",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020705",
        "text": "陆9井区块K1h1x",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020706",
        "text": "陆9井区块K1h23-5",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020707",
        "text": "陆9井区块K1h26-7",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020708",
        "text": "陆11井区块J2x1",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020709",
        "text": "陆11井区块J2x4",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020710",
        "text": "陆12井区块J2x4",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020711",
        "text": "陆13井区块J2x4",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020712",
        "text": "陆15井区块J2t",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020713",
        "text": "陆152井区块J2t",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020714",
        "text": "陆22井区块K1h",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020715",
        "text": "陆22井区块J2t",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020716",
        "text": "陆22井区块J2x",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020717",
        "text": "夏盐11井区块J1s21",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01020718",
        "text": "陆151井区J2t",
        "parent": "010207",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "0103",
        "text": "南缘",
        "parent": "01",
        "level": "2",
        "typeid": "qd",
        "typename": "区带",
        "dir": "区带级"
    },
    {
        "id": "010301",
        "text": "卡因迪克",
        "parent": "0103",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01030101",
        "text": "卡6井区块E2-3a",
        "parent": "010301",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01030102",
        "text": "卡6井区块E1-2z",
        "parent": "010301",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01030103",
        "text": "卡6井区块J3q",
        "parent": "010301",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010302",
        "text": "呼图壁",
        "parent": "0103",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "010303",
        "text": "独山子",
        "parent": "0103",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01030301",
        "text": "独山子N1s",
        "parent": "010304",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010304",
        "text": "玛河",
        "parent": "0103",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "010305",
        "text": "齐古",
        "parent": "0103",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01030501",
        "text": "齐古J2t",
        "parent": "010305",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "0104",
        "text": "西北缘",
        "parent": "01",
        "level": "2",
        "typeid": "qd",
        "typename": "区带",
        "dir": "区带级"
    },
    {
        "id": "010401",
        "text": "乌尔禾",
        "parent": "0104",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01040101",
        "text": "乌5井区块T2k2",
        "parent": "010401",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040102",
        "text": "乌5井区块T2k1",
        "parent": "010401",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040103",
        "text": "乌5井区块T1b",
        "parent": "010401",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040104",
        "text": "乌16井区块T2k1",
        "parent": "010401",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040105",
        "text": "乌16井区块T2k21",
        "parent": "010401",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040106",
        "text": "乌33井区块T2k2",
        "parent": "010401",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040107",
        "text": "乌33井区块T2k1",
        "parent": "010401",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040108",
        "text": "乌33井区块T2k13",
        "parent": "010401",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040109",
        "text": "乌33井区块T1b",
        "parent": "010401",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040110",
        "text": "乌36井区块T2k1",
        "parent": "010401",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040111",
        "text": "乌36井区块T1b",
        "parent": "010401",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402",
        "text": "克拉玛依",
        "parent": "0104",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "010402001",
        "text": "一东区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402002",
        "text": "一东区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402003",
        "text": "一中区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402004",
        "text": "一中区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402005",
        "text": "一西区T2k",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402006",
        "text": "一区C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402007",
        "text": "克浅10井区块J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402008",
        "text": "克浅10井区块J2x",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402009",
        "text": "克浅109井区块J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402010",
        "text": "二东区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402011",
        "text": "二东区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402012",
        "text": "二中区J1b",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402013",
        "text": "二中区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402014",
        "text": "二西1区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402015",
        "text": "二西2区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402016",
        "text": "二西3区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402017",
        "text": "二中西区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402018",
        "text": "二区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402019",
        "text": "二区C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402020",
        "text": "克92井区块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402021",
        "text": "三1区J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402022",
        "text": "三1区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402023",
        "text": "三1区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402024",
        "text": "三2区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402025",
        "text": "三2区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402026",
        "text": "三3区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402027",
        "text": "三3区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402028",
        "text": "三2+3区C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402029",
        "text": "三4区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402030",
        "text": "三4区C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402031",
        "text": "古83井区块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402032",
        "text": "古22井区块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402033",
        "text": "古89井区块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402034",
        "text": "四1南区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402035",
        "text": "四1南区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402036",
        "text": "四1北区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402037",
        "text": "四1北区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402038",
        "text": "四2区J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402039",
        "text": "四2区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402040",
        "text": "四2区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402041",
        "text": "四2区C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402042",
        "text": "金003井区块T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402043",
        "text": "123井断块T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402044",
        "text": "123井断块T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402045",
        "text": "五1区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402046",
        "text": "五1区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402047",
        "text": "五2东区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402048",
        "text": "五2东区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402049",
        "text": "五2西区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402050",
        "text": "五2西区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402051",
        "text": "五3东P3w",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402052",
        "text": "五3中区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402053",
        "text": "五3区J1b",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402054",
        "text": "五3区P1j",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402055",
        "text": "五区南P3w",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402056",
        "text": "克007井区块P1j",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402057",
        "text": "克79井区块P3w",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402058",
        "text": "克80井区块P1f",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402059",
        "text": "克82井区块P3w",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402060",
        "text": "克113井区块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402061",
        "text": "克132井区块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402062",
        "text": "574井区块P1j",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402063",
        "text": "93850井区块K1q1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402064",
        "text": "六区C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402065",
        "text": "六1区J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402066",
        "text": "六2区J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402067",
        "text": "六3区J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402068",
        "text": "六东区T2k",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402069",
        "text": "六中区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402070",
        "text": "六中区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402071",
        "text": "六浅1井区块J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402072",
        "text": "七东1区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402073",
        "text": "七东1区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402074",
        "text": "七东1区C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402075",
        "text": "七东2区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402076",
        "text": "七东2区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402077",
        "text": "七中东区J1s",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402078",
        "text": "七中东区J1b",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402079",
        "text": "七中东区T3b",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402080",
        "text": "七中东区C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402081",
        "text": "七中区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402082",
        "text": "七中区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402083",
        "text": "七西区J1b",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402084",
        "text": "七西区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402085",
        "text": "七西区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402086",
        "text": "七西区C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402087",
        "text": "八区T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402088",
        "text": "八区P2w",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402089",
        "text": "八区P2w1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402090",
        "text": "八区P1j",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402091",
        "text": "八1区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402092",
        "text": "八2区T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402093",
        "text": "446井区块T3b",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402094",
        "text": "530井区块J1b1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402095",
        "text": "530井区块J1b4+5",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402096",
        "text": "530井区块T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402097",
        "text": "530井区块P2w",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402098",
        "text": "531井区块T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402099",
        "text": "546井区块T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402100",
        "text": "552井区块J1b",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402101",
        "text": "585井区块P1j",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402102",
        "text": "九区南T2k",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402103",
        "text": "九1区J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402104",
        "text": "九2区J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402105",
        "text": "九3区J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402106",
        "text": "九4区J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402107",
        "text": "九5区J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402108",
        "text": "九6区J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402109",
        "text": "九7区J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402110",
        "text": "九8区J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402111",
        "text": "九9区J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402112",
        "text": "九9区J1b",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402113",
        "text": "九1-九5区J1b",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402114",
        "text": "九1—九5区J1b",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402115",
        "text": "九浅41井区块J3q",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402116",
        "text": "检230井区块J3q3",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402117",
        "text": "九浅7井断块J1b",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402118",
        "text": "九浅11井区块J1b",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402119",
        "text": "古3井区块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402120",
        "text": "白8井区块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402121",
        "text": "白9井区块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402122",
        "text": "古16井区块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402123",
        "text": "检451井区块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402124",
        "text": "检451井区块",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402125",
        "text": "246井断块J1b",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402126",
        "text": "246井断块T2k",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402127",
        "text": "246井断块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402128",
        "text": "白25井区块T2k15",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402129",
        "text": "白25井区块",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402130",
        "text": "白25井区块P3w",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402131",
        "text": "白25井区块P3w1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402132",
        "text": "白25井区块P1f2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402133",
        "text": "288井断块T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402134",
        "text": "288井区块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402135",
        "text": "417井断块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402136",
        "text": "403井断块T2k",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402137",
        "text": "403井断块C",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402138",
        "text": "黑油山T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402139",
        "text": "黑油山T2k1",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402140",
        "text": "六中区(稀油)T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010402141",
        "text": "六中区(稠油)T2k2",
        "parent": "010402",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010403",
        "text": "夏子街",
        "parent": "0104",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01040301",
        "text": "夏9井区块J1b",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040302",
        "text": "夏9井区块T2k1",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040303",
        "text": "夏9井区块T1b",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040304",
        "text": "夏013井区块J1b",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040305",
        "text": "夏016井区块J1b5",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040306",
        "text": "夏18-36井区块T2k1",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040307",
        "text": "夏18-36井区块T1b",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040308",
        "text": "夏26井区块T2k2",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040309",
        "text": "夏27井区块T2k2",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040310",
        "text": "夏29井区块T2k2",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040311",
        "text": "夏35井区块T2k2",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040312",
        "text": "夏48井区块T2k13",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040313",
        "text": "夏50井区块T2k1",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040314",
        "text": "夏50井区块T2k24",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040315",
        "text": "夏52井区块T1b",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040316",
        "text": "夏54井区块T1b",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040317",
        "text": "夏69井区块P1f",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040318",
        "text": "夏72井区块P1f",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040319",
        "text": "夏检302井区块T1b1",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040320",
        "text": "夏检302井区块T1b2",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040321",
        "text": "夏检302井区块T2k25",
        "parent": "010403",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010404",
        "text": "小拐",
        "parent": "0104",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01040401",
        "text": "车67井区块J1b",
        "parent": "010404",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040402",
        "text": "车67井区块P2x",
        "parent": "010404",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040403",
        "text": "拐5井区块P2x1",
        "parent": "010404",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040404",
        "text": "拐5井区块P2x2",
        "parent": "010404",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040405",
        "text": "拐16井区块J1s21",
        "parent": "010404",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040406",
        "text": "拐20井区块J1s21",
        "parent": "010404",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010405",
        "text": "玛北",
        "parent": "0104",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01040501",
        "text": "玛2井区块T1b",
        "parent": "010405",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040502",
        "text": "玛2井区块P2w",
        "parent": "010405",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010406",
        "text": "百口泉",
        "parent": "0104",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01040601",
        "text": "古53井区块C",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040602",
        "text": "百1井区块P2w",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040603",
        "text": "百31井区块T1+2",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040604",
        "text": "百31井区块T1b",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040605",
        "text": "百31井区块P1j",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040606",
        "text": "百21井区块T3b",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040607",
        "text": "百21井区块T2k2",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040608",
        "text": "百21井区块T2k1",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040609",
        "text": "百21井区块T1b",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040610",
        "text": "百21井区块T1b1+2",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040611",
        "text": "百21井区块P2x",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040612",
        "text": "百42井区块T2k2",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040613",
        "text": "百34井区块T2k2",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040614",
        "text": "百34井区块T2k1",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040615",
        "text": "百422井区块T2k2",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040616",
        "text": "百113井区块T2k2",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040617",
        "text": "百113井区块T1b",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040618",
        "text": "百503井断块基质(C)",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040619",
        "text": "百512井断块(C)",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040620",
        "text": "百乌28井区块P1j1+2",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040621",
        "text": "百乌28井断块P1j1",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040622",
        "text": "检188断块T2k2",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040623",
        "text": "检188断块T2k1",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040624",
        "text": "检188断块P2w",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040625",
        "text": "检188断块C",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040626",
        "text": "百重7井区块J1b",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040627",
        "text": "百重7井区块T2k2",
        "parent": "010406",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010407",
        "text": "红山嘴",
        "parent": "0104",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01040701",
        "text": "80井区块T2k1",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040702",
        "text": "红003井区块K1q",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040703",
        "text": "红003井区块J3q",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040704",
        "text": "红018井区块C",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040705",
        "text": "红023井区块T2k2",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040706",
        "text": "红032井区块T2k1",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040707",
        "text": "红4井区块T2k1",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040708",
        "text": "红15井区块T2k2",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040709",
        "text": "红15井区块T2k1",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040710",
        "text": "红18井区块J1b",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040711",
        "text": "红18井区块T2k1",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040712",
        "text": "红18井区块J2X1",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040713",
        "text": "红29井区块J1b",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040714",
        "text": "红29井区块T2k2",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040715",
        "text": "红29井区块T2k1",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040716",
        "text": "红56A井区块T2k1",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040717",
        "text": "红56A井区块C",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040718",
        "text": "红60井断块T2k2",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040719",
        "text": "红62井区块T2k2",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040720",
        "text": "红62井区块T2k1",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040721",
        "text": "红71井区块C",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040722",
        "text": "红76井区块T2k2",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040723",
        "text": "红76井区块T2k1",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040724",
        "text": "红87井区块T2k2",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040725",
        "text": "红91井区块C",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040726",
        "text": "红94井区块J2x3",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040727",
        "text": "红120井区块C",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040728",
        "text": "红山4井区块T2k1",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040729",
        "text": "车202井区块T2k1",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040730",
        "text": "红浅1井区块J3q",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040731",
        "text": "红浅1井区块J1b",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040732",
        "text": "红浅1井区块T2k2",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040733",
        "text": "红浅1井区块T2k1",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040734",
        "text": "红53井区块T2k1",
        "parent": "010407",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010408",
        "text": "车排子",
        "parent": "0104",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01040801",
        "text": "车2井区块J3q",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040802",
        "text": "车21井区块C",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040803",
        "text": "车23井区块C",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040804",
        "text": "车25井断块J1b2",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040805",
        "text": "车32井区块C",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040806",
        "text": "红116井区块C",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040807",
        "text": "车35井区块J3q",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040808",
        "text": "车35井区块J2x",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040809",
        "text": "车35井区块J2x2",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040810",
        "text": "车43井断块P1j",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040811",
        "text": "车46井断块P1j",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040812",
        "text": "车47井区块P1j",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040813",
        "text": "车510井区块N1s1",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040814",
        "text": "车72井断块P1j",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040815",
        "text": "车362井块J2x2",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040816",
        "text": "车362+车366井断块J1b3",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040817",
        "text": "车362井区块J2x",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040818",
        "text": "车89井区块N1s3",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040819",
        "text": "车92井断块J2x1+J2x2",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040820",
        "text": "车峰2井断块J2x2",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040821",
        "text": "车峰3井区块C",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040822",
        "text": "车28井断块K1q",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040823",
        "text": "DC1003井断块J1b",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040824",
        "text": "车912井断块J1b4+5",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040825",
        "text": "车排1井区块J1b",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040826",
        "text": "车60井区块K1q",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040827",
        "text": "车60井区块J3q",
        "parent": "010408",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010409",
        "text": "风城",
        "parent": "0104",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01040901",
        "text": "风3井区块P1f",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040902",
        "text": "风5井区块上盘P1f",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040903",
        "text": "风5井区块下盘P1f",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040904",
        "text": "重18井区SAGD开发J3q2",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040905",
        "text": "重18井区SAGD开发J3q3",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040906",
        "text": "重18井区常规开发J3q3",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040907",
        "text": "重18井区块J3q22-3",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040908",
        "text": "重18井区块J1b",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040909",
        "text": "重1井断块J3q",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040910",
        "text": "重22井区块J1b",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040911",
        "text": "重43井区块J1b",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040912",
        "text": "重检3井区块J3q2",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040913",
        "text": "重检3井区块J3q3",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040914",
        "text": "重29-重32井区块J3q",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01040915",
        "text": "风重010井区块J1b",
        "parent": "010409",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010410",
        "text": "艾湖",
        "parent": "0104",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01041001",
        "text": "玛18井区块T1b",
        "parent": "010410",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "010411",
        "text": "金龙",
        "parent": "0104",
        "level": "3",
        "typeid": "yt",
        "typename": "油田",
        "dir": "油田级"
    },
    {
        "id": "01041101",
        "text": "金201井断块（基质）P1j",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041102",
        "text": "金201井断块（裂缝）P1j",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041103",
        "text": "金202井断块P3w1",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041104",
        "text": "金202井断块P3w2",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041105",
        "text": "金202井断块（基质）P1j",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041106",
        "text": "金202井断块（裂缝）P1j",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041107",
        "text": "金204井断块（基质）P1j",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041108",
        "text": "金204井断块（裂缝）P1j",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041109",
        "text": "金208井断块P3w1",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041110",
        "text": "金208井断块P3w2",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041111",
        "text": "金208井断块（基质）P1j",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041112",
        "text": "金208井断块（裂缝）P1j",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041113",
        "text": "金212井断块P3w1",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041114",
        "text": "金212井断块P3w2",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041115",
        "text": "金212井断块（基质）P1j",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041116",
        "text": "金212井断块（裂缝）P1j",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041117",
        "text": "金214井断块P3w1",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041118",
        "text": "金214井断块（基质）P1j",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041119",
        "text": "金214井断块（裂缝）P1j",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041120",
        "text": "金217井断块P3w2",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    },
    {
        "id": "01041121",
        "text": "金龙2井区块P1j",
        "parent": "010411",
        "level": "4",
        "typeid": "yc",
        "typename": "油藏",
        "dir": "油藏级"
    }
];