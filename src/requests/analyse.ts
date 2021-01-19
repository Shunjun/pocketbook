import { getItem } from '@/utils/store';
import { request } from '@/utils/request';
import { MonthStatisticType } from '@/types/analyse';

export interface UserDataQueryType {
  page: number;
  catlog_id: number;
  month: number;
}
/**
 * 获取按月的统计
 */
export const getMonthStatistic = async (): Promise<MonthStatisticType> => {
  const requestDate = {
    openId: getItem('openId'),
  };
  return await request({
    name: 'monthStatistic',
    data: requestDate,
  });
};
