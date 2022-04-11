<template>
  <div class="operateEfficiency-wrapper">
    <Card title :loading="loading">
      <div class="system-wrapper">
        <div
          class="custom-card-wrapper"
          v-for="(item, index) in state.energyRunCart"
          :key="index"
          style="display: flex;flex-direction: column;
                    align-items: center;
                  justify-content: center;"
        >
          <div>
            <div style="font-size:12px;">{{ item.title }}</div>
          </div>
          <div style="display: flex;align-items: baseline;">
            <div style="font-size: 22px;">{{ item.val }}</div>
            <div style="font-size:12px;">{{ item.unit }}</div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { Card } from 'ant-design-vue';
import { reactive, watch } from 'vue';
const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
  loading: Boolean,
});
const state = reactive({
  energyRunCart: []
})
watch(() => props.options, () => {
  state.energyRunCart = fomate(props.options)
})
const fomate = (initData) => {
  const arr = [
    { mark: 'rapw', title: '额定功率', val: 2, unit: 'kW' },
    { mark: 'rcap', title: '额定容量', val: 2, unit: 'kWh' },
    { mark: 'req', title: '可充电量', val: 2, unit: 'kWh' },
    { mark: 'rdq', title: '可放电量', val: 2, unit: 'kWh' },
    { mark: 'npcs', title: 'PCS数量', val: 2, unit: '个' },
    { mark: 'npcs', title: 'BMS数量', val: 2, unit: '个' },
    { mark: 'reqp', title: '可充功率', val: 2, unit: 'kW' },
    { mark: 'rdqp', title: '可放功率', val: 2, unit: 'kW' },
    { mark: 'ulsoc', title: 'SOC运行上限', val: 2, unit: '%' },
    { mark: 'llsoc', title: 'SOC运行下限', val: 2, unit: '%' },
    { mark: 'teq', title: '总充电量', val: 2, unit: 'kWh' },
    { mark: 'tdq', title: '总放电量', val: 2, unit: 'kWh' },
  ]
  arr.forEach(item => {
    item.val = initData[item.mark]
  })
  console.log(arr)
  return arr
}
</script>

<style lang="less" scoped>
.operateEfficiency-wrapper{
  :deep(.ant-card-bordered){
    border-radius: 8px;
  }
  :deep(.ant-card-body) {
    padding: 0;
  }
}
.system-wrapper {
  background: rgb(235, 233, 233);
  border-radius: 8px;
  padding: 10px;
  flex: 1;
  // margin: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 10px 10px;
  // grid-auto-rows: 50px;
  .custom-card-wrapper {
    background: #fff;
    border-radius: 8px;
    border: 1px solid rgb(226, 219, 219);
    &:hover {
      box-shadow: 0 2px 12px 0 rgb(0, 0, 0, 0.1);
    }
  }
}
</style>