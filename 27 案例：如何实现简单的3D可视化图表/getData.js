/*
 * @LastEditTime: 2021-04-27 00:04:34
 * @LastEditors: jinxiaojian
 */
const getNum = () => Math.floor(Math.random() * 10)*10
function getData () {
  let arr = []
  for (let i = 0; i < 50; i++) {
    arr.push({
      data: i,
      arr: [
        { type: 'TA0002', val: getNum(), color: '#FF6F2E' },
        { type: 'TA0003', val: getNum(), color: '#F14E10' },
        { type: 'TA0004', val: getNum(), color: '#DE2F00' },
        { type: 'TA0005', val: getNum(), color: '#C20000' },
        { type: 'TA0011', val: getNum(), color: '#A20000' },
        { type: 'TA0040', val: getNum(), color: '#810000' },
      ]
    })
  }
  return JSON.stringify(arr)
}
getData()

