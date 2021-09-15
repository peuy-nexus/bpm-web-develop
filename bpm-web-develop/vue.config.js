const CompressionWebpackPlugin = require("compression-webpack-plugin");
const port = process.env.port || process.env.npm_config_port || 7981; // dev port
const HealthPlugin = require("./build/HealthPlugin");
const Timestamp = new Date().getTime();

module.exports = {
  publicPath: "./",
  lintOnSave: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "~@/assets/styles/var.scss";',
        // additionalData: '@import "~@/assets/styles/app.scss";',
      },
    },
  },
  devServer: {
    port: port,
    compress: true,
    disableHostCheck: true,
    host: "localhost", //如果是真机测试，就使用这个IP
    https: false,
    hotOnly: false, //热更新（webpack已实现了，这里false即可）
    // 配置跨域请求头，解决开发环境的跨域问题
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    proxy: {
      "/dev-api": {
        target: "http://searly.asuscomm.com:18888/bpm-web",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          ["^" + "/dev-api"]: "",
        },
      },
    },
  },
  chainWebpack: config => {
    // config
    //   .plugin('webpack-bundle-analyzer')
    //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
    // // 修复HMR
    config.resolve.symlinks(true);
    config.output.filename(`[name].[hash]${Timestamp}.js`).end();
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.plugins.push(
        new HealthPlugin(),
        new CompressionWebpackPlugin({
          // 正在匹配需要压缩的文件后缀
          test: /\.(js|css|svg|woff|ttf|json|html)$/,
          // 大于10kb的会压缩
          threshold: 10240,
          // 其余配置查看compression-webpack-plugin
        }),
      );
    }
  },
  runtimeCompiler: true,
  productionSourceMap: false,
};
