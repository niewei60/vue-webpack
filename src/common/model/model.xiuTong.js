import Http from '@common/app.http.js'
import $ from 'jquery';
export default {

    //登录  yes
    async getLogin(data) {
        const http = new Http({
            url: 'https://api.yueyangdongdong.com/auth/req-unionlogin?osType=WEB',
            method: 'post',
            data: {
                thirdPartyCode: 'WX',
                wxCode: data.code
            },
            intercept: true
        })
        let result = await http.connect();
        return result && result.data;
        // const deviceId = window.localStorage.getItem('deviceId')
        // alert(data.code)
        // $.ajax({
        //     url: 'http://api-test.yueyangdongdong.com/auth/req-unionlogin?osType=WEB&deviceId='+deviceId,
        //     type: 'post',
        //     data: JSON.stringify({
        //         thirdPartyCode: 'WX',
        //         wxCode: data.code
        //     }),
        //     dataType: 'json',
        //     contentType:'application/json;charset=UTF-8',
        //     success: (result)=> {
        //         result && result.data;
        //     },
        //     error: (err)=> {
        //         alert(JSON.stringify(err))
        //     }
        // })
    },
    //  获取账号信息
    async gentUserInfo(){
        const http = new Http({
            url: 'https://api.yueyangdongdong.com/account/account-by-id',
            method: 'get',
            intercept: true
        })
        let result = await http.connect();
        return result && result.data;
    },
    // 提现信息
    async putForward(params){
        const http = new Http({
            url: 'https://pay.yueyangdongdong.com/pay/withdraw',
            params: params,
            method: 'get',
            intercept: true
        })
        let result = await http.connect();
        return result && result.data;
    },

    // 获取历史提现记录
    async historyPutForward(userId){
        const http = new Http({
            url: 'https://api.yueyangdongdong.com/account/list-withdraw',
            method: 'get'
        })
        let result = await http.connect();
        return result && result.data;
    },
}
