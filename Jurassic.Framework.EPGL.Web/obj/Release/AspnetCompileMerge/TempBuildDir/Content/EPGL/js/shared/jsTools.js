//获得Web路径---
function GetWebUrl(){
	var sCurFile;
	var sCurFile1;
	var sCurFile2;
	var sCurDir;
	
	sCurFile = document.URL;
//'去掉问号后面的部分--
	aCurFile1=sCurFile.split("?");
//'去掉文件名--
	aCurFile2=aCurFile1[0].split("/");
	
	sCurDir=""
	for ( var i=0;  i<aCurFile2.length-1; i++)
		sCurDir = sCurDir + aCurFile2[i] + "/" ;
	return (sCurDir);
}

//获取绝对路径
function canonical_uri(src, base_path) 
{ 
	var root_page = /^[^?#]*\//.exec(location.href)[0], 
	root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0], 
	absolute_regex = /^\w+\:\/\//; 

	// is `src` is protocol-relative (begins with // or ///), prepend protocol 
	if (/^\/\/\/?/.test(src)) 
	{ 
	src = location.protocol + src; 
	} 
	// is `src` page-relative? (not an absolute URL, and not a domain-relative path, beginning with /) 
	else if (!absolute_regex.test(src) && src.charAt(0) != "/") 
	{ 
	// prepend `base_path`, if any 
	src = (base_path || "") + src; 
	} 

	// make sure to return `src` as absolute 
	return absolute_regex.test(src) ? src : ((src.charAt(0) == "/" ? root_domain : root_page) + src); 
}

//正则表达式replace
String.prototype.replaceAll = function (s1, s2) {
    var r = new RegExp(s1.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
    return this.replace(r, s2);
}

//getQueryString
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

//字符串形式
function getUrlRequest(url) {
	//console.log(url);
	url = decodeURI(url);//中文解码处理
	//console.log(url);
	var prams = url.substr(url.indexOf("?"));//获取url中“?”字符后的字符串

	var theReq = new Object();
	if (prams.indexOf("?") != -1)
	{
		var str = prams.substr(1);
		var strs = str.split("&");
		var keyvalue;
		for (var i=0; i<strs.length; i++)
		{
			keyvalue = strs[i].split("=");
			theReq[keyvalue[0]] = keyvalue[1];
		}
	}
	return theReq;
}

function fixOcxMask(container) {
	var frame = $("<iframe frameborder=0 scrolling=no style='background-color:transparent; position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;'></iframe>");
	$(container).append(frame);
}

function InitActiveX(AcitveXObjectID,ContianerID){
	var ce = document.getElementById(ContianerID);
	var ac = document.createElement("Object");
	if (ce)
	{
		ac.id="joGIS1";
		ac.classid="clsid:D2546426-13FD-4018-85F1-F5BD61147C8F";
		ac.CODEBASE="JoGIS4.ocx#version=1,0,0,1";
		ac.style.width = "100%";
		ac.style.height = "500px";
		ac.wmode="Opaque";

	    ce.appendChild(ac);
	}

}

//@AcitveXObjectID: 要删除的ActiveX控件ID。
//@ContianerID: 要查找的节点范围，从此节点一下查找待删除的ActiveX。
function ActiveXKiller(AcitveXObjectID,ContianerID){   
	var ce = document.getElementById(ContianerID);
	if (ce)
	{
	    var cce = ce.children;
	    for (var i = 0; i < cce.length; i = i + 1)
	    {
	        if (cce[i].id == AcitveXObjectID)
	        {
	            ce.removeChild(cce[i]);
	        }
	    }
	}

}

var OpenResultWin = function(resultid) {
	//window.open
}

function resizeWindow()
{
    //判断浏览器是否支持window.screen判断浏览器是否支持screen
    if (window.screen)
    {
        //定义一个myw，接受到当前全屏的宽
        var myw = screen.availWidth;
        //定义一个myw，接受到当前全屏的高
        var myh = screen.availHeight;
        //把window放在左上脚
        window.moveTo(0, 0);
        //把当前窗体的长宽跳转为myw和myh
        window.resizeTo(myw, myh);
    }
}

var filesList = new Array();  
var filesIndex = 0;
var fso;
try
{
	fso = new ActiveXObject("Scripting.FileSystemObject");
}
catch(e){}
function searchFilesList(filePath){  
    var f = fso.GetFolder(filePath);  
    // 遍历目录  
    var fk = new Enumerator(f.SubFolders);  
    for (; !fk.atEnd(); fk.moveNext()) {  
        filesList[filesIndex++] = fk.item();  
        searchFilesList(fk.item());  
    }  
    // 遍历目录文件  
    var fc = new Enumerator(f.files);  
    for (; !fc.atEnd(); fc.moveNext()) {  
        filesList[filesIndex++] = fc.item();  
    }  
}


function searchFilesByKeyNoDir(filePath, keyword){
    var f = fso.GetFolder(filePath);
	// 遍历目录  
    var fk = new Enumerator(f.SubFolders);
    for (; !fk.atEnd(); fk.moveNext()) {
        searchFilesByKeyNoDir(fk.item(), keyword);  
    }
    // 遍历目录文件  
    var fc = new Enumerator(f.files);
    for (; !fc.atEnd(); fc.moveNext()) {
		if (fc.item().Name.indexOf(keyword) >= 0) {//匹配关键字才装载
			//console.log(fc.item().Name);
        	filesList[filesIndex++] = fc.item();
		}
    }  
}

function dataTreeConvert(rows){
	function exists(rows, parent){
		for(var i=0; i<rows.length; i++){
			if (rows[i].id == parent) return true;
		}
		return false;
	}
	
	var nodes = [];
	// get the top level nodes
	for(var i=0; i<rows.length; i++){
		var row = rows[i];
		if (!exists(rows, row.parent)){
			nodes.push({
				id:row.id,
				text:row.text
			});
		}
	}
	
	var toDo = [];
	for(var i=0; i<nodes.length; i++){
		toDo.push(nodes[i]);
	}
	while(toDo.length){
		var node = toDo.shift();	// the parent node
		// get the children nodes
		for(var i=0; i<rows.length; i++){
			var row = rows[i];
			if (row.parent == node.id){
				var child = row;
				if (node.children){
					node.children.push(child);
				} else {
					node.children = [child];
				}
				toDo.push(child);
			}
		}
	}
	return nodes;
}

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

/**
 * 
 * 0xFFFFFF9B
 */
function colorHexToRgba(colorhex) {
	//console.log(colorhex);
	var rgba = {r:0, g:0, b:0, a:0};
	rgba.r = parseInt( '0x' + colorhex.substr(2,2) );
	rgba.g = parseInt( '0x' + colorhex.substr(4,2) );
	rgba.b = parseInt( '0x' + colorhex.substr(6,2) );
	rgba.a = parseInt( '0x' + colorhex.substr(8,2) );
	return rgba;
}

function DateAdd(interval, number, date){ 
	switch(interval.toLowerCase()){ 
		case "y": return new Date(date.setFullYear(date.getFullYear()+number)); 
		case "m": return new Date(date.setMonth(date.getMonth()+number)); 
		case "d": return new Date(date.setDate(date.getDate()+number)); 
		case "w": return new Date(date.setDate(date.getDate()+7*number)); 
		case "h": return new Date(date.setHours(date.getHours()+number)); 
		case "n": return new Date(date.setMinutes(date.getMinutes()+number)); 
		case "s": return new Date(date.setSeconds(date.getSeconds()+number)); 
		case "l": return new Date(date.setMilliseconds(date.getMilliseconds()+number)); 
	} 
}

function DateDiff(interval, date1, date2){
	var long = date2.getTime() - date1.getTime(); //相差毫秒
	switch(interval.toLowerCase()){
		case "y": return parseInt(date2.getFullYear() - date1.getFullYear());
		case "m": return parseInt((date2.getFullYear() - date1.getFullYear())*12 + (date2.getMonth()-date1.getMonth()));
		case "d": return parseInt(long/1000/60/60/24);
		case "w": return parseInt(long/1000/60/60/24/7);
		case "h": return parseInt(long/1000/60/60);
		case "n": return parseInt(long/1000/60);
		case "s": return parseInt(long/1000);
		case "l": return parseInt(long);
	}
}

//获取上个月时间yyyy/MM/dd
function getLastMonthDate() {
    var nowdate = new Date();
    var vYear = nowdate.getFullYear();
    var vMon = nowdate.getMonth();//从0开始，故不需要减1
    var vDay = nowdate.getDate();
    //每个月的最后一天日期
    var daysInMonth = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
    if(vMon==0){
        vYear = vYear - 1;
        vMon = 11;
    } else {
        vMon = vMon - 1;
    }
    //若是闰年，二月最后一天是29号
    if(vYear%4 == 0 && vYear%100 != 0  || vYear%400 == 0 ){
        daysInMonth[1]= 29;
    }
    if(daysInMonth[vMon] < vDay){
        vDay = daysInMonth[vMon];
    }
    if(vDay<10){
        vDay="0"+vDay;
    }
    if(vMon+1<10){
        vMon="0"+(vMon+1);
    }
    var date =vYear+"/"+ vMon +"/"+vDay;

    return date;
}
//获取明天日期yyyy/MM/dd
function getTomorrow() {
    var nowdate = new Date();
    var vYear = nowdate.getFullYear();
    var vMon = nowdate.getMonth();//从0开始，故不需要减1
    var vDay = nowdate.getDate();
    //每个月的最后一天日期
    var daysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

    //若是闰年，二月最后一天是29号
    if (vYear % 4 == 0 && vYear % 100 != 0 || vYear % 400 == 0) {
        daysInMonth[1] = 29;
    }
    if (vDay == daysInMonth[vMon]) {
        vMon=vMon+1;
        vDay = 1;
    } else {
        vDay = vDay + 1;
    }
    if (vMon == 12) {
        vYear = vYear+1;
        vMon = 0;
    }
    if (vDay < 10) {
        vDay = "0" + vDay;
    }
    if (vMon+1 < 10) {
        vMon = "0" + (vMon+1);
    }
    var date = vYear + "/" + vMon + "/" + vDay;

    return date;
}

// 要绘制的数据和数据的数据点数  
// 获得一些随机数据  
function getRandomData(total) {  
	var data = [];  
	if (data.length > 0)  
		data = data.slice(1);  
	while (data.length < total) {  
		var prev = data.length > 0 ? data[data.length - 1] : Math.random() * 10 + 50;  
		var y = prev + Math.random() * 10 - 5;  
		if (y < 0)  
			y = 0;  
		// if (y > 100)  
		// 	y = 100;  
		data.push(y);
	}
	return data;  
}

var getRandomColor = function(){    
	return (function(m,s,c){    
		return (c ? arguments.callee(m,s,c-1) : '#') +    
		s[m.floor(m.random() * 16)]    
	})(Math,'0123456789abcdef',5)    
}