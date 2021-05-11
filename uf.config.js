/*
* webpack打包编译文件
* command: webpack --watch --config uf.config.js
* author: v_gengsiyu
* date: 2019-08-02
* */

const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry: {
        main: './less/index.less'
    },
    output: {
        path: __dirname + '/css',
        filename: '[name].min.css'
    },
    devServer: {
        contentBase: "./js",
        open: true,
        host: "http://ump-dev-gengsiyu.bcc-bdbl.baidu.com/",
        port: "8870"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize'/*, 'autoprefixer-loader'*/],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.less/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize', /*'autoprefixer-loader', */'less-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                exclude: /node_modules/,
                test: /\.(jpg|png)\??.*$/,
                loader: 'file-loader?name=[name].[ext]&publicPath=./img/&outputPath=../img/'
                // loader: 'url-loader?limit=1024&name=dist/[hash:32].[ext]'
            },
            {

                test: /\.(gif|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=1024'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].min.css',
            allChunks: true
        })
    ]
};
