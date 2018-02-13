/**
     * 时间格式化 返回格式化的时间
     * @param date {object}  可选参数，要格式化的data对象，没有则为当前时间
     * @param fomat {string} 格式化字符串，例如：'YYYY年MM月DD日 hh时mm分ss秒 星期' 'YYYY/MM/DD week' (中文为星期，英文为week)
     * @return {string} 返回格式化的字符串
     * 
     * 例子:
     * formatDate(new Date("january 01,2012"));
     * formatDate(new Date());
     * formatDate('YYYY年MM月DD日 hh时mm分ss秒 星期 YYYY-MM-DD week');
     * formatDate(new Date("january 01,2012"),'YYYY年MM月DD日 hh时mm分ss秒 星期 YYYY/MM/DD week');
     * 
     * 格式：   
     *    YYYY：4位年,如1993
　　 *　　YY：2位年,如93
　　 *　　MM：月份
　　 *　　DD：日期
　　 *　　hh：小时
　　 *　　mm：分钟
　　 *　　ss：秒钟
　　 *　　星期：星期，返回如 星期二
　　 *　　周：返回如 周二
　　 *　　week：英文星期全称，返回如 Saturday
　　 *　　www：三位英文星期，返回如 Sat
     */
function formatDate(date, format) {
    if (arguments.length < 2 && !date.getTime) {
        format = date;
        date = new Date();
    }
    try {
        typeof format != 'string' && (format = 'YYYY年MM月DD日 hh时mm分ss秒');
        var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', '日', '一', '二', '三', '四', '五', '六'];
        return format.replace(/YYYY|yyyy|YY|MM|DD|dd|hh|mm|ss|星期|周|www|week/g, function (a) {
            switch (a) {
                case "YYYY": return date.getFullYear();
                case "yyyy": return date.getFullYear();
                case "YY": return (date.getFullYear() + "").slice(2);
                case "MM": return date.getMonth() + 1;
                    //case "mm": return date.getMonth() + 1;
                case "DD": return date.getDate();
                case "dd": return date.getDate();
                case "hh": return date.getHours();
                case "mm": return date.getMinutes();
                case "ss": return date.getSeconds();
                case "星期": return "星期" + week[date.getDay() + 7];
                case "周": return "周" + week[date.getDay() + 7];
                case "week": return week[date.getDay()];
                case "www": return week[date.getDay()].slice(0, 3);
            }
        });
    }
    catch (x)
    { return date; }
}
//easyUI中datagrid函数的表格，{ field: 'dDate', title: '日期', formatter: showFormatDate }
function showFormatDateBase(value, AFormat) {
    if (value == undefined) return value;
    if (value == "0001-01-01") return value;
    var isIE = (navigator.appName.toUpperCase() == "Microsoft Internet Explorer".toUpperCase());
    //
    var sFmt = AFormat;
    if (sFmt == undefined || sFmt == null || sFmt == "") sFmt = "yyyy-MM-dd";
    try {
        var d = toDateTime(value, sFmt);
        return d.Format(sFmt);                 //formatDate(d, "YYYY-MM-DD")
    }
    catch (x)
    { }
    return value;
}
//转成日期时间，这是核心转换，把各种可能转化成日期时间
var isLocalDate = null;                         //本浏览器是否本地化时间
var isIE = null;                                //是否ie
var ieVersion = null;                           //ie版本
function toDateTime(value, AFormat, ADefault) {
    if (value instanceof Date) value;           //如果是日期类型变量，直接格式化返回
    if (value == undefined) return ADefault;
    if (value == "0001-01-01") return value;
    //读取浏览器版本
    if (isIE == null || isIE == undefined) isIE = (navigator.appName.toUpperCase() == "Microsoft Internet Explorer".toUpperCase());
    if (ieVersion == null || ieVersion == undefined || ieVersion < 6)
        ieVersion = parseFloat(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").substring(4));
    //是否localDate
    var isLocal = isLocalDate;
    if (isLocal == null || isLocal == undefined) {
        isLocal = (isIE);
        //if (isLocal) { if (ieVersion > 8) isLocal = false; }
        isLocalDate = isLocal;
    }
    //
    var sFmt = AFormat;
    if (sFmt == undefined || sFmt == null || sFmt == "") sFmt = "yyyy-MM-dd";
    var a = value;
    var d = 0;
    try {
        //这一段用来调试的，发布时可以屏蔽掉
        /*
        a = value.replace(/(\d{4})-(\d{2})-(\d{2})T(.*)?\.(.*)/, "$1/$2/$3 $4");    //if ((typeof a) == 'string')
        d = new Date(a);
        a = value.replace(/-/g, "/").replace(/T/, " ");
        d = new Date(a);
        var dSpan = new Date(0);
        d = new Date("2000/01/01 11:30:00");    //斜杠格式浏览器都支持。CONVERT(datetime, '1900/01/01')
        var t = d.getTime();                    //得到1970年1月1日到现在的秒数
        var d2 = new Date(2000, 01, 01, 11, 30, 00, 00);    //生成一个标准日期
        var t2 = d2.getTime();                  //读取这个标准日期的秒数
        var t = t2 - t;
        if (Math.abs(t) < 1000) t = 0;          //可以忽略的
        */
        //不兼容ie，兼容谷歌。谷歌转出来的日期加了8个时区，需要减掉
        d = new Date(value);
        if (!isNaN(d)) {
            //if (!isLocal)
            d = dateToLocalZone(d);
            return d;
        }
        //兼容ie，2017-06-12T12:34:56
        //注意：ie8转出来的时间没加8个时区，不需要减掉
        a = value.replace(/-/g, "/").replace(/T/, " ");
        d = new Date(Date.parse(a)); //兼容ie
        if (!isNaN(d)) {
            if (!isLocal) d = dateToLocalZone(d);
            return d;
        }
        //兼容ie的时间格式时分秒
        a = value.replace(/(\d{4})-(\d{2})-(\d{2})T(.*)?\.(.*)/, "$1/$2/$3 $4");
        d = new Date(a);
        if (isNaN(d)) return d;
        if (!isLocal) d = dateToLocalZone(d);
        return d;
    }
    catch (x)
    { }
    return value;
}
//UTC时间转换成本地时区GMT，可以加时区，参考http://www.myexception.cn/javascript/1923154.html
function dateToLocalZone(d, jiaShiqu) {
    if (jiaShiqu == undefined || jiaShiqu == null) jiaShiqu = 0;
    var r = d;
    //var isIE = (navigator.appName.toUpperCase() == "Microsoft Internet Explorer".toUpperCase());
    //得到1970年一月一日到现在的秒数
    var len = d.getTime();
    var utcTime = len;
    //本地时间与GMT时间的时间偏移差
    var offset = d.getTimezoneOffset() * 60000;
    //得到现在的格林尼治时间。IE的日期格式转换不需要减时区了
    //if (!isIE)
    utcTime = len + offset;
    //转回日期格式
    r = new Date(utcTime + 3600000 * jiaShiqu);
    return r;
}
function showFormatDate(value, row, index) {
    return showFormatDateBase(value);
}
function showFormatBool(value, row, index) {
    if (value) return "是"; else return "否";
}
// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function toJsonDate(jsondate)
{
    jsondate = jsondate.replace("/Date(", "").replace(")/", "");
    if (jsondate.indexOf("+") > 0)
    {
        jsondate = jsondate.substring(0, jsondate.indexOf("+"));
    }
    else if (jsondate.indexOf("-") > 0)
    {
        jsondate = jsondate.substring(0, jsondate.indexOf("-"));
    }
    var date = new Date(parseInt(jsondate, 10));
    //var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    //var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    //return date.getFullYear() + "-" + month + "-" + currentDate;
	return date;
}
