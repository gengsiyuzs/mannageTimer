/**
 * @file app 时间列表
 * Created by gengsiyu
 */

define(function (uf, require) {
    let utils = require('../common/utils.js');
    return {
        type: 'div',
        content: [
            {
                type: 'table',
                name: 'timeListTable',
                columns: [
                    {title: 'ID', dataIndex: 'id', key: 'id'},
                    {title: '事件类型', dataIndex: 'type', key: 'type'},
                    {title: '开始时间', dataIndex: 'startTime', key: 'startTime'},
                    {title: '结束时间', dataIndex: 'endTime', key: 'endTime'},
                    {
                        title: '持续时间',
                        dataIndex: 'duringTime',
                        key: 'duringTime',
                        render: (v, row) => (utils.getTimeDiff(row.startTime, row.endTime) + ' 小时')
                    },
                    {
                        title: '评价', dataIndex: 'description', key: 'description', render: v => {
                            return {
                                type: 'rate',
                                value: v,
                                allowHalf: true,
                                disabled: true
                            };
                        }
                    },
                    {
                        title: '操作',
                        dataIndex: '_operation',
                        width: 100,
                        render: function () {
                            return [
                                {type: 'a', content: '编辑', action: 'edit'},
                                {type: 'a', content: '删除', action: 'delete'}
                            ];
                        }
                    }
                ],
                rowSelection: {
                    selections: true
                },
                title: {
                    extra: [
                        {
                            type: 'button',
                            mode: 'primary',
                            style: {marginLeft: 16},
                            icon: 'plus',
                            content: '新增', action: 'add'
                        },
                        {
                            type: 'button',
                            mode: 'primary',
                            style: {marginLeft: 16},
                            icon: 'delete',
                            content: '批量删除', action: 'batchDelete'
                        }
                    ],
                    text: '时间管理列表',
                    basicWidget: [
                        'filter',
                        'export',
                        'switchTags'
                    ],
                    menuWidget: [
                        'refresh',
                        'fullScreen'
                    ]
                },
                rowKey: 'id',
                pagination: {pageType: 'client', pageSize: 10},
                source: {
                    url: 'api/mock/getTimeList',
                    method: 'get',
                    handler: function (data) {
                        return data;
                    }
                },
                crud: {
                    add: {
                        title: '新增事件',
                        api: 'api/mock/addTimeList',
                        form: {
                            items: [
                                {
                                    type: 'select', label: '事件类型', name: 'type', required: true, options: [
                                        '吃饭', '理发', '上厕所', '午睡'
                                    ], mode: 'combobox', placeholder: '没有喜欢的，可以任意输'
                                },
                                {
                                    type: 'date-picker',
                                    style: {width: '100%'},
                                    name: 'startTime',
                                    label: '开始时间',
                                    format: 'YYYY-MM-DD HH:mm:ss',
                                    showTime: true,
                                    required: true
                                },
                                {
                                    type: 'date-picker',
                                    style: {width: '100%'},
                                    name: 'endTime',
                                    label: '结束时间',
                                    format: 'YYYY-MM-DD HH:mm:ss',
                                    showTime: true
                                },
                                {
                                    type: 'rate',
                                    label: '评价',
                                    allowHalf: true,
                                    name: 'description'
                                }
                            ]
                        }
                    },
                    edit: {
                        title: '编辑事件', method: 'post',
                        api: 'api/mock/editTimeList',
                        forbidden: 'type'
                    },
                    delete: {
                        title: '删除事件',
                        api: {
                            url: 'api/mock/deleteTimeList',
                            method: 'delete'
                        },
                        render: function (row) {
                            return {
                                type: 'html',
                                content: '确定要删除『 ' + row.type + ' 』事件吗?'
                            };
                        }
                    },
                    batchDelete: {
                        title: '批量删除:',
                        method: 'post',
                        api: 'api/mock/batchDeleteTimeList',
                        okText: '批量删除',
                        render: function (rows) {
                            return {
                                type: 'div',
                                content: [{type: 'html', content: '确定要批量删除以下选中事件吗？'}, {
                                    type: 'html', content: '' + rows.map(function (v) {
                                        return v.type;
                                    }).join(', ') + ''
                                }]
                            };
                        }
                    }
                }
            }
        ]
    };
});