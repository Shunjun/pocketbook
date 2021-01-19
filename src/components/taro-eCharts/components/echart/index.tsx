import React, { forwardRef, useEffect, useRef } from 'react';
import * as echarts from '../ec-canvas/echarts';
import EcCanvasTaro, { ECObj } from '../ec-canvas';
import { View } from '@tarojs/components';

interface BaseChartProps {
  canvasId?: string;
  option?: any;
  style?: CSSStyleDeclaration;
  className?: string;
  width?: string | number;
  height?: string | number;
}

const createRandomId = length => {
  const chats = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  let result = new Array(length)
    .fill('1')
    .map(() => chats.charAt(Math.floor(Math.random() * chats.length)))
    .join('');

  return result;
};

const useActionType = (actionRef, refresh) => {
  useEffect(() => {
    const type = {
      refresh,
    };
    if (typeof actionRef === 'function') {
      actionRef(type);
    }
    if (actionRef && typeof actionRef !== 'function') {
      actionRef.current = type;
    }
  }, []);
};

function addPX(content) {
  if (!content) {
    return '100%';
  }
  if (typeof content === 'number' && !isNaN(content)) {
    return `${content}px`;
  }
  return content;
}

const BaseChart = forwardRef((props: BaseChartProps, ref) => {
  const { canvasId = createRandomId(16), option, className } = props;

  const ec: ECObj = {
    lazyLoad: true,
  };

  let Chart = useRef<any>();

  // NOTE: option变化不会更新视图
  useEffect(() => {
    if (option) {
      setTimeout(() => {
        refresh(option);
      }, 0);
    }
  }, []);

  const refresh = option => {
    console.log('设置了表单');
    Chart.current.init((canvas, width, height, canvasDpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: canvasDpr,
      });
      canvas.setChart(chart);
      // TODO:
      chart.setOption(option, true);
      return chart;
    });
  };

  useActionType(ref, refresh);

  const createStyle = () => {
    const { style, width, height } = props;
    return Object.assign({}, style, {
      width: addPX(width),
      height: addPX(height),
    }) as React.CSSProperties;
  };

  return (
    <View style={createStyle()} className={className}>
      <EcCanvasTaro ref={Chart} canvasId={canvasId} ec={ec} />
    </View>
  );
});

export default BaseChart;
