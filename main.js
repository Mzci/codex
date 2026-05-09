import { WebOS } from './os/core/webos.js';

const root = document.getElementById('app');
const webos = new WebOS(root);
await webos.boot();

window.OS = webos.api;
