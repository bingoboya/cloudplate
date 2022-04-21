<template>
  <!-- 访问来源 -->
  <Card title :loading="loading">
    <div ref="chartRef" :style="{ width, height }"></div>
  </Card>
</template>
<script lang="ts" setup>
import { Ref, ref, watch } from 'vue';
import { Card } from 'ant-design-vue';
import { useECharts } from '/@/hooks/web/useECharts';
const props = defineProps({
  loading: Boolean,
  options: {
    type: Array,
    default: () => ([])
  },
  yTitle: {
    type: Array,
    default: () => []
  },
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
watch(
  () => props.loading,
  () => {
    if (props.loading) {
      return;
    }
    initEchart(false)
  },
  { immediate: true },
);

const initEchart = (clear = true) => {
  setOptions({
    color: ['#5470C6', '#EE6666'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: { left: '1%', right: '1%', top: '32', bottom: 0, containLabel: true },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: { // 横轴刻度样式
          color: 'red',
          fontSize: 8
        },
        // prettier-ignore
        data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: props.yTitle[0],
        nameTextStyle: {
          color: '#5470C6',
          fontSize: 8
        },
        show: true,
        position: 'left',
        offset: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#5470C6',
          }
        },
        axisLabel: {
          formatter: '{value} KW',
          fontSize: 8,
          color: '#5470C6'
        }
      },
      {
        type: 'value',
        name: props.yTitle[1],
        nameTextStyle: {
          color: 'red',
          fontSize: 8
        },
        show: true,
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: 'red'
          }
        },
        axisLabel: {
          formatter: '{value} KW',
          fontSize: 8,
          color: 'red'
        }
      }
    ],
    series: props.options
  }, clear)
}
watch(() => props.options, () => {
  initEchart(false)
})
</script>
