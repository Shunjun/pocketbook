import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import withWeapp from '@tarojs/with-weapp';
import style from './style.module.scss';
import { dateFormat, DateNumber2Date } from '@/utils/date';

interface MonthCollectPropsType {
  month: number;
  monthIncome: number;
  monthOutcome: number;
  hide: boolean;
}

@withWeapp({
  /**
   * 组件的属性列表
   */
  properties: {
    month: Number,
    monthIncome: Number,
    monthOutcome: Number,
    hide: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {},
})
class _C extends React.PureComponent<any, MonthCollectPropsType> {
  data: MonthCollectPropsType;
  config = {
    component: true,
  };
  render() {
    const { month, monthIncome, monthOutcome, hide } = this.data;
    return (
      <View
        className={classnames({
          [style.hide]: hide,
          [style.collect]: true,
          collect: true,
        })}
      >
        <Text className={style.month}>{dateFormat('yyyy年MM月', DateNumber2Date(month))}</Text>
        <View className={style.expence}>
          <View className={style.dividinglineBlack}></View>
          <Text className={style.expenceItem}>{'总支出￥' + Number(monthOutcome).toFixed(2)}</Text>
          <Text className={style.expenceItem}>{'总收入￥' + Number(monthIncome).toFixed(2)}</Text>
        </View>
      </View>
    );
  }
}

export default _C;
