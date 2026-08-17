import { CONFIG, STATUS } from './config.js'
import { createGame } from './game.js'
import { bindControls } from './input.js'

/**
 * 应用入口：组装游戏进程与输入，维护 HUD 与弹层 UI。
 */

const canvas = document.getElementById('board')
const scoreEl = document.getElementById('score')
const statusEl = document.getElementById('status')
const speedEl = document.getElementById('speed')
const overlay = document.getElementById('overlay')
const overlayTitle = document.getElementById('overlayTitle')
const overlayHint = document.getElementById('overlayHint')

const STATUS_TEXT = {
  [STATUS.READY]: '就绪',
  [STATUS.RUNNING]: '进行中',
  [STATUS.PAUSED]: '已暂停',
  [STATUS.OVER]: '游戏结束'
}

function updateUi(state) {
  scoreEl.textContent = String(state.score)

  const interval = Math.max(
    CONFIG.minInterval,
    CONFIG.baseInterval - state.score * CONFIG.speedUpPerFood
  )
  statusEl.textContent = STATUS_TEXT[state.status] || state.status

  // 速度档位刻度
  const ticks = Math.round(
    ((CONFIG.baseInterval - interval) / (CONFIG.baseInterval - CONFIG.minInterval)) * 100
  )
  speedEl.textContent = String(ticks)

  switch (state.status) {
    case STATUS.READY:
      overlay.style.display = 'flex'
      overlayTitle.textContent = '准备开始'
      overlayHint.textContent = '按任意方向键或点击下方方向键开始'
      break
    case STATUS.RUNNING:
      overlay.style.display = 'none'
      break
    case STATUS.PAUSED:
      overlay.style.display = 'flex'
      overlayTitle.textContent = '已暂停'
      overlayHint.textContent = '再次点击或按空格继续'
      break
    case STATUS.OVER:
      overlay.style.display = 'flex'
      overlayTitle.textContent = '游戏结束'
      overlayHint.textContent = `最终得分 ${state.score} 分，点击重新开始`
      break
    default:
      overlay.style.display = 'none'
  }
}

start()

function start() {
  const game = createGame({ canvas, onUiChange: updateUi })

  bindControls({
    onDirection: (dir) => game.submitDirection(dir),
    onPause: () => game.togglePause(),
    onRestart: () => game.restart()
  })

  // 首屏同步 HUD 与弹层
  updateUi(game.getState())
}
