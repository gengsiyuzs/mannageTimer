/**
 * @file app 配置文件
 * Created by gengsiyu
 */
define(function (uf, require) {
    let utils = require('./common/utils.js');
    return {
        type: 'layout',
        content: [
            {
                type: 'header',
                style: {
                    background: '#7dbcea',
                    color: '#fff',
                    textAlign: 'right'
                },
                content: {
                    type: 'row',
                    content: [
                        {type: 'col', span: 18},
                        {
                            type: 'col', span: 6, content: [
                                {
                                    type: 'icon',
                                    mode: 'setting',
                                    style: {
                                        fontSize: 16,
                                        cursor: 'pointer'
                                    },
                                    onClick: e => {
                                        uf('loginModal').show({update: true});
                                    }
                                },
                                {
                                    type: 'span', style: {
                                        fontSize: 16, marginLeft: 16, cursor: 'pointer'
                                    }, content: '请登录', name: 'userInfo',
                                    source: {
                                        url: 'api/mock/getStoreInfo',
                                        params: {name: 'person'},
                                        target: 'content',
                                        handler: data => {
                                            return [
                                                {
                                                    type: 'div',
                                                    style: {
                                                        verticalAlign: 'middle',
                                                        width: 30, height: 30, display: 'inline-block',
                                                        background: (function () {
                                                            switch (data.sex) {
                                                                case '女':
                                                                    return 'url(../assets/png/女孩.png) no-repeat';
                                                                case '男':
                                                                    return 'url(../assets/png/男孩.png) no-repeat';
                                                                default:
                                                                    return 'url(../assets/png/中性_32.png) no-repeat';
                                                            }
                                                        })(),
                                                        backgroundSize: '100% 100%'
                                                    }
                                                },
                                                {type: 'span', content: data && data.person || '请登录'}
                                            ];
                                        }
                                    },
                                    onClick: e => {
                                        // utils.storeDataList('person');
                                        let val = e.target.innerHTML;
                                        if (val === '请登录') {
                                            uf('loginModal').show();
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            // 面包屑
            {
                type: 'breadcrumb',
                style: {background: '#E8ECF0'}
            },
            {
                type: 'content',
                content: {
                    type: 'layout',
                    content: [
                        {
                            type: 'sider',
                            style: {
                                // background: '#3ba0e9',
                                // color: '#fff',
                                // textAlign: 'center',
                                // lineHeight: '120px'
                            },
                            content: {
                                type: 'menu',
                                mode: 'inline',
                                theme: 'dark',
                                defaultOpenKeys: ['partView'],
                                items: [
                                    {
                                        key: 'timeList',
                                        icon: 'appstore',
                                        title: '时间列表',
                                        link: '/timeList'
                                    },
                                    {
                                        key: 'diy',
                                        icon: 'appstore',
                                        title: '自定义记录',
                                        link: '/diy'
                                    },
                                    {
                                        key: 'user',
                                        icon: 'user',
                                        title: '个人中心',
                                        link: '/user'
                                    }
                                ]
                            }
                        },
                        {
                            type: 'content',
                            style: {
                                // background: '#108ee9',
                                // color: '#fff',
                                // textAlign: 'center',
                                // minHeight: '120px',
                                // lineHeight: '120px'
                            },
                            content: {
                                type: 'div',
                                style: {background: '#fff', overflow: 'auto', padding: '10px 20px', height: '100%'},
                                childrenHolder: true
                            }
                        }
                    ]
                }
            },
            {
                type: 'footer',
                style: {
                    background: '#7dbcea',
                    color: '#fff',
                    textAlign: 'center'
                },
                content: '助你成为真正的时间管理大师，超越罗志祥'
            },
            // 登录框
            {
                type: 'modal',
                name: 'loginModal',
                destoryOnClose: true,
                visible: false,
                title: '登录',
                render: row => {
                    return {
                        type: 'form',
                        name: 'editUserInfoForm',
                        items: [
                            {
                                type: 'input',
                                name: 'person',
                                label: '你叫啥',
                                required: true
                            },
                            {
                                type: 'input-number', required: true,
                                name: 'age', style: {width: '100%'},
                                label: '你多大了'
                            },
                            {
                                type: 'radio',
                                name: 'sex',
                                label: '性别', required: true,
                                options: ['男', '女', '不详']
                            }
                        ]
                    };
                },
                onSubmit: row => {
                    let data = uf('editUserInfoForm').getValues(true);
                    if (!data) {
                        uf.message.error('填完整不行嘛！！');
                        return false;
                    }
                    if (row.update) {
                        utils.updateStoreData('person', data, 1).then(data => {
                            uf('userInfo').reload();
                        });
                    } else {
                        utils.addDataStore('person', data).then(data => {
                            uf('userInfo').reload();
                        });
                    }
                }
            }
        ]
    };
});
