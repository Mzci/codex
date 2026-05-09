import { EventBus } from './event-bus.js';
import { IndexedDBStore } from '../storage/indexed-db.js';
import { UserManager } from '../services/user-manager.js';
import { FileSystem } from '../services/filesystem.js';
import { NetworkService } from '../services/network-service.js';
import { WindowManager } from '../components/window-manager.js';
import { AppManager } from '../components/app-manager.js';
import { baseApps } from '../apps/base-apps.js';

export class WebOS {
  constructor(root) { this.root = root; this.events = new EventBus(); }
  async boot() {
    this.root.innerHTML = `<main class="desktop"><section id="desktop"></section><footer class="taskbar"><button id="startBtn">Start</button><div id="tasks"></div><div id="clock"></div></footer><aside id="startMenu" class="start-menu hidden"></aside><section id="notify" class="notify"></section></main>`;
    const db = new IndexedDBStore();
    const filesystem = new FileSystem(db, this.events); await filesystem.seed();
    const userManager = new UserManager(this.events); userManager.restore() || await userManager.register('admin', 'admin');
    const network = new NetworkService(this.events);
    const wm = new WindowManager(this.events, this.root.querySelector('#desktop'));
    const api = this.api = { events: this.events, filesystem, userManager, network, storage: db };
    const appManager = new AppManager({ events: this.events, wm, fs: filesystem, api: null });
    api.appManager = appManager; api.windowManager = wm; api.network = network; api.apiVersion = '1.0.0'; appManager.api = api;

    baseApps.forEach((a) => appManager.register(a));
    this.buildStartMenu(baseApps, appManager);
    this.attachSystemUI();
    appManager.launch('files');
    setInterval(() => this.root.querySelector('#clock').textContent = new Date().toLocaleTimeString(), 1000);
  }
  buildStartMenu(apps, appManager) {
    const m = this.root.querySelector('#startMenu');
    m.innerHTML = apps.map((a) => `<button data-app="${a.id}">${a.name}</button>`).join('');
    m.onclick = (e) => { const id = e.target.dataset.app; if (id) appManager.launch(id); m.classList.add('hidden'); };
    this.root.querySelector('#startBtn').onclick = () => m.classList.toggle('hidden');
  }
  attachSystemUI() {
    this.events.on('onAppInstall', (app) => this.notify(`Installed: ${app.name}`));
    this.events.on('onUserLogin', (u) => this.notify(`Welcome ${u.username}`));
    this.events.on('onFileChange', ({ action }) => this.networkSync({ action }));
  }
  async networkSync(payload) { await this.api.network.sync(payload); }
  notify(message) { const n = this.root.querySelector('#notify'); n.innerHTML = `<div>${message}</div>`; setTimeout(() => n.innerHTML = '', 2500); }
}
