/*
 * @LastEditTime: 2021-06-02 00:21:36
 * @LastEditors: jinxiaojian
 */
const width = 1000
const height = 1000
const data = [
  { state: "入侵执行", value: 1764545, color: '#FC7A1C' },
  { state: "巩固阵地", value: 1764545, color: '#FB5621' },
  { state: "主机提权", value: 4722699, color: '#FC613F' },
  { state: "躲避检测", value: 3276813, color: '#F23F33' },
  { state: "建立外连", value: 6925318, color: '#E40F0F' },
  { state: "破坏窃取", value: 2380152, color: '#B90000' },

]

const FunnelChart = class FunnelChart {
  constructor(container) {
    this._container = container;

    // Groups
    this._g = null;

    // Visual elements and selections
    this._infoBox = null;
    this._textBox = null;
    this._charBox = null;

    // Base variables and constants        
    this._width = 0;
    this._height = 0;
    this._offset = 30;
    this._hw = 0;
    this._funnelWidth = { max: 0, min: 0 };

    // Scales
    this._y = null;

    // Data
    this._data = null;
    this._chartData = null;
    this._total = 0;

    // Options
    this._options = {
      percentage: "first", // first, previous
      showPercentage: true
    };

    // Font
    this._font = {
      fontFamily: "黑体",
      size: {
        label: 16,
        value: 16,
        percentage: 12
      }
    }

    this._field = {
      stage: "stage",
      value: "value",
      color: "color"
    };

    this._tooltip = {
      color: "black",
      boxColor: "white",
      boxOpacity: 0.8
    };

    // events
    this._onhover = null;
    this._onclick = null;
  }

  size (_) {
    return arguments.length ? (this._width = _[0], this._height = _[1], this) : [this._width, this._height];
  }

  options (_) {
    return arguments.length ? (this._options = Object.assign(this._options, _), this) : this._options;
  }

  font (_) {
    return arguments.length ? (this._font = Object.assign(this._font, _), this) : this._font;
  }

  field (_) {
    return arguments.length ? (this._field = Object.assign(this._field, _), this) : this._field;
  }

  tooltip (_) {
    return arguments.length ? (this._tooltip = Object.assign(this._tooltip, _), this) : this._tooltip;
  }

  data (_) {
    return arguments.length ? (this._data = [..._], this) : this._data;
  }

  onhover (_) {
    return arguments.length ? (this._onhover = _, this) : this._onhover;
  }

  onclick (_) {
    return arguments.length ? (this._onclick = _, this) : this._onclick;
  }

  render () {
    this._init();
    this._process();
    this._initScales();
    this._render();
    return this;
  }

  _init () {

    this._hw = this._width / 2;
    this._funnelWidth.max = this._width * 0.65;

    this._funnelWidth.min = this._width * 0.15;

    this._textBox = this._container
      .append("text")
      .attr("font-family", this._font.fontFamily)
      .style("visibility", "hidden");
    this._getCharBox();
  }

  _process () {

    this._processPartToWhole();

  }



  _processPartToWhole () {
    let t = 0;
    this._chartData = this._data.map((d, i) => {
      const
        vs = t,
        value = +d[this._field.value];

      t += value;
      return {
        stage: d[this._field.stage],
        value: value,
        color: d[this._field.color],
        vs: vs,
        ve: t,
        pct: 0
      };
    });

    this._total = t;
    this._chartData.forEach(d => d.pct = d.value / t);
  }

  _initScales () {
    this._y = d3.scaleLinear().range([0, this._height]);

    this._y.domain([0, this._total]);


  }

  _render () {
    this._g = this._container
      .append("g")
      .attr("font-family", this._font.fontFamily);

    this._renderLabels();
    this._renderFunnel();

  }

  _renderLabels () {
    const offset = 5


    const data = this._chartData
      .filter(d => this._y(d.ve) - this._y(d.vs) > this._charBox.height);

    const labels = this._g
      .selectAll("label")
      .data(data)
      .join("g")
      .attr("class", "label")
      .attr("font-size", this._font.size.label)
      .attr("font-weight", "bold")
      .attr("fill", "#666")
      .call(g => {
        const line = g
          .append("line")
          .attr("stroke", "#666")
          .attr("stroke-dasharray", "1,2");


        line
          .attr("x1", 0).attr("y1", d => this._y(d.vs + d.value * 0.75))
          .attr("x2", this._hw).attr("y2", d => this._y(d.vs + d.value * 0.75));


        g
          .append("text")
          .attr("x", 0)
          .attr("y", d => this._y(d.vs + d.value * 0.75) - offset)
          .attr("dy", "-0.2em")
          .text(d => d.stage)
      });

    this._attachEvents(labels);
  }

  _renderLayers (layer, shadow) {
    return this._g
      .selectAll("layer")
      .data(this._chartData)
      .join("g")
      .attr("class", "layer")
      .call(g => {
        g
          .append("path")
          .attr("fill", d => {
            return d.color
          }
          )
          // .attr('fill', 'red')
          .attr("d", layer)
      })
      .call(g => {
        g
          .append("path")
          .attr("fill", d => d3.color(d.color).darker(0.5))
          // .attr('fill', 'red')
          .attr("d", shadow)
      });
  }

  _renderNumbers (target, t) {
    const ah = this._options.showPercentage ? this._charBox.height * 2 : this._charBox.height;
    const filtered = target
      .filter(d => this._y(d.ve) - this._y(d.vs) > ah);

    filtered.call(g => {
      g
        .append("text")
        .attr("fill", "white")
        .attr("font-size", this._font.size.value)
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("transform", t)
        .text(d => d3.format(".3s")(d.value));

      if (this._options.showPercentage) {
        g
          .append("text")
          .attr("fill", "white")
          .attr("font-size", this._font.size.percentage)
          .attr("text-anchor", "middle")
          .attr("transform", t)
          .attr("dy", "1em")
          .text(d => d3.format(".1%")(d.pct));
      }
    });
  }


  _renderFunnel () {
    const
      that = this,
      { pa, pc, xb, xt } = this._getLinearEquationSet2();

    const layers =
      this._renderLayers(layer, shadow)
        .call(g => {
          g
            .append("path")
            .attr("fill", d => d3.color(d.color).darker(0.7))
            // .attr("fill", 'red')
            .attr("d", bottom)
        });

    const
      x1 = (this._width - this._funnelWidth.max * 1 / 3) / 2, y1 = 0,
      x2 = (this._width - this._funnelWidth.max) / 2 + this._funnelWidth.max, y2 = this._offset,
      a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    this._renderNumbers(
      layers,
      d => {

        const py = this._y(d.vs + d.value / 2), px = xt(py);
        return `translate(${px},${py}) skewY(${a})`;

      }
    );

    this._attachEvents(layers);

    function layer (d) {
      const
        ys = that._y(d.vs), ye = that._y(d.ve) - 10,
        y00 = ys, y01 = ye, x00 = xb(y00), x01 = xb(y01),
        p0 = pc(ys), p1 = pc(ye);

      return `M${x00},${y00}L${p0.x},${p0.y}L${p1.x},${p1.y}L${x01},${y01}L${x00},${y00}`;
    }

    function shadow (d) {
      const
        ys = that._y(d.vs), ye = that._y(d.ve) - 10,
        y00 = ys, y01 = ye, x00 = xb(y00), x01 = xb(y01),
        p0 = pa(ys), p1 = pa(ye);

      return `M${x00},${y00}L${p0.x},${p0.y}L${p1.x},${p1.y}L${x01},${y01}L${x00},${y00}`;
    }

    function bottom (d) {
      const
        y = that._y(d.ve) - 10,
        y00 = y, x00 = xb(y00),
        p0 = pa(y), p1 = pc(y);

      return `M${x00},${y00}L${p0.x},${p0.y}L${p1.x},${p1.y}L${x00},${y00}`;
    }
  }

  _getLinearEquationSet2 () {
    const mb = (x1, y1, x2, y2) => {
      const m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
      return { m, b };
    };

    // Second line
    const xb = y => {
      const
        x1 = (this._width - this._funnelWidth.max * 1 / 3) / 2, y1 = 0,
        x2 = (this._width - this._funnelWidth.min) / 2 * 1.05, y2 = this._height;
      return this._x(x1, y1, x2, y2)(y);
    };

    // Text line
    const xt = y => {
      const
        xa = (this._width - this._funnelWidth.max * 1 / 3) / 2,
        xb = (this._width - this._funnelWidth.max) / 2 + this._funnelWidth.max,
        x1 = xa + (xb - xa) / 2, y1 = 0;
      const
        xc = (this._width - this._funnelWidth.min) / 2 * 1.05,
        xd = (this._width - this._funnelWidth.min) / 2 + this._funnelWidth.min,
        x2 = xc + (xd - xc) / 2, y2 = this._height;
      return this._x(x1, y1, x2, y2)(y);
    };

    const p = (x11, x12, x22, y) => {
      // Line 1
      const y11 = 0, y12 = this._height;
      // Line 2
      const x21 = xb(y), y21 = y, y22 = y21 + this._offset;

      const
        l1 = mb(x11, y11, x12, y12),
        l2 = mb(x21, y21, x22, y22);

      const
        px = (l2.b - l1.b) / (l1.m - l2.m),
        py = l1.m * px + l1.b;

      return { x: px, y: py };
    }

    // Left line
    const pa = y => p(
      (this._width - this._funnelWidth.max) / 2,
      (this._width - this._funnelWidth.min) / 2,
      (this._width - this._funnelWidth.max) / 2,
      y);

    // Right line
    const pc = y => p(
      (this._width - this._funnelWidth.max) / 2 + this._funnelWidth.max,
      (this._width - this._funnelWidth.min) / 2 + this._funnelWidth.min,
      (this._width - this._funnelWidth.max) / 2 + this._funnelWidth.max,
      y);

    return { pa, pc, xb, xt };
  }

  _x (x1, y1, x2, y2) {
    const
      m = (y2 - y1) / (x2 - x1),
      b = y1 - m * x1;

    return y => (y - b) / m;
  }

  _attachEvents (target) {
    target

      .on("pointerenter", (e, d) => {
        this._showTooltip(e, d);
        if (this._onhover) this._onhover(d);
      })
      .on("pointermove", (e, d) => {
        this._moveTooltip(e);
      })
      .on("pointerleave", () => {
        this._hideTooltip();
      })
      .on("click", (e, d) => {
        this._showTooltip(e, d);
        if (this._onClick) this._onClick(d);
      })
    
  }

  _showTooltip (e, d) {
    const info = [d.stage, d3.format(",")(d.value), d3.format(".2%")(d.pct)];

    var max = 0;
    info.forEach(s => {
      const l = this._calcTextLength(s);
      if (l > max) max = l;
    })

    if (!this._infoBox)
      this._infoBox = this._g
        .append("g")
        .attr("fill", this._tooltip.color)
        .call(g => g.append("rect")
          .attr("class", "ibbg")
          .attr("opacity", this._tooltip.boxOpacity)
          .attr("stroke", "#aaa")
          .attr("stroke-width", 0.5)
          .attr("rx", 4).attr("ry", 4)
          .attr("x", -5).attr("y", -5)
          .attr("fill", this._tooltip.boxColor))

    const spacing = 1.1;
    this._infoBox
      .style("visibility", "visible")
      .select(".ibbg")
      // .attr("width", max + 20).attr("height", spacing * this._charBox.height * info.length + 5);
      .attr("width", max + 20).attr("height", 70);


    this._infoBox
      .selectAll("text")
      .data(info)
      .join(
        enter => {
          enter
            .append("text")
            .attr("dy", (d, i) => `${spacing * i + 1}em`)
            .attr("font-weight", (d, i) => i === 0 ? "bold" : "")
            .text(d => d);
        },
        update => update.text(d => d),
        exit => exit.remove()
      );

    this._moveTooltip(e);
  }

  _getSVG () {
    let curr = this._container.node();
    while (curr && curr.tagName !== "svg")
      curr = curr.parentElement;
    return curr;
  }

  _moveTooltip (e) {
    const svg = this._getSVG();
    if (svg) {
      // convert to SVG coordinates
      const
        p = svg.createSVGPoint(),
        box = this._infoBox.node().getBBox(),
        gr = this._g.node().getBoundingClientRect();
      p.x = e.clientX;
      p.y = e.clientY;
      const converted = p.matrixTransform(this._g.node().getScreenCTM().inverse());

      const
        left = converted.x + box.width + gr.left > this._width ? converted.x - box.width : converted.x,
        top = converted.y + box.height + gr.top > this._height ? converted.y - box.height : converted.y;

      this._infoBox.attr("transform", `translate(${left + 10},${top + 10})`);
    }
  }

  _hideTooltip (d) {
    if (this._infoBox) this._infoBox.style("visibility", "hidden");
  }

  _calcTextLength (text) {
    return this._textBox.text(text).node().getBBox().width;
  }

  _getCharBox () {
    this._charBox = this._textBox.text("M").node().getBBox();
  }
}

const chart = function* (d3, width, height, FunnelChart, data) {
  const svg = d3.create("svg")
    .attr("cursor", "default")
    .attr("viewBox", [0, 0, width, height]);

  yield svg.node();
  new FunnelChart(svg)
    .size([width, height])
    .options({})
    .field({ stage: "state" })
    .data(data)
    .render();
  return svg.node();

}

const getSvg = chart(d3, width, height, FunnelChart, data)
getSvg.next()
document.querySelector('#svg').appendChild(getSvg.next().value)
