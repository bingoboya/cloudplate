<template>
  <!-- 转化率 -->
  <Card title class="bingo" :loading="loading">
    <div ref="chartRef" :style="{ width, height }"></div>
  </Card>
</template>
<script lang="ts" setup>
import { Ref, ref, watch, toRefs } from 'vue';
import { Card } from 'ant-design-vue';
import { useECharts } from '/@/hooks/web/useECharts';
import { cloneDeep } from 'lodash-es';
const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
  loading: Boolean,
  width: {
    type: String as PropType<string>,
    default: '100%',
  },
  height: {
    type: String as PropType<string>,
    default: '300px',
  },
});
const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

const { options } = toRefs(props);
const aa = cloneDeep(options);
console.log('aa', aa.value);
watch(
  () => cloneDeep(options),
  () => {
    console.log('jianting-options', options.value);
    setOptions({
      legend: {
        bottom: 0,
        data: ['访问', '购买'],
      },
      tooltip: {},
      radar: {
        radius: '60%',
        splitNumber: 8,
        indicator: [
          {
            name: '电脑',
            max: 100,
          },
          {
            name: '充电器',
            max: 100,
          },
          {
            name: '耳机',
            max: 100,
          },
          {
            name: '手机',
            max: 100,
          },
          {
            name: 'Ipad',
            max: 100,
          },
          {
            name: '耳机',
            max: 100,
          },
        ],
      },
      series: [
        {
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            shadowBlur: 0,
            shadowColor: 'rgba(0,0,0,.2)',
            shadowOffsetX: 0,
            shadowOffsetY: 10,
            opacity: 1,
          },
          // data: options
          data: [
            {
              value: [90, 50, 86, 40, 50, 20],
              name: '访问',
              itemStyle: {
                color: '#b6a2de',
              },
            },
            {
              value: [710, 75, 70, 76, 20, 85],
              name: '购买',
              itemStyle: {
                color: '#5ab1ef',
              },
            },
          ],
        },
      ],
    });
  },
  { deep: true },
);

watch(
  () => props.loading,
  () => {
    if (props.loading) {
      return;
    }
    chartInit();
  },
  { immediate: true },
);
const chartInit = () => {
  setOptions({
    legend: {
      bottom: 0,
      data: ['访问', '购买'],
    },
    tooltip: {},
    radar: {
      radius: '60%',
      splitNumber: 8,
      indicator: [
        {
          name: '电1脑',
          max: 100,
          min: 0
        },
        {
          name: '充电器',
          max: 100,
          min: 0
        },
        {
          name: '耳机',
          max: 100,
          min: 0
        },
        {
          name: '手机',
          max: 100,
          min: 0
        },
        {
          name: 'Ipad',
          max: 100,
          min: 0
        },
        {
          name: '耳机',
          max: 100,
          min: 0
        },
      ],
    },
    series: [
      {
        type: 'radar',
        symbolSize: 0,
        areaStyle: {
          shadowBlur: 0,
          shadowColor: 'rgba(0,0,0,.2)',
          shadowOffsetX: 0,
          shadowOffsetY: 10,
          opacity: 1,
        },
        // data: options
        data: [
          {
            value: [90, 50, 86, 40, 50, 20],
            name: '访问',
            itemStyle: {
              color: '#b6a2de',
            },
          },
          {
            value: [70, 75, 70, 76, 20, 85],
            name: '购买',
            itemStyle: {
              color: '#5ab1ef',
            },
          },
        ],
      },
    ],
  });
};
  // setTimeout(() => {
  //   chartInit();
  // }, 3000);
</script>
<style lang="less" scoped>
.bingo {
  // ::v-deep .ant-card-body {
  //   padding: 0 !important;
  //   height: 100%;
  // }
}
</style>
