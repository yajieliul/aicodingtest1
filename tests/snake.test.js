import { describe, it, expect } from 'vitest'
import { reset, step, spawnFood, modifyDirection } from '../src/logic/snake.js'
import { DIRECTION, STATUS } from '../src/config.js'

function playingState(overrides = {}) {
  const state = reset(overrides)
  state.status = STATUS.RUNNING
  return state
}

describe('reset', () => {
  it('创建合法的初始状态', () => {
    const state = reset()
    expect(state.score).toBe(0)
    expect(state.status).toBe(STATUS.READY)
    expect(state.snake.length).toBe(3)
    expect(state.food).not.toBeNull()
    // 头和食物不重叠
    const head = state.snake[0]
    expect(head.x === state.food.x && head.y === state.food.y).toBe(false)
  })

  it('初始蛇位于中部且水平放置', () => {
    const state = reset({ gridWidth: 20, gridHeight: 20 })
    const midX = Math.floor(20 / 2)
    const midY = Math.floor(20 / 2)
    expect(state.snake.length).toBe(3)
    expect(state.snake[0]).toEqual({ x: midX, y: midY })
    expect(state.snake[1]).toEqual({ x: midX - 1, y: midY })
    expect(state.snake[2]).toEqual({ x: midX - 2, y: midY })
    expect(state.direction).toEqual(DIRECTION.RIGHT)
  })
})

describe('step 移动', () => {
  it('未进食时移动长度不变，头部沿方向前移', () => {
    const state = playingState({ gridWidth: 20, gridHeight: 20 })
    state.direction = DIRECTION.RIGHT
    state.nextDirection = DIRECTION.RIGHT
    state.food = { x: 100, y: 100 } // 放一个远离的伪食物，确保不会吃到

    const headBefore = { ...state.snake[0] }
    const { event } = step(state)

    expect(event).toBe('MOVE')
    expect(state.snake.length).toBe(3)
    expect(state.snake[0]).toEqual({ x: headBefore.x + 1, y: headBefore.y })
  })

  it('吃到食物时长度+1且分数+1，食物更换位置', () => {
    const state = playingState({ gridWidth: 20, gridHeight: 20 })
    state.direction = DIRECTION.RIGHT
    state.nextDirection = DIRECTION.RIGHT
    // 把食物放到蛇头正前方
    const head = state.snake[0]
    state.food = { x: head.x + 1, y: head.y }

    const headBefore = head
    const { event } = step(state)

    expect(event).toBe('EAT')
    expect(state.score).toBe(1)
    expect(state.snake.length).toBe(4)
    expect(state.snake[0]).toEqual({ x: headBefore.x + 1, y: headBefore.y })
  })

  it('撞墙触发 HIT_WALL 并将状态置为 OVER', () => {
    const state = playingState({ gridWidth: 5, gridHeight: 5 })
    // 放置蛇头在右边界，向右移动即撞墙
    state.snake = [{ x: 4, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 2 }]
    state.direction = DIRECTION.RIGHT
    state.nextDirection = DIRECTION.RIGHT
    state.food = { x: 0, y: 0 }

    const { event } = step(state)
    expect(event).toBe('HIT_WALL')
    expect(state.status).toBe(STATUS.OVER)
  })

  it('撞自身（回头吃身体）触发 HIT_SELF', () => {
    const state = playingState({ gridWidth: 20, gridHeight: 20 })
    // 蛇身 = 头部(2,2)，方向向下，前下方(2,3)被身体占据且非尾部
    state.snake = [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 }
    ]
    state.direction = DIRECTION.DOWN
    state.nextDirection = DIRECTION.DOWN
    state.food = { x: 0, y: 0 }

    const { event } = step(state)
    expect(event).toBe('HIT_SELF')
    expect(state.status).toBe(STATUS.OVER)
  })
})

describe('modifyDirection', () => {
  it('阻止 180° 反向键', () => {
    const state = playingState()
    state.direction = DIRECTION.RIGHT
    state.nextDirection = DIRECTION.RIGHT
    const ok = modifyDirection(state, DIRECTION.LEFT)
    expect(ok).toBe(false)
    expect(state.nextDirection).toEqual(DIRECTION.RIGHT)
  })

  it('允许合法的转身', () => {
    const state = playingState()
    state.direction = DIRECTION.RIGHT
    state.nextDirection = DIRECTION.RIGHT
    const ok = modifyDirection(state, DIRECTION.UP)
    expect(ok).toBe(true)
    expect(state.nextDirection).toEqual(DIRECTION.UP)
  })
})

describe('spawnFood', () => {
  it('生成的食物不落在蛇身上', () => {
    const state = playingState()
    const food = spawnFood(state)
    const overlap = state.snake.some((c) => c.x === food.x && c.y === food.y)
    expect(overlap).toBe(false)
  })
})
