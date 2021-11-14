/*
 * @LastEditTime: 2021-11-15 02:29:52
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
