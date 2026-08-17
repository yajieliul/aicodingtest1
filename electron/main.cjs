// 贪吃蛇桌面版 —— Electron 主进程（CommonJS）
// 注释说明：
//   因为本 package.json 声明了 "type": "module"，为了让主进程稳定地以 CommonJS
//   方式加载（Electron 对 ESM 主进程支持依赖版本），这里使用显式 .cjs 后缀。
// 职责：创建应用窗口，并加载 Vite 构建后的静态产物（dist/index.html）。

const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 860,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // 加载打包后的静态页面（Vite base 已设为相对路径，file:// 下资源可正常解析）
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))

  // 隐藏默认菜单，观感更接近独立游戏
  win.setMenuBarVisibility(false)
}

app.whenReady().then(() => {
  createWindow()
  // macOS：点击 Dock 图标且无窗口时重建
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Windows/Linux：所有窗口关闭即退出；macOS 遵循平台习惯留在 Dock
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
