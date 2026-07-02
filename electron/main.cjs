// Electron main process for Airport Cup.
// Runs the built Next.js server IN-PROCESS (no child process / no binary-path
// juggling) and loads it in a native window. Works from the repo (`.next` build)
// and from a packaged app (Next + node_modules shipped unpacked; DB as a resource).

const { app, BrowserWindow, shell } = require("electron");
const http = require("node:http");
const net = require("node:net");
const path = require("node:path");
const fs = require("node:fs");

const isPackaged = app.isPackaged;
// In the repo, app dir is the project root. When packaged, files live unpacked
// under resources/app.asar.unpacked (asar:false here, so just resourcesPath/app).
const APP_DIR = isPackaged ? path.join(process.resourcesPath, "app") : path.join(__dirname, "..");

// Point the DB loader at the football database (shipped as an unpacked resource
// when packaged; the repo copy in dev).
const PACKAGED_DB = path.join(process.resourcesPath, "open-football-database", "data");
const REPO_DB = path.join(APP_DIR, "data", "open-football-database", "data");
process.env.FOOTBALL_DB_DIR = isPackaged && fs.existsSync(PACKAGED_DB) ? PACKAGED_DB : REPO_DB;
process.env.NODE_ENV = "production";

function findFreePort(start = 34120) {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.on("error", () => resolve(findFreePort(start + 1)));
    srv.listen(start, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
    srv.on("error", reject);
  });
}

async function startNext(port) {
  const next = require("next");
  const nextApp = next({ dev: false, dir: APP_DIR });
  await nextApp.prepare();
  const handle = nextApp.getRequestHandler();
  await new Promise((resolve) => {
    http.createServer((req, res) => handle(req, res)).listen(port, "127.0.0.1", resolve);
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: "#0b0e14",
    show: false,
    title: "Airport Cup",
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });

  // External links open in the real browser, not inside the app window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  const port = await findFreePort();
  try {
    console.log(`[airport-cup] starting Next on 127.0.0.1:${port} (db: ${process.env.FOOTBALL_DB_DIR})`);
    await startNext(port);
    await win.loadURL(`http://127.0.0.1:${port}/discover`);
    console.log(`[airport-cup] window loaded: http://127.0.0.1:${port}/discover`);
  } catch (err) {
    await win.loadURL(
      "data:text/html," +
        encodeURIComponent(
          `<body style="font-family:sans-serif;background:#0b0e14;color:#eef;padding:40px">
             <h1>Airport Cup failed to start</h1><pre>${String(err && err.stack)}</pre>
             <p>Run <code>npm run build</code> first, then relaunch.</p></body>`,
        ),
    );
  }
  win.show();
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
