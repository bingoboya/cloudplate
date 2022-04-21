<template>
  <div>
    <!-- header -->
    <div class="pop-tab">
      <div
        :class="{ tab: true, checked: item.checked }"
        v-for="item in state.choseList"
        :key="item.code"
        @click="choseType(item)"
      >
        {{ item.label }}
      </div>
    </div>
    <!-- 全局 -->
    <Global v-if="state.curChosed === 1" :showG6="false" />
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
    curChosed: 1,
  });
  const choseType = (item) => {
    state.choseList.forEach((element) => {
      element.checked = false;
    });
    item.checked = true;
    state.curChosed = item.key;
  };
</script>

<style lang="less" scoped>
  .tab {
    display: inline-block;
    padding: 2px 16px;
    // width: 60px;
    // height: 40px;
    background-color: transparent;
    cursor: pointer;
    text-align: center;
    // line-height: 40px;
  }

  .checked {
    background-color: green;
    border-radius: 16px;
  }
</style>
