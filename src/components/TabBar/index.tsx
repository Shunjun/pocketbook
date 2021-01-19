import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
import { AtTabBar } from 'taro-ui';
import AppConfig from '@/app.config';
import useTabbarInfo, { setHeightAct } from '@/hooks/useTabbarInfo';

interface BookTabBarProps {
  current: number;
}

const tabList = AppConfig.tabBar.list.map(item => {
  return {
    title: item.text,
    image: item.iconPath,
    selectedImage: item.selectedIconPath,
  };
});

const pages = AppConfig.tabBar.list.map(item => {
  return {
    url: item.pagePath,
  };
});

const TABBAR_HEIGHT = 65;

const BookTabBar = (props: BookTabBarProps) => {
  const { current } = props;

  // 事件处理
  const handleSwitchTab = (index: number) => {
    for (let i = 0; i < pages.length; i++) {
      if (i === index) {
        Taro.switchTab({
          url: `/${pages[i].url}`,
        });
        console.log('切换');
      }
    }
  };

  const [tabbarInfo, dispatch] = useTabbarInfo();
  useEffect(() => dispatch(setHeightAct(TABBAR_HEIGHT)), []);

  return (
    <AtTabBar
      customStyle={{ height: `${tabbarInfo.height}px` }}
      fixed
      color='#666'
      selectedColor='#2da2b2'
      iconSize={20}
      tabList={tabList}
      onClick={handleSwitchTab}
      current={current}
    ></AtTabBar>
  );
};

export default BookTabBar;
