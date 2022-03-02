/*
 * @LastEditTime: 2022-03-02 17:41:19
 * @LastEditors: jinxiaojian
 */
const root = document.querySelector('#svg');

const width = 1000
const radius = width / 6
const arc = d3.arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
  .padRadius(radius * 1.5)
  .innerRadius(d => d.y0 * radius)
  .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

const format = d3.format(",d")
const partition = data => {
  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);
  return d3.partition()
    .size([2 * Math.PI, root.height + 1])
    (root);
}

(async function () {
  const data = await (await fetch('./data.json')).json()
  const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))
  const getChart = function (partition, data, d3, width, color, arc, format, radius) {
    const root = partition(data);

    root.each(d => d.current = d);

    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, width])
      .style("font", "10px sans-serif");

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

    const path = g.append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("d", d => arc(d.current));

    path.filter(d => d.children)
      .style("cursor", "pointer")

    path.append("title")
      .text(d => `积分: ${format(d.value)}`);

    const label = g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))

    label
      .join("text")
      .attr("font-size", '2em')
      .attr("dy", d => !d.data.info ? '0' : "-0.5em")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current))
      .text(d => d.data.name);

    label
      .join("text")
      .attr("font-size", '1em')
      .attr("dy", "0.5em")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current))
      .text(d => d.data.info);

    const parent = g.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")


    g.append("text")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .attr("font-size", '2em')
      .attr("dy", "-1em")
      .text("微步前端组件库 tbfe-ui");
    g.append("text")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .attr("font-size", '2em')
      .attr("dy", "1em")
      .text("2月 维护 积分");


    function arcVisible (d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible (d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform (d) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    return svg.node();
  }
  root.appendChild(getChart(partition, data, d3, width, color, arc, format, radius))
}())
