import Axios from 'axios';
import sha256 from 'js-sha256';
import {Dialog} from 'vant';
import {Toast} from 'vant';

import Config from './app.config.js';

/**
 * 请求类
 */
class Http {
    /**
     * 构造方法
     * @param {object} option [description]
     */
    constructor(option) {
        this.option = option;
        this.silence = option.silence || false;
        this.intercept = typeof option.intercept == 'undefined' || option.intercept;
        this.lock = false;
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        // 生成axios http实例
        this.httpInstance = Axios.create({
            baseURL: Config.host + Config.api,
            timeout: 30000,
            header: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': ''

            }
        });
    }

    /**
     * 取消拦截器
     */
    ejectInterceptor() {
        this.httpInstance.interceptors.request.eject(this.reqInterceptor);
        this.httpInstance.interceptors.response.eject(this.resInterceptor);
    }

    /**
     * 错误处理方法
     * @param {object} err
     * @param {boolean} flag
     */
    errorHandle(err, flag) {
        if (flag) {
            Dialog.alert({
                title: '温馨提示：',
                message: err.message
            }).then(() => {
                // on close
            });
        } else {
            Dialog.alert({
                title: '温馨提示：',
                message: err.error.response.data.Message
            }).then(() => {
                // on close
            });
        }
    }

    /**
     * 解锁与隐藏加载器
     */
    unlockAndHideLoader() {
        // 解锁请求
        this.lock = false;

        // 隐藏加载器
        if (!this.silence) {
            Toast.clear();
        }
    }

    /**
     * 发送请求获取数据方法
     * @param {object} option
     * @return {*}
     */
    connect() {
        const httpInstance = this.httpInstance.interceptors;
        let option = this.option || {};
        // 设置拦截器状态
        this.intercept = option.intercept || this.intercept;
        if (this.intercept) {
            this.ejectInterceptor();
            // http请求拦截
            this.reqInterceptor = httpInstance.request.use((config) => {
                // 显示加载器
                if (!this.silence) {
                    Toast.loading({
                        mask: true,
                        message: '加载中...',
                        duration: 0
                    });
                }
                // 返回请求配置
                return config;
            }, (error) => {
                // 解锁并隐藏加载器
                this.unlockAndHideLoader();
                // 返回错误
                return Promise.reject(error);
            });

            // http响应拦截
            this.resInterceptor = httpInstance.response.use((response) => {
                // 解锁并隐藏加载器
                this.unlockAndHideLoader();
                // 处理响应数据
                if (response.data.code == 'ok') {
                    return response.data;
                } else {
                    this.errorHandle(response.data, true);
                }
            }, (error) => {
                option.data && option.data.callback && option.data.callback(error);
                // 解锁并隐藏加载器
                this.unlockAndHideLoader();
                // 处理错误
                this.errorHandle({code: -1, msg: error.message, error: error});
            });
        } else {
            // 锁定请求
            if (this.lock) {
                return;
            }
            this.lock = true;
        }

        // 设置query参数
        option.params = option.params || {};
        const localStorage = window.localStorage;
        const deviceId = window.localStorage.getItem('deviceId')
        if (localStorage.user) {
            const user = JSON.parse(localStorage.user);
            console.log(user);
            option.params = Object.assign({}, option.params, {
                userId: user.loginResponse.userInfo.id,
                token: user.loginResponse.token,
            });
        }
        option.params = Object.assign({}, option.params, {
            deviceId: deviceId,
        });
        // 设置headers
        console.log('option.params ' + JSON.stringify(option.params));
        let edge = localStorage.user ? '[' + localStorage.secretKey + ']' : '';
        let url = option.url ? option.url : this.option.url;
        let signUrl = url + '?' + Object.keys(option.params).map((key, i) => {
            let prefix = '&';
            if (i == 0) {
                prefix = '';
            }
            return prefix + key + '=' + option.params[key];
        }).join('');
        let signStr = sha256(edge + signUrl + edge);
        option.headers = option.headers || {};
        option.headers = Object.assign({}, option.headers, {
            //'sessionId': user.sessionId,
            //'sign': signStr,
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': '',
            'Accept': 'application/json'
        });
        // 执行请求并返回
        return this.httpInstance(Object.assign({}, this.option, option));
    }
}

export default Http;
