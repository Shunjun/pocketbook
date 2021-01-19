import { View } from '@tarojs/components';
import React, { useState } from 'react';
import style from './style.module.scss';
import { CATLOG_TYPE_INCOME, CATLOG_TYPE_OUTCOME } from '@/utils/constants';

// components
import SwitchItem from '../switchItem';

export interface onTypeChangeEvent {
  currentActive: typeof CATLOG_TYPE_INCOME | typeof CATLOG_TYPE_OUTCOME;
}

interface AnalyseCardTieleProps {
  title: string;
  onTypeChange: (ev: onTypeChangeEvent) => void;
  defaultActiveType?: 1 | 2;
}
const AnalyseCardTiele = (props: AnalyseCardTieleProps) => {
  const { title, onTypeChange, defaultActiveType = 1 } = props;

  // 切换开关
  const [activeType, setActiveType] = useState<1 | 2>(defaultActiveType);
  const handleSwitch = ev => {
    const { active } = ev.detail;
    setActiveType(active);
    const typeChangeEvent = {
      currentActive: active,
    };
    onTypeChange(typeChangeEvent);
  };

  return (
    <View className={style.titleContainer}>
      <View>{title}</View>
      <SwitchItem onSwitch={handleSwitch} activeType={activeType} size='small' />
    </View>
  );
};

export default AnalyseCardTiele;
