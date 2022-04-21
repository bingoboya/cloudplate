<template>
  <div>
    <div>
      <BingoTabs
        :choseList="state.choseList1" :curChosed="state.curChosed1"
        @chose-comp="(val) => state.curChosed1 = val" />
    </div>
    <div>
      <div v-show="state.curChosed1 === 1" class="enter-y w-full add-shadow">
        <BenifitsCharts :options="state.sysPoweroptions" :yTitle="['储能系统有功功率', '储能系统无功功率']" :loading="loading" />
        <BenifitsCharts :options="state.sysPoweroptions" :yTitle="['储能系统有功功率', '储能系统无功功率']" :loading="loading" />
      </div>
      <div v-show="state.curChosed1 === 2">
        <Selo class="enter-y" @chooseDay="chooseDay" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defHttp } from '/@/utils/http/axios';
import BenifitsCharts from '/@/components/Echarts/BenifitsCharts.vue';
import Selo from '/@/components/Selo/index.vue';
const loading = ref(true)
const state = reactive({
  sysPoweroptions: [],
  choseList1: [
    { key: 1, label: '柱状', checked: true },
    { key: 2, label: '日历', checked: false },
  ],
  // 默认选中的项
  curChosed1: 1,
})
const chooseDay = (selectedDate, val) => {
  console.log('chooseDay', selectedDate, val);
}

const optionsListApi = (params) => defHttp.get({ url: '/getshouye/homepage', params });
const getUserInfomation = async () => {
  const res = await optionsListApi();
  const {
    sysPowerSeries,
  } = res;
  sysPowerSeries.forEach(element => {
    element.type = 'bar'
  });
  state.sysPoweroptions = sysPowerSeries;
};
getUserInfomation();
const task = setInterval(() => {
  getUserInfomation();
}, 3000);
onBeforeUnmount(() => {
  clearInterval(task);
});
setTimeout(() => {
    loading.value = false;
  }, 1500);
</script>

<style lang="scss" scoped>
</style>