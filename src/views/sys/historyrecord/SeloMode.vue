<template>
  <div>
    <Selo class="enter-y" @chooseDay="chooseDay" />
    <a-table size="small" class="enter-y" :columns="state.celueColumnsData" :data-source="state.celueDataSource" bordered :pagination="false" />
  </div>
</template>

<script setup>
import Selo from '/@/components/Selo/index.vue'
const state = reactive({
  celueColumnsData: [
    {
      title: '优化策略',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '下发人',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: '下发时间',
      dataIndex: 'time',
      key: 'address1',
      ellipsis: true,
    },
    {
      title: '预计收益(元)',
      dataIndex: 'vitrual',
      key: 'address2',
      ellipsis: true,
    },
    {
      title: '实际收益(元)',
      dataIndex: 'real',
      key: 'address3',
      ellipsis: true,
    }
  ],
  celueDataSource: [
    {
      key: '1',
      name: '优化策略1',
      age: 'bingo',
      time: '2022-02-28',
      vitrual: 1623.1,
      real: 1712.9
    }
  ]
})
const chooseDay = (selectedDate, val) => {
  state.celueDataSource[0].time = selectedDate
  state.celueDataSource[0].real = val
}
</script>
<style lang="less" scoped>

</style>
