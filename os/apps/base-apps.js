export const baseApps = [
  { id: 'files', name: 'File Explorer', run: async (root, OS) => {
    const refresh = async () => { const items = await OS.filesystem.list('/home'); root.innerHTML = `<ul>${items.map(i => `<li draggable="true" data-path="${i.path}">${i.name}</li>`).join('')}</ul>`; };
    await refresh(); OS.events.on('onFileChange', refresh);
  }},
  { id: 'editor', name: 'Text Editor', run: async (root, OS, p) => {
    const file = p.path || '/home/readme.txt'; const node = await OS.filesystem.get(file);
    root.innerHTML = `<textarea style="width:100%;height:85%">${node?.content || ''}</textarea><button>Save</button>`;
    root.querySelector('button').onclick = async () => OS.filesystem.write(file, root.querySelector('textarea').value);
  }},
  { id: 'browser', name: 'Browser', run: (root) => { root.innerHTML = '<iframe sandbox="allow-same-origin allow-scripts allow-forms" src="https://example.com" style="width:100%;height:100%;border:0"></iframe>'; }},
  { id: 'terminal', name: 'Terminal', run: (root, OS) => {
    root.innerHTML = '<div class="term-log"></div><input class="term-input" placeholder="help" />';
    const log = root.querySelector('.term-log'); const input = root.querySelector('.term-input'); let cwd = '/home';
    const print = (t) => log.innerHTML += `<div>${t}</div>`;
    const commands = {
      help: () => print('ls cd mkdir rm open install app help'),
      ls: async () => print((await OS.filesystem.list(cwd)).map(i => i.name).join(' ')),
      mkdir: async (n) => OS.filesystem.create(`${cwd}/${n}`, 'folder'),
      rm: async (n) => OS.filesystem.remove(`${cwd}/${n}`),
      cd: (p) => { cwd = p.startsWith('/') ? p : `${cwd}/${p}`; print(cwd); },
      open: (id) => OS.appManager.launch(id),
      install: () => OS.appManager.installFromJSON({ id: 'hello', name: 'Hello App', run: (r) => r.innerHTML = '<h2>Installed dynamically</h2>' }),
      app: () => print([...OS.appManager.registry.keys()].join(','))
    };
    input.onkeydown = async (e) => { if (e.key !== 'Enter') return; const [c, a] = input.value.split(' '); await (commands[c]?.(a) ?? print('unknown')); input.value = ''; };
  }},
  { id: 'settings', name: 'Settings', run: (root, OS) => {
    root.innerHTML = '<button id="theme">Toggle Theme</button>';
    root.querySelector('#theme').onclick = () => document.body.classList.toggle('light');
    OS.network.sync({ type: 'settings', light: document.body.classList.contains('light') });
  }},
  { id: 'paint', name: 'Paint', run: (root) => {
    root.innerHTML = '<canvas width="500" height="300" style="border:1px solid #555"></canvas>';
    const c = root.querySelector('canvas'), x = c.getContext('2d'); let d = false;
    c.onmousedown = () => d = true; c.onmouseup = () => d = false;
    c.onmousemove = (e) => { if (!d) return; x.fillRect(e.offsetX, e.offsetY, 2, 2); };
  }}
];
