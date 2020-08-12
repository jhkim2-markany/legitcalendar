const { createProxyMiddleware } = require('http-proxy-middleware');
const ip = require("ip");

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({ 
      target: 'http://localhost:5000',      //로컬용
      changeOrigin: true,
    })
  );
};


