import Taro from '@tarojs/taro';
import { SelectorQuery } from '@tarojs/taro/types/index';

const ENV = Taro.getEnv();


// 保留小数
export function fixDigit(num: number | string, digit: number): string {
  if (typeof num === 'string') {
    num = parseFloat(num);
  }
  if (Number.isNaN(num)) {
    return Number(0).toFixed(digit);
  }
  return num.toFixed(digit);
}

export function delay(delayTime = 500): Promise<void> {
  return new Promise(resolve => {
    if ([Taro.ENV_TYPE.WEB, Taro.ENV_TYPE.SWAN, Taro.ENV_TYPE.WEAPP].includes(ENV)) {
      setTimeout(() => {
        resolve();
      }, delayTime);
      return;
    }
    resolve();
  });
}

export function delayQuerySelector(selectorStr: string, delayTime = 500): Promise<Array<Object>> {
  const selector: SelectorQuery = Taro.createSelectorQuery();

  return new Promise(resolve => {
    delay(delayTime).then(() => {
      selector
        .select(selectorStr)
        .boundingClientRect()
        .exec((res: Array<Object>) => {
          resolve(res);
        });
    });
  });
}

export function delayQuerySelectAll(selectorStr: string, delayTime = 500): Promise<Array<Object>> {
  const selector: SelectorQuery = Taro.createSelectorQuery();

  return new Promise(resolve => {
    delay(delayTime).then(() => {
      selector
        .selectAll(selectorStr)
        .boundingClientRect()
        .exec((res: Array<Object>) => {
          resolve(res);
        });
    });
  });
}

export function delayGetScrollOffset({ delayTime = 500 }): Promise<Array<Object>> {
  return new Promise(resolve => {
    delay(delayTime).then(() => {
      Taro.createSelectorQuery()
        .selectViewport()
        .scrollOffset()
        .exec((res: Array<Object>) => {
          resolve(res);
        });
    });
  });
}

export default {
  delay,
  delayGetScrollOffset,
  delayQuerySelector,
  delayQuerySelectAll,
};
