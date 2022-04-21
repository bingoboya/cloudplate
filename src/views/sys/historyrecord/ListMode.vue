<template>
  <div>
    <!-- <div style="justify-content: center; display: flex;">列表模式</div> -->
    <!-- <a-table
      class="ant-table-striped" :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :columns="columns" bordered size="small" :pagination="false" :data-source="data" :scroll="{ y: 340 }" /> -->
    
    <ListComp />
    <!-- <MyPagination 
      :total="total" 
      :pagesize="reqParams.pagesize" 
      :currentPage="currentPage" 
      @change-page="changePage" /> -->
  </div>
</template>

<script setup>
import MyPagination from '/@/components/MyPagination/index.vue'
import ListComp from './ListComp/index.vue';
const total = ref(300)
const currentPage = ref(1)
const reqParams = reactive({
  pagesize: 20
})
const changePage = () => {
  console.log('changePage');
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 150,
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

const data = [...Array(100)].map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));
</script>
<style lang="less" scoped></style>
