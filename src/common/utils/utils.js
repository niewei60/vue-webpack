export default {
    // 获取参数
    getParams: function (name) {
        let queryStr = window.location.search.replace('?', '&').split('&');
        let queryObj = {};
        queryStr.forEach(function (str) {
            queryObj[str.split('=')[0]] = str.split('=')[1]
        });
        return queryObj[name];
    },
}