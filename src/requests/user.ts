import { setItem, getItem } from '@/utils/store';
import Taro from '@tarojs/taro';

let isGetting = false;

export function getSession() {
  if (getItem('openId') || isGetting) return;
  isGetting = true;
  Taro.cloud
    .callFunction({
      name: 'login',
    })
    .then((res: any) => {
      setItem('openId', res.result.opendid);
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      isGetting = false;
    });
}
