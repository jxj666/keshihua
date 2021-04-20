/*
 * @LastEditTime: 2021-04-21 00:25:35
 * @LastEditors: jinxiaojian
 */

import {Timing} from './Timing.js';

export class Animator {
  constructor({duration, iterations,easing}) {
    this.timing = {duration, iterations,easing};
  }

  animate(target, update) {
    // let frameIndex = 0;
    const timing = new Timing(this.timing);
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