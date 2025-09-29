export default class EventEmitter {
  private listeners: { [key: string]: Function[] } = {}

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  off(event: string, callback?: Function) {
    if (!this.listeners[event]) return

    if (!callback) {
      // kalau callback tidak diberikan → hapus semua listener event ini
      delete this.listeners[event]
    } else {
      this.listeners[event] = this.listeners[event].filter(fn => fn !== callback)
    }
  }

  trigger(event: string, ...args: any[]) {
    if (!this.listeners[event]) return
    this.listeners[event].forEach(callback => callback(...args))
  }
}
