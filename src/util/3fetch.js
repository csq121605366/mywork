import $ from 'jquery';
import MessageBox from '@/extend/message';

const BaseUrl = 'https://106.15.103.194'
export default function (param) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: param.url,
            xhrFields: {
                withCredentials: true
            },
            type: param.method || 'POST',
            data: param.data || null,
            success: function (res) {
                if (typeof res == 'string') {
                    resolve(JSON.parse(res));
                    console.log(JSON.parse(res))
                } else {
                    console.log(res)
                    resolve(res);
                }
            },
            complate: function (res) {
                console.log(res)
            }
        })
    })
}