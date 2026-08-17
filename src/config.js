// 游戏全局配置常量

export const CONFIG = {
  // 网格尺寸（格子数）
  gridWidth: 20,
  gridHeight: 20,
  // 每格像素（画布渲染基准，实际按 canvas 尺寸等比缩放）
  cellSize: 30,
  // 初始蛇身长度
  initialSnakeLength: 3,
  // 基础移动间隔（毫秒）
  baseInterval: 180,
  // 每吃一个食物减少的间隔（提升速度）
  speedUpPerFood: 6,
  // 最小移动间隔（封顶速度）
  minInterval: 60
}

export const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
}

export const STATUS = {
  READY: 'READY',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  OVER: 'OVER'
}
