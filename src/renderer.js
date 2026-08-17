import { CONFIG } from './config.js'

/**
 * Canvas 渲染模块，仅负责绘制，不包含任何游戏逻辑。
 */

const COLORS = {
  grid: 'rgba(255,255,255,0.04)',
  snakeHead: '#4ade80',
  snakeBody: '#22b17c',
  food: '#f87171'
}

/**
 * 绘制整帧。
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement} canvas
 * @param {object} state gameState
 */
export function draw(ctx, canvas, state) {
  const { gridWidth, gridHeight } = state
  const cellW = canvas.width / gridWidth
  const cellH = canvas.height / gridHeight

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawGrid(ctx, gridWidth, gridHeight, cellW, cellH)

  if (state.food) {
    drawFood(ctx, state.food, cellW, cellH)
  }
  drawSnake(ctx, state.snake, cellW, cellH)
}

function drawGrid(ctx, cols, rows, cellW, cellH) {
  ctx.strokeStyle = COLORS.grid
  ctx.lineWidth = 1
  // 保留画布底色不需要，直接画线
  ctx.beginPath()
  for (let x = 1; x < cols; x++) {
    ctx.moveTo(x * cellW, 0)
    ctx.lineTo(x * cellW, rows * cellH)
  }
  for (let y = 1; y < rows; y++) {
    ctx.moveTo(0, y * cellH)
    ctx.lineTo(cols * cellW, y * cellH)
  }
  ctx.stroke()
}

function drawFood(ctx, food, cellW, cellH) {
  ctx.save()
  ctx.fillStyle = COLORS.food
  ctx.beginPath()
  ctx.arc(
    food.x * cellW + cellW / 2,
    food.y * cellH + cellH / 2,
    Math.min(cellW, cellH) * 0.34,
    0,
    Math.PI * 2
  )
  ctx.fill()
  ctx.restore()
}

function drawSnake(ctx, snake, cellW, cellH) {
  snake.forEach((cell, index) => {
    const margin = index === 0 ? 0.1 : 0.18
    const pad = Math.min(cellW, cellH) * margin
    ctx.fillStyle = index === 0 ? COLORS.snakeHead : COLORS.snakeBody
    ctx.fillRect(
      cell.x * cellW + pad,
      cell.y * cellH + pad,
      cellW - pad * 2,
      cellH - pad * 2
    )
  })
}
