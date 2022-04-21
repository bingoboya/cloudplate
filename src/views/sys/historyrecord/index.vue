<template>
  <div style="padding: 20px">
    <div style="justify-content: center; display: flex;">历史记录</div>
    <div style="margin-bottom: 10px">
      <a-button @click="state.mode = 1">日历模式</a-button>
      <a-button @click="state.mode = 2">列表模式</a-button>
    </div>
    <SeloMode v-if="state.mode === 1" />
    <ListMode v-else />
  </div>
</template>

<script setup>
import SeloMode from './SeloMode.vue'
import ListMode from './ListMode.vue'
const state = reactive({
  mode: 2
})

</script>
<style lang="less" scoped>

</style>
