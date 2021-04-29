/*
 * @LastEditTime: 2021-04-29 17:50:06
 * @LastEditors: jinxiaojian
 */
const dataSource = './1.json';

/* globals d3 */
(async function () {
  const data = await (await fetch(dataSource)).json()
  const rootData = data.data.root
  const regions = d3.hierarchy(rootData)
    .sum(d => 1)
  const pack = d3.pack()
    .size([800, 800])
    .padding(10);

  const root = pack(regions);
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
      const name = node.data.name || node.data.proc_file.name;
      ctx.fillStyle = textColor;
      ctx.font = '2rem Arial';
      ctx.textAlign = 'center';
      ctx.fillText(name, x, y);
    }
  }

  draw(context, root);
}());