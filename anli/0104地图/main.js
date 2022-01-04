/*
 * @LastEditTime: 2022-01-04 14:21:32
 * @LastEditors: jinxiaojian
 */
let warnData = {
  "CHN": 'rgb(219, 74, 73)',
  "USA": 'rgb(225, 146, 136)',
  "IND": 'rgb(245, 195, 188)',
  "DEU": 'rgb(245, 195, 188)',
  "FRA": 'rgb(245, 195, 188)',
}
var svg = d3.select("svg"),
  width = +svg.attr("width")
svg.attr('style', 'background:rgb(43, 34, 35)')
var tootip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0.0)

d3.json("./map2.json", function (error, cData) {
  if (error) throw error
  mainPic({
    cData
  })
})

//主图
function mainPic ({
  cData
}) {
  var projection = d3.geoMercator()
    .scale((width - 3) / (2 * Math.PI))
    .translate([width / 2, width / 2]);
  var path = d3.geoPath()
    .projection(projection);
  d3.json("./map.json", function (error, wData) {
    if (error) throw error;
    var groups = svg.append('g');
    groups.selectAll("path")
      .data(wData.features)
      .enter()
      .append("path")
      .attr("class", 'country')
      .style('fill', (country) => {
        if (warnData[country.id]) {
          if (cData[country.properties.name]) {
            // 首先如果有记载位置先获取,否则计算中心点
            info({ xy: projection(cData[country.properties.name]), country, groups, warnData: warnData[country.id] })
          } else {
            info({ xy: path.centroid(country), country, groups, warnData: warnData[country.id] })
          }
        }
        return warnData[country.id] || '#fff'
      })
      .style('stroke', '#eee')
      .attr("d", path)
  });
}

//添加部件
function info ({ xy, country, groups, warnData }) {
  let xyData = xy
  let gTag = groups.append("g").attr('class', 'tag')
  let circle = gTag.append("circle")
    .attr('cx', xyData[0])
    .attr('cy', xyData[1])
    .attr('r', 5)
    .attr('fill', '#fff')
    .attr('stroke', '#999')
    .attr('style', 'cursor:pointer')
    .on('mouseover', d => {
      console.log(circle)
      circle.attr('stroke', 'red')
      tootip.html(`<div>
<div>${country.properties.name}</div>
<div>攻击者数量: <span style="color: ${warnData};">???</span></div>
<div>攻击占比: <span style="color: ${warnData};">???</span></div>
      </div>`).style('left', d3.event.pageX + 20 + 'px').style('top', d3.event.pageY + 20 + 'px').style('opacity', 1.0).style('z-index', '1000')
    })
    .on("mouseout", d => {
      circle.attr('stroke', '#999')
      tootip.style('opacity', 0).style('z-index', '-1000')
    })

  // gTag.append("circle")
  //   .attr('cx', xyData[0])
  //   .attr('cy', xyData[1])
  //   .attr('r', 6)
  //   .attr('fill', 'none')
  //   .attr('stroke', '#333')
  // gTag.append("circle")
  //   .attr('cx', xyData[0])
  //   .attr('cy', xyData[1])
  //   .attr('r', 9)
  //   .attr('fill', 'none')
  //   .attr('stroke', '#333')
  // gTag.append("path")
  //   .attr('d', `M${xyData[0]} ${xyData[1]} L${xyData[0]} ${xyData[1] - 100} Z`)
  //   .attr('stroke', '#333')
  // gTag.append('rect')
  //   .attr('x', xyData[0] - country?.properties?.name?.length * 5)
  //   .attr('y', xyData[1] - 100 - 30)
  //   .attr('width', country?.properties?.name?.length * 10)
  //   .attr('height', 30)
  //   .attr('fill', '#00000066')
  //   .attr('rx', 5)
  //   .attr('ry', 5)
  // gTag.append("text")
  //   .attr('x', xyData[0])
  //   .attr('y', xyData[1] - 100 - 10)
  //   .attr('text-anchor', 'middle')
  //   .attr("fill", '#fff')
  //   .style("font-size", '14px')
  //   .text(country?.properties?.name)
}