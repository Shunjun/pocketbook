import { getItem } from '@/utils/store';
import { request } from '@/utils/request';
import { PagingData } from '@/types/request';
import { userDataList } from '@/types/userData';

export interface UserDataQueryType {
  page: number;
  catlog_id: number;
  month: number;
}
/**
 * 请求用户数据列表
 */
export const getUserData = async (query: UserDataQueryType): Promise<PagingData<userDataList>> => {
  const { page, catlog_id, month } = query;
  const queryData = {
    openId: getItem('openId'),
    page: page || 1,
    catlog_id,
    month,
  };
  return await request({
    name: 'get',
    data: queryData,
  });
};

interface userDataRequest {
  catlog_id: number;
  amount: number;
  type: number;
  desc: string;
  date: string;
}

/**
 * 添加项目请求
 * @param data
 */
export const addUserData = async (data: userDataRequest) => {
  return await request({
    name: 'add',
    data: {
      openId: getItem('openId'),
      data,
    },
  });
};
