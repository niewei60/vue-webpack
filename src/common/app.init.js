import 'babel-polyfill';
import './assets/css/global.styl';
import Vue from 'vue';
import Vant from 'vant';
import 'vant/lib/index.css';

import adapt from './utils/adapt.js';
import * as Component from './components/index.js';

// Vue自定义模块配置
import './app.filters';
/**
 * 初始化
 * @param  {Function} callback [description]
 */

 
Vue.prototype.$store={}
export default (callback) => {
    // 根据页面宽度自适应基准文字大小
    adapt();
    window.addEventListener('resize', () => {
        adapt();
    });
    Vue.use(Vant);
    // 全局组件注册
    const globalComponents = [];
    Object.keys(Component).forEach((key) => {
        const component = globalComponents.findIndex((name) => name === key);
        if (component >= 0) {
            Vue.component(Component[key].name, Component[key]);
        }
    });

    // 全局组件配置
    Vue.use((v, options) => {
        // 创建组件实例方法
        const createVm = function (component) {
            const Component = Vue.extend(component);
            const vm = new Component().$mount();
            document.body.appendChild(vm.$el);
            return vm;
        };
        // 全局事件通信总线实例
        v.prototype.$bus = window.$bus = new Vue();
    });

    callback();
};
