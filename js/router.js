/**
 * @file 整个应用的路由配置
 * Created Date: 2018-05-21 14:11:07
 */
define(function () {
    return {
        type: 'router',
        routes: [
            {
                path: '/',
                component: 'app',
                breadcrumbName: '时间管理',
                indexRedirect: 'timeList',
                childRoutes: [
                    {
                        path: 'timeList',
                        breadcrumbName: '时间列表',
                        component: 'components/timeList'
                    },
                    {
                        path: 'user',
                        breadcrumbName: '个人中心',
                        component: 'components/user'
                    },
                    {
                        path: 'diy',
                        breadcrumbName: '自定义',
                        component: 'components/diy'
                    }
                ]
            }
        ]
    };
});
