import { DIRECTION } from './config.js'

/**
 * 输入控制模块：把键盘按键和触控按钮映射为游戏方向，交给回调处理。
 */

const KEYMAP = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  KeyW: 'UP',
  KeyS: 'DOWN',
  KeyA: 'LEFT',
  KeyD: 'RIGHT',
  w: 'UP',
  s: 'DOWN',
  a: 'LEFT',
  d: 'RIGHT',
  W: 'UP',
  S: 'DOWN',
  A: 'LEFT',
  D: 'RIGHT'
}

/**
 * 绑定全局输入。
 * @param {object} handlers
 * @param {Function} handlers.onDirection  @param 方向名 'UP'|'DOWN'|'LEFT'|'RIGHT'
 * @param {Function} [handlers.onPause] 空格/回车暂停
 * @param {Function} [handlers.onRestart] 重开按钮
 */
export function bindControls({ onDirection, onPause, onRestart }) {
  window.addEventListener('keydown', (e) => {
    const name = e.code
    if (['Space', 'Enter', 'KeyP'].includes(name)) {
      e.preventDefault()
      onPause && onPause()
      return
    }
    const dirName = KEYMAP[name]
    if (dirName) {
      e.preventDefault()
      onDirection && onDirection(DIRECTION[dirName])
    }
  })

  // 触控方向键与 W/A/S/D 辅助键
  document.querySelectorAll('[data-dir]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const dirName = btn.getAttribute('data-dir')
      onDirection && onDirection(DIRECTION[dirName])
    })
    // 阻止长按触发右键菜单/多选
    btn.addEventListener('contextmenu', (e) => e.preventDefault())
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault()
      const dirName = btn.getAttribute('data-dir')
      onDirection && onDirection(DIRECTION[dirName])
    })
  })

  const restartBtn = document.getElementById('restartBtn')
  if (restartBtn && onRestart) {
    restartBtn.addEventListener('click', onRestart)
  }
}
