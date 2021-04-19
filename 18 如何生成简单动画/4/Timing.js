/*
 * @LastEditTime: 2021-04-20 00:00:11
 * @LastEditors: jinxiaojian
 */

export class Timing {
  constructor({duration, iterations = 1} = {}) {
    this.startTime = Date.now();
    this.duration = duration;
    this.iterations = iterations;
  }

  get time() {
    return Date.now() - this.startTime;
  }

  get p() {
    const progress = Math.min(this.time / this.duration, this.iterations);
    return this.isFinished ? 1 : progress % 1;
  }

  get isFinished() {
    return this.time / this.duration >= this.iterations;
  }
}