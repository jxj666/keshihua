/*
 * @LastEditTime: 2021-04-29 19:47:44
 * @LastEditors: jinxiaojian
 */
const dataSource = './1.json';

const titleEl = document.getElementById('title');

function getTitle (target) {
  const name = target.getAttribute('data-name');
  if (target.parentNode && target.parentNode.nodeName === 'g') {
    const parentName = target.parentNode.getAttribute('data-name');
    if (target.parentNode.parentNode && target.parentNode.parentNode.nodeName === 'g') {
      const _parentName = target.parentNode.parentNode.getAttribute('data-name');
      return `${_parentName}-${parentName}-${name}`;
    }
    return `${parentName}-${name}`;
  }
  return name || '图例';
}

/* globals d3 */
(async function () {
  const data = await (await fetch(dataSource)).json()
  const rootData = data.data.root
  const regions = d3.hierarchy(rootData)
    .sum(d => 1)
    .sort((a, b) => b.value - a.value);
  const pack = d3.pack()
    .size([800, 800])
    .padding(10);

  const root = pack(regions);

  const svgroot = document.querySelector('svg');
  function draw (parent, node, { fillStyle = 'rgba(0, 0, 0, 0.2)', textColor = 'white' } = {}) {
    const { x, y, r, children } = node;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    if (node.data.threat_name_list && node.data.threat_name_list.length) {
      fillStyle = 'rgba(255, 0, 0, 0.2)'
    }
    circle.setAttribute('data-name', node.data.name || node.data.proc_file.name);
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', fillStyle);
    parent.appendChild(circle);
    if (children) {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('data-name', node.data.name || node.data.proc_file.name);
      for (let i = 0; i < children.length; i++) { draw(group, children[i], { fillStyle, textColor }); }
      parent.appendChild(group);
    } else {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('fill', textColor);
      text.setAttribute('font-family', 'Arial');
      text.setAttribute('font-size', '1rem');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('x', x);
      text.setAttribute('y', y - 10);
      const name = node.data.name || node.data.proc_file.name;
      text.textContent = name;
      parent.appendChild(text);
      if (node.data.threat_name_list && node.data.threat_name_list.length) {
        const name = node.data.threat_name_list.join('-');
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('fill', textColor);
        text.setAttribute('font-family', 'Arial');
        text.setAttribute('font-size', '0.5rem');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('x', x);
        text.setAttribute('y', y + 10);
        text.textContent = name;
        parent.appendChild(text);
      }

    }
  }

  draw(svgroot, root);

  let activeTarget = null;
  svgroot.addEventListener('mousemove', (evt) => {
    let target = evt.target;
    if (target.nodeName != 'circle') {
      if (activeTarget) activeTarget.setAttribute('stroke', '');
      return
    } else {
      titleEl.textContent = getTitle(target);
    }
    if (activeTarget !== target) {
      if (activeTarget) activeTarget.setAttribute('stroke', '');

    }
    activeTarget = target;
    target.setAttribute('stroke', 'red');

  });

}());