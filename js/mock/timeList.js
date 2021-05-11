/**
 * @file 请求
 */


define(function (uf, require) {
    let utils = require('../common/utils.js');
    return [
        // 获取接口
        {
            url: 'api/mock/getStoreInfo',
            handler: function handler(config, success, error) {
                let params = config.params;
                // console.log(params);
                utils.storeDataList('person').then(data => {
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
            url: 'api/mock/addTimeList',
            handler: function handler(config, success, error) {
                let params = config.params;
                utils.addDataStore('timeList', params).then(data => {
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
        // 获取timeList
        {
            url: 'api/mock/getTimeList',
            handler: function handler(config, success, error) {
                utils.storeDataList('timeList').then(data => {
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
            url: 'api/mock/editTimeList',
            handler: function handler(config, success, error) {
                let params = config.params;
                utils.updateStoreData('timeList', params, params.id).then(data => {
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
        // 删除事件
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
        }
    ];
});