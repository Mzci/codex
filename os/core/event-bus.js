export class EventBus {
  constructor() { this.listeners = new Map(); }
  on(event, cb) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(cb);
    return () => this.listeners.get(event)?.delete(cb);
  }
  emit(event, payload) { this.listeners.get(event)?.forEach((cb) => cb(payload)); }
}
