<template>
  <div class="growCard-wrapper">
    <!-- <div class="md:flex" style="justify-content: space-between">
      <template v-for="(item, index) in growCardList" :key="item.title">
        <Card
          size="small"
          :loading="loading"
          class="md:w-1/3 w-full !md:mt-0 !mt-4"
          :class="[index + 1 < 3 && '!md:mr-4']"
          :canExpan="false"
        >
          <template #title>
            <Tag :color="item.color">{{ item.action }}</Tag>
            {{ item.title }}
          </template>

          <div class="py-4 px-4 flex justify-between">
            <CountTo prefix="$" :startVal="1" :endVal="item.value" class="text-2xl" />
            <Icon :icon="item.icon" :size="40" />
          </div>

          <div class="p-2 px-4 flex justify-between">
            <span>总{{ item.title }}</span>
            <CountTo prefix="$" :startVal="1" :endVal="item.total" />
          </div>
        </Card>
      </template>
    </div> -->
    <!-- <div class="md:flex" style="justify-content: space-between">
      <div
        class="md:w-1/3 w-full !md:mt-0 !mt-4 !md:mr-4"
        :style="{
          flex: 1,
          borderRadius: '4px',
          height: '118px',
          overflow: 'hidden',
        }"
      >
        <Skeleton active :loading="loading">
          <div
            :style="{
              position: 'relative',
              color: '#fff',
              borderRadius: '4px',
              height: '118px',
              backgroundSize: '100% 100%',
              background: 'linear-gradient(270deg, rgba(0, 127, 251, 0.98) 0%, #32C8FF 100%)',
              borderRadius: '5px',
            }"
          >
            <div
              :style="{
                position: 'absolute',
                right: '0',
                bottom: '0',
                width: '230px',
                height: '90px',
                backgroundImage: iconUrl,
                backgroundSize: '100% 100%',
              }"
            ></div>
            <div style="border-bottom: 1px solid #eee">
              <div style="display: flex">
                <Icon icon="visit-count|svg" :size="20" />
                <span style="margin-left: 4px">基本信息</span>
              </div>
            </div>

            <div style="position: absolute">
              <div>电池类型：琳栓铁力</div>
              <div>
                接入电压：
                <CountTo style="font-size: 30px" :startVal="1" :endVal="12" />千伏
              </div>
              <div>接入站点：{{ state.baseInfo.addr }}</div>
            </div>
          </div>
        </Skeleton>
      </div>
      <div
        class="md:w-1/3 w-full !md:mt-0 !mt-4 !md:mr-4"
        :style="{
          flex: 1,
          height: '118px',
          borderRadius: '4px',
          overflow: 'hidden',
        }"
      >
        <Skeleton active :loading="loading">
          <div
            :style="{
              position: 'relative',
              color: '#fff',
              borderRadius: '4px',
              height: '118px',
              backgroundSize: '100% 100%',
              background: 'linear-gradient(270deg, #6141E0 0%, #9084FF 100%)',
              borderRadius: '5px',
            }"
          >
            <div
              :style="{
                position: 'absolute',
                right: '0',
                bottom: '0',
                width: '230px',
                height: '90px',
                border: '1px solid red',
                backgroundImage: iconUrl,
                backgroundSize: '100% 100%',
              }"
            ></div>
            <div style="border-bottom: 1px solid #eee">
              <div style="display: flex">
                <Icon icon="visit-count|svg" :size="20" />
                <span style="margin-left: 4px">运行状态</span>
              </div>
            </div>
            <div style="padding: 10px 20px; display: flex; justify-content: space-between">
              <div>
                <div style="margin-bottom: 6px; display: flex; align-items: center">
                  <div style="margin-right: 10px">PCS:</div>
                  <div>
                    <span
                      style="
                        color: green;
                        font-size: 12px;
                        background: #fff;
                        padding: 0px 10px;
                        border-radius: 8px;
                      "
                    >正常</span>
                  </div>
                </div>
                <div style="margin-bottom: 6px; display: flex; align-items: center">
                  <div style="margin-right: 10px">BMS:</div>
                  <div>
                    <span
                      style="
                        color: green;
                        font-size: 12px;
                        background: #fff;
                        padding: 0px 10px;
                        border-radius: 8px;
                      "
                    >正常</span>
                     </div>
                </div>
                <div>
                  信息警告：
                  <CountTo style="font-size: 20px" :startVal="1" :endVal="12" />条
                </div>
              </div>
              <div style="z-index: 1">
                <div>
                  <CountTo style="font-size: 20px" :startVal="1" :endVal="53" />天
                </div>
                <div>运行天数</div>
              </div>
            </div>
          </div>
        </Skeleton>
      </div>
      <div
        class="md:w-1/3 w-full !md:mt-0 !mt-4"
        :style="{
          flex: 1,
          borderRadius: '4px',
          color: '#fff',
          height: '118px',
          overflow: 'hidden',
        }"
      >
        <Skeleton active :loading="loading">
          <div
            :style="{
              position: 'relative',
              borderRadius: '4px',
              backgroundSize: '100% 100%',
              flexDirection: 'column',
              display: 'flex',
              height: '117px',
              borderRadius: '5px',
              background: 'linear-gradient(90deg, #77DAA3 0%, #0EC582 100%)',
            }"
          >
            
            <div
              :style="{
                position: 'absolute',
                right: '0',
                bottom: '0',
                width: '230px',
                height: '90px',
                border: '1px solid red',
                backgroundImage: iconUrl,
                backgroundSize: '100% 100%',
              }"
            ></div>
            <div style="border-bottom: 1px solid #eee">
              <div style="display: flex">
                <Icon icon="visit-count|svg" :size="20" />
                <span style="margin-left: 4px">储能SOC</span>
              </div>
            </div>

            <div style="z-index: 0; display: flex; align-items: center; height: 100%">
              <div
                style="
                  display: flex;
                  align-items: center;
                  height: 48px;
                  width: 140px;
                  border: 1px solid #fff;
                "
              >
                <div
                  style="border: 1px solid #fff; border-radius: 10px; height: 100%; width: 100%"
                >body</div>
                <div style="border: 1px solid #fff; border-radius: 3px; width: 8px; height: 24px"></div>
              </div>
              <div>
                <CountTo style="font-size: 27px" :startVal="1" :endVal="80" />%
              </div>
            </div>
          </div>
        </Skeleton>
      </div>
    </div> -->
    <div class="md:flex" style="justify-content: space-between">
      <!-- 基本信息 -->
      <Card size="small" :loading="loading" class="md:w-1/3 w-full !md:mt-0 !mt-4 !md:mr-4">
        <div
          :style="{
            position: 'relative',
            color: '#fff',
            height: '118px',
            backgroundSize: '100% 100%',
            background: 'linear-gradient(270deg, rgba(0, 127, 251, 0.98) 0%, #32C8FF 100%)',
            borderRadius: '5px',
          }"
        >
          <!-- backgroundImage: imgUrl, -->
          <div
            :style="{
              position: 'absolute',
              right: '0',
              bottom: '0',
              width: '230px',
              height: '90px',
              backgroundImage: iconUrl,
              backgroundSize: '100% 100%',
            }"
          ></div>
          <div style="border-bottom: 1px solid #eee">
            <div style="display: flex">
              <Icon icon="visit-count|svg" :size="20" />
              <span style="margin-left: 4px">基本信息</span>
            </div>
          </div>

          <div style="position: absolute">
            <div>电池类型：{{ state.baseInfo.battery }}</div>
            <div>
              接入电压：
              <span style="font-size: 30px">{{ state.baseInfo.volt }}</span
              >千伏
              <!-- <CountTo style="font-size: 30px" :startVal="1" :endVal="state.baseInfo.volt" />千伏 -->
            </div>
            <div>接入站点：{{ state.baseInfo.incharStation }}</div>
          </div>
        </div>
      </Card>
      <!-- 运行状态 -->
      <Card size="small" :loading="loading" class="md:w-1/3 w-full !md:mt-0 !mt-4 !md:mr-4">
        <div
          :style="{
            position: 'relative',
            color: '#fff',
            borderRadius: '4px',
            height: '118px',
            backgroundSize: '100% 100%',
            background: 'linear-gradient(270deg, #6141E0 0%, #9084FF 100%)',
            borderRadius: '5px',
          }"
        >
          <!-- backgroundImage: imgUrl, -->
          <div
            :style="{
              position: 'absolute',
              right: '0',
              bottom: '0',
              width: '230px',
              height: '90px',
              border: '1px solid red',
              backgroundImage: iconUrl,
              backgroundSize: '100% 100%',
            }"
          ></div>
          <div style="border-bottom: 1px solid #eee">
            <div style="display: flex">
              <Icon icon="visit-count|svg" :size="20" />
              <span style="margin-left: 4px">运行状态</span>
            </div>
          </div>
          <div style="padding: 10px 20px; display: flex; justify-content: space-between">
            <div>
              <div style="margin-bottom: 6px; display: flex; align-items: center">
                <div style="margin-right: 10px">PCS:</div>
                <div>
                  <span
                    style="
                      color: green;
                      font-size: 12px;
                      background: #fff;
                      padding: 0px 10px;
                      border-radius: 8px;
                    "
                  >正常</span
                  >
                  <!-- <span v-if="state.runningState.pcsState === 1" style="color: green;background: #fff;padding: 0px 10px;border-radius: 8px;">正常</span>
                  <span v-else style="color: rgb(194, 31, 3);background: #fff;padding: 0px 10px;border-radius: 8px;">异常</span>-->
                </div>
              </div>
              <!-- {{ 1 ? '正常' : 2 ? '故障' : '警告' }} -->
              <!-- {{ 1 ? '正常' : 2 ? '异常' : '警告' }} -->
              <div style="margin-bottom: 6px; display: flex; align-items: center">
                <div style="margin-right: 10px">BMS:</div>
                <div>
                  <span
                    style="
                      color: green;
                      font-size: 12px;
                      background: #fff;
                      padding: 0px 10px;
                      border-radius: 8px;
                    "
                  >正常</span
                  >
                  <!-- <span v-if="state.runningState.bmsState === 1" style="color: green;background: #fff;padding: 0px 10px;border-radius: 8px;">正常</span>
                  <span v-else style="color: rgb(194, 31, 3);background: #fff;padding: 0px 10px;border-radius: 8px;">异常</span>-->
                </div>
              </div>
              <div>
                信息警告：
                <CountTo style="font-size: 20px" :startVal="1" :endVal="12" />条
              </div>
            </div>
            <div style="z-index: 1">
              <div> <CountTo style="font-size: 20px" :startVal="1" :endVal="53" />天 </div>
              <div>运行天数</div>
            </div>
          </div>
        </div>
      </Card>
      <!-- 储能SOC -->
      <Card size="small" :loading="loading" class="md:w-1/3 w-full !md:mt-0 !mt-4">
        <div
          :style="{
            position: 'relative',
            borderRadius: '4px',
            backgroundSize: '100% 100%',
            flexDirection: 'column',
            display: 'flex',
            height: '117px',
            borderRadius: '5px',
            background: 'linear-gradient(90deg, #77DAA3 0%, #0EC582 100%)',
          }"
        >
          <!-- backgroundImage: imgUrl, -->
          <div
            :style="{
              position: 'absolute',
              right: '0',
              bottom: '0',
              width: '230px',
              height: '90px',
              border: '1px solid red',
              backgroundImage: iconUrl,
              backgroundSize: '100% 100%',
            }"
          ></div>
          <div style="border-bottom: 1px solid #eee">
            <div style="display: flex">
              <Icon icon="visit-count|svg" :size="20" />
              <span style="margin-left: 4px">储能SOC</span>
            </div>
          </div>

          <div style="z-index: 0; display: flex; align-items: center; height: 100%">
            <div
              style="
                display: flex;
                align-items: center;
                height: 48px;
                width: 140px;
                border: 1px solid #fff;
              "
            >
              <div style="border: 1px solid #fff; border-radius: 10px; height: 100%; width: 100%"
              >body</div
              >
              <div
                style="border: 1px solid #fff; border-radius: 3px; width: 8px; height: 24px"
              ></div>
            </div>
            <div> <CountTo style="font-size: 27px" :startVal="1" :endVal="80" />% </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
<script setup>
  import notDataSvg from '/@/assets/svg/no-data.svg';
  import { CountTo } from '/@/components/CountTo/index';
  import { watch, reactive } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { Card } from 'ant-design-vue';
  // import { Tag, Card, Skeleton } from 'ant-design-vue';
  // import { growCardList } from '../data';
  // import headerImg from '/@/assets/images/header.jpg';
  const props = defineProps({
    loading: {
      type: Boolean,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  });
  const state = reactive({
    baseInfo: {},
  });
  // const imgUrl = `url(${headerImg})`;
  const iconUrl = `url(${notDataSvg})`;
  watch(
    () => props.options,
    () => {
      state.baseInfo = props.options;
    },
  );
</script>
<style lang="less" scoped>
  .growCard-wrapper {
    :deep(.ant-card-body) {
      padding: 0px;
    }
  }
</style>
