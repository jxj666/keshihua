/*
 * @LastEditTime: 2021-04-26 00:07:28
 * @LastEditors: jinxiaojian
 */
// Spritejs是跨平台的高性能图形系统，可以在Web，节点，桌面应用程序和小程序上渲染图形
import { Scene } from 'https://unpkg.com/spritejs/dist/spritejs.esm.js';
// spritejs的3d扩展
import { Cube, Light, shaders } from 'https://unpkg.com/sprite-extend-3d/dist/sprite-extend-3d.esm.js';

let cache = null;
async function getData (toDate = new Date()) {
  if (!cache) {
    const data = await (await fetch('./1.json')).json();
    cache = data.contributions.map((o) => {
      o.date = new Date(o.date.replace(/-/g, '/'));
      return o;
    });
  }
  // 要拿到 toData 日期之前大约一年的数据（52周）
  let start = 0,
    end = cache.length;

  // 用二分法查找
  while (start < end - 1) {
    const mid = Math.floor(0.5 * (start + end));
    const { date } = cache[mid];
    if (date <= toDate) end = mid;
    else start = mid;
  }

  // 获得对应的一年左右的数据
  let day;
  if (end >= cache.length) {
    day = toDate.getDay();
  } else {
    const lastItem = cache[end];
    day = lastItem.date.getDay();
  }
  // 根据当前星期几，再往前拿52周的数据
  const len = 7 * 52 + day + 1;
  const ret = cache.slice(end, end + len);
  if (ret.length < len) {
    // 日期超过了数据范围，补齐数据
    const pad = new Array(len - ret.length).fill({ count: 0, color: '#ebedf0' });
    ret.push(...pad);
  }
  console.log(ret)
  return ret;
}

(async function () {
  // 创建一个 Scene 对象
  const container = document.getElementById('stage');

  const scene = new Scene({
    container,
    displayRatio: 2,
  });
  // 创建 Layer 对象
  const layer = scene.layer3d('fglayer', {
    ambientColor: [0.5, 0.5, 0.5, 1],
    camera: {
      fov: 45,
    },
  });
  layer.camera.attributes.pos = [2, 6, 9];
  layer.camera.lookAt([0, 0, 0]);
  // 补充细节，实现更好的视觉效果
  const light = new Light({
    direction: [-3, -3, -1],
    color: [1, 1, 1, 1],
  });

  layer.addLight(light);

  // 将数据转换成柱状元素
  const program = layer.createProgram({
    vertex: shaders.GEOMETRY.vertex,
    fragment: shaders.GEOMETRY.fragment,
    // cullFace: null,
  });

  // 创建好 WebGL 程序之后，我们就可以获取数据，用数据来操作文档树了
  const dataset = await getData();
  const max = d3.max(dataset, (a) => {
    return a.count;
  });

  /* globals d3 */
  const selection = d3.select(layer);
  // 再增加一个过渡动画，让柱状图的高度从不显示，到慢慢显示出来
  const chart = selection.selectAll('cube')
    .data(dataset)
    .enter()
    .append(() => {
      return new Cube(program);
    })
    .attr('width', 0.1667)
    .attr('depth', 0.1667)
    .attr('height', 1)
    // Note: use scaleY. DONT use height directly because the change of height
    // will rebuild geometry(much slower).
    .attr('scaleY', 0.001)
    // .attr('scaleY', (d) => {
    //   return d.count / max;
    // })
    .attr('pos', (d, i) => {
      const x0 = -3.8 + 0.0717 + 0.0015;
      const z0 = -0.5 + 0.05 + 0.0015;
      const x = x0 + 0.1667 * Math.floor(i / 6);
      const z = z0 + 0.1667 * (i % 6);
      // return [x, 0.5 * d.count / max, z];
      return [x, 0, z];
    })
    .attr('colors', (d, i) => {
      return d.color;
    });

    // 我们还可以给柱状图增加一个底座
  const fragment = `
    precision highp float;
    precision highp int;
    varying vec4 vColor;
    varying vec2 vUv;
    void main() {
      float x = fract(vUv.x * 53.0);
      float y = fract(vUv.y * 6.0);
      x = smoothstep(0.0, 0.1, x) - smoothstep(0.9, 1.0, x);
      y = smoothstep(0.0, 0.1, y) - smoothstep(0.9, 1.0, y);
      gl_FragColor = vColor * (x + y);
    }    
  `;

  const axisProgram = layer.createProgram({
    vertex: shaders.TEXTURE.vertex,
    fragment,
    // cullFace: null,
  });

  const ground = new Cube(axisProgram, {
    width: 7.6,
    height: 0.1,
    z:-0.01,
    x:2.75,
    y: -0.049, // not 0.05 to avoid z-fighting
    depth: 1,
    colors: 'rgba(0, 0, 0, 0.1)',
  });

  layer.append(ground);
  // 通过 chart.trainsition 来实现这个线性动画
  const linear = d3.scaleLinear()
    .domain([0, max])
    .range([0, 1.0]);
  chart.transition()
    .duration(2000)
    .attr('scaleY', (d, i) => {
      return linear(d.count);
    })
    .attr('y', (d, i) => {
      return 0.5 * linear(d.count);
    });

  layer.setOrbit();

  window.layer = layer;
}());