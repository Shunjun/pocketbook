import React, { useMemo } from 'react';
import classnames from 'classnames';
import { View, Text, Picker } from '@tarojs/components';
import NavBar from '@/components/Navbar';
import { dateFormat } from '@/utils/date';
import { connect } from 'react-redux';
import style from './index.module.scss';

interface HeaderProps {
  curCatlogIndex: number; // 当前类型
  totalMoney: {
    income: number;
    outcome: number;
  };
  curMonth: string;
  onMonthChange?: (curMonth: string) => void;
  onCatlogChange?: (catlogId: number) => void;
}

const mapStateToProps = ({ catlog }, ownProps: HeaderProps): HeaderProps & { catlogs: any } => {
  return Object.assign({}, catlog, ownProps);
};

const date = new Date();

function Header(props: ReturnType<typeof mapStateToProps>) {
  const { catlogs, curCatlogIndex, totalMoney, curMonth, onCatlogChange, onMonthChange } = props;

  const maxDate = useMemo<string>(() => dateFormat('yyyy-MM-dd', date), [date]);

  const catlog = catlogs[curCatlogIndex];
  return (
    <View className={classnames([style.header])} id='header'>
      <NavBar title='记账本' color='#fff' background='initial' />
      <Picker
        value={curCatlogIndex}
        mode='selector'
        range={catlogs}
        rangeKey='title'
        onChange={e => {
          onCatlogChange && onCatlogChange(Number(e.detail.value));
        }}
      >
        <View className={style.flexControl}>
          <Text>{catlog.title}</Text>
          <View className='dividingline-white'></View>
          <Text className={classnames([`iconfont ${catlog.iconName}`, style.catlogIcon])}></Text>
        </View>
      </Picker>
      <View className={style.dateView}>
        <Picker
          className={style.datePicker}
          value={curMonth}
          mode='date'
          fields='month'
          start='2012-1'
          end={maxDate}
          onChange={e => {
            onMonthChange && onMonthChange(e.detail.value);
          }}
        >
          <Text>{curMonth}</Text>
          <Text className={classnames(['iconfont', 'icontriangle-down'])}></Text>
        </Picker>

        <View className={style.expence}>
          <View className={style.expenceItem}>
            {'总支出￥' + Number(totalMoney.outcome).toFixed(2)}
          </View>
          <View className={style.expenceItem}>
            {'总收入￥' + Number(totalMoney.income).toFixed(2)}
          </View>
        </View>
      </View>
    </View>
  );
}

export default connect(mapStateToProps)(Header);
