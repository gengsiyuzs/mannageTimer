/**
 * @file Description
 * @author susisi
 * Created Date: 2019-06-19 16:41:17
 */

module.exports = function (env) {
    return {
        webpack: {
            entry: {
                main: __dirname + '/less/index.less'
            },
            output: {
                path: __dirname + '/css/',
                filename: '[name].min.js',
                // 如果定义了此属性，则启用css分离打包，分离出的css文件名称。使用的是上面的path+cssFile
                cssFile: '[name].min.css'
            }
        }
    };
};
