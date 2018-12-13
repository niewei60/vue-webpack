import Vue from 'vue';
import App from './home/view.vue';
import init from '@common/app.init.js';

/* eslint-disable no-new */
init(() => {
  window.$root = new Vue({
    el: '#app',
    render: h => h(App)
  });
});
