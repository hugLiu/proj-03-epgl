var loding = function (obj, flag) {
    var parent = document.getElementById(obj);

    if (flag == false) {
        if (parent.children.length != 0 && parent.children[parent.children.length - 1].className == 'shadowBox') {
            parent.removeChild(parent.children[parent.children.length - 1]);
            return;
        } else {
            return;
        }

    } else if (parent.children.length != 0 && parent.children[parent.children.length - 1].className == 'shadowBox') {

        return;
    }
    var style = null;
    if (window.getComputedStyle) {
        style = window.getComputedStyle(parent, null);    // 非IE
    } else {
        style = parent.currentStyle;  // IE
    }
    var shadowBox = document.createElement('div');
    shadowBox.style.cssText = "width:" + style.width + ";height:" + style.height + ";opacity:.5;position:absolute;left:0;top:0;z-index:99999;background-color:gray";
    shadowBox.setAttribute("class", "shadowBox");
    var img = document.createElement("img");
    img.style.cssText = "position:absolute;left:50%;top:50%;margin-left:-62px;margin-top:-62px;"
    img.setAttribute("src", "/Content/EPGL/img/shared/loding.gif");
    img.setAttribute("draggable", "false");
    shadowBox.appendChild(img);
    parent.appendChild(shadowBox);
}