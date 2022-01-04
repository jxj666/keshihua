/*
 * @LastEditTime: 2022-01-04 15:30:29
 * @LastEditors: jinxiaojian
 */
let warnData = {
  "JPN": { color: 'rgb(219, 74, 73)', count: '2132', pixel: '66' },
  "CHN": { color: 'rgb(219, 74, 73)', count: '223', pixel: '22' },
  "USA": { color: 'rgb(225, 146, 136)', count: '123', pixel: '3' },
  "IND": { color: 'rgb(245, 195, 188)', count: '123', pixel: '3' },
  "DEU": { color: 'rgb(245, 195, 188)', count: '13', pixel: '2.2' },
  "FRA": { color: 'rgb(245, 195, 188)', count: '12', pixel: '2.1' },
}
var svg = d3.select("svg"),
  width = svg.attr("width"),
  height = svg.attr("height")

let gTag

svg.attr('style', 'background:rgb(43, 34, 35)')
var tootip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0.0)
var projection = d3.geoMercator()
  .scale((width - 3) / (2 * Math.PI))
  .translate([width / 2, width / 2]);
var path = d3.geoPath()
  .projection(projection);

//各国对应中心json,比计算中心更准确
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
  //地图json,符合法规,无领土缺失
  d3.json("./map.json", function (error, wData) {
    if (error) throw error;
    var groups = svg.append('g');
    var countries = groups.selectAll("path")
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
        return warnData[country.id]?.color || '#fff'
      })
      .style('stroke', 'background:rgb(43, 34, 35)')
      .attr("d", path)
    set({ countries, path })
  });
}

//添加部件
function info ({ xy, country, groups, warnData }) {
  let xyData = xy
  gTag = groups.append("g").attr('class', 'tag')
  let circle = gTag.append("circle")
    .attr('cx', xyData[0])
    .attr('cy', xyData[1])
    .attr('r', 5)
    .attr('fill', '#fff')
    .attr('stroke', '#999')
    .attr('style', 'cursor:pointer')
    .on('mouseover', d => {
      circle.attr('stroke', 'red')
      tootip.html(`<div>
<div>${country.properties.name}</div>
<div>攻击者数量: <span style="">${warnData.count}</span></div>
<div>攻击占比: <span style="">${warnData.pixel}</span></div>
      </div>`).style('left', d3.event.pageX + 20 + 'px').style('top', d3.event.pageY + 20 + 'px').style('opacity', 1.0).style('z-index', '1000')
    })
    .on("mouseout", d => {
      circle.attr('stroke', '#999')
      tootip.style('opacity', 0).style('z-index', '-1000')
    })
}

function set ({
  countries,
  path
}) {
  return null
  // var initTran = projection.translate()
  // var initScale = projection.scale()
  // console.log(initTran, initScale)
  // var zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", d => {
  //   console.log(d3.event.transform, d3.sourceEvent?.deltaY)
  //   projection.translate([
  //     // initTran[0],

  //     initTran[0] + d3.event.transform['x'] / 2,
  //     // initTran[1],

  //     initTran[1] + d3.event.transform['y'] / 2
  //   ])
  //   projection.scale(initScale * d3.event.transform['k'])
  //   countries.attr('d', path)
  // })
  // svg.append('rect').attr('class', 'overlay').attr('x', 0).attr('y', 0).attr('width', width).attr('height', height).call(zoom)
}