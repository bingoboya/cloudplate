<template>
  <div>
    <div class="moniterpcs_wrapper">
      <div class="pcs_top">
        <div style="display: flex">
          <a-select
            v-model:value="state.query.selectNums" mode="multiple" style="width: 330px; height: 32px"
            :show-arrow="true" max-tag-count="responsive" allowClear placeholder="PCS#01~06（下拉选择1、可多选）"
            :options="state.machineNums" />
          <a-select
            v-model:value="state.query.selectName" style="width: 200px; height: 32px; margin: 0 10px" allowClear
            placeholder="设备名称（单选）" :options="state.machineNames" />
          <a-select
            v-model:value="state.query.searchTag" mode="multiple" style="width: 330px" :show-arrow="true"
            allowClear max-tag-count="responsive" placeholder="数据查找" :options="state.searchDataList" />
        </div>
      </div>

      <div class="pcs_bottom">
        <div v-for="(item, index) in state.dataList" :key="item + index" class="item-whole-wrapper">
          <div
            style="padding: 10px;
            font-weight: 500;
            font-size: 18px;
            border-bottom: 1px solid #e7e4e4;
            text-align: center;
          ">{{ item.name }}</div>
          <div style="display: flex">
            <div class="celiang">遥测量</div>
            <div class="system-wrapper">
              <div
                :class="[
                  showHeightLight(itemInfo.title) ? 'height_light_card_blue' : '',
                  'custom-card-wrapper',
                ]" v-for="(itemInfo, i) in item.pcsInfo"
                @click="toggleshowModal(item.name, itemInfo.mark, `${itemInfo.title}(${itemInfo.unit})`)"
                :key="itemInfo.mark + i" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 4px 0;
                cursor: pointer;
                justify-content: center;
              ">
                <div>
                  <div style="font-size: 12px">{{ itemInfo.title }}</div>
                </div>
                <div style="padding: 4px 0; display: flex; align-items: baseline">
                  <div style="font-size: 18px">{{ itemInfo.val }}</div>
                  <div style="font-size: 12px">{{ itemInfo.unit }}</div>
                </div>
              </div>
            </div>
          </div>
          <div style="border-top: 1px solid rgb(231, 228, 228); display: flex; white-space: nowrap">
            <div class="celiang">遥信量</div>
            <div class="msg-system-wrapper">
              <div
                :class="[
                  showHeightLight(itemSignalInfo.title)
                    ? itemSignalInfo.val
                      ? 'height_light_card_red'
                      : 'height_light_card_green'
                    : '',
                  'custom-card-wrapper',
                ]" v-for="(itemSignalInfo, ind) in item.signalInfo" @click="toggleshowModal(
                  item.name,
                  itemSignalInfo.mark,
                  `${itemSignalInfo.title}(${itemSignalInfo.unit})`,
                )
                " :key="itemSignalInfo + ind" :style="{
                  background: itemSignalInfo.val ? 'rgb(249 197 195)' : 'rgb(186 233 221)',
                  color: itemSignalInfo.val ? 'rgb(239 99 94)' : '#13ad13',
                }" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 12px;
                cursor: pointer;
                padding: 4px 0;
              ">{{ itemSignalInfo.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <a-modal v-model:visible="visible" width="80%" height="86%" :destroyOnClose="true" :bodyStyle="{ height: '94%' }"
    :footer="null" title="">
    <DataRange :modalParams="state.modalParams" :modalTitle="state.modalTitle" />
  </a-modal> -->
  </div>
</template>
<script setup>
// import DataRange from 'components/DataRange/index.vue';
import { defHttp } from "/@/utils/http/axios";
import { cloneDeep } from "lodash-es";
const visible = ref(false);

const state = reactive({
  // 只监听时间变化调用接口
  query: {},
  modalParams: [],
  modalTitle: "",
  dataList: [], // 显示的数据
  allDataList: [], // 缓存所有数据
  machineNums: [],
  machineNames: [],
  searchDataList: [], // 数据查询的下拉列表
  deviceNameList: [], // 设备名
});
const toggleshowModal = (val, mark, modalTitle) => {
  const name = val.replace(/[^0-9]/gi, "");
  state.modalParams = ["pcs", name, mark];
  state.modalTitle = modalTitle;
  console.log("showModal", state.modalParams, modalTitle);
  visible.value = true;
};
const showHeightLight = title => {
  const tem = toRaw(state.query.searchTag);
  return tem && tem.includes(title);
};
const getDataList = query => {
  return defHttp.get({ url: "/weather/pcspages", query });
};
const getData = async query => {
  const { pcsDataList, deviceNameList } = await getDataList(query);
  pcsDataList.forEach(item => {
    item.pcsInfo = fomatePcsInfo(item.pcsInfo);
    item.signalInfo = fomateSignalInfo(item.signalInfo);
  });
  state.allDataList = pcsDataList;
  state.dataList = filterDataList(pcsDataList, state.query);
  createSelectList(pcsDataList);
};

const createSelectList = pcsDataList => {
  const machineNum = []; // 生成机器号下拉列表数据
  const machineName = []; // 生成设备名称下拉列表数据
  // const wholeList = pcsDataList.map(item => item.name.replace('编号', 'PCS')) // 生成所有的数据中的name字段列表
  pcsDataList.forEach(item => {
    // const name = item.name.replace('编号', 'PCS')
    machineNum.push(item.name.match(/(\S*)编号/)[1]); // 取编号前面的当作机器号
    machineName.push(item.name.match(/(编号\S*)/)[1]); // 取编号后边的当设备名
  });
  state.machineNums = Array.from(new Set(machineNum)).map(item => {
    return {
      value: item,
      label: item,
    };
  });
  state.machineNames = Array.from(new Set(machineName)).map(item => {
    return {
      value: item,
      label: item.replace("编号", "PCS"),
    };
  });
};

const fomateSignalInfo = initData => {
  const arr = [
    { mark: "falultstatus", title: "故障状态", val: true },
    { mark: "onstatus", title: "开机状态", val: true },
    { mark: "comstatus", title: "BMS通信状态", val: true },
    { mark: "acovercur", title: "交流过流动作", val: true },
    { mark: "acovervol", title: "交流过压动作", val: true },
    { mark: "acundervol", title: "交流欠压动作", val: true },
    { mark: "accoverfreq", title: "交流过频动作", val: true },
    { mark: "acunderfreq", title: "交流欠频动作", val: true },
    { mark: "seqerror", title: "相序错误动作", val: true },
    { mark: "overload", title: "过载动作", val: true },
    { mark: "dccovercur", title: "直流过流动作", val: true },
    { mark: "dccovervol", title: "直流过压动作", val: true },
    { mark: "dcundervol", title: "直流直流欠压动作", val: true },
    { mark: "dcreverse", title: "直流极性反接动作", val: true },
    { mark: "overtemp", title: "过温动作", val: true },
  ];
  arr.forEach(item => {
    item.val = initData[item.mark];
  });
  // console.log(arr)
  return arr;
};
const fomatePcsInfo = initData => {
  const arr = [
    { mark: "volA", title: "交流测A相电压", val: 2, unit: "KW" },
    { mark: "volB", title: "交流测B相电压", val: 2, unit: "KWh" },
    { mark: "volC", title: "交流测C相电压", val: 2, unit: "KWh" },
    { mark: "curA", title: "交流测A相电流", val: 2, unit: "KWh" },
    { mark: "curB", title: "交流测B相电流", val: 2, unit: "个" },
    { mark: "curC", title: "交流测C相电流", val: 2, unit: "个" },
    { mark: "freq", title: "电网频率", val: 2, unit: "KW" },
    { mark: "acapW", title: "交流有功功率", val: 2, unit: "KW" },
    { mark: "acrpW", title: "无功功率", val: 2, unit: "%" },
    { mark: "dcvol", title: "直流侧电压", val: 2, unit: "%" },
    { mark: "dccur", title: "直流侧电流", val: 2, unit: "KWh" },
    { mark: "dcpw", title: "直流侧功率", val: 2, unit: "KWh" },
    { mark: "igbtTemp", title: "IGBT模块温度", val: 2, unit: "KWh" },
    { mark: "dpw", title: "可放功率", val: 2, unit: "KWh" },
    { mark: "epw", title: "可充功率", val: 2, unit: "KWh" },
  ];
  arr.forEach(item => {
    item.val = initData[item.mark];
  });
  // console.log(arr)
  return arr;
};

getData(state.query);
let task = setInterval(() => {
  getData(state.query);
}, 3000);
const filterDataList = (allDataList, query) => {
  const { selectNums, selectName, searchTag } = query;
  let retArraya = [];
  let retArrayb = [];
  if (selectNums && selectNums.length > 0) {
    allDataList.forEach(item => {
      selectNums.forEach(num => {
        if (item.name.includes(num)) {
          retArraya.push(item);
        }
      });
    });
  } else {
    retArraya = [...allDataList];
  }
  if (selectName) {
    retArrayb = retArraya.filter(val => val.name.includes(selectName));
  } else {
    retArrayb = [...retArraya];
  }
  const tempData = retArrayb.map(val => {
    const pcsInfos = val.pcsInfo.map(info => info.title);
    const signalInfos = val.signalInfo.map(info => info.title);
    return [...pcsInfos, ...signalInfos];
  });
  const flatTempData = Array.from(new Set(tempData.flat()));
  state.searchDataList = flatTempData.map(temp => {
    return {
      value: temp,
    };
  });
  // console.log('filterDataList1',state.searchDataList, tempData, flatTempData, state.searchDataList, retArraya, retArrayb, allDataList)
  // console.log('filterDataList1', state.searchDataList, selectName, selectNums, searchTag, retArraya, retArrayb, allDataList)
  return retArrayb;
};
watch(
  () => cloneDeep(state.query),
  (n, o) => {
    // 监听到参数变化根据当前的参数在当前的datalist中筛出符合条件的数据
    state.dataList = filterDataList(toRaw(state.allDataList), n);
  }
);

onUnmounted(() => {
  clearInterval(task);
});
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
  background: #fb908d !important;
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
  border: 2px solid #5197fb;
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
    border: 2px solid #5197fb;
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
