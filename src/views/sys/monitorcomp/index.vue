<template>
  <div>
    <BingoTabs :choseList="state.choseList" :curChosed="state.curChosed" @chose-comp="(val) => state.curChosed = val" />
    <!-- 全局 -->
    <Global v-if="state.curChosed === 1" />
    <PCS v-if="state.curChosed === 2" />
    <BMS v-if="state.curChosed === 3" />
    <BatteryCluster v-if="state.curChosed === 4" />
  </div>
</template>

<script setup>
  import Global from '/@/components/DataMonitor/Global/index.vue';
  import PCS from '/@/components/DataMonitor/PCS/index.vue';
  import BMS from '/@/components/DataMonitor/BMS/index.vue';
  import BatteryCluster from '/@/components/DataMonitor/BatteryCluster/index.vue';
  const state = reactive({
    choseList: [
      { key: 1, label: '全部', checked: true },
      { key: 2, label: 'PCS', checked: false },
      { key: 3, label: 'BMS', checked: false },
      { key: 4, label: '电池簇', checked: false },
    ],
    // 默认选中的项
    curChosed: 3,
  });
</script>

<style lang="less" scoped>
</style>
