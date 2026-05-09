export class FileSystem {
  constructor(db, events) { this.db = db; this.events = events; }
  async seed() {
    const root = await this.db.get('files', '/');
    if (!root) {
      const defaults = [
        { path: '/', name: '/', type: 'folder', parent: null },
        { path: '/home', name: 'home', type: 'folder', parent: '/' },
        { path: '/home/readme.txt', name: 'readme.txt', type: 'text', parent: '/home', content: 'Welcome to WebOS' }
      ];
      for (const i of defaults) await this.db.put('files', i);
    }
  }
  async list(parent = '/') { return (await this.db.all('files')).filter((f) => f.parent === parent); }
  async get(path) { return this.db.get('files', path); }
  async create(path, type = 'text', content = '') {
    const parts = path.split('/').filter(Boolean); const name = parts.at(-1); const parent = '/' + parts.slice(0, -1).join('/');
    const node = { path, name, type, parent: parent || '/', content };
    await this.db.put('files', node); this.events.emit('onFileChange', { action: 'create', node }); return node;
  }
  async write(path, content) { const f = await this.get(path); f.content = content; await this.db.put('files', f); this.events.emit('onFileChange', { action: 'write', node: f }); }
  async remove(path) { await this.db.delete('files', path); this.events.emit('onFileChange', { action: 'delete', path }); }
}
