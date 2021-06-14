import define1 from "./8d271c22db968ab0@158.js";

export default function define (runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["sales4yrs.csv", new URL("./files/fd4051cc09e134f5cb21669f0f920e6498f6af234d68fe7433274612f7552a0c3c4ccf30ae9a17509eed34118d94c19507f930cdac8dac78600cf4b6628804f8", import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));

  main.variable(observer("viewof options")).define("viewof options", ["form", "html"], function (form, html) {
    return (
      form(html`<form><span>Year: <select name="year">
<option value="3">2020</option>
<option value="2">2019</option>
<option value="1">2018</option>
<option value="0">2017</option>
</select></span></form>`)
    )
  });
  main.variable(observer("options")).define("options", ["Generators", "viewof options"], (G, _) => G.input(_));
  main.variable(observer()).define(["html"], function (html) {
    return (
      html`<style>
.tick text {
  fill: #888;  
  font-size: small;
  writing-mode: tb;
  text-anchor: middle;  
}

.tick line {
  stroke: #ccc;
}
</style>`
    )
  });
  main.variable(observer("chart")).define("chart", ["d3", "width", "height", "drawStartLines", "drawRadialBars"], function* (d3, width, height, drawStartLines, drawRadialBars) {
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
  );
  main.variable(observer("drawStartLines")).define("drawStartLines", ["chartData", "color", "bar", "innerRadius", "numOfBars", "minRadius", "margin", "start", "title", "highlight", "restore", "d3", "year", "triangle", "seq", "parts"], function (chartData, color, bar, innerRadius, numOfBars, minRadius, margin, start, title, highlight, restore, d3, year, triangle, seq, parts) {
    return (
      g => {
        const starts = g.selectAll(".start")
          .data(chartData)
          .join("g")
          .attr("opacity", 1)
          .attr("fill", d => color(d.territory))
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
          .text(d => `${d.territory} ${d3.format("$.2s")(d.values[year])}`);

        var widths = texts.nodes().map(d => d.getComputedTextLength());

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
    )
  });
  main.variable(observer("drawRadialBars")).define("drawRadialBars", ["x", "maxValue", "maxRadius", "margin", "deg", "minRadius", "bar", "chartData", "color", "arc", "innerRadius", "year", "title", "highlight", "restore", "seq", "axisArc", "parts"], function (x, maxValue, maxRadius, margin, deg, minRadius, bar, chartData, color, arc, innerRadius, year, title, highlight, restore, seq, axisArc, parts) {
    return (
      (g, tspace) => {
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
            .text(x.tickFormat(1, "$.1s")));

        const bars = g.selectAll(".bar")
          .data(chartData)
          .join("g")
          .attr("class", "bar")
          .attr("opacity", 1)
          .attr("fill", d => color(d.territory))
          .call(g => g.append("path").attr("d", arc))
          .call(g => g.append("circle")
            .attr("r", bar.width / 2)
            .attr("cx", (d, i) => innerRadius(i) + bar.width / 2)
            .attr("transform", (d, i) => `rotate(${deg(x(d.values[year])) - 90})`))
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
    )
  });
  main.variable(observer("parts")).define("parts", function () {
    return (
      { start: null, bar: null }
    )
  });
  main.variable(observer("highlight")).define("highlight", ["parts"], function (parts) {
    return (
      (e, d) => {
        parts.start.transition().duration(500).attr("opacity", a => a === d ? 1 : 0.5);
        parts.bar.transition().duration(500).attr("opacity", a => a === d ? 1 : 0.5);
      }
    )
  });
  main.variable(observer("restore")).define("restore", ["parts"], function (parts) {
    return (
      () => {
        parts.start.transition().duration(500).attr("opacity", 1);
        parts.bar.transition().duration(500).attr("opacity", 1);
      }
    )
  });
  main.variable(observer("title")).define("title", ["years", "year", "d3"], function (years, year, d3) {
    return (
      g => g.append("title").text(d => `${years[year]} - ${d.territory}\n${d3.format("$,.2f")(d.values[year])}`)
    )
  });
  main.variable(observer("x")).define("x", ["d3", "maxValue"], function (d3, maxValue) {
    return (
      d3.scaleLinear()
        .domain([0, maxValue * 1.05])
        .range([0, 1.5 * Math.PI])
    )
  });
  main.variable(observer("color")).define("color", ["d3", "chartData"], function (d3, chartData) {
    return (
      d3.scaleOrdinal(d3.schemeTableau10)
        .domain(chartData.map(d => d.territory))
    )
  });
  main.variable(observer("seq")).define("seq", function () {
    return (
      (length) => Array.apply(null, { length: length }).map((d, i) => i)
    )
  });
  main.variable(observer("innerRadius")).define("innerRadius", ["minRadius", "bar"], function (minRadius, bar) {
    return (
      i => minRadius + (bar.width + bar.padding) * i
    )
  });
  main.variable(observer("outerRadius")).define("outerRadius", ["innerRadius", "bar"], function (innerRadius, bar) {
    return (
      i => innerRadius(i) + bar.width
    )
  });
  main.variable(observer("deg")).define("deg", function () {
    return (
      a => a * 180 / Math.PI
    )
  });
  main.variable(observer("arc")).define("arc", ["d3", "innerRadius", "outerRadius", "x", "year"], function (d3, innerRadius, outerRadius, x, year) {
    return (
      (d, i) => d3.arc()
        .innerRadius(innerRadius(i))
        .outerRadius(outerRadius(i))
        .startAngle(0)
        .endAngle(x(d.values[year]))()
    )
  });
  main.variable(observer("axisArc")).define("axisArc", ["d3", "innerRadius", "bar"], function (d3, innerRadius, bar) {
    return (
      i => d3.arc()
        .innerRadius(innerRadius(i) - bar.padding / 2)
        .outerRadius(innerRadius(i) - bar.padding / 2)
        .startAngle(0)
        .endAngle(1.5 * Math.PI)()
    )
  });
  main.variable(observer("data")).define("data", ["d3", "FileAttachment"], async function (d3, FileAttachment) {
    return (
      d3.csvParse(await FileAttachment("sales4yrs.csv").text(), d3.autoType)
    )
  });
  main.variable(observer("chartData")).define("chartData", ["data"], function (data) {
    return (
      data.map(d => {
        return {
          territory: d["territory"],
          values: data.columns.slice(1).map(y => d[y])
        }
      })
    )
  });
  main.variable(observer("maxValue")).define("maxValue", ["d3", "chartData", "year"], function (d3, chartData, year) {
    return (
      d3.max(chartData.map(d => d.values[year]))
    )
  });
  main.variable(observer("year")).define("year", ["options"], function (options) {
    return (
      options.year
    )
  });
  main.variable(observer("years")).define("years", ["data"], function (data) {
    return (
      data.columns.slice(1)
    )
  });
  main.variable(observer("width")).define("width", function () {
    return (
      1024
    )
  });
  main.variable(observer("height")).define("height", function () {
    return (
      768
    )
  });
  main.variable(observer("margin")).define("margin", function () {
    return (
      { top: 30, left: 0, bottom: 0, right: 0 }
    )
  });
  main.variable(observer("minRadius")).define("minRadius", function () {
    return (
      100
    )
  });
  main.variable(observer("maxRadius")).define("maxRadius", ["outerRadius", "numOfBars"], function (outerRadius, numOfBars) {
    return (
      outerRadius(numOfBars - 1)
    )
  });
  main.variable(observer("bar")).define("bar", function () {
    return (
      { width: 20, padding: 10 }
    )
  });
  main.variable(observer("triangle")).define("triangle", ["bar"], function (bar) {
    return (
      { width: bar.width / 2, height: bar.width, padding: 2, num: 3 }
    )
  });
  main.variable(observer("start")).define("start", function () {
    return (
      { left: 100, right: 350, padding: 5 }
    )
  });
  main.variable(observer("numOfBars")).define("numOfBars", ["chartData"], function (chartData) {
    return (
      chartData.length
    )
  });
  const child1 = runtime.module(define1);
  main.import("form", child1);
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return (
      require("d3@6")
    )
  });

  return main;
}
