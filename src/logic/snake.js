import { CONFIG, DIRECTION, STATUS } from '../config.js'

/**
 * 贪吃蛇纯逻辑模块。
 * 所有函数均为纯函数——不依赖 DOM，可被单元测试直接验证。
 */

/**
 * 创建一个新的游戏状态（一局开始）。
 * @param {object} [overrides] 可覆盖网格尺寸等
 * @returns {object} gameState
 */
export function reset(overrides = {}) {
  const gridWidth = overrides.gridWidth ?? CONFIG.gridWidth
  const gridHeight = overrides.gridHeight ?? CONFIG.gridHeight

  // 蛇初始位于网格中部，水平向右，头在前
  const midX = Math.floor(gridWidth / 2)
  const midY = Math.floor(gridHeight / 2)
  const length = overrides.initialSnakeLength ?? CONFIG.initialSnakeLength

  const snake = []
  for (let i = 0; i < length; i++) {
    snake.push({ x: midX - i, y: midY })
  }

  const state = {
    snake,
    direction: { ...DIRECTION.RIGHT },
    nextDirection: { ...DIRECTION.RIGHT },
    food: null,
    score: 0,
    status: STATUS.READY,
    gridWidth,
    gridHeight
  }

  state.food = spawnFood(state)
  return state
}

/**
 * 在空白格子中随机生成一个食物位置。
 * @param {object} state 当前状态
 * @returns {{x:number,y:number}}
 */
export function spawnFood(state) {
  const occupied = new Set(state.snake.map((c) => `${c.x},${c.y}`))
  const freeCells = []
  for (let y = 0; y < state.gridHeight; y++) {
    for (let x = 0; x < state.gridWidth; x++) {
      if (!occupied.has(`${x},${y}`)) freeCells.push({ x, y })
    }
  }
  // 蛇填满时无可用格子，返回特殊占位
  if (freeCells.length === 0) return null
  const idx = Math.floor(Math.random() * freeCells.length)
  return freeCells[idx]
}

/**
 * 处理方向输入：更新 nextDirection，阻止 180° 反向。
 * @param {object} state 待修改状态（会被原地更新）
 * @param {object} dir 形如 {x,y} 的单位向量
 * @returns {boolean} 是否为合法方向（非反向）
 */
export function modifyDirection(state, dir) {
  if (!dir || (dir.x === 0 && dir.y === 0)) return false
  const { direction } = state
  // 反方向检测：dx*dx + dy*dy 不冲突，但这里判断是否为相反向量
  if (direction.x + dir.x === 0 && direction.y + dir.y === 0) {
    // 反向，忽略
    return false
  }
  state.nextDirection = { x: dir.x, y: dir.y }
  return true
}

/**
 * 推进一帧。
 * @param {object} state 当前状态（会被原地更新为新状态）
 * @returns {{ state: object, event: string }}
 *   event: 'MOVE' | 'EAT' | 'HIT_WALL' | 'HIT_SELF'
 */
export function step(state) {
  if (state.status !== STATUS.RUNNING) {
    return { state, event: 'IDLE' }
  }

  // 采用本帧输入方向
  state.direction = { ...state.nextDirection }

  const head = state.snake[0]
  const newHead = {
    x: head.x + state.direction.x,
    y: head.y + state.direction.y
  }

  // 撞墙
  if (
    newHead.x < 0 ||
    newHead.y < 0 ||
    newHead.x >= state.gridWidth ||
    newHead.y >= state.gridHeight
  ) {
    state.status = STATUS.OVER
    return { state, event: 'HIT_WALL' }
  }

  const willEat = state.food && newHead.x === state.food.x && newHead.y === state.food.y

  // 撞自身：用"成功推进后的蛇身"判断，避免误判将要移出的尾部
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1)
  const hitSelf = bodyToCheck.some((c) => c.x === newHead.x && c.y === newHead.y)

  if (hitSelf) {
    state.status = STATUS.OVER
    return { state, event: 'HIT_SELF' }
  }

  // 头部前插
  state.snake.unshift(newHead)

  if (willEat) {
    state.score += 1
    state.food = spawnFood(state)
    return { state, event: 'EAT' }
  }

  // 未进食，移除尾部以保持长度
  state.snake.pop()
  return { state, event: 'MOVE' }
}
