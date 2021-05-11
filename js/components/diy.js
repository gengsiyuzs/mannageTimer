/**
 * @file app 自定义记录
 * Created by gengsiyu
 */

define(function (uf, require) {
    let utils = require('../common/utils.js');
    // 事件列表
    let eventList = ['起床-7:30', '喝水-7:40', '上厕所-7:50', '洗头-8:00',
        '化妆-8:15', '叠被子-8:25', '穿衣服-8:30'];
    // 颜色列表
    let colorList = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];
    let weekEnum = {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '日',
    };
    // 今天的闹钟
    let curClock;
    // 计时器
    let timer;

    // 处理dataSource
    function formatDataSource(list) {
        return list.map((item, idx) => {
            return {
                key: item,
                title: item,
                description: item
            };
        });
    }

    // 选择transfer触发保存
    function save() {
        let targetKeys = uf('diyTransfer').get('targetKeys');
        let noneEvent = [];
        eventList.forEach(item => {
            if (!targetKeys.includes(item)) {
                noneEvent.push(item);
            }
        });
        let data = {
            date: uf.moment().format('YYYY-MM-DD'),
            doneEvent: targetKeys,
            noneEvent: noneEvent
        };
        let allData = uf('diyTable').getValues();
        let curData = allData.filter(item => item.date === data.date);
        if (!curData.length) {
            uf.ajax({
                url: 'api/mock/addDiyList',
                params: data,
                success: data => {
                    uf('diyTable').reload();
                }
            });
        } else {
            let editId = curData[0]['id'];
            data.id = editId;
            uf.ajax({
                url: 'api/mock/editDiyList',
                params: data,
                success: data => {
                    uf('diyTable').reload();
                }
            });
        }
    }

    // 生成时分秒
    function getTimes() {
        let options = [];
        for (let i = 0; i < 24; i++) {
            options.push({
                value: i < 10 ? '0' + i : i,
                label: i < 10 ? '0' + i : i,
                children: (function () {
                    let minuteOptions = [];
                    for (let j = 0; j < 60; j++) {
                        minuteOptions.push({
                            value: j < 10 ? '0' + j : j,
                            label: j < 10 ? '0' + j : j,
                            children: (function () {
                                let secondOptions = [];
                                for (let h = 0; h < 60; h++) {
                                    secondOptions.push({
                                        value: h < 10 ? '0' + h : h,
                                        label: h < 10 ? '0' + h : h
                                    });
                                }
                                return secondOptions;
                            })()
                        });
                    }
                    return minuteOptions;
                })()
            });
        }
        return options;
    }

    // 按照星期排序
    function weekSort(data) {
        let dataMap = {};
        let dataWeek = [];
        data.forEach(item => {
            if (!dataMap[item.week]) {
                dataMap[item.week] = [item];
            } else {
                dataMap[item.week].push(item);
            }
            dataWeek.push(+item.week);
        });
        dataWeek = Array.from(new Set(dataWeek)).sort();
        let newData = [];
        dataWeek.forEach(item => {
            newData = newData.concat(dataMap[item]);
        });
        return newData;
    }

    // 闹铃时间到
    function clockTimeDone() {
        uf('closeClock').set({disabled: false});
        let audio = document.getElementById('audio');
        audio.src = "../../logo/bed.mp3";
        audio.loop = "loop";
        audio.autoplay = "autoplay";
    }

    // 关闭闹铃
    function closeClock() {
        let audio = document.getElementById('audio');
        audio.src = "";
        uf('closeClock').set({disabled: true});
    }

    // 设置闹铃
    function setClock(curClock) {
        if (!curClock) {
            uf('todayClock').set({content: '今天还没有闹钟哦~'});
            return;
        }
        uf('todayClock').set({content: curClock.join(' | ')});
        // 开始设置闹铃
        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(() => {
            let currentTime = uf.moment().format('HH:mm:ss');
            // 判断是否到时间了
            curClock.forEach(item => {
                if (currentTime === item.replace(/[' ']/g, '')) {
                    clockTimeDone();
                    if (curClock.length === 1) {
                        clearInterval(timer);
                    }
                }
            });
        }, 900);
    }

    return {
        type: 'div',
        beforeDestroy: e => {
            if (timer) {
                clearInterval(timer);
            }
        },
        content: [
            {
                type: 'row', content: [
                    {
                        type: 'col', span: 12,
                        content: {
                            type: 'transfer', name: 'diyTransfer',
                            render: item => item.title,
                            listStyle: {height: 300, width: 200},
                            dataSource: formatDataSource(eventList),
                            titles: ['代办', '已完成'],
                            operations: ['完成', '重做'],
                            targetKeys: [],
                            notFoundContent: '还没有任务哦~',
                            onChange: e => {
                                uf('diyTransfer').set({targetKeys: e});
                                save();
                            }
                        }
                    },
                    {
                        type: 'col', span: 12,
                        content: {
                            type: 'card',
                            title: '设置闹钟',
                            content: [
                                {
                                    type: 'alert', mode: 'success',
                                    style: {marginBottom: 16, marginTop: -8},
                                    message: [
                                        {type: 'span', content: '今日闹钟：'},
                                        {type: 'span', name: 'todayClock'}
                                    ]
                                },
                                {
                                    type: 'fieldset', name: 'alreadyClock',
                                    title: '已定闹钟', style: {margin: '-8px 0 16px 0'},
                                    source: {
                                        url: 'api/mock/getClockList',
                                        target: 'content',
                                        handler: data => {
                                            data = weekSort(data);
                                            let con = [];
                                            let timeMap = {};
                                            data.forEach(item => {
                                                if (!timeMap[item['week']]) {
                                                    timeMap[item['week']] = [item.time]
                                                } else {
                                                    timeMap[item['week']].push(item.time);
                                                }
                                                con.push({
                                                    type: 'tag', style: {marginTop: 8},
                                                    content: `星期${weekEnum[item['week']]} ${item.time}`,
                                                    color: colorList[+item['week'] - 1],
                                                    closable: true,
                                                    onClose: function (e) {
                                                        e.preventDefault();
                                                        uf.ajax({
                                                            url: 'api/mock/deleteClock',
                                                            params: {id: item.id},
                                                            success: data => {
                                                                uf('alreadyClock').reload();
                                                            }
                                                        });
                                                    }
                                                });
                                            });
                                            // 获取今天的闹钟
                                            curClock = timeMap[uf.moment().day()];
                                            // 设置闹铃
                                            setClock(curClock);
                                            return con;
                                        }
                                    }
                                },
                                {
                                    type: 'form',
                                    items: [
                                        {
                                            type: 'select', name: 'week', label: '星期',
                                            placeholder: '请选择星期', mode: 'multiple',
                                            required: true,
                                            options: [
                                                {label: '星期一', value: 1},
                                                {label: '星期二', value: 2},
                                                {label: '星期三', value: 3},
                                                {label: '星期四', value: 4},
                                                {label: '星期五', value: 5},
                                                {label: '星期六', value: 6},
                                                {label: '星期日', value: 7},
                                                {label: '整周', value: 0},
                                            ]
                                        },
                                        {
                                            type: 'cascader',
                                            required: true,
                                            placeholder: '时间选择（时/分/秒）', name: 'time', label: '时间',
                                            options: getTimes(),
                                            displayRender: label => label.join(' : ')
                                        },
                                        {
                                            type: 'button',
                                            content: '设置闹钟',
                                            action: 'submit',
                                            mode: 'finish',
                                            icon: 'clock-circle'
                                        },
                                        {
                                            type: 'button',
                                            content: '关闭闹钟', name: 'closeClock',
                                            mode: 'waiting', disabled: true,
                                            icon: 'pause-circle', onClick: e => {
                                                closeClock();
                                            }
                                        }
                                    ],
                                    onSubmit: val => {
                                        let param = [];
                                        val.week.forEach(item => {
                                            param.push({
                                                week: item,
                                                time: val.time.join(' : ')
                                            });
                                        });
                                        uf.ajax({
                                            url: 'api/mock/setClock',
                                            params: param,
                                            success: data => {
                                                uf('alreadyClock').reload();
                                            }
                                        });
                                    }
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'table',
                name: 'diyTable',
                columns: [
                    {title: 'ID', dataIndex: 'id', key: 'id', display: false},
                    {title: '时间', dataIndex: 'date', key: 'date'},
                    {
                        title: '所有事件', dataIndex: 'endTime', key: 'allEvent', render: v => {
                            return eventList.map(item => ({
                                type: 'p', content: item
                            }));
                        }
                    },
                    {
                        title: '已做事件', dataIndex: 'doneEvent', key: 'doneEvent', render: v => {
                            return v.map(item => ({
                                type: 'p', content: item, style: {color: 'green'}
                            }));
                        }
                    },
                    {
                        title: '未做事件', dataIndex: 'noneEvent', key: 'noneEvent', render: v => {
                            return v.map(item => ({
                                type: 'p', content: item, style: {color: '#cc3b3b'}
                            }));
                        }
                    },
                    {
                        title: '操作',
                        dataIndex: '_operation',
                        width: 100,
                        render: function () {
                            return [
                                // {type: 'a', content: '编辑', action: 'edit'},
                                {type: 'a', content: '删除', action: 'delete'}
                            ];
                        }
                    }
                ],
                rowSelection: {selections: true},
                title: {
                    // extra: [
                    //     {
                    //         type: 'button',
                    //         mode: 'primary',
                    //         style: {marginLeft: 16},
                    //         icon: 'plus',
                    //         content: '新增', action: 'add'
                    //     },
                    //     {
                    //         type: 'button',
                    //         mode: 'primary',
                    //         style: {marginLeft: 16},
                    //         icon: 'delete',
                    //         content: '批量删除', action: 'batchDelete'
                    //     }
                    // ],
                    text: '自定义列表',
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
                    url: 'api/mock/getDiyList',
                    method: 'get',
                    handler: function (data) {
                        let curData = data.filter(item => item.date === uf.moment().format('YYYY-MM-DD'));
                        if (curData.length) {
                            let doneEventKeys = curData[0]['doneEvent'];
                            uf('diyTransfer').set({targetKeys: doneEventKeys});
                        }
                        return data || [];
                    }
                },
                crud: {
                    /* add: {
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
                     }*/
                }
            }
        ]
    };
});