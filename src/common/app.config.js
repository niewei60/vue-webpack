const dev = {
  host: '',
  api: ''
};
const prod = {
  host: 'http://api-test.yueyangdongdong.com',
  api: ''
};

let config;
if (process.env.NODE_ENV == 'development') {
  config = dev;
} else if (process.env.NODE_ENV == 'production') {
  config = prod;
}
export default config;
