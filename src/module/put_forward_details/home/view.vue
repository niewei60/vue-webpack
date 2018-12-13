<template lang="html" src="./view.html"></template>
<style lang="stylus" rel="stylesheet/stylus" src="./view.styl" scoped></style>

<script>
    import Model from '@common/model/model.xiuTong.js';
    import moment from 'moment'
    export default {
        data() {
            return {
                listArr: []
            }
        },
        methods: {
            init() {
                this.historyPutForward();
            },
            // 获取历史记录
            async historyPutForward(userId) {
                let data = await Model.historyPutForward(userId);
                if (data) {
                    this.listArr = data.content;
                    this.listArr && this.listArr.forEach((item) =>{
                        item.createTime = moment(item.createTime).format('YYYY-MM-DD')
                    })
                }
            },
        },
        mounted() {
            this.init();
        },
        created() {
            window.$page = this;
        }
    }
</script>


