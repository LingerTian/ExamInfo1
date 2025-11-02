import { defineConfig } from 'umi';
import type { ProLayoutProps } from '@ant-design/pro-components';

const defaultSettings: ProLayoutProps['settings'] = {
  navTheme: 'light',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorPrimary: '#165DFF',
  title: '考试管理系统',
  pwa: false,
  iconfontUrl: '',
};

export default defineConfig({
  devtool: 'eval',
  targets: {
    chrome: 80,
  },
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: '登录',
          path: '/user/login',
          component: './user/Login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        {
          name: '考试信息查询',
          path: '/exam',
          component: './exam',
        },
        {          name: '考试详情',          path: '/exam/:id',          component: './exam/detail',        },        {          name: '考场分布',          path: '/exam/:id/room-distribution',          component: './exam/RoomDistribution',        },
        {
          path: '/',
          redirect: '/exam',
        },
      ],
    },
  ],
  theme: {
    'font-size-base': '14px',
    'primary-color': '#165DFF',
    'background-color-base': '#ffffff',
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: {},
  manifest: {
    basePath: '/',
  },
});