export default class EventEmitter {
  private callbacks: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
    return this;
  }

  off(event: string, callback?: Function) {
    if (!this.callbacks[event]) return this;
    
    if (callback) {
      this.callbacks[event] = this.callbacks[event].filter(
        cb => cb !== callback
      );
    } else {
      delete this.callbacks[event];
    }
    return this;
  }

  trigger(event: string, ...args: any[]) {
    if (!this.callbacks[event]) return this;
    
    this.callbacks[event].forEach(callback => {
      callback(...args);
    });
    return this;
  }
}