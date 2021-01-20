import React from 'react';
import { View } from '@tarojs/components';
import { connect } from 'react-redux';
import { CATLOG_TYPES } from '@/utils/constants';
import classNames from 'classnames';
import { CATLOG_TYPE_INCOME, CATLOG_TYPE_OUTCOME } from '@/utils/constants';
import withWeapp from '@tarojs/with-weapp';
import style from './style.module.scss';

interface SwitchItemOwnProps {
  activeType: typeof CATLOG_TYPE_INCOME | typeof CATLOG_TYPE_OUTCOME;
  onSwitch: (ev: { detail: { active: number; activeItem: string } }) => void;
  size?: 'small' | 'normal';
}

type MapStateToProps = Readonly<ReturnType<typeof mapStateToProps>>;

type SwitchItemProps = MapStateToProps;

const mapStateToProps = ({ catlog }, ownProps: SwitchItemOwnProps) => {
  const { activeType, onSwitch, size = 'normal' } = ownProps;
  return {
    catlog,
    activeType,
    onSwitch,
    size,
  };
};

@withWeapp({
  behaviors: [],
  properties: {
    ['ex-class']: String,
    activeType: Number,
    size: String,
  },
  data: {},
  methods: {
    handleItemtap(ev) {
      const { type, activeitem } = ev.target.dataset;
      let myEventDetail = {
        active: type,
        activeItem: activeitem, // detail对象，提供给事件监听函数
      };
      let myEventOption = {};
      this.triggerEvent('switch', myEventDetail, myEventOption);
    },
  },
})
class _C extends React.Component<SwitchItemProps, {}> {
  data: {
    active: number;
  };
  config = {
    component: true,
  };

  handleItemtap: (ev) => void;

  styleCreater(item, active) {
    if (item.TYPE === active) {
      return {
        color: item.COLOR,
        border: `1px solid ${item.COLOR}`,
        backgroundColor: item.BG_COLOR,
      };
    }
    return {};
  }

  render() {
    const { activeType, size } = this.props;
    const exClass = this.props['ex-class'];
    const outcome = CATLOG_TYPES.OUTCOME;
    const income = CATLOG_TYPES.INCOME;

    return (
      <View className={classNames([style.switchWarp, exClass])}>
        <View
          key='type'
          className={classNames({
            [style.switchItem]: true,
            [style.normal]: size === 'normal',
            [style.small]: size === 'small',
          })}
          style={this.styleCreater(outcome, activeType)}
          data-type={outcome.TYPE}
          data-activeitem={outcome.TITLE}
          onClick={this.handleItemtap}
        >
          {outcome.TITLE}
        </View>
        <View
          key='type'
          className={classNames({
            [style.switchItem]: true,
            [style.normal]: size === 'normal',
            [style.small]: size === 'small',
          })}
          style={this.styleCreater(income, activeType)}
          data-type={income.TYPE}
          data-activeitem={income.TITLE}
          onClick={this.handleItemtap}
        >
          {income.TITLE}
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(_C);
