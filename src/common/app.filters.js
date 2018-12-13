import Vue from 'vue';

let filter = {
  rounding(val) {
    return parseInt(val);
  },
  toFixed(price) {
    if (typeof price == 'number') return price.toFixed(2);
    else if (price == '') return '-';
    else return price;
  },
  // 获取工资，除1000
  formatWages(param) {
    if (param === '' || param === null || param === undefined) {
      return '-';
    } else {
      return param / 1000;
    }
  }
};

Vue.filter('rounding', filter.rounding);
Vue.filter('toFixed', filter.toFixed);
Vue.filter('formatWages', filter.formatWages);

