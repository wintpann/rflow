import { Lazy } from '../common';

class Scheduler {
  callbacks = new Set<Lazy>();

  schedule(callback: Lazy) {
    this.callbacks.add(callback);
    if (this.callbacks.size === 1) {
      Promise.resolve().then(() => this.flush());
    }
  }

  isScheduled(callback: Lazy) {
    return this.callbacks.has(callback);
  }

  flush() {
    for (const callback of this.callbacks.values()) {
      callback();
    }
    scheduler.callbacks.clear();
  }
}

export const scheduler = new Scheduler();
