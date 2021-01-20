import React from 'react';
// components
import { Block, View } from '@tarojs/components';
import NavBar from '@/components/Navbar';
import BookTabBar from '@/components/TabBar';

interface Setting {
  bgmotion: any;
}

interface SettingProps {}

const Setting = (Props: SettingProps) => {
  return (
    <Block>
      <NavBar title='统计' color='#fff' background='#2da2b2' />
      <View style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        没啥可设置的
      </View>
      <BookTabBar current={2} />
    </Block>
  );
};

export default Setting;
