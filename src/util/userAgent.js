export default function () {
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