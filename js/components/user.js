/**
 * @file app 时间列表
 * Created by gengsiyu
 */

define(function (uf, require) {
    let utils = require('../common/utils.js');
    let yAxisConf = {
        nameTextStyle: {
            align: 'right',
            padding: [0, 0, 16, 0]
        },
        splitLine: {
            show: false
        },
        axisLine: {
            show: true
        },
        axisTick: {
            show: false
        }
    };
    let echartConf = {
        type: 'echarts',
        name: 'timeManageEcharts',
        title: {
            text: '事件管理率', left: 'center',
            textStyle: {
                fontSize: 14
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        legend: {
            data: ['蒸发量', '降水量', '平均温度']
        },
        xAxis: {
            type: 'category',
            data: [],
            axisPointer: {
                type: 'shadow'
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '时间',
                min: 0,
                ...yAxisConf,
                axisLabel: {
                    formatter: '{value} h'
                }
            },
            {
                type: 'value',
                name: '利用率',
                ...yAxisConf,
                min: 0,
                max: 100,
                axisLabel: {
                    formatter: '{value} %'
                }
            }
        ],
        series: []
    };

    const titleEnum = {
        '事件小白': 3,
        '时间管理者': 10,
        '事件小王子': 18,
        '小罗志祥': 30,
        '罗志祥本祥': 50
    };

    // 相加
    function add(...times) {
        let total = 0;
        times.forEach(item => {
            total += Number(item);
        });
        return total;
    }

    // 处理获取回来的信息，分类处理
    function formatTimeList(data) {
        let classMap = {};
        data.forEach(item => {
            let startDate = uf.moment(item.startTime).format('YYYY-MM-DD');
            let start = item.startTime;
            let end = item.endTime;
            if (!classMap[startDate]) {
                classMap[startDate] = {};
                if (end) {
                    if (!classMap[startDate][item.type]) {
                        classMap[startDate][item.type] = add(utils.getTimeDiff(start, end));
                    } else {
                        classMap[startDate][item.type] = add(classMap[startDate][item.type],
                            utils.getTimeDiff(start, end));
                    }
                } else {
                    classMap[startDate][item.type] = add(classMap[startDate][item.type]) || 0;
                }
            } else {
                if (end) {
                    if (!classMap[startDate][item.type]) {
                        classMap[startDate][item.type] = add(utils.getTimeDiff(start, end));
                    } else {
                        classMap[startDate][item.type] = add(classMap[startDate][item.type],
                            utils.getTimeDiff(start, end));
                    }
                } else {
                    classMap[startDate][item.type] = add(classMap[startDate][item.type]) || 0;
                }
            }
        });
        return classMap;
    }

    // 把分类数据处理成表格要的数据
    function formatEchartData(data) {
        // 先拿出所有的事件
        let allEvents = [];
        // X轴
        let xData = [];
        for (let key in data) {
            let item = data[key];
            xData.push(key);
            for (let cur in item) {
                if (!allEvents.includes(cur)) {
                    allEvents.push(cur);
                }
            }
        }
        // 构建series
        let series = [];
        let yAxis = [];
        allEvents.forEach(item => {
            series.push({
                name: item,
                type: 'bar',
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                data: (function () {
                    return xData.map(cur => {
                        return data[cur][item];
                    });
                })()
            });
        });
        // 加入利用率
        series.push({
            data: (function () {
                let arr = [];
                xData.forEach(item => {
                    let total = 0;
                    for (let key in data[item]) {
                        total = add(data[item][key], total);
                    }
                    arr.push(((total / 24) * 100).toFixed(2));
                });
                return arr;
            })(),
            name: '利用率',
            markPoint: {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            },
            type: 'line',
            yAxisIndex: 1
        });
        echartConf.series = series;
        echartConf.xAxis.data = xData;
        return echartConf;
    }

    // 获取称号
    function getTitle(data) {
        let titleIndex = [3, 10, 18, 30, 50];
        let titleEnum = {
            3: '事件小白',
            10: '时间管理者',
            18: '事件小王子',
            30: '小罗志祥',
            50: '罗志祥本祥'
        };
        let length = data.length;
        let title = titleEnum[length];
        if (title) {
            return title;
        }
        titleIndex.forEach((item, index) => {
            if (length >= item && length < titleIndex[index + 1]) {
                title = titleEnum[item];
            }
        });
        return title;
    }

    // 获得称号时间
    function getTitleTime(title, data) {
        return data[titleEnum[title] - 1]['startTime'];
    }

    return {
        type: 'div', content: [
            {
                type: 'row',
                content: [
                    {
                        type: 'col', span: 6,
                        content: [
                            {
                                type: 'list',
                                columns: [
                                    {
                                        title: '姓名',
                                        dataIndex: 'person'
                                    },
                                    {
                                        title: '年龄',
                                        dataIndex: 'age'
                                    },
                                    {
                                        title: '性别',
                                        dataIndex: 'sex'
                                    }
                                ],
                                source: {
                                    url: 'api/mock/getStoreInfo', target: 'data'
                                },
                                bordered: false
                            },
                            {
                                type: 'timeline',
                                pending: {type: 'p', content: '至今'},
                                style: {margin: '8px 0 0 8px'},
                                source: {
                                    url: 'api/mock/getTimeList', target: 'content',
                                    handler: data => {
                                        let firstTime = data[0];
                                        if (!firstTime) {
                                            return '';
                                        }
                                        // 第一次事件
                                        let firstEvent = [];
                                        // 事件池
                                        let eventPool = [];

                                        data.forEach(item => {
                                            if (!firstEvent.includes(item.type)) {
                                                firstEvent.push(item.type);
                                                eventPool.push({
                                                    type: 'timeline-item',
                                                    content: `第一次记录『${item.type}』事件 ： ` + item.startTime,
                                                    color: 'green'
                                                });
                                            }
                                        });

                                        if (data.length >= 3) {
                                            eventPool.push({
                                                type: 'timeline-item',
                                                content: `获得『${getTitle(data)}』称号 ： ${getTitleTime(getTitle(data), data)}`,
                                                color: 'red'
                                            });
                                        }

                                        return eventPool;
                                    }
                                }
                            }
                        ]
                    },
                    {
                        type: 'col', span: 18,
                        source: {
                            url: 'api/mock/getTimeList', target: 'content',
                            handler: data => {
                                let dataMap = formatEchartData(formatTimeList(data));
                                return dataMap;
                            }
                        }
                    }
                ]
            }
        ]
    };
});