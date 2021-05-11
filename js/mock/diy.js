/**
 * @file 请求
 */


define(function (uf, require) {
    let utils = require('../common/utils.js');
    return [
        // 获取接口
        {
            url: 'api/mock/getDiyList',
            handler: function handler(config, success, error) {
                let params = config.params;
                utils.storeDataList('diy').then(data => {
                    success({
                        status: 0,
                        data: data[data.length - 1]
                    });
                }, err => {
                    success({
                        status: 1,
                        err
                    });
                });
            }
        },
        // 新增事件
        {
            url: 'api/mock/addDiyList',
            handler: function handler(config, success, error) {
                let params = config.params;
                utils.addDataStore('diy', params).then(data => {
                    success({
                        status: 0,
                        data: data
                    });
                }, err => {
                    success({
                        status: 1,
                        err
                    });
                });
            }
        },
        // 获取List
        {
            url: 'api/mock/getDiyList',
            handler: function handler(config, success, error) {
                utils.storeDataList('diy').then(data => {
                    success({
                        status: 0,
                        data: data
                    });
                }, err => {
                    success({
                        status: 1,
                        err
                    });
                });
            }
        },
        // 编辑事件
        {
            url: 'api/mock/editDiyList',
            handler: function handler(config, success, error) {
                let params = config.params;
                console.log(params);
                utils.updateStoreData('diy', params, params.id).then(data => {
                    success({
                        status: 0,
                        data: data
                    });
                }, err => {
                    success({
                        status: 1,
                        err
                    });
                });
            }
        },
        // 设置闹钟
        {
            url: 'api/mock/setClock',
            handler: function handler(config, success, error) {
                let params = config.params;
                utils.addDataStore('clock', params).then(data => {
                    success({
                        status: 0,
                        data: data
                    });
                }, err => {
                    success({
                        status: 1,
                        err
                    });
                });
            }
        },
        // 获取闹钟List
        {
            url: 'api/mock/getClockList',
            handler: function handler(config, success, error) {
                utils.storeDataList('clock').then(data => {
                    success({
                        status: 0,
                        data: data
                    });
                }, err => {
                    success({
                        status: 1,
                        err
                    });
                });
            }
        },
        // 删除闹钟
        {
            url: 'api/mock/deleteClock',
            handler: function handler(config, success, error) {
                let params = config.params;
                utils.delectStoreData('clock', params.id).then(data => {
                    success({
                        status: 0,
                        data: data
                    });
                }, err => {
                    success({
                        status: 1,
                        err
                    });
                });
            }
        }
        /* // 删除事件
         {
             url: 'api/mock/deleteTimeList',
             handler: function handler(config, success, error) {
                 let params = config.params;
                 utils.delectStoreData('timeList', params.id).then(data => {
                     success({
                         status: 0,
                         data: data
                     });
                 }, err => {
                     success({
                         status: 1,
                         err
                     });
                 });
             }
         },
         // 批量删除事件
         {
             url: 'api/mock/batchDeleteTimeList',
             handler: function handler(config, success, error) {
                 let params = config.params;
                 let allKeys = utils.batchDelete('timeList', params.ids.split(','));
                 Promise.all(allKeys).then(data => {
                     success({
                         status: 0,
                         data: data
                     });
                 }, err => {
                     success({
                         status: 1,
                         err
                     });
                 });
             }
         }*/
    ];
});