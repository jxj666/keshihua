/*
 * @LastEditTime: 2021-03-24 23:58:57
 * @LastEditors: jinxiaojian
 */

const canvas = document.querySelector('canvas');

const context = canvas.getContext('2d');

const rectSize = [100, 100];
context.fillStyle = 'red';
context.beginPath();
context.save(); // 暂存状态
context.translate(-0.5 * rectSize[0], -0.5 * rectSize[1]);
context.rect(0.5 * canvas.width, 0.5 * canvas.height, ...rectSize);
// context.translate(0.5 * rectSize[0], 0.5 * rectSize[1]);
context.restore(); // 恢复状态
context.fill();