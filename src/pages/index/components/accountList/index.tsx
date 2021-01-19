import React, { useState, useRef, useEffect } from 'react';
import { Block, View, ScrollView } from '@tarojs/components';
import EndOfList from '@/components/endOfList';
import Monthcollect from '../monthCollect';
import DayListItem from '../DayListItem';
import useLoadingFlag from '@/hooks/useLoadingFlag';
import useHeaderInfo from '@/hooks/useHeaderInfo';
import style from './index.module.scss';
import useTabbarInfo from '@/hooks/useTabbarInfo';
import { delayQuerySelectAll } from '@/utils/tools';
import { dateFormat } from '@/utils/date';
import PageLoading from '@/components/PageLoading';

// types
import { userDataList } from '@/types/userData';
import { BaseEventOrig } from '@tarojs/components/types';
import { ScrollViewProps } from '@tarojs/components/types/ScrollView';
import { DayItem } from '@/types/userData';

const COLLECT_HEIGHT = 23;

export interface MonthChangeEvent {
  currentIndex: number;
}

interface AccountlistPropsType {
  datas: userDataList;
  refresherTriggered?: boolean;
  onLoadMore?: () => void;
  onRefresherRefresh?: () => void;
  isLoading?: boolean;
  isEndding?: boolean;
  isLoadingMore?: boolean;
  onListMonthChange?: (ev: MonthChangeEvent) => void;
}

const Accountlist = (props: AccountlistPropsType) => {
  const {
    datas,
    refresherTriggered = false,
    onLoadMore,
    onRefresherRefresh,
    isEndding,
    isLoadingMore,
    isLoading = false,
    onListMonthChange,
  } = props;

  const [lTop, setlTop] = useState<number[]>([]);
  const lastIndexRef = useRef(0);

  useEffect(() => {
    _calculateHeight();
    onListMonthChange?.({ currentIndex: lastIndexRef.current });
  }, [datas]);

  const handleSroll = (ev: BaseEventOrig<ScrollViewProps.onScrollDetail>) => {
    const curScrollTop = ev.detail.scrollTop;

    let curIndex = 0;
    const lastIndex = lastIndexRef.current;

    // 判断所在的区间
    lTop.forEach((_item, i) => {
      let top: number, bottom: number;
      if (i === 0) {
        top = lTop[i];
        bottom = lTop[i + 1] + COLLECT_HEIGHT;
      } else if (i === lTop.length - 1) {
        top = lTop[i] + COLLECT_HEIGHT;
        bottom = Infinity;
      } else {
        top = lTop[i] + COLLECT_HEIGHT;
        bottom = lTop[i + 1] + COLLECT_HEIGHT;
      }

      if (curScrollTop >= top && curScrollTop < bottom) {
        curIndex = i;
      }
    });

    // 变化时触发
    if (curIndex !== lastIndex) {
      lastIndexRef.current = curIndex;
      let ev = {
        currentIndex: curIndex,
      };
      onListMonthChange?.(ev);
    }
  };

  /**
   * 获取列表节点高度
   */
  function _calculateHeight() {
    let lTop: number[] = [];
    delayQuerySelectAll('.collect', 0).then(res => {
      const rests = res[0];
      if (rests[0]) {
        const firstTop = rests[0].top;
        new Array(0).forEach.call(rests, item => {
          let thistop: number = item.top - firstTop;
          lTop.push(thistop);
        });
      }
      setlTop(lTop);
    });
  }

  const handleLoadMore = onLoadMore && useLoadingFlag(onLoadMore);
  const headerInfo = useHeaderInfo();
  const [tabberInfo] = useTabbarInfo();

  return (
    <View
      className={style.list}
      style={{
        top: headerInfo.height,
        bottom: tabberInfo.height,
      }}
    >
      {isLoading ? (
        <PageLoading />
      ) : (
        <ScrollView
          className={style.scrollView}
          scrollY
          scrollWithAnimation={false}
          onScroll={handleSroll}
          onRefresherRefresh={onRefresherRefresh}
          refresherEnabled
          refresherTriggered={refresherTriggered}
          onScrollToLower={handleLoadMore}
        >
          {datas.map((item, index) => {
            const { list: dayList } = item;
            return (
              <Block key='_id'>
                <Monthcollect
                  hide={index === 0}
                  month={item._id}
                  monthIncome={item.month_expense_income}
                  monthOutcome={item.month_expense_outcome}
                ></Monthcollect>
                <AccountDayList dayList={dayList} />
              </Block>
            );
          })}
          <EndOfList
            showLoadMore={true}
            isEndding={isEndding}
            isLoading={isLoadingMore}
            onLoadMoreClick={handleLoadMore}
          />
        </ScrollView>
      )}
    </View>
  );
};

interface AccountDaylistPropsType {
  dayList: DayItem[];
}

const AccountDayList = (props: AccountDaylistPropsType) => {
  const { dayList } = props;
  return (
    <Block>
      {dayList.map(dayItem => {
        const { belong_date, day_expense_outcomes, day_expense_incomes, list } = dayItem;

        const dateObj = new Date(belong_date);
        return (
          <View key='_id' className='list-item'>
            <DayListItem
              date={dateObj}
              title={dateFormat('MM月dd日', dateObj)}
              outcomeExpense={day_expense_outcomes}
              incomeExpense={day_expense_incomes}
              list={list}
            />
          </View>
        );
      })}
    </Block>
  );
};

export default Accountlist;
