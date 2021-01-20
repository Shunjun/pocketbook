export default {
  pages: ['pages/index/index', 'pages/analyse/index', 'pages/setting/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    custom: true,
    list: [
      {
        text: '明细',
        pagePath: 'pages/index/index',
        iconPath: '/assets/images/detail.png',
        selectedIconPath: '/assets/images/detail-fill.png',
      },
      {
        text: '统计',
        pagePath: 'pages/analyse/index',
        iconPath: '/assets/images/piechart.png',
        selectedIconPath: '/assets/images/piechart-fill.png',
      },
      {
        text: '设置',
        pagePath: 'pages/setting/index',
        iconPath: '/assets/images/control.png',
        selectedIconPath: '/assets/images/control-fill.png',
      },
    ],
  },
};
