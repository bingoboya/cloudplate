<template>
  <!-- 告警中心 -->
  <div style="background: #eee;">
    <!-- <div style="padding: 20px">
      <a-range-picker
        show-time
        v-model:value="state.query.selectDateRange"
        :allowClear="false"
        style="width: 380px"
      />
      <a-select
        v-model:value="state.query.deviceValue"
        :options="state.deviceList"
        mode="multiple"
        :show-arrow="true"
        max-tag-count="responsive"
        allowClear
        placeholder="设备"
        style="width: 200px;margin: 0 10px;"
      />
      <a-select
        v-model:value="state.query.deviceIdValue"
        :options="state.deviceIdList"
        mode="multiple"
        :show-arrow="true"
        max-tag-count="responsive"
        allowClear
        placeholder="设备编号"
        style="width: 200px;margin-right:10px;"
      />
      <a-select
        v-model:value="state.query.optionsValue"
        :options="state.optionsList"
        mode="multiple"
        :show-arrow="true"
        max-tag-count="responsive"
        allowClear
        placeholder="数据项"
        style="width: 200px"
      />
    </div> -->
    <div ref="countRef" style="height:100%;background: #eee;">
      <a-table
        :dataSource="state.dataSource"
        :columns="state.columns"
        :pagination="false"
        size="middle"
        bordered
        class="ant-table-striped"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
        :scroll="{ y: (scry - 200) }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a-tooltip placement="topLeft" destroyTooltipOnHide	>
              <template #title>
                <span>{{ record.name }}</span>
              </template>
              <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ record.name }}</div>
            </a-tooltip>
          </template>
          <template v-if="column.key === 'happenTime'">
            <a-tooltip placement="topLeft" destroyTooltipOnHide	>
              <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ record.happenTime }}</div>
            </a-tooltip>
          </template>
          <template v-if="column.key === 'duration'">
            <a-tooltip placement="topLeft" destroyTooltipOnHide	>
              <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                {{ caculDiffDate(record.recoverydDate, record.happenTime) }}
              </div>
            </a-tooltip>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script setup>
import dayjs from 'dayjs';
import { cloneDeep } from "lodash-es";
// import request from '@/utils/request'
import { defHttp } from "/@/utils/http/axios";
// import { cleanObject } from '/@/utils/tools.js'
const countRef = ref(null)
const scry = ref(10)
const caculDiffDate = (maxDate, minDate) => {
  const d1 = maxDate.replace(/\-/g, "/");
  const d2 = minDate.replace(/\-/g, "/");
  const date1 = new Date(d1);   //date1就是一个日期类型了
  const date2 = new Date(d2);   //date1就是一个日期类型了

  const date3=date1.getTime()-date2.getTime(); //时间差秒
  //计算出相差天数
  const days=Math.floor(date3/(24*3600*1000))

  //计算出小时数
  const leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
  const hours=Math.floor(leave1/(3600*1000))

  //计算相差分钟数
  const leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
  const minutes=Math.floor(leave2/(60*1000))

  //计算相差秒数
  const leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
  const seconds=Math.round(leave3/1000)
  return `${days}天${hours}小时${minutes}分钟${seconds}秒`
}
const state = reactive({
  dataSource: [
    {
      key: '1',
      name: '02#电池堆BMS02',
      happenTime: '2022-02-23 17:18:14',
      eventdescrip: 'BMU通信故障',
      duration: '1小时2分钟6秒',
      recoverydDate: '2022-02-23 18:10:20'
    },
    {
      key: '2',
      name: '03#电池堆BMS02',
      happenTime: '2022-01-23 17:28:14',
      eventdescrip: 'BMU通信故障',
      duration: '1小时2分钟6秒',
      recoverydDate: '2022-01-23 18:10:20'
    },
    {
      key: '3',
      name: '04#电池堆BMS02',
      happenTime: '2022-01-23 17:38:14',
      eventdescrip: 'BMU通信故障',
      duration: '1小时2分钟6秒',
      recoverydDate: '2022-01-23 18:10:20'
    },
    {
      key: '4',
      name: '05#电池堆BMS02',
      happenTime: '2022-01-23 17:48:14',
      eventdescrip: 'BMU通信故障',
      duration: '1小时2分钟6秒',
      recoverydDate: '2022-01-23 18:10:20'
    },
    {
      key: '5',
      name: '06#电池堆BMS02',
      happenTime: '2022-01-23 17:58:14',
      eventdescrip: 'BMU通信故障',
      duration: '1小时2分钟6秒',
      recoverydDate: '2022-01-23 18:10:20'
    },
    {
      key: '6',
      name: '07#电池堆BMS02',
      happenTime: '2022-01-23 17:18:14',
      eventdescrip: 'BMU通信故障',
      duration: '1小时2分钟6秒',
      recoverydDate: '2022-01-23 18:10:20'
    },
    {
      key: '7',
      name: '08#电池堆BMS02',
      happenTime: '2022-01-23 12:08:14',
      eventdescrip: 'BMU通信故障',
      duration: '1小时2分钟6秒',
      recoverydDate: '2022-01-23 18:10:20'
    },
    {
      key: '8',
      name: '02#电池堆BMS02',
      happenTime: '2022-01-23 13:08:14',
      eventdescrip: 'BMU通信故障',
      duration: '1小时2分钟6秒',
      recoverydDate: '2022-01-23 18:10:20'
    },
    {
      key: '9',
      name: '02#电池堆BMS02',
      happenTime: '2022-01-23  4:08:14',
      eventdescrip: 'BMU通信故障',
      duration: '1小时2分钟6秒',
      recoverydDate: '2022-01-23 18:10:20'
    },
    {
      key: '10',
      name: '02#电池堆BMS02',
      happenTime: '2022-01-23 9:08:14',
      eventdescrip: 'BMU通信故障',
      duration: '1小时2分钟6秒',
      recoverydDate: '2022-01-23 18:10:20'
    },
    {
      key: '11',
      name: '06#电池堆BMS02',
      happenTime: '2022-01-23 12:08:14',
      eventdescrip: 'BMU通信故障',
      duration: '1小时2分钟6秒',
      recoverydDate: '2022-01-23 18:10:20'
    },
    {
      key: '12',
      name: '03#电池堆BMS01',
      happenTime: '2022-01-23 11:08:14',
      eventdescrip: 'BMU通信故障',
      duration: '1小时2分钟6秒',
      recoverydDate: '2022-01-23 18:10:20'
    },
    {
      key: '13',
      name: '06#电池堆BMS03',
      happenTime: '2022-01-23 13:08:14',
      eventdescrip: 'BMU通信故障',
      duration: '1小时2分钟6秒',
      recoverydDate: '2022-01-23 18:10:20'
    },
    {
      key: '14',
      name: '02#电池堆BMS04',
      happenTime: '2022-01-23 12:08:14',
      eventdescrip: 'BMU通信故障',
      duration: '1小时2分钟6秒',
      recoverydDate: '2022-01-23 18:10:20'
    }
  ],
  columns: [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 80,
      align: 'center'
    },
    {
      title: '设备名称/编号',
      dataIndex: 'name',
      key: 'name',
      // ellipsis: true, // 自动省略
      // ellipsis: 'showTitle'
    },
    {
      title: '发生日期及时刻',
      dataIndex: 'happenTime',
      key: 'happenTime',
    },
    {
      title: '事件描述',
      dataIndex: 'eventdescrip',
      key: 'eventdescrip',
      ellipsis: 'showTitle'
    },
    {
      title: '持续时间',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '恢复日期及时刻',
      dataIndex: 'recoverydDate',
      key: 'recoverydDate',
    },
  ],
  query: {
    optionsValue: [],
    deviceValue: [],
    deviceIdValue: [],
    selectDateRange: [
      dayjs(`${dayjs().format('YYYY-MM-DD')} 00:00:00`, 'YYYY-MM-DD HH:mm:ss'),
      dayjs(`${dayjs().format('YYYY-MM-DD')} 23:59:59`, 'YYYY-MM-DD HH:mm:ss')
    ],
  },
  // 设备
  deviceList: [{ label: 'PCS', value: 'pcs' }, { label: '电池堆', value: 'bms' }],
  // 设备编号列表
  deviceIdList: [],
  // 数据项列表
  optionsList: [],
  oriData: []
})

// const getTableScroll = ({ extraHeight, ref } = {}) => {
//   if (typeof extraHeight == "undefined") {
//     //  默认底部分页64 + 边距10
//     extraHeight = 74
//   }
//   let tHeader = null
//   if (ref && ref.current) {
//     tHeader = ref.current.getElementsByClassName("ant-table-thead")[0]
//   } else {
//     tHeader = document.getElementsByClassName("ant-table-thead")[0]
//   }
//   //表格内容距离顶部的距离
//   let tHeaderBottom = 0
//   if (tHeader) {
//     tHeaderBottom = tHeader.getBoundingClientRect().bottom
//   }
//   // 窗体高度-表格内容顶部的高度-表格内容底部的高度
//   // let height = document.body.clientHeight - tHeaderBottom - extraHeight
//   let height = `calc(100vh - ${tHeaderBottom + extraHeight}px)`
//   // 空数据的时候表格高度保持不变,暂无数据提示文本图片居中
//   if (ref && ref.current) {
//     let placeholder = ref.current.getElementsByClassName('ant-table-placeholder')[0]
//     if (placeholder) {
//       placeholder.style.height = height
//       placeholder.style.display = "flex"
//       placeholder.style.alignItems = "center"
//       placeholder.style.justifyContent = "center"
//     }
//   }
//   return height
// }
onMounted(() => {
  // const scry = getTableScroll({ref: countRef})
  scry.value = countRef.value.clientHeight
  console.log('scry', countRef.value.clientHeight)
  // scry.value = scry
})
// const getDataList = query => {
//   return defHttp.get({ url: "/weather/droplist", query });
// };
// const getOptions = async () => {
//   const res = await getDataList()
//   // request({
//   //   url: `/weather/droplist`,
//   //   method: 'get'
//   // }).then((res) => {
//     const vb = []
//     const aa = res.filter(item => item.deviceId === 'pcs' || item.deviceId === 'bms')
//     aa.forEach(element => {
//       if (element.deviceId === 'pcs') {
//         element.device.forEach(devi => {
//           devi.label = devi.name.replace('PCS', '')
//           devi.value = devi.orderId
//         })
//       }
//       element.data.forEach(val => {
//         if (val.data.includes('signal')) {
//           val.label = val.name
//           val.value = val.data
//           vb.push(val)
//         }
//       })
//     });
//     // console.log('res', aa, vb);
//     state.optionsList = vb
//     state.deviceIdList = aa[0].device
//   // })
// }
// getOptions()
// watch(() => cloneDeep(state.query), async (n, o) => {
//   console.log('监听', n);
//   // getDataList()
// }, { immediate: true })
</script>

<style lang="less" scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>