import Taro from '@tarojs/taro';
import { ResponsType } from '@/types/request';

interface requestOptions {
  name: string;
  data?: any;
}
/**
 * 请求函数
 */
export const request = async (options: requestOptions) => {
  const { name, data } = options;

  try {
    let res = (await Taro.cloud.callFunction({
      name,
      data,
    })) as { errMsg: string; result: ResponsType };

    console.log(res);

    if (res.errMsg === 'cloud.callFunction:ok' && res.result) {
      // 请求调用成功
      if (res.result['ok'] === 1) {
        console.log(res.result['ok']);
        return res.result.data;
      } else {
        let message = res.result['errMsg'] || '请求失败';
        Taro.showToast({
          title: message,
        });
        throw res.result;
      }
    } else {
      Taro.showToast({
        title: '服务器错误',
      });
      throw res.errMsg;
    }
  } catch (error) {
    Taro.showToast({
      title: '网络错误',
    });
    throw error;
  }
};
