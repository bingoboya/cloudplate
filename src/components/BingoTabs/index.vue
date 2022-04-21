<template>
  <div
    :class="{ tab: true, checked: item.checked }" v-for="item in props.choseList" :key="item.code"
    @click="choseType(item)">
    {{ item.label }}
  </div>
</template>

<script setup name="BingoTabs">
const emit = defineEmits(['chose-comp'])
const props = defineProps({
  choseList: {
    type: Array,
    default: () => { [] }
  },
  curChosed: {
    type: [Number, String]
  }
})
watch(() => props.curChosed, (newValue) => {
    props.choseList.forEach(item => {
        item.checked = item.key === newValue
    })
  }, {
    immediate: true,
  })
  const choseType = (item) => {
    props.choseList.forEach((element) => {
      element.checked = false;
    });
    item.checked = true;
    // props.curChosed = item.key;
    emit('chose-comp', item.key)
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