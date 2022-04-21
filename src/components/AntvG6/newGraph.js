import G6 from '@antv/g6';
const grid = new G6.Grid();
export const newGraph = (container) => {
  const { scrollWidth, scrollHeight } = container;
  console.log('create new graph');
  // addSelectDOM(container)
  const toolbar = new G6.ToolBar({
    position: { x: 600, y: 60 },
  });
  const width = scrollWidth;
  const height = scrollHeight || 510;
  const graph = new G6.Graph({
    container: 'container',
    width,
    height,
    // fitCenter: true,
    plugins: [toolbar],
    // TODO 关掉 renderer: 'svg', render函数渲染很快，但是会出现图层覆盖的bug
    renderer: 'svg',
    // fitView: true, //设置是否将图适配到画布中；
    fitViewPadding: [0, 0, 0, 0], //画布上四周的留白宽度。
    // linkCenter: true,
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
    // defaultNode: {
    //   style: {
    //     fill: '#DEE9FF',
    //     stroke: '#5B8FF9',
    //   },
    // },
    defaultEdge: {
      type: 'circle-running',
      style: {
        lineWidth: 2,
        stroke: '#bae7ff',
      },
    },
  });
  onEvent(graph);

  return graph;
};

const onEvent = (graph) => {
  // 鼠标进入节点
  // graph.on('node:mouseenter', (e) => {
  //   const nodeItem = e.item; // 获取鼠标进入的节点元素对象
  //   graph.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
  //   const model = nodeItem.getModel();
  //   model.oriLabel = model.label;
  //   graph.updateItem(nodeItem, {
  //     label: `after ${model.id}`,
  //     labelCfg: {
  //       style: {
  //         fill: '#003a8c',
  //       },
  //     },
  //   });
  // });
  // // 监听鼠标离开节点
  // graph.on('node:mouseleave', (e) => {
  //   const nodeItem = e.item;
  //   // 设置目标节点的 hover 状态 false
  //   graph.setItemState(nodeItem, 'hover', false);
  //   const model = nodeItem.getModel();
  //   graph.updateItem(nodeItem, {
  //     label: model.oriLabel,
  //     labelCfg: {
  //       style: {
  //         fill: '#555',
  //       },
  //     },
  //   });
  // });
  // // 监听鼠标点击节点
  graph.on('node:click', (e) => {
    const nodeItem = e.item;
    const model = nodeItem.getModel();
    console.log('点击node', model.id);
    // 先将所有当前有 click 状态的节点的 click 状态置为 false
    //   const clickNodes = graph.findAllByState('node', 'click');
    //   clickNodes.forEach((cn) => {
    //     graph.setItemState(cn, 'click', false);
    //   });
    //   const nodeItem = e.item;
    //   console.log('当前点击的类型', nodeItem.getType(), nodeItem.getModel());
    //   // 设置目标节点的 click 状态 为 true
    //   graph.setItemState(nodeItem, 'click', true);
  });
  // graph.on('edge:mouseenter', function (evt) {
  //   const edge = evt.item;
  //   const model = edge.getModel();
  //   model.oriLabel = model.label;
  //   graph.updateItem(edge, {
  //     label: 'aftera',
  //     labelCfg: {
  //       style: {
  //         fill: '#003a8c',
  //       },
  //     },
  //   });
  // });
  // graph.on('edge:mouseleave', function (evt) {
  //   const edge = evt.item;
  //   graph.setItemState(edge, 'hover', false);
  //   graph.updateItem(edge, {
  //     label: 'label',
  //     labelCfg: {
  //       style: {
  //         fill: '#555',
  //       },
  //     },
  //   });
  // });
  // graph.on('edge:click', function (evt) {
  //   const edge = evt.item;
  //   console.log('当前点击的类型', edge.getType());
  //   graph.setItemState(edge, 'hover', false);
  //   graph.updateItem(edge, {
  //     label: 'label',
  //     labelCfg: {
  //       style: {
  //         fill: '#555',
  //       },
  //     },
  //   });
  // });
};

const addSelectDOM = (container) => {
  // // Add a selector to DOM
  // const selector = document.createElement('select');
  // selector.id = 'selector';
  // const selection1 = document.createElement('option');
  // selection1.value = 'default';
  // selection1.innerHTML = 'Default Mode';
  // const selection2 = document.createElement('option');
  // selection2.value = 'addNode';
  // selection2.innerHTML = 'Add Node (By clicking canvas)';
  // const selection3 = document.createElement('option');
  // selection3.value = 'addEdge';
  // selection3.innerHTML = 'Add Edge (By clicking two end nodes)';
  // selector.appendChild(selection1);
  // selector.appendChild(selection2);
  // selector.appendChild(selection3);
  // container.appendChild(selector);
  // // const btn = document.createElement('BUTTON')
  // // const t=document.createTextNode("CLICK ME");
  // // btn.appendChild(t);
  // // btn.onclick = ()=>{
  // //   console.log(3333, selector, btn);
  // // }
  // // container.appendChild(btn)
};
