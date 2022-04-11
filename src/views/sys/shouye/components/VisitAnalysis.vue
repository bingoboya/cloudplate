<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import { useECharts } from '/@/hooks/web/useECharts';
import { basicProps } from './props';

const props = defineProps({
  // eslint-disable-next-line vue/valid-define-props
  ...basicProps,
  options: {
    type: Array,
    default: () => ([])
  },
  test: {
    type: Object
  }
});
const getDaysInOneMonth = (year, month) => {
  month = parseInt(month, 10);
  var d = new Date(year, month, 0);
  return d.getDate();
};
const calcuXaxis = () => {
  const curDate = new Date();
  const curYear = curDate.getFullYear();
  const curMonth = curDate.getMonth() + 1;
  const curMonthDays = curDate.getDate();
  const lastMonthDays = getDaysInOneMonth(curYear, curMonth - 1);
  const maxDays = Math.max(curMonthDays, lastMonthDays);
  const xAxisDays = [...Array(maxDays)].map((val, index) => {
    return index + 1;
  });
  return xAxisDays
}

const chartRef = ref(null);
const { setOptions } = useECharts(chartRef);
onMounted(() => {
  chartInit();
});

const chartInit = (clear = true) => {
  setOptions({
    title: {
      // text: '储能收益',
    },
    legend: {
      data: ['本月', '上月'],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          width: 1,
          color: '#019680',
        },
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: calcuXaxis(),
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          type: 'solid',
          color: 'rgba(226,226,226,0.5)',
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: [
      {
        type: 'value',
        // max: 80000,
        splitNumber: 4,
        axisTick: {
          show: false,
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(255,255,255,0.2)', 'rgba(226,226,226,0.2)'],
          },
        },
      },
      // {
      //   type: 'value',
      //   name: '储能系统有功功率',
      //   nameTextStyle: {
      //     color: '#5470C6',
      //     fontSize: 8
      //   },
      //   show: true,
      //   position: 'left',
      //   offset: 0,
      //   axisLine: {
      //     show: true,
      //     lineStyle: {
      //       color: '#5470C6',
      //     }
      //   },
      //   axisLabel: {
      //     formatter: '{value} KW',
      //     fontSize: 8,
      //     color: '#5470C6'
      //   }
      // },
      // {
      //   type: 'value',
      //   name:'储能系统有功功率1',
      //   nameTextStyle: {
      //     color: 'red',
      //     fontSize: 8
      //   },
      //   show: true,
      //   position: 'right',
      //   axisLine: {
      //     show: true,
      //     lineStyle: {
      //       color: 'red'
      //     }
      //   },
      //   axisLabel: {
      //     formatter: '{value} KW',
      //     fontSize: 8,
      //     color: 'red'
      //   }
      // }
    ],
    grid: { left: '1%', right: '1%', top: '2  %', bottom: 0, containLabel: true },
    series: props.options
  }, clear);
};
watch([() => props.options], () => {
  console.log('收益图标', props.options, props.test)
  chartInit(false)
}, { immediate: true })
</script>
