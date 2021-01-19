import React from 'react';
import { Block, View, Button, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import withWeapp from '@tarojs/with-weapp';
import classNames from 'classnames';
import style from './style.module.scss';
import '@/assets/fonts/iconfont.css';
import { CATLOG_TYPES } from '@/utils/constants';

export interface InputEvent {
  detail: {
    content?: string;
    curContent: string;
  };
}

interface NumberKeyboardProps {
  maxamount?: string;
  curType?: number;
  contentempty?: boolean;
  onInput?: (ev: InputEvent) => void;
  onDelete?: (ev: InputEvent) => void;
  onSubmit?: (ev: InputEvent) => void;
}

@withWeapp({
  curContent: '',
  properties: {
    contentempty: Boolean,
    maxamount: String,
    curType: Number,
  },
  data: {
    submitColor: '',
    lastCurtype: 0,
  },
  lifetimes: {
    attached() {
      this.chengeSubmitColor();
    },
  },
  methods: {
    chengeSubmitColor() {
      let curType = this.properties.curType;
      if (curType !== 1 && curType !== 2) curType = 1;
      let submitColor: string = '';

      for (const key in CATLOG_TYPES) {
        if (Object.hasOwnProperty.call(CATLOG_TYPES, key)) {
          const item = CATLOG_TYPES[key];
          if (item.type === curType) {
            if (this.curContent) {
              submitColor = item.COLOR;
            } else {
              submitColor = item.DIS_COLOR;
            }
          }
        }
      }

      if (submitColor !== this.data.submitColor) {
        this.setData({
          submitColor,
        });
      }
    },
    handleInput(ev) {
      const content = String(ev.content);
      const maxamount = this.properties.maxamount;
      let lastContent = this.curContent || '';
      let curContent = '';

      // 点单独处理
      if (content === '.') {
        if (lastContent.includes('.')) {
          return;
        } else {
          if (lastContent == '') {
            curContent = '0.';
          } else {
            curContent = lastContent + '.';
          }
        }
        this.curContent = curContent;
      } else {
        curContent = lastContent + content;
        if (parseFloat(curContent) < parseFloat(maxamount)) {
          this.curContent = curContent;
        } else {
          curContent = lastContent;
          Taro.showToast({
            title: `金额不可大于${maxamount}`,
            icon: 'none',
          });
        }
      }

      let myEventDetail = {
        content,
        curContent,
      };
      let myEventOption = {};
      this.chengeSubmitColor();
      this.triggerEvent('input', myEventDetail, myEventOption);
    },

    handleDelete() {
      let curContent = this.curContent;
      if (curContent.length === 0) return;
      curContent = curContent.slice(0, curContent.length - 1);
      this.curContent = curContent;
      let myEventDetail = {
        content: 'delete',
        curContent,
      };
      this.chengeSubmitColor();
      this.triggerEvent('delete', myEventDetail);
    },

    handleSubmit() {
      let curContent = this.curContent;
      let myEventDetail = {
        curContent,
      };
      this.triggerEvent('submit', myEventDetail);
    },
  },
})
class _C extends React.Component<NumberKeyboardProps, {}> {
  static defaultProps = {
    maxamount: '10000000',
  };
  handleInput: (ev: NumberClickEvent) => void;
  handleDelete: () => void;
  handleSubmit: () => void;
  data: {
    submitColor: string;
    lastCurtype: number;
    curContent: string;
  };
  config = {
    component: true,
  };
  curContent = '';
  lastCurtype = 0;

  static getDerivedStateFromProps(props, state) {
    if (props.curtype != state.lastCurtype) {
      let submitColor;
      for (const key in CATLOG_TYPES) {
        if (Object.hasOwnProperty.call(CATLOG_TYPES, key)) {
          const item = CATLOG_TYPES[key];
          if (item.type == props.curtype) {
            if (state.curContent) {
              submitColor = item.color;
            } else {
              submitColor = item.discolor;
            }
          }
        }
      }
      return {
        ...state,
        submitColor,
        lastCurtype: props.curtype,
      };
    } else {
      return null;
    }
  }

  render() {
    const { submitColor } = this.data;
    return (
      <View className={style.keyboard}>
        <View className={style.numbers}>
          <KeyboardRow keys={['1', '2', '3']} onClick={this.handleInput} />
          <KeyboardRow keys={['3', '4', '5']} onClick={this.handleInput} />
          <KeyboardRow keys={['7', '8', '9']} onClick={this.handleInput} />

          <View className={style.row}>
            <Button
              className={classNames([style.zero, style.button])}
              hoverClass={style.hover}
              onClick={ev => this.handleInput({ content: ev.target.dataset.content })}
              data-content={'0'}
            >
              0
            </Button>
            <Button
              className={classNames([style.point, style.button])}
              hoverClass={style.hover}
              onClick={() => this.handleInput({ content: '.' })}
            >
              .
            </Button>
          </View>
        </View>
        <View className={style.keyboardRight}>
          <View className={style.row}>
            <Button onClick={this.handleDelete} className={style.button} hoverClass={style.hover}>
              <Text className={classNames(['iconfont', 'icondelete'])}></Text>
            </Button>
          </View>
          <View className={style.submit}>
            <Button
              className={style.button}
              style={submitColor ? 'background-color:' + submitColor : ''}
              onClick={this.handleSubmit}
            >
              确定
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

interface NumberClickEvent {
  content?: string;
  index?: number;
}

interface KeyboardRowProps {
  keys: string[];
  onClick: (ev?: NumberClickEvent) => void;
}

class KeyboardRow extends React.PureComponent<KeyboardRowProps, {}> {
  constructor(props: KeyboardRowProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(ev, index) {
    const { onClick } = this.props;
    const { dataset } = ev.target;
    const event = {
      content: dataset.content,
      index,
    };
    onClick(event);
  }

  render() {
    const { keys } = this.props;
    return (
      <View className={style.row}>
        {keys.map((item, index) => {
          return (
            <Block key={index}>
              <Button
                className={style.button}
                hoverClass={style.hover}
                onClick={ev => this.handleClick(ev, index)}
                data-content={item}
              >
                {item}
              </Button>
            </Block>
          );
        })}
      </View>
    );
  }
}

export default _C;
