import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Taro from '@tarojs/taro';
import { getSession } from '@/requests/user';
import configStore from './store';
import './assets/fonts/iconfont.css';
import './app.scss';

const store = configStore();

class App extends Component {
  componentDidMount() {
    const cloud = Taro.cloud;
    if (!Taro.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'pocketbook-server-np8wz',
        traceUser: true,
      });
    }
    getSession();
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
