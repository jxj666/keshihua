/*
 * @LastEditTime: 2021-07-12 23:28:56
 * @LastEditors: jinxiaojian
 */

const isSea = require('is-sea');

let map = []

for (let x = 180; x >= -180; x -=3) {
  for (let y = 90; y >= -90; y -= 3) {
    map.push({
      x,
      y,
      sea: isSea(y, x)
    })
  }
}
fs.writeFile('message.txt', JSON.stringify(map), (err) => {
  if (err) throw err;
  console.log('It\'s saved!');
});
