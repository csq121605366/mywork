import axios from '../util/fetch'

export function login(data) {
    return axios({url: '/login/jmp.php', method: 'post', data})
}
export function getUserStatus() {
    return axios({url: '/datalist/getUserStatus.php', method: 'post'})
}

export function getData() {
    return axios({url: '/datalist/getData.php', method: 'get'})
}

export function changeremarks(data) {
    return axios({url: '/datalist_mobile/changeremarks.php', method: 'post', data})
}

export function mGetData(data) {
    return axios({url: '/datalist_mobile/getData.php', method: "post", data})
}

export function getRead(data) {
    return axios({url: '/datalist/saveTempSID.php', method: "post", data})
}

export function checkStatus(data) {
    return axios({url: '/outside/getDataStatus.php', method: "post", data})
}

export function seriesHide(data) {
    return axios({url: '/datalist/hideSeries.php', method: 'post', data})
}
export function seriesShow(data) {
    return axios({url: '/datalist/visualizeData.php', method: 'post', data})
}
