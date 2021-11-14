/*
 * @LastEditTime: 2021-10-28 14:59:53
 * @LastEditors: jinxiaojian
 */

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const nums = [55, 33, 88];
context.fillStyle = 'red';
nums.forEach(
  (x, i) => {
    context.beginPath();
    context.rect(i * 30 + 10, 0, 20, x);
    context.fill();
  }
)
