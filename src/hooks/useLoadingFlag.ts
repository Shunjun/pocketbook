import { useCallback, useRef } from 'react';

const useLoadingFlag = (loadingFn: () => void) => {
  const loadingFlagRef = useRef(false);

  return useCallback(() => {
    const loadingFlag = loadingFlagRef.current;
    if (loadingFlag) return;
    loadingFlagRef.current = true;
    const res = loadingFn && loadingFn();
    loadingFlagRef.current = false;
    return res;
  }, [loadingFn, loadingFlagRef.current]);
};

export default useLoadingFlag;
