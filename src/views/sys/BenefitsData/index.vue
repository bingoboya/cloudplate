<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <div>昨日收益 +1900 元</div>
      <div>本月收益 +19200 元</div>
      <div>本年收益 +19300 元</div>
    </div>
    <div>
      <BingoTabs
        :choseList="state.choseList" :curChosed="state.curChosed"
        @chose-comp="(val) => state.curChosed = val" />
    </div>
    <BenefitsDay v-if="state.curChosed === 1" />
    <BenefitsMonth v-if="state.curChosed === 2" />
    <BenefitsYear v-if="state.curChosed === 3" />
  </div>
</template>

<script setup>
import BenefitsDay from '/@/views/sys/BenefitsData/components/BenefitsDay/index.vue'
import BenefitsMonth from '/@/views/sys/BenefitsData/components/BenefitsMonth/index.vue'
import BenefitsYear from '/@/views/sys/BenefitsData/components/BenefitsYear/index.vue'
const state = reactive({
  choseList: [
    { key: 1, label: '日收益', checked: true },
    { key: 2, label: '月收益', checked: false },
    { key: 3, label: '年收益', checked: false },
  ],
  // 默认选中的项
  curChosed: 1,
});
</script>

<style lang="scss" scoped>
</style>