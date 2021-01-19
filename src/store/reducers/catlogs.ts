import { AnyAction } from 'redux';
import { SET_CATLOGS } from '../actionTypes';
import { Catlogs } from '@/types/catlogs';

/**
 * type 0 为全部
 * type 1 为收入
 * type 2 为支出
 */
const initData: { catlogs: Catlogs } = {
  catlogs: [
    { title: '全部分类', id: 0, type: 0, iconName: 'iconfenlei' },
    { title: '生意', id: 23, type: 1, iconName: 'iconshengyi' },
    { title: '退款', id: 41, type: 1, iconName: 'icontuikuan' },
    { title: '工资', id: 32, type: 1, iconName: 'icongongzi' },
    { title: '奖金', id: 55, type: 1, iconName: 'icontuikuan' },
    { title: '其他', id: 26, type: 1, iconName: 'iconqita' },
    { title: '红包', id: 37, type: 1, iconName: 'iconhongbao' },
    { title: '转账', id: 91, type: 1, iconName: 'iconzhuanzhang' },
    { title: '交通', id: 6, type: 2, iconName: 'iconjiaotong' },
    { title: '餐饮', id: 12, type: 2, iconName: 'iconcanyin' },
    { title: '服装', id: 54, type: 2, iconName: 'iconfuzhuang' },
    { title: '购物', id: 52, type: 2, iconName: 'icongouwu' },
    { title: '学习', id: 31, type: 2, iconName: 'iconxuexi' },
    { title: '娱乐', id: 72, type: 2, iconName: 'iconyule' },
    { title: '运动', id: 81, type: 2, iconName: 'iconyundong' },
    { title: '旅游', id: 34, type: 2, iconName: 'iconlvyou' },
    { title: '酒店', id: 15, type: 2, iconName: 'iconjiudian' },
    { title: '宠物', id: 89, type: 2, iconName: 'iconchongwu' },
    { title: '医疗', id: 18, type: 2, iconName: 'iconyiliao' },
  ],
};

export default function(state = initData, action: AnyAction) {
  switch (action.type) {
    case SET_CATLOGS:
      return {
        ...state,
        catlogs: action.value,
      };

    default:
      return state;
  }
}
