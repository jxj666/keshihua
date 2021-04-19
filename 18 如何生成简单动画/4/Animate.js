/*
 * @LastEditTime: 2021-04-20 00:21:32
 * @LastEditors: jinxiaojian
 */

import {Timing} from './timing.js';

export class Animator {
  constructor({duration, iterations}) {
    this.timing = {duration, iterations};
  }

  animate(target, update) {
    let frameIndex = 0;
    const timing = new Timing(this.timing);
    // console.log(timing)
    return new Promise((resolve) => {
      function next() {
        if(update({target, frameIndex, timing}) !== false && !timing.isFinished) {
          requestAnimationFrame(next);
        } else {
          resolve(timing);
        }
        frameIndex++;
      }
      next();
    });
  }
}