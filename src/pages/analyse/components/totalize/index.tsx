import React from 'react';
import { View, Text } from '@tarojs/components';
import style from './style.module.scss';

interface TotalizeProps {
  income: number;
  outcome: number;
}

const Totalize = (props: TotalizeProps) => {
  const { income = 0, outcome = 0 } = props;

  return (
    <View className={style.container}>
      <View className={style.outcome}>
        <View className={style.label}>共支出</View>
        <View className={style.amount}>
          <Text className={style.subscript}>￥</Text>
          <Text>{Number(outcome).toFixed(2)}</Text>
        </View>
      </View>
      <View className={style.income}>
        共收入
        <View className={style.amount}>￥{Number(income).toFixed(2)}</View>
      </View>
    </View>
  );
};

export default Totalize;
