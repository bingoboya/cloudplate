<template>
  <div>
    <!-- g6 -->
    <div v-if="showG6" style="width: 100%; height: 600px">
      <AntvG6 />
    </div>
    <!-- bottom -->
    <OperateEfficiency :options="state.cemsSysInfoEfficiency" :loading="loading" class="enter-y" />
  </div>
</template>

<script setup>
  import { defHttp } from '/@/utils/http/axios';
  import OperateEfficiency from '/@/components/OperateEfficiency/index.vue';
  import AntvG6 from '/@/components/AntvG6/index.vue';
  // import AntvG6copy from '/@/components/AntvG6/indexcopy.vue';
  defineProps({
    showG6: {
      type: Boolean,
      default: true
    }
  })
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

<style lang="less" scoped></style>
