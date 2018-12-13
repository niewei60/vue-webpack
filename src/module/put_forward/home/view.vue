<template lang="html" src="./view.html"></template>
<style lang="stylus" rel="stylesheet/stylus" src="./view.styl" scoped></style>

<script>
    import {Dialog} from 'vant';
    import {Toast} from 'vant';
    import Model from '@common/model/model.xiuTong.js';

    export default {
        data() {
            return {
                phoneNumber: null,
                wxNum: null,
                starCoin: null,
                starBean: 0,
            }
        },
        methods: {
            init() {
                this.phoneNumber = null;
                this.wxNum = null;
                this.starCoin = null;
                this.gentUserInfo();
            },

            // 获取账号信息
            async gentUserInfo() {

                let data = await Model.gentUserInfo();
                if (data) {
                    this.starBean = data.starCoin;
                }
            },
            // 提交
            async sub() {
                if(!this.phoneNumber || !this.wxNum.trim() || !this.starCoin){
                    Dialog.alert({
                        title: '温馨提示：',
                        message: '请输入正确的数据！',
                    }).then(() => {
                        // on close
                    });
                    return ;
                }
                if(this.starCoin >= this.starBean){
                    Dialog.alert({
                        title: '温馨提示：',
                        message: '您可提现金额不能超过'+this.starBean,
                    }).then(() => {
                        // on close
                    });
                    return ;
                }
                Dialog.confirm({
                    title: '确认提现信息',
                    message: '您确认提现到<span style="color: #4d3ba4">'+ this.wxNum +'</span>这个微信吗？<p>星币数量：'+this.starCoin+'</p><p>手机号码：'+this.phoneNumber+'</p>'
                }).then( async () => {
                    let openId = window.localStorage.getItem('user') && JSON.stringify(window.localStorage.getItem('user'));
                    let data = await Model.putForward({
                        phoneNumber: this.phoneNumber,
                        starCoin: this.starCoin,
                        wxNum: this.wxNum
                    });
                    if (data) {
                        Toast.success("提现成功！");
                        this.init();
                    }
                }).catch(() => {
                    // on cancel
                });
            },
            goTo(){
                window.location.href = '../../modules/put_forward_details/view.html';
            }
        },
        mounted() {
            this.init();
        },
        created() {
            window.$page = this;
        }
    }
</script>


