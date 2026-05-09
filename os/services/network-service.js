import { LocalStore } from '../storage/local-store.js';

export class NetworkService {
  constructor(events) { this.events = events; }
  async sync(payload) {
    const queue = LocalStore.get('cloudQueue', []);
    queue.push({ at: Date.now(), payload });
    LocalStore.set('cloudQueue', queue);
    return { ok: true, mode: 'mock-cloud' };
  }
}
