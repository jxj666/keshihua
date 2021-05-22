/*
 * @LastEditTime: 2021-05-22 13:52:00
 * @LastEditors: jinxiaojian
 */
const mapData = [
  {
    "type": "Feature",
    "label": '北京',
    "geometry": {
      "type": "Point",
      "coordinates": [116.404763, 39.91668]
    }
  },
  {
    "type": "Feature",
    "label": "上海",
    "geometry": {
      "type": "Point",
      "coordinates": [121.474216, 31.234447]
    }
  },
  {
    "type": "Feature",
    "label": "广州",
    "geometry": {
      "type": "Point",
      "coordinates": [113.273729, 23.133741]
    }
  },
  {
    "type": "Feature",
    "label": "深圳",
    "geometry": {
      "type": "Point",
      "coordinates": [114.058228, 22.551126]
    }
  },
  {
    "type": "Feature",
    "label": "武汉",
    "geometry": {
      "type": "Point",
      "coordinates": [114.307849, 30.594488]
    }
  },
  {
    "type": "Feature",
    "label": "杭州",
    "geometry": {
      "type": "Point",
      "coordinates": [120.205736, 30.251085]
    }
  }
]
const graticule = d3.geoGraticule10()
const width = 1000
const velocity = 0.003
const DOM = myCanvas
const projection = d3.geoOrthographic().rotate([35, -55, 5]).precision(0.1)
  .fitExtent([[5, 5], [width - 5, width - 5]], { type: "Sphere" })
const backprojection = d3.geoProjection(function (a, b) {
  return d3.geoOrthographicRaw(-a, b);
})
  .clipAngle(90)
  .translate(projection.translate())
  .scale(projection.scale())

!async function () {
  const world = await d3.json('./world.json')
  const land = topojson.feature(world, world.objects.land)
  const map = function (DOM, width, d3, projection, backprojection, land, mapData, velocity, invalidation) {
    // const context = this ? this.getContext("2d") : DOM.context2d(width, width);
    const context = DOM.getContext("2d")
    const path = d3.geoPath(projection, context);
    let pointRadius = 0;
    const render = function () {
      const path = d3.geoPath(projection, context);
      const rotate = projection.rotate();
      const backpath = d3.geoPath(backprojection.rotate([rotate[0] + 180, -rotate[1], -rotate[2]]), context);
      context.clearRect(0, 0, width, width);

      context.beginPath(), path({ type: "Sphere" }),
        context.fillStyle = '#fcfcfc', context.fill();

      context.beginPath(), backpath(land),
        context.fillStyle = '#d0ddfa', context.fill();

      context.beginPath(), backpath(d3.geoGraticule()()),
        context.lineWidth = .1, context.strokeStyle = '#97b3f6', context.stroke();

      context.beginPath(), path(d3.geoGraticule()()),
        context.lineWidth = .1, context.strokeStyle = '#1046c6', context.stroke();

      context.beginPath(), path(land),
        context.globalAlpha = 0.9,
        context.lineWidth = 1, context.strokeStyle = '#1046c6', context.stroke(),
        context.fillStyle = '#5c88ee', context.fill(),
        context.globalAlpha = 1;

      context.beginPath(), path({ type: "Sphere" }),
        context.lineWidth = .1, context.strokeStyle = '#1046c6', context.stroke();

      // Point
      mapData.forEach(city => {
        context.beginPath(), path.pointRadius(2.5), path(city), context.fillStyle = "#ff0000", context.fill();
        context.beginPath(),
          path.pointRadius(pointRadius),
          path(city),
          context.strokeStyle = "#ff0000",
          context.lineWidth = 1.25,
          context.stroke();
        context.closePath();
        if (pointRadius >= 12.5) {
          pointRadius = 2.5;
        } else {
          pointRadius += 0.5;
        }
      });
    }

    // no need to specify render() here, it's taken care of by the loop below.
    // context.canvas.inertia = d3.geoInertiaDrag(d3.select(context.canvas), null, projection);

    const timer = d3.timer(function () {
      var rotate = projection.rotate();
      rotate[0] += velocity * 100;
      projection.rotate(rotate);
      render();
    });

    // invalidation.then(() => (timer.stop(), timer = null, d3.select(context.canvas).on(".drag", null)));

    return context.canvas;

  }
  map(DOM, width, d3, projection, backprojection, land, mapData, velocity)
  // map(DOM, width, d3, projection, backprojection, land, mapData, velocity, invalidation)
  console.log(land)
}()
