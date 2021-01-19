import React, { useEffect, useRef, useState } from 'react';
import { CATLOG_TYPE_INCOME, CATLOG_TYPES } from '@/utils/constants';
import merge from 'lodash/merge';
// components
import { EChart } from '@/components/taro-eCharts';
import AnalyseCard from '../anaylseCord';
import { onTypeChangeEvent } from '@/components/analyseCardTitle';

interface ChartData {
  data: number[];
  xAxis: string[];
}

interface MonthAnlyseProps {
  income?: ChartData;
  outcome?: ChartData;
}

const defaultData = {
  data: [] as number[],
  xAxis: [] as string[],
};

const defaultOption = {
  color: ['#3398DB'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      show: false,
      // 坐标轴指示器，坐标轴触发有效
      type: 'none',
    },
    triggerOn: 'click',
    showContent: false,
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      data: [] as string[],
      type: 'category',
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#888888',
      },
      axisLine: {
        lineStyle: {
          color: '#eeeeee',
        },
      },
      triggerEvent: false,
    },
  ],
  yAxis: {
    show: false,
    axisLabel: {
      show: false,
    },
  },
  series: [
    {
      type: 'bar',
      barWidth: '30%',
      stack: 'one',
      data: [],
      silent: true,
      animation: false,
    },
    {
      type: 'bar',
      barWidth: '30%',
      stack: 'one',
      data: [] as number[],
      emphasis: {
        label: {
          show: true,
          position: 'top',
          formatter: params => {
            let count = Number(params.value);
            if (isNaN(count)) count = 0;
            let countStr = count.toFixed(2);
            return `￥${countStr}`;
          },
        },
      },
    },
  ],
};

/**
 * 月统计组件
 *
 * @param {MonthAnlyseProps} props
 * @return {*}
 */
const MonthAnlyse = (props: MonthAnlyseProps) => {
  const { income = defaultData, outcome = defaultData } = props;

  const echartsRef = useRef<{ refresh: (config: any) => void }>();

  // 切换输出
  const [activeType, setActiveType] = useState<1 | 2>(1);
  const handleSwitchChange = (ev: onTypeChangeEvent) => {
    const { currentActive } = ev;
    setActiveType(currentActive);
  };

  useEffect(() => {
    function createOption() {
      const copyOption = merge({}, defaultOption);

      let color = CATLOG_TYPES.INCOME.COLOR;
      let data = defaultData;
      if (activeType === CATLOG_TYPE_INCOME) {
        data = income;
        color = CATLOG_TYPES.INCOME.COLOR;
      } else {
        data = outcome;
        color = CATLOG_TYPES.OUTCOME.COLOR;
      }
      copyOption.color[0] = color;
      copyOption.xAxis[0].data = data.xAxis;
      copyOption.series[1].data = data.data;
      let max = data.data.reduce((max, item) => {
        return Math.max(max, item);
      }, 0);
      copyOption.series[0].data = new Array(data.data.length).fill(max / 50);

      return copyOption;
    }
    let option = createOption();

    echartsRef.current?.refresh(option);
  }, [activeType, income, outcome]);

  return (
    <AnalyseCard
      title='每月对比'
      onSwitchChange={handleSwitchChange}
      defaultActiveType={activeType}
    >
      <EChart ref={echartsRef} height={200}></EChart>
    </AnalyseCard>
  );
};

export default MonthAnlyse;
