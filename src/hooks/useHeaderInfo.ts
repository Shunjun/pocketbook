import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';

const defaultInfo = {
  bottom: 0,
  dataset: [],
  height: 0,
  id: '',
  left: 0,
  right: 0,
  top: 0,
  width: 0,
};

function useHeaderInfo(): Taro.NodesRef.BoundingClientRectCallbackResult {
  const [hasInfo, setHasInfo] = useState(false);
  const [headerInfo, setHeaderInfo] = useState<Taro.NodesRef.BoundingClientRectCallbackResult>(
    defaultInfo,
  );

  useEffect(() => {
    if (hasInfo) return;

    try {
      let query: Taro.SelectorQuery | undefined = Taro.createSelectorQuery();
      query
        .select('#header')
        .boundingClientRect(rect => {
          if (rect) {
            setHeaderInfo(rect);
            setHasInfo(true);
          }
        })
        .exec();
      return () => {
        query = undefined;
      };
    } catch (error) {
      throw error;
    }
  });

  return headerInfo;
}

export default useHeaderInfo;
