import { setItem } from '@/utils/store';
import Taro from '@tarojs/taro';

export function getSession() {
  Taro.cloud
    .callFunction({
      name: 'login',
    })
    .then((res: any) => {
      setItem('openId', res.result.opendid);
    })
    .catch(err => {
      console.log(err);
    });
}
