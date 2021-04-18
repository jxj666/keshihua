/*
 * @LastEditTime: 2021-03-26 00:37:45
 * @LastEditors: jinxiaojian
 */
const dataSource = 'https://s5.ssl.qhres.com/static/b0695e2dd30daa64.json';

const titleEl = document.getElementById('title');

function getTitle (target) {
  const name = target.getAttribute('data-name');
  if (target.parentNode && target.parentNode.nodeName === 'g') {
    const parentName = target.parentNode.getAttribute('data-name');
    return `${parentName}-${name}`;
  }
  return name || '图例';
}

/* globals d3 */
(async function () {
  const data = await (await fetch(dataSource)).json();
  console.log(data)
  const regions = d3.hierarchy(data)
    .sum(d => 1)
    .sort((a, b) => b.value - a.value);
  const pack = d3.pack()
    .size([800, 800])
    .padding(10);

  const root = pack(regions);
  console.log(root)

  const svgroot = document.querySelector('svg');
  function draw (parent, node, { fillStyle = 'rgba(0, 0, 0, 0.2)', textColor = 'white' } = {}) {
    const { x, y, r, children } = node;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('data-name', node.data.name);
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', fillStyle);
    parent.appendChild(circle);
    if (children) {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('data-name', node.data.name);
      for (let i = 0; i < children.length; i++) { draw(group, children[i], { fillStyle, textColor }); }
      parent.appendChild(group);
    } else {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('fill', textColor);
      text.setAttribute('font-family', 'Arial');
      text.setAttribute('font-size', '0.5rem');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      const name = node.data.name;
      text.textContent = name;
      parent.appendChild(text);
    }
  }

  draw(svgroot, root);

  let activeTarget = null;
  svgroot.addEventListener('mousemove', (evt) => {
    let target = evt.target;
    if (target.nodeName === 'text') {
      target = target.parentNode;
    } else {
      titleEl.textContent = getTitle(target);

    }
    if (activeTarget !== target) {
      if (activeTarget) activeTarget.setAttribute('fill', 'rgba(0, 0, 0, 0.2)');

    }
    target.setAttribute('fill', 'rgba(0, 128, 0, 0.1)');
    activeTarget = target;
  });

}());