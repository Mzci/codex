# WebOS (Browser Operating System)

Sistema operativo web modular con escritorio, ventanas, VFS persistente, apps base, terminal real sobre el VFS, multiusuario y sincronización mock-cloud.

## Ejecutar

```bash
python3 -m http.server 8080
```

Abrir `http://localhost:8080`.

## Credenciales por defecto

- usuario: `admin`
- contraseña: `admin`

## Estructura

- `index.html` + `main.js`: bootstrap.
- `os/core`: núcleo, eventos y lifecycle.
- `os/components`: gestores UI (ventanas y apps).
- `os/services`: filesystem, usuarios y red/sync.
- `os/storage`: LocalStorage + IndexedDB.
- `os/apps`: apps instaladas/registradas.
- `ui/styles.css`: tema oscuro/claro responsive.

## Funcionalidades implementadas

- Desktop + taskbar + start menu + notificaciones.
- Window manager draggable/resizable/min/max/focus-zindex.
- VFS con operaciones `create/list/get/write/remove` y persistencia en IndexedDB.
- Terminal con comandos: `help`, `ls`, `cd`, `mkdir`, `rm`, `open`, `install`, `app`.
- Apps base: explorer, editor, browser sandboxed iframe, terminal, settings, paint.
- API global `window.OS`:

```js
window.OS = {
  events,
  filesystem,
  userManager,
  network,
  storage,
  appManager,
  windowManager,
  apiVersion
}
```

- Eventos de sistema: `onFileChange`, `onAppInstall`, `onUserLogin`, `onWindowFocus`.
- Instalación dinámica de apps desde JSON (`appManager.installFromJSON`).
- Base para scripting/autogeneración de apps mediante API global.
- Sincronización cloud mock persistida en `localStorage.cloudQueue`.

## Extensión

Podés instalar apps en runtime:

```js
OS.appManager.installFromJSON({
  id: 'clock-plus',
  name: 'Clock Plus',
  run: (root) => { root.innerHTML = `<h3>${new Date().toISOString()}</h3>`; }
});
OS.appManager.launch('clock-plus');
```
