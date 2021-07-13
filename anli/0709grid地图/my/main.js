/*
 * @LastEditTime: 2021-07-13 10:53:28
 * @LastEditors: jinxiaojian
 */

const warnData = [
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

function getPoint (point) {
  let xy = point.geometry.coordinates
  return { x: xy[0] - xy[0] % 2, y: xy[1] - xy[1] % 2, warn: true, label: point.label }
}

const svgroot = document.querySelector('#mySvg');
function draw (parent, node) {
  const { x, y, sea, warn, label } = node;
  if (x === 180 || x === -180 || y === 90 || y === -90) return
  const r = 2
  let fillStyle = sea ? 'white' : 'gray'
  if (warn) fillStyle = 'red'
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', (x + 200) * 3);
  circle.setAttribute('cy', (-y + 100) * 3);
  circle.setAttribute('r', r);
  circle.setAttribute('fill', fillStyle);
  circle.setAttribute('title', label);
  parent.appendChild(circle);
}

map.forEach(x => {
  draw(svgroot, x)
})

let warnMap = []
warnData.forEach(x => {
  warnMap.push(getPoint(x))
})
warnMap.forEach(x => {
  draw(svgroot, x)
})

