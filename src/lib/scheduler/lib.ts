import { Lazy } from '../common';

class NextTickScheduler {
  private callbacks = new Set<Lazy>();

  schedule(callback: Lazy) {
    this.callbacks.add(callback);
    if (this.callbacks.size === 1) {
      Promise.resolve().then(() => this.flush());
    }
  }

  flush() {
    for (const callback of this.callbacks.values()) {
      callback();
    }
    this.callbacks.clear();
  }
}

class TimeoutScheduler {
  schedule(callback: Lazy, ms: number) {
    return window.setTimeout(callback, ms);
  }

  clear(timeoutID: number | undefined) {
    window.clearTimeout(timeoutID);
  }
}

class TestTimeoutScheduler implements TimeoutScheduler {
  private records = new Set<{
    callback: Lazy;
    ms: number;
    timeoutID: number;
  }>();

  private numberUID = (() => {
    let id = 0;
    return () => id++;
  })();

  private find(ms: number) {
    return Array.from(this.records.values()).find((el) => el.ms === ms);
  }

  exec(ms: number) {
    const record = this.find(ms);
    if (record) {
      record.callback();
      this.records.delete(record);
    }
  }

  isPresent(ms: number) {
    return !!this.find(ms);
  }

  schedule(callback: Lazy, ms: number) {
    const timeoutID = this.numberUID();
    this.records.add({ callback, ms, timeoutID });
    return timeoutID;
  }

  clear(timeoutID: number | undefined) {
    const record = Array.from(this.records.values()).find(
      (el) => el.timeoutID === timeoutID,
    );
    if (record) {
      this.records.delete(record);
    }
  }
}

export const testTimeoutScheduler = new TestTimeoutScheduler();
export const timeoutScheduler = new TimeoutScheduler();

export const nextTickScheduler = new NextTickScheduler();
