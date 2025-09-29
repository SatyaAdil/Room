type EventCallback = (...args: any[]) => any;

export default class EventEmitter {
  private callbacks: { [key: string]: EventCallback[] };

  constructor() {
    this.callbacks = {};
  }

  on(name: string, callback: EventCallback) {
    if (!(this.callbacks[name] instanceof Array)) {
      this.callbacks[name] = [];
    }
    this.callbacks[name].push(callback);
    return this;
  }

  off(name: string, callback?: EventCallback) {
    if (this.callbacks[name] instanceof Array) {
      if (callback) {
        this.callbacks[name] = this.callbacks[name].filter(cb => cb !== callback);
      } else {
        delete this.callbacks[name];
      }
    }
    return this;
  }

  trigger(name: string, ...args: any[]) {
    if (this.callbacks[name] instanceof Array) {
      this.callbacks[name].forEach(cb => cb(...args));
    }
  }
}
