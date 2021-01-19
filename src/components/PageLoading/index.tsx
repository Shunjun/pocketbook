import React from 'react';
import { View } from '@tarojs/components';
import style from './style.module.scss';
import classnames from 'classnames';

interface pageLoadingProps {
  className?: string;
}

const pageLoading = (props: pageLoadingProps) => {
  const { className } = props;
  return (
    <View className={classnames([style.fullHeight, style.flexMiddle, className])}>加载中...</View>
  );
};

export default pageLoading;
