/*
 * @LastEditTime: 2021-06-14 23:55:04
 * @LastEditors: jinxiaojian
 */

const data = [
  {
    "value": 99,
    "portName": "32846 DNS"
  },
  {
    "value": 95,
    "portName": "59562 HTTP"
  },
  {
    "value": 95,
    "portName": "22141 TCP"
  },
  {
    "value": 66,
    "portName": "79182 DNS"
  },
  {
    "value": 35,
    "portName": "59811 HTTPS"
  },

]
data.columns = ["portName", "value"]
const start = { left: 100, right: 350, padding: 5 }
const bar = { width: 20, padding: 10 }
const minRadius = 100
const margin = { top: 30, left: 0, bottom: 0, right: 0 }
const height = 768
const width = 1024
const parts = { start: null, bar: null }
const list = 0

const chartData = data.map(d => {
  return {
    portName: d["portName"],
    values: data.columns.slice(1).map(y => d[y])
  }
})
const triangle = { width: bar.width / 2, height: bar.width, padding: 2, num: 3 }
const numOfBars = chartData.length;


const deg = a => a * 180 / Math.PI
const seq = (length) => Array.apply(null, { length: length }).map((d, i) => i)
const innerRadius = i => minRadius + (bar.width + bar.padding) * i
const outerRadius = i => innerRadius(i) + bar.width
const maxRadius = outerRadius(numOfBars - 1)
const lists = data.columns.slice(1)
const maxValue = d3.max(chartData.map(d => d.values[list]))
const highlight = (e, d) => {
  parts.start.transition().duration(500).attr("opacity", a => a === d ? 1 : 0.5);
  parts.bar.transition().duration(500).attr("opacity", a => a === d ? 1 : 0.5);
}
const restore = () => {
  parts.start.transition().duration(500).attr("opacity", 1);
  parts.bar.transition().duration(500).attr("opacity", 1);
}
const title = g => g.append("title").text(d => `${d.portName}\n${d3.format(".0f")(d.values[list])}`)
const x = d3.scaleLinear()
  .domain([0, maxValue * 1.05])
  .range([0, 1.5 * Math.PI])
const color = d3.scaleOrdinal(d3.schemeTableau10)
  .domain(chartData.map(d => d.portName))
const arc = (d, i) => d3.arc()
  .innerRadius(innerRadius(i))
  .outerRadius(outerRadius(i))
  .startAngle(0)
  .endAngle(x(d.values[list]))()
const axisArc = i => d3.arc()
  .innerRadius(innerRadius(i) - bar.padding / 2)
  .outerRadius(innerRadius(i) - bar.padding / 2)
  .startAngle(0)
  .endAngle(1.5 * Math.PI)()


const drawRadialBars = (g, tspace) => {
  const ticks = x.ticks(15).slice(1, -1);
  ticks.push(maxValue * 1.05);
  g.attr("transform", `translate(${tspace},${maxRadius + margin.top})`);

  const marks = g.append("g")
    .selectAll(".tick")
    .data(ticks)
    .join("g")
    .attr("class", "tick")
    .attr("transform", d => `rotate(${deg(x(d)) - 90})`)
    .call(g => g.append("line").attr("x1", minRadius - bar.padding / 2).attr("x2", maxRadius + bar.padding / 2))
    .call(g => g.append("text")
      .attr("class", "tick")
      .attr("transform", d => `translate(${maxRadius + bar.padding * 1.5},0)`)
      .text(x.tickFormat(0, ".0s")));

  const bars = g.selectAll(".bar")
    .data(chartData)
    .join("g")
    .attr("class", "bar")
    .attr("opacity", 1)
    .attr("fill", d => color(d.portName))
    .call(g => g.append("path").attr("d", arc))
    .call(g => g.append("circle")
      .attr("r", bar.width / 2)
      .attr("cx", (d, i) => innerRadius(i) + bar.width / 2)
      .attr("transform", (d, i) => {
        return `rotate(${deg(x(d.values[list])) - 90})`
      }))
    .call(title)
    .on("mouseover", highlight)
    .on("mouseout", restore);

  g.selectAll(".track")
    .data(seq(chartData.length + 1))
    .join("path")
    .attr("class", "track")
    .attr("stroke", "#ccc")
    .attr("d", axisArc);

  parts.bar = bars;
}
const drawStartLines = g => {
  const starts = g.selectAll(".start")
    .data(chartData)
    .join("g")
    .attr("opacity", 1)
    .attr("fill", d => color(d.portName))
    .attr("transform", (d, i) => `translate(${bar.width},${innerRadius(numOfBars - 1 - i) - minRadius + margin.top})`)
    .call(g => g.append("circle").attr("cy", bar.width / 2).attr("r", bar.width / 2))
    .call(g => g.append("rect").attr("width", start.left).attr("height", bar.width))
    .call(title)
    .on("mouseover", highlight)
    .on("mouseout", restore);

  const texts = starts.append("text")
    .attr("class", "start")
    .attr("font-weight", "bold")
    .attr("alignment-baseline", "hanging")
    .attr("dx", start.left + start.padding)
    .attr("dy", 4)
    .text(d => `${d.portName} ${d3.format(".0f")(d.values[list])}`);
  var widths = texts.nodes().map(d => {
    return d.getComputedTextLength() || d.innerHTML.length * 8
  });
  const ext = d3.extent(widths);
  const min = ext[0], max = ext[1];
  starts.append("rect")
    .attr("width", (d, i) => start.right + (max - widths[i]))
    .attr("height", bar.width)
    .attr("transform", (d, i) => `translate(${widths[i] + start.left + start.padding * 2},0)`)


  const startLength = start.left + start.right + start.padding * 2 + max + bar.width + (triangle.num ? 3 : 0);
  starts.append("g")
    .selectAll("polygon")
    .data(seq(triangle.num))
    .join("polygon")
    .attr("points", `0,2 ${triangle.width},${triangle.width} 0,${triangle.height - 2}`)
    .attr("transform", (d, i) => `translate(${startLength - bar.width + i * (triangle.width + triangle.padding)},0)`);

  const y = d => innerRadius(d) - bar.padding / 2 - minRadius + margin.top,
    tspace = startLength + (triangle.width + triangle.padding) * triangle.num;
  g.selectAll("line")
    .data(seq(numOfBars + 1))
    .join("line")
    .attr("stroke", "#ccc")
    .attr("x1", bar.width).attr("y1", y)
    .attr("x2", tspace).attr("y2", y);

  parts.start = starts;
  return tspace;
}

const chart = function* (d3, width, height, drawStartLines, drawRadialBars) {
  const svg = d3.create("svg")
    .attr("font-size", "10pt")
    .attr("cursor", "default")
    .attr("viewBox", [0, 0, width, height]);

  yield svg.node();

  var tspace = 0;
  svg.append("g").call(g => tspace = drawStartLines(g));
  svg.append("g").call(g => drawRadialBars(g, tspace));

  return svg.node();
}

const getSvg = chart(d3, width, height, drawStartLines, drawRadialBars)
getSvg.next()
document.querySelector('#svg').appendChild(getSvg.next().value)