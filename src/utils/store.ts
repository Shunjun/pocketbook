import Taro from '@tarojs/taro';
/**
 * 存储数据：
 * storage信息存储
 */

//设置值
export const setItem = (key: string, value: any, module_name?: string) => {
  if (module_name) {
    let module_name_info = getItem(module_name);
    module_name_info[key] = value;
    Taro.setStorageSync(module_name, module_name_info);
  } else {
    Taro.setStorageSync(key, value);
  }
};

export const getItem = (key: string, module_name?: string): any => {
  if (module_name) {
    let val = getItem(module_name);
    if (val) return val[key];
    return '';
  } else {
    return Taro.getStorageSync(key);
  }
};

export const clear = (key: string) => {
  try {
    key && Taro.removeStorageSync(key);
  } catch (error) {
    // Do nothing
  }
};
