import React, { Component } from 'react';
import { Block, View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';
import '../../assets/fonts/iconfont.css';
import { EventHandler, SyntheticEvent } from 'react';
/**
 * 事件:
 * submit()
 * close()
 */
class BotDrawer extends Component<
  { onClose?: EventHandler<SyntheticEvent>; show: boolean; title?: string },
  any
> {
  static defaultProps: {};
  animation: Taro.Animation;
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  componentWillUnmount() {}

  createAnimation() {}

  handleClose(ev) {
    this.props.onClose && this.props.onClose(ev);
  }

  render() {
    const { show, title } = this.props;
    return (
      <Block>
        {show ? (
          <Block>
            <View className='mask' onClick={this.handleClose.bind(this)}></View>
            <View className='addnote-modal'>
              <View className='closebutton-wrap'>
                {title ? <Text className='title'>{title}123</Text> : null}
                <Text
                  className='iconfont iconclose closebutton'
                  onClick={this.handleClose.bind(this)}
                ></Text>
              </View>
              <View>{this.props.children}</View>
            </View>
          </Block>
        ) : null}
      </Block>
    );
  }
}

BotDrawer.defaultProps = {
  show: false,
};

export default BotDrawer;
