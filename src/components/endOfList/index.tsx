import React from 'react';
import { View, ITouchEvent } from '@tarojs/components';
import './index.scss';

interface EndOfListPropsType {
  isEndding?: boolean;
  isLoading?: boolean;
  showLoadMore?: boolean;
  onLoadMoreClick?: (e: ITouchEvent) => void;
}

const EndOfList = (props: EndOfListPropsType) => {
  const { isEndding = false, isLoading = false, showLoadMore = false, onLoadMoreClick } = props;

  const handleLoadMore = (e: ITouchEvent) => {
    onLoadMoreClick && onLoadMoreClick(e);
  };

  if (isEndding) {
    return (
      <View className='endlist'>
        <View className='line'></View>没有更多了
        <View className='line'></View>
      </View>
    );
  }
  if (isLoading) {
    return <View className='loading'>加载中...</View>;
  }

  if (showLoadMore && onLoadMoreClick) {
    return (
      <View className='loadMore' onClick={handleLoadMore}>
        加载更多
      </View>
    );
  }

  return null;
};

export default EndOfList;
