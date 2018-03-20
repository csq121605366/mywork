import fetch from '../util/fetch'

export function login(data) {
    return fetch({url: '/login/jmp.php', method: 'post', data})
}
export function getUserStatus() {
    return fetch({url: '/datalist/getUserStatus.php', method: 'post'})
}
 
export function getData() {
    return fetch({url: '/datalist/getData.php', method: 'get'})
}

 
export function changeremarks(data) {
    return fetch({url: '/datalist_mobile/changeremarks.php', method: 'post', data})
}

export function mGetData(data) {
    return fetch({url: '/datalist_mobile/getData.php', method: "post", data})
}

export function getRead(data) {
    return fetch({url: '/datalist/saveTempSID.php', method: "post", data})
}

export function checkStatus(data) {
    return fetch({url: '/datalist/getDataStatus.php', method: "post", data})
}

export function seriesHide(data) {
    return fetch({url: '/datalist/hideSeries.php', method: 'post', data})
}
export function seriesShow(data) {
    return fetch({url: '/datalist/visualizeData.php', method: 'post', data})
}
