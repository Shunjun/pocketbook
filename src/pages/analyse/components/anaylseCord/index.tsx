import React from 'react';
import style from './style.module.scss';
// components
import { View } from '@tarojs/components';
import AnalyseCardTitle, { onTypeChangeEvent } from '@/components/analyseCardTitle';

interface onSwitchChangeFunc {
  (ev: onTypeChangeEvent): void;
}

interface AnlyseCardProps {
  title: string;
  onSwitchChange: onSwitchChangeFunc;
  defaultActiveType?: 1 | 2;
}

const AnlyseCard: React.FC<AnlyseCardProps> = props => {
  const { title, onSwitchChange, children, defaultActiveType } = props;

  return (
    <View className={style.container}>
      <AnalyseCardTitle
        defaultActiveType={defaultActiveType}
        title={title}
        onTypeChange={onSwitchChange}
      />
      <View className={style.chartContainer}>{children}</View>
    </View>
  );
};

export default AnlyseCard;
