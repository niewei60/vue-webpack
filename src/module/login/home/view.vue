<template lang="html" src="./view.html"></template>
<style lang="stylus" rel="stylesheet/stylus" src="./view.styl" scoped></style>

<script>
    import {Dialog} from 'vant';
    import Model from '@common/model/model.xiuTong.js';
    import {Toast} from 'vant';
    import Utils from '@common/utils/utils.js';
    import sha256 from 'js-sha256';


    export default {
        data() {
        },
        methods: {
            init() {
                //设置全局 deviceId
                let deviceId = window.localStorage.getItem('deviceId');
                if (!deviceId) {
                    let a = sha256(new Date() + new Date());
                    window.localStorage.setItem('deviceId', a);
                }

                //获取用户信息，不为空代表已经登陆
                if(window.localStorage.user){
                    this.thirdSteps();
                    return;
                }

                // 获取回调code，不为空代表微信回调
                this.code = Utils.getParams('code');  
                if(this.code){
                    this.secondSteps(this.code);
                }else{
                    this.summit();
                }
            },
            // 第一步 微信授权 
            summit() {
                var url = 'https://h5.yueyangdongdong.com/weixin/modules/login/view.html';
                var loginUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx075d870ac56fcbc6&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
                window.location.href = loginUrl;
            },
            // 第二步 登陆获取用户
            async secondSteps(code) {
                let data = {
                    code: code
                }
                let result = await Model.getLogin(data);
                console.log(result);
                if (result) {
                    if(result.loginResponse && result.loginResponse.newbie == false){
                        window.localStorage.removeItem('user');
                        window.localStorage.setItem('user', JSON.stringify(result));
                        this.thirdSteps();
                    }else{//新用户 需要下载APP注册
                        Dialog.alert({
                            title: '新用户，请下载APP注册：',
                            message: result
                        }).then(() => {
                            window.location.href = 'https://h5.yueyangdongdong.com/app_download/index.html';
                        });
                    }
                }else{//登陆失败
                    Dialog.alert({
                        title: '登陆失败，请联系管理员：',
                        message: result
                    }).then(() => {
                        window.location.href = 'https://h5.yueyangdongdong.com/app_download/index.html';
                    });
                }
            },
            // 第三部 已经登陆成功跳转到主页
            async thirdSteps(){
                window.location.href = "../../modules/put_forward/view.html";
            }
        },
        mounted() {
            this.init();
        },
        created() {
            window.$page = this;
        }
    };
</script>

