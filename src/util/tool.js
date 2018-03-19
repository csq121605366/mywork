export function userAgent() {
    var ua = navigator.userAgent
    var isChrome = ua.indexOf("Chrome") > -1 && ua.indexOf("Safari") > -1;
    var isWeixin = ua.indexOf('MicroMessenger') > -1;
    if (!navigator.userAgent.match(/iPhone|iPad|iPod/i)) { //如果不是苹果手机
        if (!(isChrome || isWeixin)) {
            return false;
        }
    }
    return true;
}

export function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

export function cloneObj(obj) {
    var str,
        newobj = obj.constructor === Array
            ? []
            : {};
    if (typeof obj !== 'object') {
        return;
    } else if (window.JSON) {
        str = JSON.stringify(obj), //系列化对象
        newobj = JSON.parse(str); //还原
    } else {
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object'
                ? cloneObj(obj[i])
                : obj[i];
        }
    }
    return newobj;
};

export function getObjXy(obj) {
    var xy = obj.getBoundingClientRect();
    var top = xy.top - document.documentElement.clientTop + document.documentElement.scrollTop, //document.documentElement.clientTop 在IE67中始终为2，其他高级点的浏览器为0
        bottom = xy.bottom,
        left = xy.left - document.documentElement.clientLeft + document.documentElement.scrollLeft, //document.documentElement.clientLeft 在IE67中始终为2，其他高级点的浏览器为0
        right = xy.right,
        width = xy.width || right - left, //IE67不存在width 使用right - left获得
        height = xy.height || bottom - top;

    return {
        top: top,
        right: right,
        bottom: bottom,
        left: left,
        width: width,
        height: height
    }
}