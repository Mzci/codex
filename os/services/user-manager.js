import { LocalStore } from '../storage/local-store.js';

export class UserManager {
  constructor(events) { this.events = events; this.current = null; }
  users() { return LocalStore.get('users', []); }
  async register(username, password) {
    const users = this.users();
    if (users.find((u) => u.username === username)) throw new Error('User exists');
    users.push({ username, password, settings: { theme: 'dark' } });
    LocalStore.set('users', users);
    return this.login(username, password);
  }
  async login(username, password) {
    const user = this.users().find((u) => u.username === username && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    this.current = user;
    LocalStore.set('session', { username });
    this.events.emit('onUserLogin', user);
    return user;
  }
  restore() {
    const s = LocalStore.get('session');
    if (!s) return null;
    this.current = this.users().find((u) => u.username === s.username) || null;
    return this.current;
  }
  logout() { this.current = null; LocalStore.del('session'); }
}
