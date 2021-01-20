import React, { useEffect, useState, useRef } from 'react';
import { Block, View, Picker, Text } from '@tarojs/components';
import classnames from 'classnames';
import style from './style.module.scss';
import {
  dateFormat,
  DateNumber2DateString,
  getMonthList,
  getDateObj,
  isLastDayOfMonth,
  isFirstDayOfMonth,
  DateType,
  subtractDate,
  getMonthDateList,
} from '@/utils/date';
import { getMonthStatistic, getDailyStatistic } from '@/requests/analyse';
import { MonthStatisticType } from '@/types/analyse';
import { merge } from 'lodash';
import useTabbarInfo from '@/hooks/useTabbarInfo';
// components
import { ScrollView } from '@tarojs/components';
import MonthAnalyse from './components/monthAnaylse';
import DailyAnalyse from './components/dailyAnaylse';
import Totalize from './components/totalize';
import NavBar from '@/components/Navbar';
import BookTabBar from '@/components/TabBar';

interface CurMonthTotalizeType {
  month: string;
  income: number;
  outcome: number;
}

type chartsDataType = typeof defaultchartsData;

const defaultCurMonthTotalize = {
  month: '2012-01',
  income: 0,
  outcome: 0,
};

const defaultchartsData = {
  income: {
    xAxis: [] as string[],
    data: [] as number[],
  },
  outcome: {
    xAxis: [] as string[],
    data: [] as number[],
  },
};

/**
 * 获取日期的x轴
 *
 * @param {DateType} day
 * @return {*}  {string}
 */
function getDayXAxis(day: DateType): string {
  const dayDate = getDateObj(day);
  if (isFirstDayOfMonth(dayDate) || isLastDayOfMonth(dayDate)) {
    return `${dayDate.getMonth() + 1}.${dayDate.getDate()}`;
  }
  return dayDate.getDate() + '';
}

/**
 * 获取月份的x轴
 *
 * @param {DateType} month
 * @return {*}  {string}
 */
function getMonthXAxis(month: DateType): string {
  return '';
}

/**
 * 处理Charts显示的数据
 *
 * @param {*} data
 * @return {*}
 */
function transformDataForCharts(month, data) {
  const chartsData: chartsDataType = merge({}, defaultchartsData);
  if (data.length === 0) return chartsData;

  const lastSixMonth = subtractDate(month, 6, 'month');

  // 找到显示的月份
  const dateList = getMonthList(month, lastSixMonth).slice(-6);

  dateList.forEach(item => {
    const dataItem = data.find(d => DateNumber2DateString(d.month) === item);
    const income = dataItem?.expenses.income.expense || 0;
    const outcome = dataItem?.expenses.outcome.expense || 0;
    // TODO :处理跨年的月份
    const xAxis = Number(item.slice(-2)) + '月';

    chartsData.income.xAxis.push(xAxis);
    chartsData.income.data.push(income as number);
    chartsData.outcome.xAxis.push(xAxis);
    chartsData.outcome.data.push(outcome as number);
  });

  return chartsData;
}

/**
 * 处理每日Charts显示的数据
 *
 * @param {*} data
 * @return {*}
 */
function transformDataForDailyCharts(month: string, data) {
  const chartsData = merge({}, defaultchartsData);
  const dateList = getMonthDateList(month);

  console.log('🍉', data, dateList);

  dateList.forEach(item => {
    const dayItem = data.find(d => DateNumber2DateString(d.date) === item);
    const income = dayItem?.expenses.income.expense || 0;
    const outcome = dayItem?.expenses.outcome.expense || 0;
    const xAxis = getDayXAxis(item);

    chartsData.income.xAxis.push(xAxis);
    chartsData.income.data.push(income as number);
    chartsData.outcome.xAxis.push(xAxis);
    chartsData.outcome.data.push(outcome as number);
  });

  return chartsData;
}

/**
 * 分析页组件
 *
 * @param {*} props
 * @return {*}
 */
const Analyse = props => {
  const {} = props;

  // picker
  const [pickerMonth, setPickerMonth] = useState(dateFormat('yyyy-MM', new Date()));
  const handleDatePickerCheange = ev => {
    const { value } = ev.detail;
    setPickerMonth(value);
  };

  // 获取月份统计数据
  const [totalizeData, setTotalizeData] = useState<MonthStatisticType>([]);
  const [curMonthTotalize, setCurMonthTotalize] = useState<CurMonthTotalizeType>(
    defaultCurMonthTotalize,
  );
  useEffect(() => {
    getMonthStatistic().then(res => {
      setTotalizeData(res);
    });
  }, []);

  // 计算当前月份数据
  useEffect(() => {
    let data = {
      month: pickerMonth,
      income: 0,
      outcome: 0,
    };

    for (let i = 0; i < totalizeData.length; i++) {
      const item = totalizeData[i];
      if (DateNumber2DateString(item.month) === pickerMonth) {
        data = {
          month: pickerMonth,
          income: item.expenses.income.expense,
          outcome: item.expenses.outcome.expense,
        };
      }
    }

    setCurMonthTotalize(data);
  }, [pickerMonth, totalizeData]);

  // 处理数据用来显示图表
  const [chartData, setChartData] = useState<chartsDataType>();
  useEffect(() => {
    setChartData(transformDataForCharts(pickerMonth, totalizeData));
  }, [pickerMonth, totalizeData]);

  // 获取导航栏与tab栏高度
  const [tabbarInfo] = useTabbarInfo();
  const navbarRef = useRef<any>();
  const [navbarheight, setNavbarheight] = useState();
  useEffect(() => {
    let height = navbarRef.current.getNavbarHeight();
    setNavbarheight(height);
  });

  // 获取每日的统计数据
  const [dailyChartData, setDailyChartData] = useState<chartsDataType>();
  useEffect(() => {
    getDailyStatistic(pickerMonth).then(res => {
      // TODO
      const data = transformDataForDailyCharts(pickerMonth, res);
      setDailyChartData(data);
    });
  }, [pickerMonth]);

  return (
    <Block>
      <NavBar title='统计' color='#fff' background='#2da2b2' ref={navbarRef} />

      <ScrollView
        scrollY
        style={{ position: 'fixed', top: `${navbarheight}px`, bottom: `${tabbarInfo.height}px` }}
      >
        <View className={style.summary}>
          <Picker value={pickerMonth} mode='date' fields='month' onChange={handleDatePickerCheange}>
            <View className={style.mouthPicker}>
              {dateFormat('yyyy年MM月', new Date(pickerMonth))}
              <Text className='dividingline-black'></Text>
              <Text className={classnames(['iconfont', 'iconrili', style.icon])}></Text>
            </View>
          </Picker>
          <Totalize income={curMonthTotalize.income} outcome={curMonthTotalize.outcome} />
        </View>

        <DailyAnalyse income={dailyChartData?.income} outcome={dailyChartData?.outcome} />
        <MonthAnalyse income={chartData?.income} outcome={chartData?.outcome} />
      </ScrollView>

      {/* tabbar */}
      <BookTabBar current={1} />
    </Block>
  );
};

export default Analyse;
