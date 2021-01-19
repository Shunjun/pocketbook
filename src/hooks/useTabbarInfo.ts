import createSubscriberSHooks from './createShareState';

interface TabBarInfo {
  height: number;
}

interface ActionType {
  type: string;
  value: any;
}

const defaultTabBarInfo: TabBarInfo = {
  height: 100,
};

const SET_TABBAR_HEIGHT = 'SET_TABBAR_HEIGHT';

function reducer(state: TabBarInfo, action: ActionType) {
  switch (action.type) {
    case SET_TABBAR_HEIGHT:
      return {
        ...state,
        height: action.value,
      };
    default:
      return defaultTabBarInfo;
  }
}

export const setHeightAct = (height: number) => {
  return {
    type: SET_TABBAR_HEIGHT,
    value: height,
  };
};

const useTabbarInfo = createSubscriberSHooks(reducer, defaultTabBarInfo);

export default useTabbarInfo;
