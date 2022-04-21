<template>
  <div id="container" ref="g6Wrapper" class="g6-wrapper" style="height: 100%; width: 100%"></div>
  <!-- 这个demo可以参考 -->
  <!-- https://blog.csdn.net/qq_37899792/article/details/120448036 -->
</template>

<script setup>
  import G6 from '@antv/g6';
  import { defHttp } from '/@/utils/http/axios';
  // import request from '@/utils/request';
  import { newGraph } from './newGraph.js';
  import testImage from '@/assets/g6/userAvatar.jpeg';
  import three from '@/assets/g6/three.svg';
  import two from '@/assets/g6/two.svg';
  import generator from '@/assets/g6/generator.svg';
  import bolang from '@/assets/g6/bolang.svg';
  import Chart from '@antv/chart-node-g6';
  import { initData } from './initData';
  // const Util = G6.Util;
  let graph;
  const g6Wrapper = ref(null);
  const state = reactive({
    // graph: null,
    testImage,
    three,
    bolang,
    two,
    generator,
    antvData: {},
  });
  let addedCount = 0;
  const registerBehaviors = () => {
    G6.registerBehavior('click-add-node', {
      // Set the events and the corresponding responsing function for this behavior
      getEvents() {
        // The event is canvas:click, the responsing function is onClick
        return {
          'canvas:click': 'onClick',
        };
      },
      // Click event
      onClick(ev) {
        const self = this;
        // const graph = self.state.graph;
        // Add a new node
        graph.addItem('node', {
          x: ev.canvasX,
          y: ev.canvasY,
          id: `node-${addedCount}`, // Generate the unique id
        });
        addedCount++;
      },
    });
  };
  const main = async () => {
    G6.registerNode(
      // 注册节点 Scale Animation
      'circle-animate',
      {
        afterDraw(cfg, group) {
          const shape = group.get('children')[0];
          shape.animate(
            (ratio) => {
              const diff = ratio <= 0.5 ? ratio * 10 : (1 - ratio) * 10;
              return {
                r: cfg.size / 2 + diff,
              };
            },
            {
              repeat: true,
              duration: 3000,
              easing: 'easeCubic',
            },
          );
          const label = group.addShape('text', {
            // attrs: style
            attrs: {
              x: 0, // 居中
              y: 0,
              textAlign: 'center',
              textBaseline: 'middle',
              text: cfg.id,
              fill: '#666',
            },
            // must be assigned in G6 3.3 and later versions. it can be any value you want
            name: 'text-shape',
            // 设置 draggable 以允许响应鼠标的图拽事件
            draggable: true,
          });
        },
      },
      'circle',
    );
    G6.registerNode(
      // 注册节点 Background Animation
      'background-animate',
      {
        afterDraw(cfg, group) {
          const r = cfg.size / 2;
          const back1 = group.addShape('circle', {
            zIndex: -3,
            attrs: {
              x: 0,
              y: 0,
              r,
              fill: cfg.color,
              opacity: 0.6,
            },
            name: 'back1-shape',
          });
          const back2 = group.addShape('circle', {
            zIndex: -2,
            attrs: {
              x: 0,
              y: 0,
              r,
              fill: cfg.color,
              opacity: 0.6,
            },
            name: 'back2-shape',
          });
          const back3 = group.addShape('circle', {
            zIndex: -1,
            attrs: {
              x: 0,
              y: 0,
              r,
              fill: cfg.color,
              opacity: 0.6,
            },
            name: 'back3-shape',
          });
          group.sort(); // Sort according to the zIndex
          const label = group.addShape('text', {
            // attrs: style
            attrs: {
              x: 0, // 居中
              y: 0,
              textAlign: 'center',
              textBaseline: 'middle',
              text: cfg.id,
              fill: '#666',
            },
            // must be assigned in G6 3.3 and later versions. it can be any value you want
            name: 'text-shape',
            // 设置 draggable 以允许响应鼠标的图拽事件
            draggable: true,
          });
          back1.animate(
            {
              // Magnifying and disappearing
              r: r + 10,
              opacity: 0.1,
            },
            {
              duration: 3000,
              easing: 'easeCubic',
              delay: 0,
              repeat: true, // repeat
            },
          ); // no delay
          back2.animate(
            {
              // Magnifying and disappearing
              r: r + 10,
              opacity: 0.1,
            },
            {
              duration: 3000,
              easing: 'easeCubic',
              delay: 1000,
              repeat: true, // repeat
            },
          ); // 1s delay
          back3.animate(
            {
              // Magnifying and disappearing
              r: r + 10,
              opacity: 0.1,
            },
            {
              duration: 3000,
              easing: 'easeCubic',
              delay: 2000,
              repeat: true, // repeat
            },
          ); // 3s delay
        },
      },
      'circle',
    );
    G6.registerEdge(
      // 注册边
      'circle-running',
      {
        afterDraw(cfg, group) {
          // get the first shape in the group, it is the edge's path here=
          const shape = group.get('children')[0];
          // the start position of the edge's path
          const startPoint = shape.getPoint(0);

          // add red circle shape
          const circle = group.addShape('circle', {
            attrs: {
              x: startPoint.x,
              y: startPoint.y,
              fill: '#1890ff',
              r: 3,
            },
            name: 'circle-shape',
          });
          /**
           * 边节点的text有问题
           */
          // const label = group.addShape('text', {
          //   // attrs: style
          //   attrs: {
          //     x: 0, // 居中
          //     y: 0,
          //     textAlign: 'center',
          //     textBaseline: 'middle',
          //     text: cfg.id,
          //     fill: '#666',
          //   },
          //   // must be assigned in G6 3.3 and later versions. it can be any value you want
          //   name: 'text-shape',
          //   // 设置 draggable 以允许响应鼠标的图拽事件
          //   draggable: true,
          // });

          // animation for the red circle
          circle.animate(
            (ratio) => {
              // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
              // get the position on the edge according to the ratio
              const tmpPoint = shape.getPoint(ratio);
              // returns the modified configurations here, x and y here
              return {
                x: tmpPoint.x,
                y: tmpPoint.y,
              };
            },
            {
              repeat: true, // Whether executes the animation repeatly
              duration: 3000, // the duration for executing once
            },
          );
        },
      },
      'cubic', // extend the built-in edge 'cubic'
    );
    G6.registerNode('justline', {
      // 黄线-使用svg的path自定义直线
      draw(cfg, group) {
        // console.log('justline', group);
        // 如果 cfg 中定义了 style 需要同这里的属性进行融合
        const keyShape = group.addShape('path', {
          attrs: {
            path: this.getPath(cfg), // 根据配置获取路径
            stroke: cfg.stroke, // 颜色应用到描边上，如果应用到填充，则使用 fill: cfg.color
            // stroke: cfg.color, // 颜色应用到描边上，如果应用到填充，则使用 fill: cfg.color
            lineWidth: 6, // 设置直线的宽度
          },
          // must be assigned in G6 3.3 and later versions. it can be any value you want
          name: 'path-shape',
          // 设置 draggable 以允许响应鼠标的图拽事件
          draggable: true,
        });
        const label = group.addShape('text', {
          // attrs: style
          attrs: {
            x: 26, // 居中
            y: -10,
            textAlign: 'center',
            textBaseline: 'middle',
            text: cfg.label,
            fill: '#666',
            fontSize: 10,
          },
          // must be assigned in G6 3.3 and later versions. it can be any value you want
          name: 'text-shape',
          // 设置 draggable 以允许响应鼠标的图拽事件
          draggable: true,
        });
        return keyShape;
      },
      // 返回菱形的路径
      getPath(cfg) {
        const size = cfg.size || [40, 40]; // 如果没有 size 时的默认大小
        const width = size[0];
        const height = size[1];
        // console.log('justline---:', size, width, height)
        const path = [
          ['M', 0, 0 - height / 2], // 上部顶点
          ['L', width / 2, 0], // 右侧顶点
        ];
        return path;
      },
      // 锚点在服务端获取
      // getAnchorPoints() {
      //   return [
      //     [0.215, 1],
      //     [0.5, 1],
      //     [0.75, 1],
      //     [0.96, 1],
      //   ];
      // },
      // update() {/* 只要增加这个 update()后，这种没有数据变化的节点不会在每次更新数据后重载*/ }
    });
    G6.registerNode('justpath', {
      // 使用svg的path自定义可带箭头直线
      draw(cfg, group) {
        // 如果 cfg 中定义了 style 需要同这里的属性进行融合
        const keyShape = group.addShape('path', {
          attrs: {
            // startArrow: {
            //   // 自定义箭头指向(0, 0)，尾部朝向 x 轴正方向的 path
            //   path: 'M 0,0 L 20,10 L 20,-10 Z',
            //   // 箭头的偏移量，负值代表向 x 轴正方向移动
            //   // d: -10,
            // },
            // endArrow: {
            //   // 自定义箭头指向(0, 0)，尾部朝向 x 轴正方向的 path
            //   path: 'M 0,0 L 20,10 L 20,-10 Z',
            //   // 箭头的偏移量，负值代表向 x 轴正方向移动
            //   // d: -10,
            // },
            path: [
              ['M', 100, 100],
              ['L', 200, 100],
            ],
            stroke: cfg.color,
            lineWidth: 18,
            lineAppendWidth: 5,
          },
          // must be assigned in G6 3.3 and later versions. it can be any value you want
          name: 'path-shape',
        });
        const label = group.addShape('text', {
          // attrs: style
          attrs: {
            x: 0, // 居中
            y: 0,
            textAlign: 'center',
            textBaseline: 'middle',
            text: cfg.id,
            fill: '#666',
          },
          // must be assigned in G6 3.3 and later versions. it can be any value you want
          name: 'text-shape',
          // 设置 draggable 以允许响应鼠标的图拽事件
          draggable: true,
        });
        // if (cfg.label) {
        //   // 如果有文本
        //   // 如果需要复杂的文本配置项，可以通过 labeCfg 传入
        //   // const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
        //   // style.text = cfg.label;
        //   const label = group.addShape('text', {
        //     // attrs: style
        //     attrs: {
        //       x: 0, // 居中
        //       y: 0,
        //       textAlign: 'center',
        //       textBaseline: 'middle',
        //       text: cfg.label,
        //       fill: '#666',
        //     },
        //     // must be assigned in G6 3.3 and later versions. it can be any value you want
        //     name: 'text-shape',
        //     // 设置 draggable 以允许响应鼠标的图拽事件
        //     draggable: true,
        //   });
        // }
        return keyShape;
      },
      // 返回的路径
      getPath(cfg) {
        const size = cfg.size || [40, 40]; // 如果没有 size 时的默认大小
        const width = size[0];
        const height = size[1];
        const path = [
          ['M', 0, 0 - height / 2], // 上部顶点
          ['L', width / 2, 0], // 右侧顶点
          // ['L', 0, height / 2], // 下部顶点
          // ['L', -width / 2, 0], // 左侧顶点
          // ['Z'], // 封闭
        ];
        return path;
      },
      update(cfg, item) {
        // 只要增加这个 update()后，这种没有数据变化的节点不会在每次更新数据后重载
      },
    });
    G6.registerNode('resistance', {
      //电阻节点 使用svg的path自定义电阻节点
      draw(cfg, group) {
        console.log('resistance更新数据后重载', cfg);
        // 如果 cfg 中定义了 style 需要同这里的属性进行融合
        const keyShape = group.addShape('rect', {
          attrs: {
            width: 10,
            height: 20,
            fill: 'red',
          },
          // must be assigned in G6 3.3 and later versions. it can be any value you want
          name: 'path-shape',
        });
        const label = group.addShape('text', {
          attrs: { ...cfg.style, text: cfg.style.text || cfg.id },
          // attrs: {
          //   x: 15,
          //   y: 10,
          //   fontWeight: 700,
          //   text: 'node237',
          //   fill: 'gray',
          // },
          // must be assigned in G6 3.3 and later versions. it can be any value you want
          name: 'text-shape',
          // 设置 draggable 以允许响应鼠标的图拽事件
          draggable: true,
        });
        return keyShape;
      },
      getAnchorPoints() {
        return [
          [0.5, 0],
          [0.5, 1],
        ];
      },
      // update(cfg, item) {
      //   // 只要增加这个 update()后，这种没有数据变化的节点不会在每次更新数据后重载
      // },
    });
    G6.registerNode('custompath', {
      // 使用svg的path自定义电力符号
      draw(cfg, group) {
        // 如果 cfg 中定义了 style 需要同这里的属性进行融合
        const keyShape = group.addShape('path', {
          attrs: {
            path: this.getPath(cfg).path, // 根据配置获取路径
            stroke: cfg.color || 'red', // 颜色应用到描边上，如果应用到填充，则使用 fill: cfg.color
            lineWidth: 2,
            fill: cfg.fill || 'transparent',
            lineAppendWidth: 5,
          },
          name: 'path-shape',
        });
        const { width, height, path } = this.getPath(cfg);
        // 倾斜的对角线
        group.addShape('path', {
          attrs: {
            path: `M ${width} 0 L 0 ${height}`, // 根据配置获取路径
            stroke: cfg.color || 'red', // 颜色应用到描边上，如果应用到填充，则使用 fill: cfg.color
            lineWidth: 2,
            fill: cfg.fill || 'transparent',
            lineAppendWidth: 5,
          },
          name: 'slash-shape',
        });
        group.addShape('path', {
          attrs: {
            path: `M ${width / 2} ${(height / 4) * 3} H ${(width / 4) * 3}`, // 根据配置获取路径
            stroke: cfg.color || 'red', // 颜色应用到描边上，如果应用到填充，则使用 fill: cfg.color
            lineWidth: 2,
            fill: cfg.fill || 'transparent',
            lineAppendWidth: 5,
          },
          name: 'slash-shape',
        });
        group.addShape('path', {
          attrs: {
            path: 'M 4 10 C 8 3, 8 3, 8 10 S 10 10, 16 10',
            // path: 'M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80',
            // path: `M ${width/2} ${height/4*3} H ${width/4*3}`, // 根据配置获取路径
            stroke: cfg.color || 'red', // 颜色应用到描边上，如果应用到填充，则使用 fill: cfg.color
            lineWidth: 2,
            fill: cfg.fill || 'transparent',
            lineAppendWidth: 5,
          },
          name: 'slash-shape',
        });

        // if (cfg.label) {
        // 如果有文本
        // 如果需要复杂的文本配置项，可以通过 labeCfg 传入
        // const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
        // style.text = cfg.label;
        // const label = group.addShape('text', {
        //   // attrs: style
        //   attrs: {
        //     x: 0, // 居中
        //     y: 0,
        //     textAlign: 'center',
        //     textBaseline: 'middle',
        //     text: cfg.id,
        //     fill: '#666',
        //   },
        //   // must be assigned in G6 3.3 and later versions. it can be any value you want
        //   name: 'text-shape',
        //   // 设置 draggable 以允许响应鼠标的图拽事件
        //   draggable: true,
        // });
        // }

        return keyShape;
      },
      // 返回菱形的路径
      getPath(cfg) {
        const size = cfg.size || [40, 40]; // 如果没有 size 时的默认大小
        const width = size[0];
        const height = size[1];
        const path = `M0 0 H ${width} V ${height} H 0 Z`;
        return { width, height, path };
      },
      // 锚点在服务端获取
      getAnchorPoints() {
        return [
          [0.5, 0],
          [0.5, 1],
        ];
      },
    });
    G6.registerNode(
      // 有bug
      'dom-node',
      {
        draw: (cfg, group) => {
          console.log('dom-node-group', group);
          const stroke = cfg.style ? cfg.style.stroke || '#5B8FF9' : '#5B8FF9';
          const shape = group.addShape('dom', {
            attrs: {
              width: cfg.size[0],
              height: cfg.size[1],
              html: `
        <div id=${
          cfg.id
        } class='dom-node' style="background-color: #fff; border: 2px solid ${stroke}; border-radius: 5px; width: ${
                cfg.size[0] - 5
              }px; height: ${cfg.size[1] - 5}px; display: flex;">
          <div style="height: 100%; width: 33%; background-color: #CDDDFD">
            <img alt="" style="line-height: 100%; margin-left: 7px;" src="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Q_FQT6nwEC8AAAAAAAAAAABkARQnAQ" width="20" height="20" />  
          </div>
          <span style="margin:auto; padding:auto; color: #5B8FF9">${cfg.label}</span>
        </div>
          `,
            },
            draggable: true,
          });
          return shape;
        },
      },
    );
    G6.registerNode('rect-xml', {
      jsx: (cfg) => `
    <group>
      <rect style={{
        width: 220,
        height:1,
      }}>
        <rect style={{
          width: 150,
          height: 55,
          stroke: ${cfg.color},
          fill: #ffffff,
          radius: [0, 0, 6, 6],
        }}>
          <text style={{ marginTop: 5, marginLeft: 3, fill: '#333', marginLeft: 4 }}>描述: {{description}}</text>
          <text style={{ marginTop: 10, marginLeft: 3, fill: '#333', marginLeft: 4 }}>创建者: {{meta.creatorName}}</text>
        </rect>
      </rect>
      <circle style={{
        stroke: ${cfg.color},
        r: 10,
        fill: '#fff',
        marginLeft: 75,
        cursor: 'pointer'
      }} name="circle">
        <image name="img" style={{ img: ${testImage}, width: 12, height: 12,  marginLeft: 69,  marginTop: -5 }} />
      </circle>
    </group>
  `,
      afterDraw: (cfg, group) => {
        console.log(group);
        const img = group.findAllByName('img');
        if (img[0]) {
          img[0].animate(
            (ratio) => {
              return {
                opacity: Math.abs(0.5 - ratio),
              };
            },
            {
              duration: 3000,
              repeat: true,
            },
          );
        }
      },
    });
    G6.registerNode(
      //g2柱状图
      'node-with-interval',
      {
        draw(cfg, group) {
          const keyShape = group.addShape('rect', {
            attrs: {
              x: 0,
              y: 0,
              width: 100,
              height: 200,
              fill: cfg.style.fill,
            },
            draggable: true,
          });

          group.addShape('rect', {
            attrs: {
              x: 0,
              y: 0,
              width: 100,
              height: 40,
              fill: '#69c0ff',
            },
            draggable: true,
          });

          group.addShape('text', {
            attrs: {
              text: '完成率',
              x: 20,
              y: 25,
              fontSize: 24,
              fill: '#fff',
            },
            draggable: true,
          });

          group.addShape('text', {
            attrs: {
              text: '均值',
              x: 20,
              y: 70,
              fontSize: 23,
              fill: '#8c8c8c',
            },
            draggable: true,
          });
          console.log('g2柱状图：', cfg);
          group.addShape('text', {
            attrs: {
              text: '8.8%',
              x: 20,
              y: 110,
              fontSize: 30,
              fill: '#000',
            },
            draggable: true,
          });
          // 实际开发中把 (Chart || window.Chart) 换成 Chart
          // Replace (Chart || window.Chart) by Chart in your project
          const view = new Chart({
            group,
            padding: 1,
            width: 100,
            height: 70,
            x: 20,
            y: 100,
          });

          view.data(cfg.trendData);

          view.interval().position('genre*sold').color('genre');

          view.legend('genre', false);

          view.scale({
            genre: {
              alias: '游戏种类1111111', // 列定义，定义该属性显示的别名
            },
            sold: {
              alias: '销售量2222222',
            },
          });

          view.axis('sold', false);

          // 极坐标下的柱状图
          // view.coordinate('polar');

          view.render();
          console.log('intervalView-----');
          keyShape.set('intervalView', view);

          return keyShape;
        },
        update(cfg, item) {
          const keyShape = item.getKeyShape();
          const view = keyShape.get('intervalView');
          view.changeData(cfg.trendData);
        },
      },
      'single-node',
    );
    G6.registerNode('diamond', {
      draw(cfg, group) {
        // console.log('diamond');
        // 如果 cfg 中定义了 style 需要同这里的属性进行融合
        const keyShape = group.addShape('path', {
          attrs: {
            path: this.getPath(cfg), // 根据配置获取路径
            stroke: cfg.color, // 颜色应用到描边上，如果应用到填充，则使用 fill: cfg.color
          },
          // must be assigned in G6 3.3 and later versions. it can be any value you want
          name: 'path-shape',
          // 设置 draggable 以允许响应鼠标的图拽事件
          draggable: true,
        });
        if (cfg.label) {
          // console.log('cf1g', cfg);
          // 如果有文本
          // 如果需要复杂的文本配置项，可以通过 labeCfg 传入
          // const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
          // style.text = cfg.label;
          const label = group.addShape('text', {
            // attrs: style
            attrs: {
              x: 0, // 居中
              y: 0,
              textAlign: 'center',
              textBaseline: 'middle',
              text: cfg.label,
              fill: '#666',
            },
            // must be assigned in G6 3.3 and later versions. it can be any value you want
            name: 'text-shape',
            // 设置 draggable 以允许响应鼠标的图拽事件
            draggable: true,
          });
        }
        return keyShape;
      },
      // 返回菱形的路径
      getPath(cfg) {
        const size = cfg.size || [40, 40]; // 如果没有 size 时的默认大小
        const width = size[0];
        const height = size[1];
        //  / 1 \
        // 4     2
        //  \ 3 /
        const path = [
          ['M', 0, 0 - height / 2], // 上部顶点
          ['L', width / 2, 0], // 右侧顶点
          ['L', 0, height / 2], // 下部顶点
          ['L', -width / 2, 0], // 左侧顶点
          ['Z'], // 封闭
        ];
        return path;
      },
    });
    G6.registerNode(
      // 电池组件
      'battery',
      {
        draw(cfg, group) {
          // 主外框
          const width = cfg.size[0];
          const height = cfg.size[1];
          // console.log('battery', width, height)
          const keyShape = group.addShape('rect', {
            attrs: {
              x: 0,
              y: 0,
              width,
              height,
              fill: 'green',
              // fill: cfg.style.fill,
              radius: [4, 4, 4, 4],
            },
            name: 'radio-react',
            // 设置 draggable 以允许响应鼠标的图拽事件
            draggable: true,
          });
          // 电池的头部
          const batteryWidth = width / 3;
          group.addShape('rect', {
            attrs: {
              x: width / 2 - batteryWidth / 2,
              y: -4,
              width: batteryWidth,
              height: 4,
              fill: '#b5afaf',
              radius: [2, 2, 0, 0],
            },
            name: 'left-border-shape',
            // 设置 draggable 以允许响应鼠标的图拽事件
            draggable: true,
          });
          return keyShape;
        },
        afterDraw(cfg, group) {
          // 获取该节点上的第一个图形
          const width = cfg.size[0];
          const height = cfg.size[1];
          // 上半部分负责填充
          const shape = group.addShape('rect', {
            attrs: {
              x: 0,
              y: 0,
              width,
              height: (height * (100 - cfg.proportion)) / 100, // 电量比例
              fill: '#837e7e',
              radius: [4, 4, 0, 0],
            },
            name: 'radio-change-react',
            // 设置 draggable 以允许响应鼠标的图拽事件
            draggable: true,
          });
          // 如果 cfg 中定义了 height 需要同这里的属性进行融合
          if (cfg.proportion || cfg.proportion === 0) {
            // 如果有文本
            // 如果需要复杂的文本配置项，可以通过 labeCfg 传入
            // const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
            // style.text = cfg.label;
            const label = group.addShape('text', {
              attrs: {
                x: width / 2, // 居中
                y: height / 2,
                textAlign: 'center',
                textBaseline: 'middle',
                // text: `${100 - cfg.proportion}%\n${cfg.id}`,
                text: `${cfg.proportion}%\n${cfg.id}`,
                fill: '#000',
                fontSize: 10,
              },
              // must be assigned in G6 3.3 and later versions. it can be any value you want
              name: 'text-shape',
              // 设置 draggable 以允许响应鼠标的图拽事件
              draggable: true,
            });
          }
          // console.log('cfg.proportion', cfg.proportion)
          // 该图形的动画
          // shape.animate(
          //   {
          //     proportion: 30
          //     // height: cfg.proportion
          //   },
          //   {
          //     // 动画重复
          //     repeat: false,
          //     duration: 3000,
          //     easing: 'easeLinear',
          //     delay: 0, // 无延迟
          //   },
          // ); // 一次动画持续的时长为 3000，动画效果为 'easeCubic'
        },
        getAnchorPoints() {
          return [[0.5, 0]];
        },
      },
    );

    //自定义 储能系统信息 节点 (sysinfo节点)
    const getNodeConfig = (node) => {
      let config = {
        basicColor: '#5B8FF9',
        fontColor: '#5B8FF9',
        borderColor: '#5B8FF9',
        bgColor: '#C6E5FF',
      };
      return config;
    };
    const nodeBasicMethod = {
      createNodeBox: (group, config, w, h, cfg) => {
        /* 最外面的大矩形 */
        const container = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: w,
            heigh: h,
          },
          name: 'big-rect-shape',
          draggable: true,
        });
        /* 矩形 */
        group.addShape('rect', {
          attrs: {
            x: 3,
            y: 0,
            width: w - 19,
            height: h,
            fill: config.bgColor,
            fillOpacity: 0.1,
            stroke: 'green',
            // stroke: config.borderColor,
            // radius: 12,
            radius: [4, 4, 4, 4],
            lineDash: [10],
            lineWidth: 1,
            cursor: 'pointer',
          },
          name: 'rect-shape',
          draggable: true,
        });
        // 头部标题
        group.addShape('rect', {
          attrs: {
            x: w / 4,
            y: -8,
            width: (w / 4) * 2 - 18,
            height: 16,
            fill: '#b5afaf',
            fillOpacity: 1,
            radius: 12,
            lineDash: [10],
            lineWidth: 3,
            radius: [8, 8, 8, 8],
          },
          name: 'left-border-shape',
          // 设置 draggable 以允许响应鼠标的图拽事件
          draggable: true,
        });
        const label = group.addShape('text', {
          attrs: {
            x: w / 2 - 8, // 居中
            y: 0,
            fontSize: 10,
            textAlign: 'center',
            textBaseline: 'middle',
            text: '储能系统信息',
            fill: '#eee',
          },
          name: 'text-shape',
          // 设置 draggable 以允许响应鼠标的图拽事件
          draggable: true,
        });
        // 电池容器
        const batteryWidth = 30;
        const batteryHeight = 50;
        const batteryPositionX = w - 70;
        const batteryPositionY = 20;
        const headerHeight = 6; // 电池头部
        group.addShape('rect', {
          attrs: {
            x: batteryPositionX,
            y: batteryPositionY,
            width: batteryWidth,
            height: batteryHeight,
            fill: 'green',
            // fill: cfg.style.fill,
            radius: [4, 4, 4, 4],
          },
          name: 'radio-react',
          // 设置 draggable 以允许响应鼠标的图拽事件
          draggable: true,
        });
        // 电池的头部
        group.addShape('rect', {
          attrs: {
            x: batteryPositionX + ((batteryWidth / 4) * 2) / 2,
            y: batteryPositionY - headerHeight,
            width: (batteryWidth / 4) * 2,
            height: headerHeight,
            fill: '#b5afaf',
            radius: [2, 2, 0, 0],
          },
          name: 'left-border-shape',
          // 设置 draggable 以允许响应鼠标的图拽事件
          draggable: true,
        });
        // console.log('上半部分负责填充', config)
        // 上半部分负责填充
        group.addShape('rect', {
          attrs: {
            x: batteryPositionX,
            y: batteryPositionY,
            width: batteryWidth,
            height: (batteryHeight * (100 - cfg.content.chartpercent)) / 100, // 电量比例
            fill: '#837e7e',
            radius: [4, 4, 0, 0],
          },
          name: 'radio-change-react',
          // 设置 draggable 以允许响应鼠标的图拽事件
          draggable: true,
        });
        // 如果 cfg 中定义了 height 需要同这里的属性进行融合
        if (cfg.content.chartpercent || cfg.content.chartpercent === 0) {
          // 如果有文本
          // 如果需要复杂的文本配置项，可以通过 labeCfg 传入
          // const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
          // style.text = cfg.label;
          const label = group.addShape('text', {
            attrs: {
              x: batteryPositionX + batteryWidth / 2, // 居中
              y: batteryPositionY + batteryHeight / 2,
              textAlign: 'center',
              textBaseline: 'middle',
              text: `${cfg.content.chartpercent}%`,
              fill: '#000',
            },
            // must be assigned in G6 3.3 and later versions. it can be any value you want
            name: 'text-shape',
            // 设置 draggable 以允许响应鼠标的图拽事件
            draggable: true,
          });
        }
        return container;
      },
      afterDraw: (cfg, group) => {},
      setState: (name, value, item) => {},
    };
    G6.registerNode('sysinfo', {
      draw: (cfg, group) => {
        const config = getNodeConfig(cfg);
        const width = 240;
        const height = 104;
        const fontSize = 8;
        const itemTitleX = 16;
        const itemTitleY = 32;
        const itemTitleYstep = 16;
        const titleX = 60;
        const titleY = 18;
        const titleYstep = 15;
        const numX = 100;
        const MWX = 130;

        /* the biggest rect */
        const container = nodeBasicMethod.createNodeBox(group, config, width, height, cfg);
        // group.addShape('text', { /* name */
        //   attrs: {
        //     text: cfg.name,
        //     x: 0,
        //     y: 0,
        //     fontSize,
        //     fontWeight: 700,
        //     textAlign: 'left',
        //     textBaseline: 'middle',
        //     fill: config.fontColor,
        //     cursor: 'pointer',
        //   },
        //   name: 'name-text-shape',
        // });
        group.addShape(
          //放电状态
          'text',
          {
            /* the description text */
            attrs: {
              text: '放电状态',
              x: itemTitleX,
              y: itemTitleY,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'fangdian',
          },
        );
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: '放电闭锁',
            x: itemTitleX,
            y: itemTitleY + itemTitleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: config.fontColor,
          },
          name: 'chuneng',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: '充电状态',
            x: itemTitleX,
            y: itemTitleY + 2 * itemTitleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: config.fontColor,
          },
          name: 'congdian',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: '充电闭锁',
            x: itemTitleX,
            y: itemTitleY + 3 * itemTitleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: config.fontColor,
          },
          name: 'congdian2',
        });

        group.addShape('text', {
          /* the description text */
          attrs: {
            text: '功率指令',
            x: titleX,
            y: titleY,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: config.fontColor,
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: '储能功率',
            x: titleX,
            y: titleY + titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: config.fontColor,
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: '可充功率',
            x: titleX,
            y: titleY + 2 * titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: config.fontColor,
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: '可放功率',
            x: titleX,
            y: titleY + 3 * titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: config.fontColor,
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: '可充电量',
            x: titleX,
            y: titleY + 4 * titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: config.fontColor,
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: '可放电量',
            x: titleX,
            y: titleY + 5 * titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: config.fontColor,
          },
          name: 'congdian2',
        });

        group.addShape('text', {
          /* the description text */
          attrs: {
            text: cfg.content.num1,
            x: numX,
            y: titleY,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'green',
            // fill: config.fontColor,
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: cfg.content.num2,
            x: numX,
            y: titleY + 1 * titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'green',
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: cfg.content.num3,
            x: numX,
            y: titleY + 2 * titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'green',
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: cfg.content.num4,
            x: numX,
            y: titleY + 3 * titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'green',
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: cfg.content.num5,
            x: numX,
            y: titleY + 4 * titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'green',
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: cfg.content.num6,
            x: numX,
            y: titleY + 5 * titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'green',
          },
          name: 'congdian2',
        });

        group.addShape('text', {
          /* the description text */
          attrs: {
            text: 'MW',
            x: MWX,
            y: titleY,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'green',
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: 'MW',
            x: MWX,
            y: titleY + 1 * titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'green',
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: 'MW',
            x: MWX,
            y: titleY + 2 * titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'green',
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: 'MW',
            x: MWX,
            y: titleY + 3 * titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'green',
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: 'MWh',
            x: MWX,
            y: titleY + 4 * titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'green',
          },
          name: 'congdian2',
        });
        group.addShape('text', {
          /* the description text */
          attrs: {
            text: 'MWh',
            x: MWX,
            y: titleY + 5 * titleYstep,
            fontSize,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'green',
          },
          name: 'congdian2',
        });

        return container;
      },
      getAnchorPoints() {
        return [
          [0.85, 0],
          [0, 0.5], // 左侧中间
          [1, 0.5], // 右侧中间
        ];
      },
      afterDraw: nodeBasicMethod.afterDraw,
      setState: nodeBasicMethod.setState,
    });

    // 自定义 statusinfo节点
    const getNodeStatusConfig = (node) => {
      let config = {
        basicColor: '#5B8FF9',
        fontColor: '#5B8FF9',
        borderColor: '#5B8FF9',
        bgColor: '#C6E5FF',
      };
      return config;
    };
    const nodeBasicStatusMethod = {
      createNodeBox: (group, config, w, h, cfg) => {
        /* 最外面的大矩形 */
        const container = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: w,
            heigh: h,
          },
          name: 'big-rect-shape',
          draggable: true,
        });
        /* 矩形 */
        group.addShape('rect', {
          attrs: {
            x: 3,
            y: 0,
            width: w - 19,
            height: h,
            fill: config.bgColor,
            fillOpacity: 0.1,
            stroke: 'green',
            // stroke: config.borderColor,
            radius: 12,
            lineDash: [10],
            lineWidth: 1,
            cursor: 'pointer',
          },
          name: 'rect-shape',
          draggable: true,
        });
        return container;
      },
      afterDraw: (cfg, group) => {},
      setState: (name, value, item) => {},
    };
    G6.registerNode(
      // 调试状态 节点
      'statusinfo',
      {
        draw: (cfg, group) => {
          const config = getNodeStatusConfig(cfg);
          const width = 120;
          const height = 86;
          const fontSize = 8;
          const title = cfg.content.titlenum;
          const titleX = 10;
          const titleY = 22;
          const titleYstep = 15;
          const numX = 60;
          const descripX = 25;
          const descripY = 80;
          const MWX = 80;
          /* the biggest rect */
          const container = nodeBasicStatusMethod.createNodeBox(group, config, width, height, cfg);
          group.addShape('text', {
            /* name */
            attrs: {
              text: cfg.name,
              x: titleX,
              y: 10,
              fontSize,
              fontWeight: 700,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.fontColor,
              // cursor: 'pointer',
            },
            name: 'name-text-shape',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `#${title} AGC指令`,
              x: titleX,
              y: titleY,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `#${title} 联合功率`,
              x: titleX,
              y: titleY + titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `#${title} 机组功率`,
              x: titleX,
              y: titleY + 2 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `#${title} 储能功率`,
              x: titleX,
              y: titleY + 3 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });

          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num1,
              x: numX,
              y: titleY,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
              // fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num2,
              x: numX,
              y: titleY + titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num3,
              x: numX,
              y: titleY + 2 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num4,
              x: numX,
              y: titleY + 3 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });

          group.addShape('text', {
            /* the description text */
            attrs: {
              text: 'MW',
              x: MWX,
              y: titleY,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: 'MW',
              x: MWX,
              y: titleY + titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: 'MW',
              x: MWX,
              y: titleY + 2 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: 'MW',
              x: MWX,
              y: titleY + 3 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `#${title}机组一次调试状态`,
              x: descripX,
              y: descripY,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          return container;
        },
        afterDraw: nodeBasicStatusMethod.afterDraw,
        setState: nodeBasicStatusMethod.setState,
      },
    );

    // 自定义 线电压三个文本 节点
    const getNodeLineVoltConfig = (node) => {
      let config = {
        basicColor: '#5B8FF9',
        fontColor: '#5B8FF9',
        borderColor: '#5B8FF9',
        bgColor: '#C6E5FF',
      };
      return config;
    };
    const nodeBasicLineVoltMethod = {
      createNodeBox: (group, config, w, h, cfg) => {
        /* 最外面的大矩形 */
        const container = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: w,
            heigh: h,
          },
          name: 'big-rect-shape',
          draggable: true,
        });
        /* 矩形 */
        group.addShape('rect', {
          attrs: {
            x: 3,
            y: 0,
            width: w - 19,
            height: h,
            fill: config.bgColor,
            fillOpacity: 0.1,
            stroke: 'green',
            // stroke: config.borderColor,
            radius: 12,
            lineDash: [10],
            lineWidth: 1,
            cursor: 'pointer',
          },
          name: 'rect-shape',
          draggable: true,
        });
        return container;
      },
      afterDraw: (cfg, group) => {},
      setState: (name, value, item) => {},
    };
    G6.registerNode(
      // 调试状态 节点
      'linevoltinfo',
      {
        draw: (cfg, group) => {
          const config = getNodeLineVoltConfig(cfg);
          const width = 100;
          const height = 66;
          const fontSize = 8;
          const title = cfg.content.titlenum;
          const titleX = 10;
          const titleY = 22;
          const titleYstep = 15;
          const numX = 70;
          /* the biggest rect */
          const container = nodeBasicLineVoltMethod.createNodeBox(
            group,
            config,
            width,
            height,
            cfg,
          );
          group.addShape('text', {
            /* name */
            attrs: {
              text: cfg.name,
              x: titleX,
              y: 10,
              fontSize,
              fontWeight: 700,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.fontColor,
              // cursor: 'pointer',
            },
            name: 'name-text-shape',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `线电压Uab(KV)`,
              x: titleX,
              y: titleY,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
            draggable: true,
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `线电压Ubc(KV)`,
              x: titleX,
              y: titleY + titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
            draggable: true,
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `线电压Uca(KV)`,
              x: titleX,
              y: titleY + 2 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
            draggable: true,
          });

          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num1,
              x: numX,
              y: titleY,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
              // fill: config.fontColor,
            },
            name: 'congdian2',
            draggable: true,
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num2,
              x: numX,
              y: titleY + titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
            draggable: true,
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num3,
              x: numX,
              y: titleY + 2 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
            draggable: true,
          });

          return container;
        },
        afterDraw: nodeBasicLineVoltMethod.afterDraw,
        setState: nodeBasicLineVoltMethod.setState,
      },
    );

    // 自定义 wholedata节点
    const getNodeWholeDataConfig = (node) => {
      let config = {
        basicColor: '#5B8FF9',
        fontColor: '#5B8FF9',
        borderColor: '#5B8FF9',
        bgColor: '#C6E5FF',
      };
      return config;
    };
    const nodeBasicWholeDataMethod = {
      createNodeBox: (group, config, w, h, cfg) => {
        /* 最外面的大矩形 */
        const container = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: w,
            heigh: h,
          },
          name: 'big-rect-shape',
          draggable: true,
        });
        /* 矩形 */
        group.addShape('rect', {
          attrs: {
            x: 3,
            y: 0,
            width: w - 19,
            height: h,
            fill: config.bgColor,
            fillOpacity: 0.1,
            stroke: 'green',
            // stroke: config.borderColor,
            radius: 12,
            lineDash: [10],
            lineWidth: 1,
            cursor: 'pointer',
          },
          name: 'rect-shape',
          draggable: true,
        });
        return container;
      },
      afterDraw: (cfg, group) => {},
      setState: (name, value, item) => {},
    };
    G6.registerNode(
      // 调试状态 节点
      'wholedata',
      {
        draw: (cfg, group) => {
          const config = getNodeWholeDataConfig(cfg);
          const width = 140;
          const height = 140;
          const fontSize = 8;
          const titleX = 60;
          const titleY = 10;
          const titleYstep = 15;
          const numX = 60;
          /* the biggest rect */
          const container = nodeBasicWholeDataMethod.createNodeBox(
            group,
            config,
            width,
            height,
            cfg,
          );
          group.addShape('text', {
            /* name */
            attrs: {
              text: cfg.name,
              x: 0,
              y: 0,
              fontSize,
              fontWeight: 700,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.fontColor,
              cursor: 'pointer',
            },
            name: 'name-text-shape',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: '有功P(KW)：',
              x: titleX,
              y: titleY,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: '无功Q(KVar)：',
              x: titleX,
              y: titleY + titleYstep,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `频率F(Hz)：`,
              x: titleX,
              y: titleY + 2 * titleYstep,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `线电压1：`,
              x: titleX,
              y: titleY + 3 * titleYstep,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `线电压2：`,
              x: titleX,
              y: titleY + 4 * titleYstep,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `线电压3：`,
              x: titleX,
              y: titleY + 5 * titleYstep,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `A相电流(A)：`,
              x: titleX,
              y: titleY + 6 * titleYstep,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `B相电流(A)：`,
              x: titleX,
              y: titleY + 7 * titleYstep,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `C相电流(A)：`,
              x: titleX,
              y: titleY + 8 * titleYstep,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });

          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num1,
              x: numX,
              y: titleY,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
              // fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num2,
              x: numX,
              y: titleY + 1 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num3,
              x: numX,
              y: titleY + 2 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num4,
              x: numX,
              y: titleY + 3 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num5,
              x: numX,
              y: titleY + 4 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num6,
              x: numX,
              y: titleY + 5 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num7,
              x: numX,
              y: titleY + 6 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num8,
              x: numX,
              y: titleY + 7 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num9,
              x: numX,
              y: titleY + 8 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          return container;
        },
        afterDraw: nodeBasicWholeDataMethod.afterDraw,
        setState: nodeBasicWholeDataMethod.setState,
      },
    );

    // 自定义 pkdata节点
    const getNodePkDataConfig = (node) => {
      let config = {
        basicColor: '#5B8FF9',
        fontColor: '#5B8FF9',
        borderColor: '#5B8FF9',
        bgColor: '#C6E5FF',
      };
      return config;
    };
    const nodeBasicPkDataMethod = {
      createNodeBox: (group, config, w, h, cfg) => {
        /* 最外面的大矩形 */
        const container = group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: w,
            heigh: h,
          },
          linkPoints: {
            top: true,
            right: true,
            bottom: true,
            left: true,
            size: 5,
          },
          name: 'big-rect-shape',
          draggable: true,
        });
        /* 矩形 */
        group.addShape('rect', {
          attrs: {
            x: 3,
            y: 0,
            width: w - 19,
            height: h,
            fill: config.bgColor,
            fillOpacity: 0.1,
            stroke: 'green',
            // stroke: config.borderColor,
            radius: 12,
            lineDash: [10],
            lineWidth: 1,
            cursor: 'pointer',
          },
          name: 'rect-shape',
          draggable: true,
        });
        return container;
      },
      afterDraw: (cfg, group) => {},
      setState: (name, value, item) => {},
    };
    G6.registerNode(
      // Pk 节点
      'pkdata',
      {
        draw: (cfg, group) => {
          const config = getNodePkDataConfig(cfg);
          const width = 80;
          const height = 100;
          const fontSize = 8;
          const titleX = 42;
          const titleY = 15;
          const titleYstep = 15;
          const numX = 40;
          /* the biggest rect */
          const container = nodeBasicPkDataMethod.createNodeBox(group, config, width, height, cfg);
          group.addShape('text', {
            /* name */
            attrs: {
              text: cfg.name,
              x: 0,
              y: 0,
              fontSize,
              fontWeight: 700,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: config.fontColor,
              cursor: 'pointer',
            },
            name: 'name-text-shape',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: 'P(KW)：',
              x: titleX,
              y: titleY,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: 'Q(KVar)：',
              x: titleX,
              y: titleY + titleYstep,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `La(A)：`,
              x: titleX,
              y: titleY + 2 * titleYstep,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `Lb(A)：`,
              x: titleX,
              y: titleY + 3 * titleYstep,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `Lc(A)：`,
              x: titleX,
              y: titleY + 4 * titleYstep,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: `P(Hz)：`,
              x: titleX,
              y: titleY + 5 * titleYstep,
              fontSize,
              textAlign: 'right',
              textBaseline: 'middle',
              fill: config.fontColor,
            },
            name: 'congdian2',
          });

          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num1,
              x: numX,
              y: titleY,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
              // fill: config.fontColor,
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num2,
              x: numX,
              y: titleY + 1 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num3,
              x: numX,
              y: titleY + 2 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num4,
              x: numX,
              y: titleY + 3 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num5,
              x: numX,
              y: titleY + 4 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          group.addShape('text', {
            /* the description text */
            attrs: {
              text: cfg.content.num6,
              x: numX,
              y: titleY + 5 * titleYstep,
              fontSize,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'green',
            },
            name: 'congdian2',
          });
          return container;
        },
        afterDraw: nodeBasicPkDataMethod.afterDraw,
        setState: nodeBasicPkDataMethod.setState,
        getAnchorPoints() {
          return [
            [0.35, 0],
            [0, 0.5], // 左侧中间
            [1, 0.5], // 右侧中间
          ];
        },
      },
    );

    G6.registerNode(
      //inner-animate (不用了) 绕组节点--注册节点 Image animation
      'inner-animate',
      {
        getAnchorPoints() {
          return [
            [0.5, 0],
            [0.5, 1],
          ];
        },
        afterDraw(cfg, group) {
          const size = cfg.size;
          const width = size[0];
          const height = size[1];
          const image = group.addShape('image', {
            attrs: {
              x: -width / 2 - 12,
              y: -height / 2,
              width,
              height,
              // img: 'https://g.alicdn.com/cm-design/arms-trace/1.0.155/styles/armsTrace/images/TAIR.png',
              img: state[cfg.img],
            },
            name: 'image-shape',
            draggable: true,
          });
          // image.animate(
          //   (ratio) => {
          //     const toMatrix = Util.transform(
          //       [1, 0, 0, 0, 1, 0, 0, 0, 1],
          //       [['r', ratio * Math.PI * 2]],
          //     );
          //     return {
          //       matrix: toMatrix,
          //     };
          //   },
          //   {
          //     repeat: true,
          //     duration: 300,
          //     // easing: 'easeCubic',
          //   },
          // );
          // const label = group.addShape('text', {
          //   // attrs: style
          //   attrs: {
          //     x: 0, // 居中
          //     y: 0,
          //     textAlign: 'center',
          //     textBaseline: 'middle',
          //     text: cfg.id,
          //     fill: '#666',
          //   },
          //   // must be assigned in G6 3.3 and later versions. it can be any value you want
          //   name: 'text-shape',
          //   // 设置 draggable 以允许响应鼠标的图拽事件
          //   draggable: true,
          // });
        },
      },
      'rect',
    );

    G6.registerNode(
      //extend-image 绕组节点--注册节点 Image animation
      'extend-image',
      {
        draw: (cfg, group) => {
          const size = cfg.size;
          const width = size[0];
          const height = size[1];
          const image = group.addShape('image', {
            attrs: {
              x: -width / 2,
              y: -height / 2,
              width,
              height,
              // img: 'https://g.alicdn.com/cm-design/arms-trace/1.0.155/styles/armsTrace/images/TAIR.png',
              img: state[cfg.img],
            },
            name: 'image-shape',
            draggable: true,
          });
          return image;
        },
        getAnchorPoints() {
          return [
            [0.5, 0],
            [0.5, 1],
          ];
        },
      },
      'rect',
    );

    /*自定义边--中心位置显示label*/
    G6.registerEdge(
      'extra-shape-edge',
      {
        afterDraw(cfg, group) {
          // get the first shape in the graphics group of this edge, it is the path of the edge here
          // 获取图形组中的第一个图形，在这里就是边的路径图形
          const shape = group.get('children')[0];
          // get the coordinate of the mid point on the path
          // 获取路径图形的中点坐标
          const midPoint = shape.getPoint(0.5);
          const rectColor = cfg.midPointColor || '#333';
          // add a rect on the mid point of the path. note that the origin of a rect shape is on its lefttop
          // 在中点增加一个矩形，注意矩形的原点在其左上角
          group.addShape('rect', {
            attrs: {
              width: 8,
              height: 14,
              fill: rectColor || '#333',
              // x and y should be minus width / 2 and height / 2 respectively to translate the center of the rect to the midPoint
              // x 和 y 分别减去 width / 2 与 height / 2，使矩形中心在 midPoint 上
              x: midPoint.x - 5,
              y: midPoint.y - 8,
            },
          });

          // group.addShape('image', {
          //   attrs: {
          //     x: midPoint.x - 10,
          //     y: midPoint.y + 10,
          //     width: 20,
          //     height: 30,
          //     img: state.three,
          //     // img: 'https://g.alicdn.com/cm-design/arms-trace/1.0.155/styles/armsTrace/images/TAIR.png',
          //   },
          //   // must be assigned in G6 3.3 and later versions. it can be any value you want
          //   name: 'image-shape',
          // });
          // 定义中间节点文案
          group.addShape('text', {
            attrs: {
              text: cfg.midtext,
              // text: cfg.label[0],
              fill: 'red',
              fontSize: 10,
              textAlign: 'start',
              textBaseline: 'middle',
              x: midPoint.x - 5 + 14,
              y: midPoint.y - 5 + 2,
            },
            name: 'left-text-shape',
          });
          // 定义中间节点文案的单位
          // group.addShape('text', {
          //   attrs: {
          //     text: 'KW',
          //     // text: cfg.label[0],
          //     fill: 'red',
          //     fontSize: 10,
          //     textAlign: 'start',
          //     textBaseline: 'middle',
          //     x: midPoint.x - 5 + 34,
          //     y: midPoint.y - 5 + 5,
          //   },
          //   name: 'left-text-shape',
          // });
          // 定义底部节点的文案
          if (cfg.bottomtext) {
            // // get the coordinate of the quatile on the path
            // // 获取路径上的四分位点坐标
            const quatile1 = shape.getPoint(0.2);
            // const quatileColor1 = cfg.quatileColor || '#333';
            // add a circle on the quatile of the path
            // 在四分位点上放置一个圆形
            // group.addShape('circle', {
            //   attrs: {
            //     r: 5,
            //     fill: quatileColor1 || '#333',
            //     x: quatile1.x,
            //     y: quatile1.y,
            //   },
            // });
            group.addShape('text', {
              attrs: {
                text: cfg.bottomtext,
                // text: cfg.label[0],
                fill: 'green',
                textAlign: 'start',
                fontSize: 10,
                textBaseline: 'middle',
                x: quatile1.x - 5 + 14,
                y: quatile1.y - 5 + 5,
              },
              name: 'left-text-shape',
            });
            group.addShape('text', {
              attrs: {
                text: 'W',
                // text: cfg.label[0],
                fill: 'red',
                textAlign: 'start',
                fontSize: 10,
                textBaseline: 'middle',
                x: quatile1.x - 5 + 34,
                y: quatile1.y - 5 + 5,
              },
              name: 'left-text-shape',
            });
          }
          // 定义头部节点的文案
          if (cfg.uptext) {
            // // get the coordinate of the quatile on the path
            // // 获取路径上的四分位点坐标
            const quatile2 = shape.getPoint(0.75);
            // const quatileColor2 = cfg.quatileColor || '#333';
            // add a circle on the quatile of the path
            // 在四分位点上放置一个圆形
            // group.addShape('circle', {
            //   attrs: {
            //     r: 5,
            //     fill: quatileColor2 || '#333',
            //     x: quatile2.x,
            //     y: quatile2.y,
            //   },
            // });
            group.addShape('text', {
              attrs: {
                text: cfg.uptext,
                // text: cfg.label[0],
                fill: 'green',
                fontSize: 10,
                textAlign: 'start',
                textBaseline: 'middle',
                x: quatile2.x - 5 + 14,
                y: quatile2.y - 5 + 5,
              },
              name: 'left-text-shape',
            });
            group.addShape('text', {
              attrs: {
                text: 'W',
                // text: cfg.label[0],
                fontSize: 10,
                fill: 'red',
                textAlign: 'start',
                textBaseline: 'middle',
                x: quatile2.x - 5 + 34,
                y: quatile2.y - 5 + 5,
              },
              name: 'left-text-shape',
            });
          }
        },
        update: undefined,
      },
      'line',
    );

    /*自定义边--十字架*/
    G6.registerEdge(
      'extra-cross-shape-edge',
      {
        afterDraw(cfg, group) {
          // get the first shape in the graphics group of this edge, it is the path of the edge here
          // 获取图形组中的第一个图形，在这里就是边的路径图形
          const shape = group.get('children')[0];
          // get the coordinate of the mid point on the path
          // 获取路径图形的中点坐标
          const threeFivePoint = shape.getPoint(0.4);
          const rectColor = cfg.midPointColor || '#333';
          // add a rect on the mid point of the path. note that the origin of a rect shape is on its lefttop
          // 在中点增加一个矩形，注意矩形的原点在其左上角
          group.addShape('rect', {
            attrs: {
              width: 10,
              height: 20,
              fill: rectColor || '#333',
              // x and y should be minus width / 2 and height / 2 respectively to translate the center of the rect to the midPoint
              // x 和 y 分别减去 width / 2 与 height / 2，使矩形中心在 midPoint 上
              x: threeFivePoint.x - 5,
              y: threeFivePoint.y,
            },
          });
          group.addShape('text', {
            attrs: {
              text: cfg.midtext,
              // text: cfg.label[0],
              fill: 'green',
              fontSize: 10,
              textAlign: 'right',
              textBaseline: 'middle',
              x: threeFivePoint.x - 10,
              y: threeFivePoint.y + 10,
            },
            name: 'left-text-shape',
          });

          // 中间的横向黄线
          const crossPoint = shape.getPoint(0.6);
          group.addShape('rect', {
            attrs: {
              width: 40,
              height: 3,
              fill: 'red',
              // x and y should be minus width / 2 and height / 2 respectively to translate the center of the rect to the midPoint
              // x 和 y 分别减去 width / 2 与 height / 2，使矩形中心在 midPoint 上
              x: crossPoint.x - 20,
              y: crossPoint.y,
            },
          });

          const upPoint = shape.getPoint(0.85);
          group.addShape('rect', {
            attrs: {
              width: 10,
              height: 20,
              fill: rectColor || '#333',
              // x and y should be minus width / 2 and height / 2 respectively to translate the center of the rect to the midPoint
              // x 和 y 分别减去 width / 2 与 height / 2，使矩形中心在 midPoint 上
              x: upPoint.x - 5,
              y: upPoint.y,
            },
          });
          group.addShape('text', {
            attrs: {
              text: cfg.midtext,
              // text: cfg.label[0],
              fill: 'green',
              fontSize: 10,
              textAlign: 'right',
              textBaseline: 'middle',
              x: upPoint.x - 10,
              y: upPoint.y + 10,
            },
            name: 'left-text-shape',
          });
        },
        update: undefined,
      },
      'line',
    );

    registerBehaviors();
    initG6();
  };
  const initG6 = () => {
    // 实例化graph
    graph = newGraph(g6Wrapper.value);

    const rawAntvData = toRaw(state.antvData);
    // console.log('antvData', state.antvData, rawAntvData);
    graph.data(rawAntvData);
    console.time('graph.render函数时长');
    graph.render();
    console.timeEnd('graph.render函数时长');
    // graph.fitView();
    // graph.fitCenter();
    // 切换默认行为 Listen to the selector, change the mode when the selector is changed
    // selector.addEventListener('change', (e) => {
    //   const value = e.target.value;
    //   // change the behavior mode
    //   graph.setMode(value);
    //   console.log('state.graph.save()', graph.save());
    // });
  };

  onMounted(async () => {
    console.log('initbingo-2322Data', initData);
    state.antvData = await getAntvData();
    await main();
    setInterval(() => {
      getAntvDataLoop();
    }, 3000);
  });
  const getAntvDataLoop = async () => {
    const newData = await getAntvData();
    const grp = toRaw(graph);
    // console.log('轮询--从新渲染数据newData', newData)
    // 更新数据时要重新赋值才会更新视图
    grp && grp.changeData(newData);
  };
  const getAntvData = async () => {
    // return defHttp.get({ url: '/weather/getantvdata' });
    // return request({
    //   url: '/weather/getantvdata',
    //   method: 'get'
    // })

    return initData.data;
  };
  onBeforeUnmount(() => {
    console.log('销毁前的grp', graph);
    // const grp = toRaw(state.graph)
    // graph && graph.destroy()
    graph = null;
    console.log('销毁后的grp', graph);
  });
</script>

<style lang="less">
  // .g6-wrapper {
  //   ::v-deep .g6-grid-container {
  //     width: 200000px;
  //     z-index: 0 !important;
  //     .g6-grid {
  //       width: 200000px;
  //     }
  //   }
  // }
  /* 提示框的样式 */
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
</style>
