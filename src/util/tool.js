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

