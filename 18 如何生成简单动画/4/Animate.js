/*
 * @LastEditTime: 2021-04-21 00:01:35
 * @LastEditors: jinxiaojian
 */

import {Timing} from './Timing.js';

export class Animator {
  constructor({duration, iterations}) {
    this.timing = {duration, iterations};
  }

  animate(target, update) {
    // let frameIndex = 0;
    const timing = new Timing(this.timing);
    // console.log(timing)
    return new Promise((resolve) => {
      function next() {
        // if(update({target, frameIndex, timing}) !== false && !timing.isFinished) {
        if(update({target, timing}) !== false && !timing.isFinished) {
          requestAnimationFrame(next);
        } else {
          resolve(timing);
        }
        // frameIndex++;
      }
      next();
    });
  }
}