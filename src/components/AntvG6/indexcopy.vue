<template>
  <div id="mountNode" ref="g6Node" class="g6-wrapper" style="width: 100%; height: 100%"></div>
</template>

<script setup>
  import G6 from '@antv/g6';
  import data from './mockData';
  const g6Node = ref(null);
  onMounted(() => {
    g6(data);
  });
  const grid = new G6.Grid();
  const g6 = (data) => {
    const toolbar = new G6.ToolBar({
      position: { x: 600, y: 60 },
    });
    // 图实例化，至少需要为图设置挂载容器、宽、高
    const graph = new G6.Graph({
      container: 'mountNode', // 指定挂载容器
      width: g6Node.scrollWidth, // 图的宽度
      height: g6Node.scrollHeight || 500, // 图的高度
      plugins: [toolbar, grid],
      renderer: 'svg',
      // fitView: true, //设置是否将图适配到画布中；
      // linkCenter: true,
      fitViewPadding: [0, 0, 0, 0], //画布上四周的留白宽度。
      modes: {
        default: [
          'drag-canvas',
          'drag-node',
          {
            type: 'edge-tooltip',
            FormatText(model) {
              const text = 'source: ' + model.source;
              return text;
            },
          },
        ],
        // Adding node mode
        addNode: ['click-add-node', 'click-select'],
        // Adding edge mode
        addEdge: ['click-add-edge', 'click-select'],
      },
      nodeStateStyles: {
        // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
        hover: {
          fill: 'lightsteelblue',
        },
        // 鼠标点击节点，即 click 状态为 true 时的样式
        click: {
          stroke: '#000',
          lineWidth: 3,
        },
      },
      defaultEdge: {
        type: 'circle-running',
        style: {
          lineWidth: 2,
          stroke: '#bae7ff',
        },
      },
      // 默认节点集
      defaultNode: {
        shape: 'circle',
        size: [100],
        color: '#5B8FF9',
        style: {
          fill: '#9EC9FF',
          lineWidth: 3,
        },
        labelCfg: {
          style: {
            fill: '#fff',
            fontSize: 20,
          },
        },
      },
      // 默认边集
      defaultEdge: {
        style: {
          stroke: '#e2e2e2',
        },
      },
    });
    // 数据加载和图的渲染
    graph.data(data);
    graph.render();
  };
</script>

<style lang="less" scoped>
  .g6-wrapper {
    ::v-deep .g6-grid-container {
      width: 200000px;
      z-index: 0 !important;
      .g6-grid {
        width: 200000px;
      }
    }
  }
  // .g6-grid-container {
  //   z-index: 0 !important;
  // }
</style>
