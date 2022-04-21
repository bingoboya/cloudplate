<template>
  <div class="moniterpcs_wrapper">
    <div class="pcs_top">
      <div style="display: flex;">
        <a-select
          v-model:value="state.query.selectNums"
          mode="multiple"
          style="width: 330px;height: 32px;"
          :show-arrow="true"
          max-tag-count="responsive"
          allowClear
          placeholder="PCS#01~06（下拉选择1、可多选）"
          :options="state.machineNums"
        />
        <a-select
          v-model:value="state.query.selectName"
          style="width: 200px;height: 32px; margin: 0 10px;"
          allowClear
          placeholder="设备名称（单选）"
          :options="state.machineNames"
        />
        <a-select
          v-model:value="state.query.searchTag"
          mode="multiple"
          style="width: 330px"
          max-tag-count="responsive"
          :show-arrow="true"
          allowClear
          placeholder="数据查找"
          :options="state.searchDataList"
        />
      </div>
      <!-- <div>
        <a-select
          v-model:value="state.query.selectNums"
          mode="multiple"
          style="width: 300px"
          allowClear
          placeholder="BMS#01~06（下拉选择、可多选）"
          :options="[...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }))"
        />
        <a-select
          v-model:value="state.query.selectName"
          style="width: 300px"
          allowClear
          placeholder="设备名称（单选）"
          :options="[...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }))"
        />
        <a-input v-model:value="state.query.seachTag" placeholder="数据查找" allowClear />
      </div>-->
    </div>

    <div class="pcs_bottom">
      <div v-for="(item, index) in state.dataList" :key="item + index" class="item-whole-wrapper">
        <div
          style="padding: 10px;font-weight: 500;font-size: 18px;border-bottom: 1px solid #e7e4e4;text-align: center;"
        >{{ item.name }}</div>
        <div style="display: flex;">
          <div class="celiang">遥测量</div>
          <div class="system-wrapper">
            <div
              :class="[showHeightLight(itemInfo.title) ? 'height_light_card_blue' : '', 'custom-card-wrapper']"
              v-for="(itemInfo, i) in item.bmsInfo"
              :key="itemInfo.mark + i"
              @click="toggleshowModal(item.name, itemInfo.mark, `${itemInfo.title}(${itemInfo.unit})`)"
              style="display: flex;flex-direction: column;
                    align-items: center;
                    padding: 4px 0;
                    cursor: pointer;
                  justify-content: center;"
            >
              <div>
                <div style="font-size:12px;">{{ itemInfo.title }}</div>
              </div>
              <div style="padding:4px 0;display: flex;align-items: baseline;">
                <div style="font-size: 18px;">{{ itemInfo.val }}</div>
                <div style="font-size:12px;">{{ itemInfo.unit }}</div>
              </div>
            </div>
          </div>
        </div>
        <div style="border-top: 1px solid rgb(231, 228, 228);display: flex;white-space: nowrap;">
          <div class="celiang">遥信量</div>
          <div class="msg-system-wrapper">
            <div
              :class="[showHeightLight(itemSignalInfo.title) ? itemSignalInfo.val ? 'height_light_card_red' : 'height_light_card_green' : '', 'custom-card-wrapper']"
              v-for="(itemSignalInfo, ind) in item.bmsInfoSignal"
              :key="itemSignalInfo + ind"
              @click="toggleshowModal(item.name, itemSignalInfo.mark, `${itemSignalInfo.title}(${itemSignalInfo.unit})`)"
              :style="{ 
                background: itemSignalInfo.val ? 'rgb(249 197 195)' : 'rgb(186 233 221)',
                color: itemSignalInfo.val ? 'rgb(239 99 94)' : '#13ad13'
              }"
              style="display: flex;flex-direction: column;
                    align-items: center;
                    font-size:12px;
                    cursor: pointer;
                    padding: 4px 0;
                  "
            >{{ itemSignalInfo.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <a-modal
    v-model:visible="visible"
    width="80%"
    height="86%"
    :destroyOnClose="true"
    :bodyStyle="{height: '94%'}"
    :footer="null"
    title=""
  >
    <DataRange :modalParams='state.modalParams' :modalTitle="state.modalTitle" />
  </a-modal> -->
</template>

<script setup>
// import DataRange from "components/DataRange/index.vue"

import { defHttp } from "/@/utils/http/axios";
import { cloneDeep } from "lodash-es";
// import request from '@/utils/request';
// import qs from 'qs'
// import _ from 'lodash'
const visible = ref(false)

const state = reactive({
  // 只监听时间变化调用接口
  query: {},
  dataList: [], // 显示的数据
  allDataList: [], // 缓存所有数据
  machineNums: [],
  modalParams: [],
  modalTitle: '',
  machineNames: [],
  searchDataList: [], // 数据查询的下拉列表
  deviceNameList: [] // 设备名
})
const toggleshowModal = (val, mark, modalTitle) => {
  const name = val.replace(/[^0-9]/ig,"")
  state.modalParams = ['bms', name, mark]
  state.modalTitle = modalTitle
  console.log('showModal', state.modalParams, modalTitle);
  visible.value = true
}
const showHeightLight = (title) => {
  const tem = toRaw(state.query.searchTag)
  return tem && tem.includes(title)
}
const getDataList = query => {
  return defHttp.get({ url: "/weather/bmspages", query });
};
const getData = async (query) => {
  const { bmsDataList, deviceNameList } = await getDataList(query);
  bmsDataList.forEach(item => {
      item.bmsInfo = fomatePcsInfo(item.bmsInfo)
      item.bmsInfoSignal = fomateSignalInfo(item.bmsInfoSignal)
    })
    state.allDataList = bmsDataList
    state.dataList = filterDataList(bmsDataList, state.query)
    createSelectList(bmsDataList)
}
const createSelectList = (pcsDataList) => {
  const machineNum = []  // 生成机器号下拉列表数据
  const machineName = [] // 生成设备名称下拉列表数据
  // const wholeList = pcsDataList.map(item => item.name.replace('编号', 'PCS')) // 生成所有的数据中的name字段列表
  pcsDataList.forEach(item => {
    // const name = item.name.replace('编号', 'PCS')
    machineNum.push(item.name.match(/(\S*)编号/)[1])
    machineName.push(item.name.match(/(编号\S*)/)[1])
  })
  state.machineNums = Array.from(new Set(machineNum)).map(item => {
    return {
      value: item,
      label: item
    }
  })
  state.machineNames = Array.from(new Set(machineName)).map(item => {
    return {
      value: item,
      label: item.replace('编号', 'BMS')
    }
  })
}

const filterDataList = (allDataList, query) => {
  const { selectNums, selectName, searchTag } = query
  let retArraya = []
  let retArrayb = []
  if (selectNums && selectNums.length > 0) {
    allDataList.forEach(item => {
      selectNums.forEach(num => {
        if (item.name.includes(num)) {
          retArraya.push(item)
        }
      })
    })
  } else {
    retArraya = [...allDataList]
  }
  if (selectName) {
    retArrayb = retArraya.filter(val => val.name.includes(selectName))
  } else {
    retArrayb = [...retArraya]
  }
  const tempData = retArrayb.map(val => {
    const pcsInfos = val.bmsInfo.map(info => info.title)
    const signalInfos = val.bmsInfoSignal.map(info => info.title)
    return [...pcsInfos, ...signalInfos]
  })
  const flatTempData = Array.from(new Set(tempData.flat()))
  state.searchDataList = flatTempData.map(temp => {
    return {
      value: temp
    }
  })
  return retArrayb
}
watch(() => cloneDeep(state.query), (n, o) => {
  // 监听到参数变化根据当前的参数在当前的datalist中筛出符合条件的数据
  state.dataList = filterDataList(toRaw(state.allDataList), n)
})
const fomateSignalInfo = (initData) => {
  const arr = [
    { mark: 'bmucomfault', title: 'BMU通信故障', val: true },
    { mark: 'insulationfault', title: '单体过压', val: true },
    { mark: 'monovervol', title: '单体欠压', val: true },
    { mark: 'monundervol', title: '单体电压不均衡', val: true },
    { mark: 'overtemp', title: '过温', val: true },
    { mark: 'undertemp', title: '欠温', val: true },
    { mark: 'temunblance', title: '温度不均衡', val: true },
    { mark: 'overvol', title: '组端电压过高', val: true },
    { mark: 'undervol', title: '组端电压过低', val: true },
    { mark: 'eovercur', title: '组端电流充电过流', val: true },
    { mark: 'dovercur', title: '组端电流放电过流', val: true },
    { mark: 'socover', title: 'soc过高', val: true },
    { mark: 'socunder', title: 'soc过低', val: true },
  ]
  arr.forEach(item => {
    item.val = initData[item.mark]
  })
  // console.log(arr)
  return arr
}
const fomatePcsInfo = (initData) => {
  const arr = [
    { mark: 'vol', title: '电池堆总电压', val: 2, unit: 'KW' },
    { mark: 'cur', title: '电池堆总电流', val: 2, unit: 'KWh' },
    { mark: 'soc', title: '电池堆soc值', val: 2, unit: 'KWh' },
    { mark: 'soh', title: '电池对soh值', val: 2, unit: 'KWh' },
    { mark: 'maxmvol', title: '最高单体电压', val: 2, unit: '个' },
    { mark: 'minmvol', title: '最低单体电压', val: 2, unit: '个' },
    { mark: 'power', title: '电池堆总功率', val: 2, unit: 'KW' },
    { mark: 'req', title: '电池堆可充电量', val: 2, unit: 'KW' },
    { mark: 'rdq', title: '电池堆可放电量', val: 2, unit: '%' },
    { mark: 'maxtemp', title: '最高电池温度', val: 2, unit: '%' },
    { mark: 'mintemp', title: '最低电池温度', val: 2, unit: 'KWh' },
    { mark: 'maxsoc', title: '组soc最大', val: 2, unit: 'KWh' },
    { mark: 'minsoc', title: '组soc最小', val: 2, unit: 'KWh' },
  ]
  arr.forEach(item => {
    item.val = initData[item.mark]
  })
  // console.log(arr)
  return arr
}

getData(state.query)
let task = setInterval(() => {
  getData(state.query)
}, 3000)

onUnmounted(() => {
  clearInterval(task)
})
</script>

<style lang="less" scoped>
.height_light_card_red {
  position: relative;
  // margin: auto;
  // width: 120px;
  // line-height: 64px;
  // text-align: center;
  // font-size: 20px;
  // opacity: 1 !important;
  color: #fff !important;
  background: #FB908D !important;
  border: 2px solid #fb908d;
  // border: 2px solid gold;
  // border-radius: 10px;
  // background: gold;
  transition: all 0.3s;
  // cursor: pointer;

  &:hover {
    filter: contrast(1.1);
  }

  &:active {
    filter: contrast(0.9);
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    // border: 2px solid gold;
    border: 2px solid #fb908d;
    transition: all 0.5s;
    animation: clippath 3s infinite linear;
    border-radius: 10px;
  }

  &::after {
    animation: clippath 3s infinite -1.5s linear;
  }
}
.height_light_card_green {
  position: relative;
  // margin: auto;
  // width: 120px;
  // line-height: 64px;
  // text-align: center;
  // color: #fff;
  // font-size: 20px;
  // opacity: 1 !important;
  color: #fff !important;
  background: #42c8a7 !important;
  border: 2px solid #42c8a7;
  // border: 2px solid gold;
  // border-radius: 10px;
  // background: gold;
  transition: all 0.3s;
  // cursor: pointer;

  &:hover {
    filter: contrast(1.1);
  }

  &:active {
    filter: contrast(0.9);
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    // border: 2px solid gold;
    border: 2px solid #42c8a7;
    transition: all 0.5s;
    animation: clippath 3s infinite linear;
    border-radius: 10px;
  }

  &::after {
    animation: clippath 3s infinite -1.5s linear;
  }
}
.height_light_card_blue {
  position: relative;
  // margin: auto;
  // width: 120px;
  // line-height: 64px;
  // text-align: center;
  // color: #fff;
  // font-size: 20px;
  background: #a8c4eb !important;
  border: 2px solid #5197FB;
  // border: 2px solid gold;
  // border-radius: 10px;
  // background: gold;
  transition: all 0.3s;
  // cursor: pointer;

  &:hover {
    filter: contrast(1.1);
  }

  &:active {
    filter: contrast(0.9);
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    // border: 2px solid gold;
    border: 2px solid #5197FB;
    transition: all 0.5s;
    animation: clippath 3s infinite linear;
    border-radius: 10px;
  }

  &::after {
    animation: clippath 3s infinite -1.5s linear;
  }
}

@keyframes clippath {
  0%,
  100% {
    clip-path: inset(0 0 98% 0);
  }

  25% {
    clip-path: inset(0 98% 0 0);
  }
  50% {
    clip-path: inset(98% 0 0 0);
  }
  75% {
    clip-path: inset(0 0 0 98%);
  }
}
.item-whole-wrapper {
  background: #f7f7f7;
  border-radius: 8px;
  margin-bottom: 20px;
  .celiang {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
  }
}
.system-wrapper {
  border-radius: 8px;
  // padding: 0 10px 10px 10px;
  flex: 1;
  margin: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
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
.msg-system-wrapper {
  border-radius: 8px;
  flex: 1;
  margin: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
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
.moniterpcs_wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .pcs_top {
    padding-right: 10px;
    margin-bottom: 16px;
    // background-color: aquamarine;
  }
  .pcs_bottom {
    padding-right: 10px;
    // background-color: rgb(118, 139, 132);
    overflow: hidden;
    overflow-y: auto;
    flex: 1;
  }
}
</style>