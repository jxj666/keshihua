/*
 * @LastEditTime: 2021-11-15 02:09:46
 * @LastEditors: jinxiaojian
 */
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

var projection = d3.geoMercator()
  .scale((width - 3) / (2 * Math.PI))
  .translate([width / 2, height / 2]);

var path = d3.geoPath()
  .projection(projection);

var graticule = d3.geoGraticule();

svg.append("defs").append("path")
  .datum({ type: "Sphere" })
  .attr("id", "sphere")
  .attr("d", path);

svg.append("use")
  .attr("class", "stroke")
  .attr("xlink:href", "#sphere");

svg.append("use")
  .attr("class", "fill")
  .attr("xlink:href", "#sphere");

svg.append("path")
  .datum(graticule)
  .attr("class", "graticule")
  .attr("d", path);

d3.json("./map.json", function (error, world) {
  if (error) throw error;
  var groups = svg.append('g');
  groups.selectAll("path")
    .data(world.features)
    .enter()
    .append("path")
    .attr("class", 'country')
    .style('fill', (country) => {
      return country.id === "CHN" ? 'red' : '#ccc'
    })
    .attr("d", path)

});
