<template>
  <div class="p-4">
    <!-- 基本信息 -->
    <GrowCard :options="state.baseInfo" :loading="loading" class="enter-y" />
    <!-- 储能系统平均运行效率-->
    <OperateEfficiency :options="state.cemsSysInfoEfficiency" :loading="loading" class="enter-y" />
    <SiteAnalysis
      :options="state.energyStorageBenefits"
      :test="state.baseInfo"
      class="!my-4 enter-y"
      :loading="loading"
    />
    <div class="md:flex enter-y">
      <div class="md:w-1/3 w-full add-shadow">
        <NewEnergyPcsCharts
          :options="state.sysPoweroptions"
          :yTitle="['储能系统有功功率', '储能系统无功功率']"
          :loading="loading"
        />
      </div>
      <div style="position: relative" class="md:w-1/3 w-full !md:mx-4 !md:my-0 !my-4 add-shadow">
        <div class="bingo">
          <a-select
            ref="select"
            size="small"
            v-model:value="state.pcsPowerValue"
            :options="selcOptions()"
            @change="handleChangePcsPower"
            style="font-size: 12px; width: 200px"
          />
        </div>
        <NewEnergyPcsCharts
          :options="state.pcsPowerOptions"
          :yTitle="['交流有功功率', '交流无功功率']"
          :loading="loading"
        />
      </div>
      <div style="position: relative" class="md:w-1/3 w-full add-shadow">
        <div class="bingo">
          <a-select
            ref="select"
            size="small"
            v-model:value="state.pcsVolCurValue"
            :options="selcOptions()"
            @change="handleChangePcsVolCur"
            style="font-size: 12px; width: 200px"
          />
        </div>
        <NewEnergyPcsCharts
          :options="state.pcsVolCurOptions"
          :yTitle="['相电压', '相电流']"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
  import { defHttp } from '/@/utils/http/axios';
  // import { reactive, ref, toRaw, onBeforeUnmount } from 'vue';
  import GrowCard from './components/GrowCard.vue';
  import OperateEfficiency from '/@/components/OperateEfficiency/index.vue';
  import SiteAnalysis from './components/SiteAnalysis.vue';
  import NewEnergyPcsCharts from '/@/components/Echarts/NewEnergyPcsCharts.vue';
  const state = reactive({
    cemsSysInfoEfficiency: [],
    sysPoweroptions: [],
    energyStorageBenefits: [],
    cachePcsPowerOptions: [],
    cachePcsVolCurOptions: [],
    pcsVolCurOptions: [],
    pcsPowerOptions: [],
    pcsPowerValue: '01#舱',
    pcsVolCurValue: '01#舱',
    baseInfo: {},
  });
  const selcOptions = () => {
    const list = [];
    for (let i = 1; i <= 12; i++) {
      const tit = i < 10 ? `0${i}` : i;
      list.push({
        label: `${tit}#舱`,
        value: `${tit}#舱`,
      });
    }
    return list;
  };
  const handleChangePcsPower = (val) => {
    const cacheData = toRaw(state.cachePcsPowerOptions);
    const ret = cacheData.filter((item) => {
      if (item.name.indexOf(val) !== -1) {
        item.lineStyle = {
          width: 0.5,
        };
        item.smooth = true;
        item.showSymbol = false;
        if (item.name.indexOf('有功功率') !== -1) {
          item.yAxisIndex = 0; // 设置Y轴
        }
        if (item.name.indexOf('无功功率') !== -1) {
          item.yAxisIndex = 1; // 设置Y轴
        }
        return item;
      }
    });
    state.pcsPowerOptions = ret;
  };
  const handleChangePcsVolCur = (val) => {
    const cacheData = toRaw(state.cachePcsVolCurOptions);
    const ret = cacheData.filter((item) => {
      if (item.name.indexOf(val) !== -1) {
        item.lineStyle = {
          width: 0.5,
        };
        item.smooth = true;
        item.showSymbol = false;
        if (item.name.indexOf('相电压') !== -1) {
          item.yAxisIndex = 0; // 设置Y轴
        }
        if (item.name.indexOf('相电流') !== -1) {
          item.yAxisIndex = 1; // 设置Y轴
        }
        return item;
      }
    });
    state.pcsVolCurOptions = ret;
  };
  const optionsListApi = (params) => defHttp.get({ url: '/getshouye/homepage', params });
  const getUserInfomation = async () => {
    const res = await optionsListApi();
    console.log('optionsListApi----', res);
    const {
      cemsSysInfoEfficiency,
      energyStorageBenefits,
      baseInfo,
      pcsPowerSeries,
      pcsVolCurSeries,
      sysPowerSeries,
    } = res;
    state.cemsSysInfoEfficiency = cemsSysInfoEfficiency;
    state.baseInfo = baseInfo;
    state.energyStorageBenefits = energyStorageBenefits;
    state.sysPoweroptions = sysPowerSeries;
    state.cachePcsVolCurOptions = pcsVolCurSeries;
    handleChangePcsVolCur(state.pcsVolCurValue);
    state.cachePcsPowerOptions = pcsPowerSeries;
    handleChangePcsPower(state.pcsPowerValue);
  };
  getUserInfomation();
  const task = setInterval(() => {
    getUserInfomation();
  }, 3000);
  onBeforeUnmount(() => {
    clearInterval(task);
  });
  const loading = ref(true);
  setTimeout(() => {
    loading.value = false;
  }, 1500);
</script>
<style lang="less" scoped>
  .bingo {
    z-index: 999;
    left: calc(50% - 100px);
    position: absolute;
  }
  .add-shadow {
    &:hover {
      // box-shadow: 0 2px 8px 0 #a99c9c;
    }
  }
  .chart-card {
    margin: 0 10px;
    border-radius: 4px;
    background: rgb(238, 236, 236);
    width: 100%;
    flex: 1;
  }
</style>
