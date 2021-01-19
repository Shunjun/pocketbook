import React from 'react';
import { View, Text } from '@tarojs/components';
import withWeapp from '@tarojs/with-weapp';
import classnames from 'classnames';
import { fixDigit } from '@/utils/tools';
import { dateFormat } from '@/utils/date';
import { isSameDay } from './utils/isSameDay';
import { CATLOG_TYPE_INCOME, CATLOG_TYPE_OUTCOME } from '@/utils/constants';
import style from './index.module.scss';
// type
import { DataItem } from '@/types/userData';

interface MonthCollectPropsType {
  date: Date;
  title: string;
  outcomeExpense: number;
  incomeExpense: number;
  list: DataItem[];
}

@withWeapp({
  /**
   * 组件的属性列表
   */
  properties: {
    date: String,
    title: String,
    outcomeExpense: Number,
    incomeExpense: Number,
    list: Array,
  },
})
class _C extends React.Component<MonthCollectPropsType, any> {
  data: MonthCollectPropsType;
  config = {
    component: true,
  };

  showTodayFlag(date: Date) {
    const today = new Date();
    const yesterday = new Date(today.valueOf() - 1000 * 60 * 60 * 24);

    if (isSameDay(date, today)) {
      return <Text className={style.todayFlag}>{'今天'}</Text>;
    }
    if (isSameDay(date, yesterday)) {
      return <Text className={style.todayFlag}>{'昨天'}</Text>;
    }
    return null;
  }

  contentRender(list: DataItem[]) {
    if (!Array.isArray(list)) return null;
    let DataItems = list.map(item => {
      return (
        <View
          className={classnames({
            [style.outcome]: item.type === CATLOG_TYPE_OUTCOME,
            [style.income]: item.type === CATLOG_TYPE_INCOME,
            [style.dataItemList]: true,
          })}
          key='_id'
        >
          <View className={style.catlogIcon}>
            <Text className={classnames(['iconfont', item.iconName])}></Text>
          </View>
          <View className={style.descView}>
            <View className={style.desc}>
              <Text className={style.catlog}>{item.catlogTitle}</Text>
              <Text className={style.amount}>
                {`${item.type === CATLOG_TYPE_OUTCOME ? '-' : '+'} ${fixDigit(item.amount, 2)}`}
              </Text>
            </View>
            <View className={style.time}>{dateFormat('hh:ss', new Date(item.add_date))}</View>
          </View>
        </View>
      );
    });

    return DataItems;
  }

  render() {
    const { date, outcomeExpense, incomeExpense, list, title } = this.data;
    return (
      <View className={style.listItemWarp}>
        <View className={style.listItem}>
          <View className={style.title}>
            <View className={style.left}>
              <Text>{title}</Text>
              {this.showTodayFlag(date)}
            </View>
            <View className={style.right}>
              <View className={style.income}>
                <Text className={style.icon}>支</Text>
                <Text>{fixDigit(outcomeExpense, 2)}</Text>
              </View>
              <View className={style.outcome}>
                <Text className={style.icon}>收</Text>
                <Text>{fixDigit(incomeExpense, 2)}</Text>
              </View>
            </View>
          </View>

          <View className={style.content}>{this.contentRender(list)}</View>
        </View>
      </View>
    );
  }
}

export default _C;
