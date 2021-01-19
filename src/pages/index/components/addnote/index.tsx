import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { dateFormat } from '@/utils/date';
import '@/assets/fonts/iconfont.css';
import style from './style.module.scss';
import { CATLOG_TYPE_INCOME, CATLOG_TYPE_OUTCOME } from '@/utils/constants';
// components
import { Block, View, Text, Picker } from '@tarojs/components';
import Numkeyboard, { InputEvent } from '@/components/numkeyboard';
import SwitchItem from '@/components/switchItem';
// types
import { Catlogs } from '@/types/catlogs';

export interface SubmitDataType {
  detail: {
    data: {
      amount: string;
      catlogId: number;
      desc: '';
      date: string;
      type: number;
    };
  };
}

interface AddnoteProps {
  catlogs?: Catlogs;
  onSubmit?: (ev: SubmitDataType) => void;
  onClose?: () => void;
  onInput?: (ev: InputEvent) => void;
}

interface AddnoteState {
  curType: 1 | 2;
  amount: string;
  currentCatlogId: number;
  pickerDate: string;
  showCatlogs: Catlogs;
}

/**
 * 获取当前日期
 */
function getNowDate(): string {
  return dateFormat('yyyy-MM-dd', new Date());
}

/**
 * 事件:
 * submit()
 * close()
 */
class Addnote extends Component<AddnoteProps, AddnoteState> {
  constructor(props: AddnoteProps) {
    super(props);
    this.state = {
      showCatlogs: [],
      pickerDate: '',
      amount: '',
      currentCatlogId: 0,
      curType: CATLOG_TYPE_OUTCOME,
    };

    this.handInput = this.handInput.bind(this);
    this.handDelete = this.handDelete.bind(this);
    this.handSubmit = this.handSubmit.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.handleChoiceCatlog = this.handleChoiceCatlog.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
  }
  componentDidMount() {
    this.datainit();
  }

  datainit() {
    const date = new Date();
    let catlogs = this.props.catlogs!;
    const { curType } = this.state;

    this.setState({
      currentCatlogId: catlogs.find(catlog => catlog.type === curType)?.id || 0,
      pickerDate: dateFormat('yyyy-MM-dd', date),
    });

    this.changeCatlogs(curType);
  }

  //切换收入支出
  handleSwitch(ev) {
    let catlogs = this.props.catlogs!;
    const lastType = this.state.curType;
    const { active: activeType } = ev.detail;
    if (activeType === lastType) return;

    let curType = activeType;
    let currentCatlogId = catlogs.find(catlog => catlog.type == curType)?.id || 0;
    this.setState({
      currentCatlogId,
      curType,
    });

    this.changeCatlogs(activeType);
  }

  changeCatlogs(type: number) {
    let catlogs = this.props.catlogs!;
    let showCatlogs = catlogs.filter(catlog => {
      return catlog.type == type;
    });
    this.setState({
      showCatlogs,
    });
  }

  //切换日期
  handleChangeDate(ev) {
    this.setState({
      pickerDate: ev.detail.value,
    });
  }

  //切换类别
  handleChoiceCatlog(ev) {
    this.setState({
      currentCatlogId: ev.target.dataset.catlogId,
    });
  }

  //输入内容
  handInput(ev: InputEvent) {
    const { onInput } = this.props;
    let amount = ev.detail.curContent;
    this.setState({
      amount,
    });
    onInput && onInput(ev);
  }

  handDelete(ev: InputEvent) {
    const { onInput } = this.props;
    let amount = ev.detail.curContent;
    this.setState({
      amount,
    });
    onInput && onInput(ev);
  }

  //提交
  handSubmit() {
    const { amount, currentCatlogId, pickerDate, curType } = this.state;
    const { onSubmit } = this.props;

    let ev: SubmitDataType = {
      detail: {
        data: {
          amount,
          catlogId: currentCatlogId,
          desc: '',
          date: pickerDate,
          type: curType,
        },
      },
    };
    onSubmit && onSubmit(ev);
  }

  render() {
    const { pickerDate, amount, showCatlogs, currentCatlogId, curType } = this.state;

    const nowDate = getNowDate();
    return (
      <Block>
        {/*  筛选  */}
        <View className={style.sift}>
          <Picker
            className={style.fr}
            mode='date'
            fields='day'
            end={nowDate}
            value={pickerDate}
            onChange={this.handleChangeDate}
          >
            <Text>{dateFormat('MM月dd日', new Date(pickerDate))}</Text>
            <Text className={classNames(['iconfont', 'icontriangle-down', style.icon])}></Text>
          </Picker>
          <SwitchItem ex-class={style.fl} onSwitch={this.handleSwitch} activeType={curType} />
        </View>
        {/*  输入框  */}
        <View className={style.inputarea}>
          <View className={style.label}>
            <Text>￥</Text>
          </View>
          <View className={style.input}>{amount}</View>
          <View className={style.cursor}></View>
        </View>
        {/*  分类选择  */}
        <View className={style.catlogs}>
          {showCatlogs.map(item => {
            return (
              <View
                key='id'
                className={style.catlog}
                data-catlogId={item.id}
                onClick={this.handleChoiceCatlog}
              >
                <View
                  className={classNames({
                    [style.iconbg]: true,
                    [style.outcActive]:
                      item.id === currentCatlogId && item.type === CATLOG_TYPE_OUTCOME,
                    [style.incActive]:
                      item.id === currentCatlogId && item.type === CATLOG_TYPE_INCOME,
                  })}
                  data-catlogId={item.id}
                >
                  <Text
                    className={classNames(['iconfont', item.iconName, style.icon])}
                    data-catlogId={item.id}
                  ></Text>
                </View>
                <Text className={style.label} data-catlogId={item.id}>
                  {item.title}
                </Text>
              </View>
            );
          })}
        </View>
        <Numkeyboard
          curType={curType}
          onInput={this.handInput}
          onDelete={this.handDelete}
          onSubmit={this.handSubmit}
        ></Numkeyboard>
      </Block>
    );
  }
}

const mapStateToProps = ({ catlog }, ownProps: AddnoteProps) => Object.assign({}, ownProps, catlog);

export default connect(mapStateToProps)(Addnote);
