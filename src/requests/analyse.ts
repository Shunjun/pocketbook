import { getItem } from '@/utils/store';
import { request } from '@/utils/request';
import { MonthStatisticType } from '@/types/analyse';
import { getSession } from './user';

export interface UserDataQueryType {
  page: number;
  catlog_id: number;
  month: number;
}

/**
 * 获取按月的统计
 */
export const getMonthStatistic = async (): Promise<MonthStatisticType> => {
  if (!getItem('openId')) {
    getSession();
  }
  const requestDate = {
    openId: getItem('openId'),
  };
  return await request({
    name: 'monthStatistic',
    data: requestDate,
  });
};

/**
 * 获取按日的统计
 */
export const getDailyStatistic = async (month: string): Promise<MonthStatisticType> => {
  if (!getItem('openId')) {
    getSession();
  }
  const requestDate = {
    openId: getItem('openId'),
    month,
  };
  return await request({
    name: 'dailyStatistic',
    data: requestDate,
  });
};
