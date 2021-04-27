
// Spritejs是跨平台的高性能图形系统，可以在Web，节点，桌面应用程序和小程序上渲染图形
import { Scene } from 'https://unpkg.com/spritejs/dist/spritejs.esm.js';
// spritejs的3d扩展
import { Cube, Light, shaders } from 'https://unpkg.com/sprite-extend-3d/dist/sprite-extend-3d.esm.js';

let cache = null;
async function getData (toDate = new Date()) {
  if (!cache) {
    const data = await (await fetch('./1.json')).json();
    let arr=[]
    data.forEach(
      x=>{
        x.arr.forEach(
       y=>   arr.push(y)
        )
      }
    )

    cache = arr
  }
  return cache
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
  layer.camera.attributes.pos = [10, 10, 10];
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
  let max = 0
  dataset.forEach(x => {
      if (max < x.val) max = x.val
  })

  /* globals d3 */
  const selection = d3.select(layer);
  const chart1 = selection.selectAll('cube')
  .data(dataset)
  // 再增加一个过渡动画，让柱状图的高度从不显示，到慢慢显示出来
  const chart = selection.selectAll('cube')
    .data(dataset)
    .enter()
    .append(() => {
      return new Cube(program);
    })
    .attr('width', 0.1667)
    .attr('depth', 0.1667)
    .attr('height', d=>d.val*0.01)
    .attr('scaleY', 0.001)
    .attr('pos', (d, i) => {
      const x0 = -1.5;
      const z0 = -0.48 + 0.05 + 0.0015;
      const x = x0 + 0.1667 * Math.floor(i / 6);
      const z = z0 + 0.1667 * (i % 6);
      // return [x, 0.5 * d.val / max, z];
      return [x, -.1, z];
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
      float x = fract(vUv.x * 50.0);
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
    width: 8.3,
    height: 0.2,
    z: -0.01,
    x: 2.6,
    y: -0, // not 0.05 to avoid z-fighting
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
      return linear(d.val);
    })
    .attr('y', (d, i) => {
      return -.1 + 0.5 * linear(d.val);
    });

  layer.setOrbit();

  window.layer = layer;
}());