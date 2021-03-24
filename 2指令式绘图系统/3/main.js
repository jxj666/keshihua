/*
 * @LastEditTime: 2021-03-25 00:38:38
 * @LastEditors: jinxiaojian
 */
const dataSource = 'https://s5.ssl.qhres.com/static/b0695e2dd30daa64.json';

/* globals d3 */
(async function () {
  const data = await (await fetch(dataSource)).json();
  console.log(data)
  const regions = d3.hierarchy(data)
    .sum(d => 1)
    .sort((a, b) => b.value - a.value);
  const pack = d3.pack()
    .size([1600, 1600])
    .padding(10);

  const root = pack(regions);
  console.log(root)
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  const TAU = 2 * Math.PI;

  function draw (ctx, node, { fillStyle = 'rgba(0, 0, 0, 0.2)', textColor = '#fff' } = {}) {
    const children = node.children;
    const { x, y, r } = node;
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    if (children) {
      for (let i = 0; i < children.length; i++) {
        draw(context, children[i]);
      }
    } else {
      const name = node.data.name;
      ctx.fillStyle = textColor;
      ctx.font = '1rem Arial';
      ctx.textAlign = 'center';
      ctx.fillText(name, x, y);
    }
  }

  draw(context, root);
}());