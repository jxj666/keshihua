/*
 * @LastEditTime: 2021-10-28 13:00:45
 * @LastEditors: jinxiaojian
 */
function deepCopy (source, zindex) {
  if (!zindex) zindex = 0
  if (zindex > 5) return
  if (!isObject(source)) return source; //如果不是对象的话直接返回
  let target = Array.isArray(source) ? [] : {} //数组兼容
  for (var k in source) {
    if (source.hasOwnProperty(k)) {
      if (typeof source[k] === 'object') {
        target[k] = deepCopy(source[k], zindex + 1)
      } else {
        target[k] = source[k]
      }
    }
  }
  return target
}

function isObject (obj) {
  return typeof obj === 'object' && obj !== null
}
