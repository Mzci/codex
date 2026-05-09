export class WindowManager {
  constructor(events, desktop) { this.events = events; this.desktop = desktop; this.z = 10; this.windows = new Map(); }
  createWindow({ id, title, render, x = 60, y = 60, w = 520, h = 360 }) {
    const el = document.createElement('section');
    el.className = 'window'; el.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${++this.z}`;
    el.innerHTML = `<header class="win-head"><strong>${title}</strong><div><button data-a="min">_</button><button data-a="max">□</button><button data-a="close">×</button></div></header><div class="win-body"></div><div class="resize"></div>`;
    const body = el.querySelector('.win-body');
    render(body);
    this.desktop.appendChild(el);
    this.windows.set(id, { id, title, el, minimized: false, maximized: false });
    this.bind(el, id);
    return id;
  }
  bind(el, id) {
    const head = el.querySelector('.win-head');
    head.onmousedown = (e) => {
      this.focus(id); const ox = e.clientX - el.offsetLeft, oy = e.clientY - el.offsetTop;
      const move = (m) => { el.style.left = `${m.clientX - ox}px`; el.style.top = `${m.clientY - oy}px`; };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', () => document.removeEventListener('mousemove', move), { once: true });
    };
    el.querySelector('[data-a="close"]').onclick = () => el.remove();
    el.querySelector('[data-a="min"]').onclick = () => { el.style.display = 'none'; this.windows.get(id).minimized = true; };
    el.querySelector('[data-a="max"]').onclick = () => {
      const win = this.windows.get(id); win.maximized = !win.maximized;
      el.style.inset = win.maximized ? '0' : ''; if (!win.maximized) el.style.cssText += 'width:520px;height:360px;';
    };
    const rz = el.querySelector('.resize');
    rz.onmousedown = (e) => {
      e.stopPropagation(); const sw = el.offsetWidth, sh = el.offsetHeight, sx = e.clientX, sy = e.clientY;
      const move = (m) => { el.style.width = `${Math.max(280, sw + m.clientX - sx)}px`; el.style.height = `${Math.max(180, sh + m.clientY - sy)}px`; };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', () => document.removeEventListener('mousemove', move), { once: true });
    };
    el.onmousedown = () => this.focus(id);
  }
  focus(id) { const w = this.windows.get(id); if (!w) return; w.el.style.zIndex = ++this.z; this.events.emit('onWindowFocus', w); }
}
