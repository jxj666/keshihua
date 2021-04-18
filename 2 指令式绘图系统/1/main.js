/*
 * @LastEditTime: 2021-03-24 23:56:49
 * @LastEditors: jinxiaojian
 */

const canvas = document.querySelector('canvas');

const context = canvas.getContext('2d');

const rectSize = [100, 100];
context.fillStyle = 'red';
context.beginPath();
// context.rect(0.5 * canvas.width, 0.5 * canvas.height, ...rectSize);
context.rect(0.5 * (canvas.width - rectSize[0]), 0.5 * (canvas.height - rectSize[1]), ...rectSize);
context.fill();