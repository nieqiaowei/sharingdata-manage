import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
				{
				    path: '/demo',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/Demo.vue'),
				    meta: { title: 'demo' }
				},
				{
				    path: '/datarole',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/DataRole.vue'),
				    meta: { title: '数据角色管理' }
				},
				{
				    path: '/dataconsumerlist',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/DataConsumerList.vue'),
				    meta: { title: '数据消费管理' }
				},
				{
				    path: '/dataproducerlist',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/DataProducerList.vue'),
				    meta: { title: '数据发布管理' }
				},
				{
				    path: '/datasource',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/DataSource.vue'),
				    meta: { title: '数据存储管理' }
				},
				{
				    path: '/sourcetype',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/SourceType.vue'),
				    meta: { title: '数据源类型管理' }
				},
                {
                    path: '/datauser',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/DataUser.vue'),
                    meta: { title: '用户管理' }
                },
				{
				    path: '/Producer',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/Produceruser.vue'),
				    meta: { title: '生产业务管理' }
				},
				{
				    path: '/Consumer',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/Consumeruser.vue'),
				    meta: { title: '消费业务管理' }
				},
				{
				    path: '/ConsumerRole',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/ConsumerRole.vue'),
				    meta: { title: '消费业务管理' }
				},
				{
				    path: '/Syslog',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/Syslog.vue'),
				    meta: { title: '系统监控日志' }
				},
				{
				    path: '/Sysmanager',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/Sysmanager.vue'),
				    meta: { title: '系统配置管理' }
				},
				{
				    path: '/layerDemo',
				    component: () => import(/* webpackChunkName: "table" */ '../components/page/LayerDemo.vue'),
				    meta: { title: '数据传输Demo' }
				},
				
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
