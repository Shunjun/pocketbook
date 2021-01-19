import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import _isFunction from 'lodash/isFunction';
import getSystemInfo from '@/utils/getSystemInfo';
import { View } from '@tarojs/components';
import './index.scss';

interface Eventhandler {
  (): void;
}

type AtComponentProps = Partial<{
  extClass: string;
  title: string;
  background: string;
  backgroundColorTop: string;
  color: string;
  iconTheme: string;
  back: boolean;
  home: boolean;
  delta: number;
  searchBar: boolean;
  searchText: string;
  onBack: Eventhandler;
  onHome: Eventhandler;
  onSearch: Eventhandler;
  renderLeft: React.ReactElement;
  renderRight: React.ReactElement;
  renderCenter: React.ReactElement;
}>;

interface configStyleType {
  navigationbarinnerStyle: string;
  navBarLeft: string;
  navBarHeight: number;
  capsulePosition: Taro.getMenuButtonBoundingClientRect.Rect;
  navBarExtendHeight: number;
  ios: boolean;
  rightDistance: number;
}

interface AtComponentState {
  configStyle: configStyleType | null;
}

let globalSystemInfo = getSystemInfo();

class AtComponent extends Component<AtComponentProps, AtComponentState> {
  static defaultProps = {
    extClass: '',
    background: 'rgba(255,255,255,1)', //导航栏背景
    color: '#000000',
    title: '',
    searchText: '点我搜索',
    searchBar: false,
    back: false,
    home: false,
    iconTheme: 'black',
    delta: 1,
  };

  constructor(props: AtComponentProps) {
    super(props);
    this.state = {
      configStyle: this.setStyle(globalSystemInfo),
    };
  }

  static options = {
    multipleSlots: true,
    addGlobalClass: true,
  };

  componentDidShow() {
    if (globalSystemInfo?.ios) {
      globalSystemInfo = getSystemInfo();
      this.setState({
        configStyle: this.setStyle(globalSystemInfo),
      });
    }
  }

  handleBackClick() {
    if (_isFunction(this.props.onBack)) {
      this.props.onBack();
    } else {
      const pages = Taro.getCurrentPages();
      if (pages.length >= 2) {
        Taro.navigateBack({
          delta: this.props.delta,
        });
      }
    }
  }
  handleGoHomeClick() {
    if (_isFunction(this.props.onHome)) {
      this.props.onHome();
    }
  }
  handleSearchClick() {
    if (_isFunction(this.props.onSearch)) {
      this.props.onSearch();
    }
  }

  setStyle(systemInfo: ReturnType<typeof getSystemInfo>) {
    // 无systemInfo下不渲染Navbar
    if (!systemInfo) {
      return null;
    }

    const {
      statusBarHeight,
      navBarHeight,
      capsulePosition,
      navBarExtendHeight,
      ios,
      windowWidth,
    } = systemInfo;

    const { back, home, title, color } = this.props;
    let rightDistance = windowWidth - capsulePosition.right; //胶囊按钮右侧到屏幕右侧的边距
    let leftWidth = windowWidth - capsulePosition.left; //胶囊按钮左侧到屏幕右侧的边距

    let navigationbarinnerStyle = [
      `color:${color}`,
      //`background:${background}`,
      `height:${navBarHeight + navBarExtendHeight}px`,
      `padding-top:${statusBarHeight}px`,
      `padding-right:${leftWidth}px`,
      `padding-bottom:${navBarExtendHeight}px`,
    ].join(';');
    let navBarLeft: string;
    if ((back && !home) || (!back && home)) {
      navBarLeft = [
        `width:${capsulePosition.width}px`,
        `height:${capsulePosition.height}px`,
        `margin-left:0px`,
        `margin-right:${rightDistance}px`,
      ].join(';');
    } else if ((back && home) || title) {
      navBarLeft = [
        `width:${capsulePosition.width}px`,
        `height:${capsulePosition.height}px`,
        `margin-left:${rightDistance}px`,
      ].join(';');
    } else {
      navBarLeft = [`width:auto`, `margin-left:0px`].join(';');
    }
    return {
      navigationbarinnerStyle,
      navBarLeft,
      navBarHeight,
      capsulePosition,
      navBarExtendHeight,
      ios,
      rightDistance,
    };
  }

  getNavbarHeight() {
    if (!this.state.configStyle) {
      return 0;
    }
    const { navBarHeight, navBarExtendHeight } = this.state.configStyle;
    return navBarHeight + navBarExtendHeight;
  }

  render() {
    // h5不渲染 navbar
    if (!this.state.configStyle) {
      return null;
    }

    const {
      navigationbarinnerStyle,
      navBarLeft,
      navBarHeight,
      capsulePosition,
      navBarExtendHeight,
      ios,
      rightDistance,
    } = this.state.configStyle;

    const {
      title,
      background,
      backgroundColorTop,
      back,
      home,
      searchBar,
      searchText,
      iconTheme,
      extClass,
    } = this.props;

    let nav_bar__center: React.ReactElement | undefined;
    if (title) {
      nav_bar__center = <text>{title}</text>;
    } else if (searchBar) {
      nav_bar__center = (
        <View
          className='lxy-nav-bar-search'
          style={`height:${capsulePosition.height}px;`}
          onClick={this.handleSearchClick.bind(this)}
        >
          <View className='lxy-nav-bar-search__icon' />
          <View className='lxy-nav-bar-search__input'>{searchText}</View>
        </View>
      );
    } else {
      /* eslint-disable */
      nav_bar__center = this.props.renderCenter;
      /* eslint-enable */
    }

    return (
      <View
        className={`lxy-nav-bar ${ios ? 'ios' : 'android'} ${extClass}`}
        style={`background: ${
          backgroundColorTop ? backgroundColorTop : background
        };height:${navBarHeight + navBarExtendHeight}px;`}
      >
        <View
          className={`lxy-nav-bar__placeholder ${ios ? 'ios' : 'android'}`}
          style={`padding-top: ${navBarHeight + navBarExtendHeight}px;`}
        />
        <View
          className={`lxy-nav-bar__inner ${ios ? 'ios' : 'android'}`}
          style={`background:${background};${navigationbarinnerStyle};`}
        >
          <View className='lxy-nav-bar__left' style={navBarLeft}>
            {back && !home && (
              <View
                onClick={this.handleBackClick.bind(this)}
                className={`lxy-nav-bar__button lxy-nav-bar__btn_goback ${iconTheme}`}
              />
            )}
            {!back && home && (
              <View
                onClick={this.handleGoHomeClick.bind(this)}
                className={`lxy-nav-bar__button lxy-nav-bar__btn_gohome ${iconTheme}`}
              />
            )}
            {back && home && (
              <View className={`lxy-nav-bar__buttons ${ios ? 'ios' : 'android'}`}>
                <View
                  onClick={this.handleBackClick.bind(this)}
                  className={`lxy-nav-bar__button lxy-nav-bar__btn_goback ${iconTheme}`}
                />
                <View
                  onClick={this.handleGoHomeClick.bind(this)}
                  className={`lxy-nav-bar__button lxy-nav-bar__btn_gohome ${iconTheme}}`}
                />
              </View>
            )}
            {!back && !home && this.props.renderLeft}
          </View>
          <View className='lxy-nav-bar__center' style={`padding-left: ${rightDistance}px`}>
            {nav_bar__center}
          </View>
          <View className='lxy-nav-bar__right' style={`margin-right: ${rightDistance}px`}>
            {this.props.renderRight}
          </View>
        </View>
      </View>
    );
  }
}

export default AtComponent;
