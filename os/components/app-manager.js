export class AppManager {
  constructor({ events, wm, fs, api }) { this.events = events; this.wm = wm; this.fs = fs; this.api = api; this.registry = new Map(); }
  register(app) { this.registry.set(app.id, app); }
  installFromJSON(json) { this.register(json); this.events.emit('onAppInstall', json); }
  launch(id, params = {}) {
    const app = this.registry.get(id); if (!app) throw new Error('App not installed');
    return this.wm.createWindow({ id: `${id}-${Date.now()}`, title: app.name, render: (root) => app.run(root, this.api, params) });
  }
}
