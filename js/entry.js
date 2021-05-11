/**
 * @file 整个项目的入口
 */
var env = {
    version: Date.now(),
    // ajax前缀
    ajaxBaseUrl: '/api',
    // js文件地址
    modulesBaseUrl: './js',
    // 通用组件配置引入
    componentsUrl1: 'http://dev-gateway.ump.baidu-int.com/ms-common/static/res.js',
    componentsUrl2: 'http://dev-gateway.ump.baidu-int.com/ms-common/static/product.js',
    componentsUrl3: 'http://dev-gateway.ump.baidu-int.com/ms-common/static/server.js',
    componentsUrl4: 'http://dev-gateway.ump.baidu-int.com/ms-common/static/user-info.js',
    componentsUrl5: 'http://dev-gateway.ump.baidu-int.com/ms-common/static/upload.js',
    msScm: 'http://cp01-ump-ur-zhangshuai.epc.baidu.com:8083',
    workflowUrl: 'http://cp01-ump-ur-zhangshuai.epc.baidu.com:8090/front/#/personal_task/launch'
};
window.env = env;
// 使用 window.UF 初始化一个 uf 实例，并且所有模块中全部使用此实例
var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
// 初始化indexedDB
window.indexedDB = indexedDB;
if (!indexedDB) {
    console.log('你的浏览器不支持IndexedDB');
}
var $uf = window.UF({
    // 子应用名称必须填，否则无法接入
    appName: 'cmp-app',
    global: {
        ajax: {
            // 此处可以写一个全部请求的baseUrl，发送ajax前会自动吧baseUrl追加到url之前
            baseUrl: env.ajaxBaseUrl
        },
        mock: [],
        mockFiles: [
            'mock/timeList.js',
            'mock/diy.js'
        ]
    },
    modules: {
        // 子模块文件的前缀，需使用带域名信息的路径
        baseUrl: env.modulesBaseUrl,
        urlArgs: 'v=' + Date.now()
    },
    authority: {},
    precondition: [
        // 后端获取用户权限
        /*function (resolve, reject) {
            setTimeout(function () {
                $uf.ajax({
                    // 接口返回了全部用户有权限的权限点列表
                    url: ':ms-common/pms/point',
                    // 请求中需要带上header才能查询到数据。X-Pretend-App-Name的值和pms上建的应用保持一致
                    // 目前兼容 X-Pretend-App-Name / x-app-name, 如果x-app-name使用有问题时，可以尝试 X-Pretend-App-Name
                    headers: {'x-app-name': 'cmp-app'},
                    success: function (data) {
                        var obj = {};
                        for (var i in data) {
                            obj[data[i]] = 1;
                        }
                        $uf.config({
                            authority: obj
                        });
                        resolve();
                    },
                    error: resolve
                });
            }, 0);
        }*/
    ],
    data: {
        // 使用 ms-common 的接口所需配置
        'ms-common': window.location.origin + '/api/ms-common'
    },
    components: [
        // ms-common 提供公共组件
        // env.componentsUrl1,
        // env.componentsUrl2,
        // env.componentsUrl3,
        // env.componentsUrl4,
        // env.componentsUrl5,
        {
            'select': {allowClear: true, showSearch: true},
            'echarts': {
                autoResize: true,
                // ShowX 调色板
                color: [
                    '#2ec7c9', '#ffb980', '#d87a80', '#b6a2de', '#5ab1ef', '#8d98b3',
                    '#e5cf0d', '#97b552', '#95706d', '#dc69aa', '#07a2a4', '#9a7fd1',
                    '#588dd5', '#f5994e', '#c05050', '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                // 坐标系颜色
                // axisLineColor: '#555',
                textStyle: {
                    fontFamily: 'PingFang SC, Microsoft YaHei, Hiragino Sans GB,'
                        + ' STHeiti, Helvetica Neue, Helvetica, Arial, sans-serif'
                },
                yAxis: {
                    axisLabel: {
                        margin: -20,
                        // inside: true
                    }
                },
                grid: {
                    containLabel: true,
                    top: '20%'
                }
            }
        }
    ]
});
// 需使用上面产生的实例进行路由（router.js）初始化，同样到baseUrl下找
// #app-config 为目标元素的id，固定格式为 `#app-{:appName}`，appName须和在统一平台注册子应用的英文名保持一致
$uf.init('router', '#app-cmp-app');
