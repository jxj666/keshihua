export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Translucent Earth`
)});
  main.variable(observer("map")).define("map", ["DOM","width","d3","projection","backprojection","land","tokyo","velocity","invalidation"], function(DOM,width,d3,projection,backprojection,land,tokyo,velocity,invalidation)
{
  const context = this ? this.getContext("2d") : DOM.context2d(width, width);
  const path = d3.geoPath(projection, context);
  let pointRadius = 0;
  const render = function() {
    const path = d3.geoPath(projection, context);
    const rotate = projection.rotate();
    const backpath = d3.geoPath(backprojection.rotate([rotate[0]+180, -rotate[1], -rotate[2]]), context);
  	context.clearRect(0, 0, width, width);

    context.beginPath(), path({type:"Sphere"}),
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

    context.beginPath(), path({type: "Sphere"}),
      context.lineWidth = .1, context.strokeStyle = '#1046c6', context.stroke();

    
    // Point
    context.beginPath(), path.pointRadius(2.5), path(tokyo), context.fillStyle = "#ff1493", context.fill();
    context.beginPath(),
      path.pointRadius(pointRadius),
      path(tokyo),
      context.strokeStyle = "#ff1494",
      context.lineWidth = 1.25,
      context.stroke();
    context.closePath();
    if (pointRadius >= 12.5) {
      pointRadius = 2.5; 
    } else {
      pointRadius += 0.5;
    }
    
  }
  
  // no need to specify render() here, it's taken care of by the loop below.
  context.canvas.inertia = d3.geoInertiaDrag(d3.select(context.canvas), null, projection);

  const timer = d3.timer(function() {
    var rotate = projection.rotate();
    rotate[0] += velocity * 20;
    projection.rotate(rotate);
    render();
  });
  
  invalidation.then(() => (timer.stop(), timer = null, d3.select(context.canvas).on(".drag", null)));

  return context.canvas;

}
);
  main.variable(observer()).define(["projection","d3","md"], function*(projection,d3,md)
{
  // this only for informative purposes.
  while (true) {
    var p = projection.rotate().map(d3.format(".2f"));
    yield md`λ = ${p[0]}, φ = ${p[1]}, γ = ${p[2]}`
  }
}
);
  main.variable(observer("velocity")).define("velocity", function(){return(
0.003
)});
  main.variable(observer("projection")).define("projection", ["d3","width"], function(d3,width){return(
d3.geoOrthographic().rotate([35,-55,5]).precision(0.1)
    .fitExtent([[5, 5], [width - 5, width - 5]], {type: "Sphere"})
)});
  main.variable(observer("backprojection")).define("backprojection", ["d3","projection"], function(d3,projection){return(
d3.geoProjection(function(a,b) {
  return d3.geoOrthographicRaw(-a,b);
})
  .clipAngle(90)
  .translate(projection.translate())
  .scale(projection.scale())
)});
  main.variable(observer()).define(["md"], function(md){return(
md`----
_boring zone_`
)});
  main.variable(observer("graticule")).define("graticule", ["d3"], function(d3){return(
d3.geoGraticule10()
)});
  main.variable(observer("land")).define("land", ["topojson","world"], function(topojson,world){return(
topojson.feature(world, world.objects.land)
)});
  main.variable(observer("world")).define("world", ["d3"], function(d3){return(
d3.json("https://unpkg.com/world-atlas@1/world/110m.json")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3-format", "d3-fetch@0.1", "d3-geo@1", "d3-selection", "d3-timer", "d3-inertia")
)});
  main.variable(observer("tokyo")).define("tokyo", function(){return(
{
	"type": "Feature",
	"geometry": {
		"type": "Point",
		"coordinates": [139.8601606,35.664439]
	}
}
)});
  return main;
}
