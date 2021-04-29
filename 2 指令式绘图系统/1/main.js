/*
 * @LastEditTime: 2021-04-30 00:14:06
 * @LastEditors: jinxiaojian
 */

const canvas = document.querySelector('canvas');

const context = canvas.getContext('2d');

const rectSize = [100, 100];
context.fillStyle = 'red';
context.beginPath();
context.rect(0.5 * (canvas.width - rectSize[0]), 0.5 * (canvas.height - rectSize[1]), ...rectSize);
context.fill();