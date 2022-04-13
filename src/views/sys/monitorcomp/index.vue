<template>
  <div>
    <!-- header -->
    <div style="display: flex">
      <a-button>全局</a-button>
      <a-button>PCS</a-button>
      <a-button>BMS</a-button>
      <a-button>电池簇</a-button>
    </div>
    <!-- g6 -->
    <div></div>
    <!-- bottom -->
    <OperateEfficiency :options="state.cemsSysInfoEfficiency" :loading="loading" class="enter-y" />
  </div>
</template>

<script setup>
  import { defHttp } from '/@/utils/http/axios';
  import OperateEfficiency from '/@/components/OperateEfficiency/index.vue';
  const state = reactive({
    cemsSysInfoEfficiency: [],
  });
  const optionsListApi = (params) => defHttp.get({ url: '/getshouye/homepage', params });
  const getUserInfomation = async () => {
    const res = await optionsListApi();
    const { cemsSysInfoEfficiency } = res;
    state.cemsSysInfoEfficiency = cemsSysInfoEfficiency;
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

<style lang="scss" scoped></style>
