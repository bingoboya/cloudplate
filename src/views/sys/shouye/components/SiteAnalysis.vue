<template>
  <Card v-bind="$attrs">
    <VisitAnalysis :options="$attrs.options" :test="$attrs.test" />
  </Card>
</template>
<script lang="ts" setup>
  import { Card } from 'ant-design-vue';
  import VisitAnalysis from './VisitAnalysis.vue';
</script>
