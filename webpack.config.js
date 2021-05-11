var path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    devServer: {
        contentBase: "./js",
        open: true,
        host: "http://ump-dev-gengsiyu.bcc-bdbl.baidu.com/",
        port: "8870"
    },
    // entry: ['webpack/hot/dev-server', path.resolve(__dirname, './js/entry.js')],
    // output: {
    //     path: path.resolve(__dirname, './js/entry.js'),
    //     filename: 'bundle.js'
    // },
    // devServer: {
    //   inline: true,
    //   port: 8099
    // },
    // module: {
    //     loaders: [{
    //         test: /\.js?$/,
    //         exclude: /(node_modules|bower_components)/,
    //         loader: 'babel',
    //         query: {
    //             presets: ['es2015', 'react']
    //         }
    //
    //     }]
    // },
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         template: './index.html'
    //     }),
    //     new webpack.HotModuleReplacementPlugin()
    // ]
};
