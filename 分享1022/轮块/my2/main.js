/*
 * @LastEditTime: 2021-10-28 14:32:06
 * @LastEditors: jinxiaojian
 */



const root = document.querySelector('#svg');

const width = 1000
const radius = width / 6
const showIndex = 3

//查看卷曲前的效果
// const arc = d => {
//   let path = d3.path()
//   path.rect(d.x0 * 100, d.y0 * 100, (d.x1-d.x0 )* 100, (d.y1-d.y0) * 100)
//   return path.toString()
// }

const arc=d3.arc()
.startAngle(d => d.x0)
.endAngle(d => d.x1)
// 如果指定了 angle 则将间隙角度设置为指定的函数或数值，并返回当前 arc 生成器。
.padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
// 如果指定了 radius 则将间隔半径设置为指定的函数或数值并返回 arc 生成器。
.padRadius(radius * 1.5)
// 如果指定了 radius 则将内半径设置为指定的函数或数值并返回当前 arc 生成器。
.innerRadius(d => d.y0 * radius)
// 如果指定了 radius 则将外半径设置为指定的函数或数值并返回当前 arc 生成器。
.outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))


const format = d3.format(",d")
const partition = data => {
  // 根据指定的层次结构数据构造一个根节点。
  const root = d3.hierarchy(data)
    // 从当前 node 开始以 post-order traversal 的次序为当前节点以及每个后代节点调用指定的 value 函数，并返回当前 node。
    .sum(d => d.value)
    // 排序
    .sort((a, b) => b.value - a.value);
  console.log('root1', deepCopy(root))

  //使用默认的设置创建一个分区图布局。
  return d3.partition()
    // 如果指定了 size 则将当前的布局尺寸设置为指定的二元数值数组：[width, height]，并返回当前 treemap 布局。
    .size([2 * Math.PI, root.height + 1])
    (root);
}

!async function () {
  const data = await (await fetch('./data.json')).json()
  // 使用 何种 颜色方案创建分类颜色比例尺
  // quantize scale(量化比例尺) 可以将连续数据四舍五入到一组固定的离散值中，可以用来生成离散数据。
  // interpolateRainbow 一种连续色彩
  const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

  const getChart = function (partition, data, d3, width, color, arc, format, radius) {

    //制造一个分区数据集
    const root = partition(data);
    console.log('root2', deepCopy(root))
    //存数据
    root.each(d => {
      d.current = d
    }
    );

    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, width])
      .style("font", "10px 雅黑");

    const g = svg.append("g")
    .attr("transform", `translate(${width / 2},${width / 2})`);

    const path = g.append("g")
      .selectAll("path")
      // 返回后代节点数组，第一个节点为自身，然后依次为所有子节点的拓扑排序
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("d", d => arc(d.current));





    path.filter(d => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    path.append("title")
      .text(d => `进程路径: ${d.ancestors().map(d => d.data.name).reverse().join("/")}\n进程占比: ${format(d.value)}`);

    const label = g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr("font-size", '2em')
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current))
      .text(d => d.data.name);

    //圆心
    const parent = g.append("circle")
      // 设置或获取元素绑定的数据集(不进行数据与元素个数的对比)
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

    function clicked (event, p) {
      // 设置或获取元素绑定的数据集(不进行数据与元素个数的对比)
      parent.datum(p.parent || root);

      //数算法
      root.each(d => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });

      const t = g.transition().duration(750);

      path.transition(t)
        // 对于每个选定的元素，在过渡过程中执行指定的函数.
        .tween("data", d => {
          // 控制缩放变换的插值方式.
          const i = d3.interpolate(d.current, d.target);
          return t => d.current = i(t);
        })
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
        // 使用自定义插值器在给定的属性之间进行过渡.
        .attrTween("d", d => () => arc(d.current));

      label.filter(function (d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      }).transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target))
        .attrTween("transform", d => () => labelTransform(d.current));
    }

    function arcVisible (d) {
      return d.y1 <= showIndex && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible (d) {
      return d.y1 <= showIndex && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform (d) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
    return svg.node();
  }
  root.appendChild(getChart(partition, data, d3, width, color, arc, format, radius))
}()
