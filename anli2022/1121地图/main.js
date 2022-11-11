/*
 * @LastEditTime: 2022-11-11 18:59:31
 * @LastEditors: jinxiaojian
 */
let mockData = {
  "CHN": '#fff',
  // "USA": 'orange',
  // "IND": 'yellow',
}

var svg = d3.select("svg"),
  width = +svg.attr("width")
var projection = d3.geoMercator()
  .scale((width - 3) / (2 * Math.PI))
  .translate([width / 2, width / 2]);
var path = d3.geoPath()
  .projection(projection);
console.log('path', path)
d3.json("./wrold.json", function (error, world) {
  console.log(1, error, world)
  if (error) throw error;
  let groups = svg.append('g');
  groups.selectAll("path")
    .data(world.features)
    .enter()
    .append("path")
    .attr("class", 'country')
    .style('fill', (country) => {
      if (mockData[country.id]) {
        // info(path.centroid(country), country, groups)
      }
      return mockData[country.id] || '#eee'
    })
    .style('stroke', (country) => {
      return country.id==='CHN'? 'blue': 'blue'
    })
    .attr("d", (...x) => {
      return path(...x)
    })

  d3.json("./china.json", function (error, world) {
    console.log(2, error, world)
    let groups = svg.append('g');
    groups.style('fill','none')
    if (error) throw error;
    groups.selectAll("path")
      .data(world.features)
      .enter()
      .append("path")
      .attr("class", 'province')
      .style('stroke', 'blue')
      .style('stroke-width',val=>{
        console.log(val.properties)
        return val.properties. adcode==='100000_JD'?1 :0.1
      } )

      .attr("d", (...x) => {
        return path(...x)
      })
  });
});

//添加标签
function info (xy, country, groups) {
  let xyData = xy
  let gTag = groups.append("g").attr('class', 'tag')
  gTag.append("circle")
    .attr('cx', xyData[0])
    .attr('cy', xyData[1])
    .attr('r', 3)
    .attr('fill', '#333')
  gTag.append("circle")
    .attr('cx', xyData[0])
    .attr('cy', xyData[1])
    .attr('r', 6)
    .attr('fill', 'none')
    .attr('stroke', '#333')
  gTag.append("circle")
    .attr('cx', xyData[0])
    .attr('cy', xyData[1])
    .attr('r', 9)
    .attr('fill', 'none')
    .attr('stroke', '#333')
  gTag.append("path")
    .attr('d', `M${xyData[0]} ${xyData[1]} L${xyData[0]} ${xyData[1] - 100} Z`)
    .attr('stroke', '#333')
  gTag.append('rect')
    .attr('x', xyData[0] - country?.properties?.name?.length * 5)
    .attr('y', xyData[1] - 100 - 30)
    .attr('width', country?.properties?.name?.length * 10)
    .attr('height', 30)
    .attr('fill', '#00000066')
    .attr('rx', 5)
    .attr('ry', 5)
  gTag.append("text")
    .attr('x', xyData[0])
    .attr('y', xyData[1] - 100 - 10)
    .attr('text-anchor', 'middle')
    .attr("fill", '#fff')
    .style("font-size", '14px')
    .text(country?.properties?.name)
}