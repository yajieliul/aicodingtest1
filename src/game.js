import { CONFIG, STATUS } from './config.js'
import { reset, step, modifyDirection } from './logic/snake.js'
import { draw } from './renderer.js'

/**
 * 游戏进程控制：组合纯逻辑与渲染，驱动游戏循环。
 */

export function createGame({ canvas, onUiChange }) {
  const ctx = canvas.getContext('2d')
  let state = reset()
  let timer = null

  const game = {
    getState: () => state,

    submitDirection(dir) {
      // 归一到标准方向
      const mapped = normalizeDir(dir)
      if (!mapped) return
      if (state.status === STATUS.READY || state.status === STATUS.OVER) {
        // 首次输入即开始
        startPlaying()
      }
      if (state.status === STATUS.RUNNING) {
        modifyDirection(state, mapped)
      }
    },
    requestMove: startPlaying,
    togglePause,
    restart
  }

  function normalizeDir(dir) {
    if (!dir) return null
    if (typeof dir.x !== 'number' || typeof dir.y !== 'number') return null
    if (dir.x === 0 && dir.y === 0) return null
    return dir
  }

  function loop() {
    const result = step(state)
    if (result.event === 'EAT') {
      resizeInterval()
    }
    if (result.event === 'HIT_WALL' || result.event === 'HIT_SELF') {
      stopTimer()
      onUiChange && onUiChange(state)
      return
    }
    onUiChange && onUiChange(state)
  }

  function resizeInterval() {
    stopTimer()
    const interval = Math.max(
      CONFIG.minInterval,
      CONFIG.baseInterval - state.score * CONFIG.speedUpPerFood
    )
    if (state.status === STATUS.RUNNING) {
      timer = setInterval(loop, interval)
    }
  }

  function startPlaying() {
    if (state.status === STATUS.OVER) return
    if (state.status === STATUS.READY) {
      state.status = STATUS.RUNNING
    }
    if (state.status === STATUS.PAUSED) {
      state.status = STATUS.RUNNING
    }
    resizeInterval()
    onUiChange && onUiChange(state)
  }

  function togglePause() {
    if (state.status === STATUS.RUNNING) {
      state.status = STATUS.PAUSED
      stopTimer()
    } else if (state.status === STATUS.PAUSED) {
      game.requestMove()
    }
    onUiChange && onUiChange(state)
  }

  function restart() {
    state = reset()
    state.status = STATUS.RUNNING
    resizeInterval()
    onUiChange && onUiChange(state)
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  // render 帧循环（始终运行，保证初始画面与动画）
  let rafId = null
  function renderLoop() {
    draw(ctx, canvas, state)
    rafId = requestAnimationFrame(renderLoop)
  }
  rafId = requestAnimationFrame(renderLoop)

  // 初始 UI 通知
  onUiChange && onUiChange(state)

  return game
}
