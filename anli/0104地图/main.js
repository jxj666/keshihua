/*
 * @LastEditTime: 2022-01-05 13:45:12
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

svg.attr('style', 'background:rgb(43, 34, 35)')
//建立信息tip
var tootip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0.0)
// 定义投影模式
var projection = d3.geoMercator()
  .scale((width - 3) / (2 * Math.PI))
  .translate([width / 2, width / 2])
  .rotate([-10, 0])
//建立地图path
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
    // var pick = svg.append('g')
    var groups = svg.append('g');
    var countries = groups.selectAll("path")
      .data(wData.features)
      .enter()
      .append("path")
      .attr("class", 'country')
      .style('fill', (country) => {
        if (warnData[country.id]) {
          if (cData[country.properties.name]) {
            // 首先如果有记载中心位置先获取,否则计算中心点
            info({ xy: projection(cData[country.properties.name]), country, groups, warnData: warnData[country.id] })
          } else {
            info({ xy: path.centroid(country), country, groups, warnData: warnData[country.id] })
          }
        }
        return warnData[country.id]?.color || '#fff'
      })
      .style('stroke', 'background:rgb(43, 34, 35)')
      .attr("d", path)
    set({ groups })
  });
}

//添加信息部件
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

//缩放控制
function set ({
  groups,
  // pick
}) {
  // let transform = {
  //   x: 0,
  //   y: 0,
  //   k: 1
  // }
  var zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", d => {
    // console.log(d3.event.type)
    let transform = d3.event.transform
    groups.style('transform', `translate(${transform['x']}px,${transform['y']}px) scale(${transform['k']})`)
  })
  svg.call(zoom)
  // let btn = svg.append('g')
  // btn.append("circle")
  //   .attr('cx', width - 20)
  //   .attr('cy', height - 20)
  //   .attr('r', 10)
  //   .attr('fill', '#fff')
  //   .attr('stroke', '#eee').attr('style', 'cursor:pointer')
  //   .on("click", d => {
  //     groups.style('transform', `translate(${transform.x}px,${transform.y}px) scale(${transform.k / 0.9})`)
  //     transform = {
  //       ...transform,
  //       k: transform.k / 0.9
  //     }
  //   })

  // btn.append("circle")
  //   .attr('cx', width - 20)
  //   .attr('cy', height - 50)
  //   .attr('r', 10)
  //   .attr('fill', '#fff')
  //   .attr('stroke', '#eee').attr('style', 'cursor:pointer')
  //   .on("click", d => {
  //     groups.style('transform', `translate(${transform.x}px,${transform.y}px) scale(${transform.k / 1.1})`)
  //     transform = {
  //       ...transform,
  //       k: transform.k / 1.1
  //     }
  //   })

}