import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { getUserData, addUserData } from '@/requests/userData';
import { dateFormat, DateNumber2DateString, DateNumber2Date } from '@/utils/date';
import { setCatlogs } from '@/store/actions/catlogs';
import style from './index.module.scss';

// components
import { View, Text, Block } from '@tarojs/components';
import BotDrawer from '@/components/BotDrawer';
import AccountList, { MonthChangeEvent } from './components/accountList';
import Addnote, { SubmitDataType } from './components/addnote';
import Header from './components/header';
import BookTabBar from '@/components/TabBar';

// types
import { userDataList } from '@/types/userData';
import { Catlogs, Catlog } from '@/types/catlogs';

interface IndexPropsTypes {
  catlogs: Catlogs;
}

interface IndexStateTypes {
  totalMoney: {
    income: number;
    outcome: number;
  };

  curMonth: number;
  datas: userDataList; // 列表数据

  curCatlogIndex: number;
  curPage: number; // 下一次要加载的页码,返回数据后加1
  more: boolean;

  isloading: boolean;
  addNoteVisable: boolean;
  refresher: boolean; //下拉刷新器
}

class Index extends Component<IndexPropsTypes, IndexStateTypes> {
  constructor(props: IndexPropsTypes) {
    super(props);
    this.state = {
      // 金额
      totalMoney: {
        income: 0,
        outcome: 0,
      },
      datas: [], // 列表数据
      // 查询参数
      curMonth: parseInt(dateFormat('yyyyMM', new Date())),
      curCatlogIndex: 0,
      curPage: 1,
      more: true,

      addNoteVisable: false,
      isloading: false,
      refresher: false, // 下拉刷新器
    };

    // 绑定事件
    this.handleMonthChenge = this.handleMonthChenge.bind(this);
    this.handleCatlogChange = this.handleCatlogChange.bind(this);
    this.pullDownRefresh = this.pullDownRefresh.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleAddModule = this.handleAddModule.bind(this);
    this.handleCloseModule = this.handleCloseModule.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    Taro.showToast({
      title: '加载中',
      icon: 'loading',
    });
    await this.refreshData();
    Taro.hideToast();
  }

  // 请求数据
  async refreshData() {
    const { curPage, curCatlogIndex, curMonth, isloading, datas } = this.state;
    const catlog_id = this.props.catlogs[curCatlogIndex].id;

    try {
      if (isloading) return; // 如果正在刷新

      this.setState({
        isloading: true,
      });
      let res = await getUserData({
        page: curPage,
        catlog_id,
        month: curMonth,
      });

      let { list: newData, page, more } = res;
      this.dataInit(newData);

      if (page === 1 || page === curPage) {
        if (page !== 1) {
          // 如果不是第一页,做拼接
          newData = this.dataJoint(datas, newData);
        }
        this.setState({
          datas: newData,
          curPage: page + 1,
          more,
          isloading: false,
        });
      } else {
        // 页码问题,重置页码
        this.setState(
          {
            curPage: 1,
          },
          () => {
            this.refreshData();
          },
        );
      }
    } catch (error) {
      // do nothing
    }
  }

  /**
   * 初始化数据
   * 1.根据catlog 查询显示的类型
   * @param datas
   */
  dataInit(datas: userDataList) {
    datas.forEach(monthItem => {
      monthItem.belong_month = DateNumber2DateString(monthItem._id);
      monthItem.list.forEach(dayItem => {
        let { _id, list } = dayItem;
        list = list || [];
        // 处理当天收支数据
        for (let index = 0; index < list.length; index++) {
          const deal = list[index];
          let catlog = this.findCatlogById(deal.catlog_id);

          if (catlog) {
            list[index] = {
              ...deal,
              iconName: catlog.iconName,
              catlogTitle: catlog.title,
            };
          } else {
            // 如果没有匹配的 catlog,移除该条记录
            list.splice(index, 1);
            index = index - 1;
          }
        }
        dayItem.belong_date = DateNumber2DateString(_id);
        dayItem.day_expense_outcomes = list.find(dataItem => dataItem.type === 2)?.day_expense || 0;
        dayItem.day_expense_incomes = list.find(dataItem => dataItem.type === 1)?.day_expense || 0;
      });
    });
  }

  /**
   * 合并数据
   * @param oldDatas
   * @param newData
   */
  dataJoint(oldDatas: userDataList, newDatas: userDataList) {
    // 如果数据为空
    if (newDatas.length === 0) {
      return oldDatas;
    }
    // 拼接数据
    const lastOldMonth = oldDatas[oldDatas.length - 1];
    const firstNewMonth = newDatas[0];
    // 是否有相同的月份
    if (lastOldMonth && lastOldMonth._id === firstNewMonth._id) {
      const lastOldDate = lastOldMonth.list[lastOldMonth.list.length - 1];
      const firstNewDate = firstNewMonth.list[0];
      //是否有相同的日期
      if (lastOldDate._id === firstNewDate._id) {
        lastOldDate.list = lastOldDate.list.concat(firstNewDate.list);
        // 删除新数据当天的数据
        firstNewMonth.list.shift();
      }
      lastOldMonth.list = lastOldMonth.list.concat(firstNewMonth.list);
      // 删除新数据当月的数据
      newDatas.shift();
    }
    return oldDatas.concat(newDatas);
  }

  findCatlogById(id: number): Catlog | undefined {
    const { catlogs } = this.props;
    return catlogs.find(catlog => catlog.id == id);
  }

  pullDownRefresh() {
    this.setState(
      {
        refresher: true,
        curPage: 1,
      },
      () => {
        this.refreshData().then(() => {
          this.setState({
            refresher: false,
          });
        });
      },
    );
  }

  // -------- LoadMore --------
  handleLoadMore() {
    const { more, isloading } = this.state;
    if (!more || isloading) {
      return;
    }
    this.refreshData();
  }

  // -------- header --------
  handleCatlogChange(curCatlogIndex: number) {
    this.setState({
      curCatlogIndex,
    });
    Taro.showToast({
      title: '加载中',
      icon: 'loading',
    });
    this.refreshData().then(() => {
      Taro.hideToast({
        complete: () => {},
      });
    });
  }

  handleMonthChenge(monthString: string) {
    console.log(monthString);
    const curMonth = parseInt(monthString.split('-').join(''));
    Taro.showToast({
      title: '加载中',
      icon: 'loading',
    });
    this.setState(
      {
        curMonth,
        curPage: 1,
      },
      () => {
        this.refreshData().then(() => {
          Taro.hideToast();
        });
      },
    );
  }

  // ------- button -------
  showAddmodule() {
    this.setState({
      addNoteVisable: true,
    });
  }

  hideAddmodule() {
    this.setState({
      addNoteVisable: false,
    });
  }

  handleAddModule() {
    this.showAddmodule();
  }

  handleCloseModule() {
    this.hideAddmodule();
  }

  async handleSubmit(ev: SubmitDataType) {
    try {
      const { amount, catlogId, desc, date, type } = ev.detail.data;

      if (amount === '') {
        Taro.showToast({ title: '请输入金额', icon: 'none' });
        return;
      }

      if (parseFloat(amount) == 0) {
        Taro.showToast({ title: '金额不能为0', icon: 'none' });
        return;
      }

      const requestData = {
        amount: parseFloat(amount),
        catlog_id: catlogId,
        desc,
        date,
        type,
      };

      Taro.showToast({
        title: '添加中...',
        icon: 'loading',
      });
      await addUserData(requestData);
      Taro.hideToast();
      this.hideAddmodule();
      Taro.showToast({
        title: '添加成功',
        icon: 'success',
      });
      this.setState({
        curPage: 1,
      });
      this.refreshData();
    } catch (err) {
      // do nothing
    }
  }

  handleMonthChange = (ev: MonthChangeEvent) => {
    let { currentIndex } = ev;
    const data = this.state.datas[currentIndex];

    this.setState({
      totalMoney: {
        income: data?.month_expense_income || 0,
        outcome: data?.month_expense_outcome || 0,
      },
      curMonth: data?._id || this.state.curMonth,
    });
  };

  render() {
    const {
      addNoteVisable,
      curCatlogIndex,
      curMonth,
      totalMoney,
      refresher,
      datas,
      more,
      isloading,
    } = this.state;
    return (
      <Block>
        <BotDrawer show={addNoteVisable} onClose={this.handleCloseModule}>
          <Addnote onClose={this.handleCloseModule} onSubmit={this.handleSubmit}></Addnote>
        </BotDrawer>
        <View className={style.addNote} onClick={this.handleAddModule}>
          <Text className={classnames(['iconfont', 'iconedit-square', style.icon])}></Text>
        </View>
        <Header
          curCatlogIndex={curCatlogIndex}
          onCatlogChange={this.handleCatlogChange}
          onMonthChange={this.handleMonthChenge}
          totalMoney={totalMoney}
          curMonth={dateFormat('yyyy年MM月', DateNumber2Date(curMonth))}
        />
        <AccountList
          datas={datas}
          isEndding={!more}
          isLoadingMore={isloading}
          onListMonthChange={this.handleMonthChange}
          onLoadMore={this.handleLoadMore}
          refresherTriggered={refresher}
          onRefresherRefresh={this.pullDownRefresh}
        />
        <BookTabBar current={0} />
      </Block>
    );
  }
}

const mapStateToProps = ({ catlog }, ownProps: any) => {
  return Object.assign({}, ownProps, catlog);
};

const mapDispatchToProps = (dispatch, ownProps: any) => {
  return {
    setCatlogs: value => dispatch(setCatlogs(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
