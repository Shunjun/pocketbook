import { useEffect, useReducer } from 'react';

interface subscriberFunc {
  (): void;
}

/**
 * 强制更新hook
 * 返回一个dispatch,每次执行对state取反,使视图更新
 */
const useforceUpdate = () => {
  return useReducer(state => !state, false)[1];
};

function createSubscriberSHook(reducer, initialState) {
  const subscribers: subscriberFunc[] = [];
  let state = initialState;

  const dispatch = action => {
    state = reducer(state, action);
    subscribers.forEach(callback => callback());
  };

  const subscriberHook = () => {
    const forceUpdate = useforceUpdate();
    useEffect(() => {
      const callback = () => forceUpdate();
      subscribers.push(callback);
      callback();
      return () => {
        const index = subscribers.indexOf(callback);
        subscribers.splice(index, 1);
      };
    }, [state]);

    return [state, dispatch];
  };

  return subscriberHook;
}

export default createSubscriberSHook;
