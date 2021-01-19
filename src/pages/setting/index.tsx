import React from 'react';
// components
import { Block } from '@tarojs/components';
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

      <BookTabBar current={2} />
    </Block>
  );
};

export default Setting;
