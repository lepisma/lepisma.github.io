// Sandpile for the main canvas

const size = 10
const colors = ['rgb(230, 230, 230)', 'white']

function resizeCanvas (canvas) {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function clearCtx (ctx, width, height) {
  ctx.clearRect(0, 0, width, height)
}

function dot (ctx, x, y, width, height, color) {
  ctx.fillStyle = color
  ctx.fillRect(x * size, y * size, size, size)
}

function drawSand (ctx, sand, width, height) {
  for (let i = 0; i < sand.length; i++) {
    for (let j = 0; j < sand[i].length; j++) {
      if (sand[i][j] > 0) {
        dot(ctx, i, j, width, height, colors[Math.min(2, sand[i][j]) - 1])
      }
    }
  }
}

function initSand (width, height) {
  let maxX = width / size
  let maxY = height / size

  let sand = []
  for (let i = 0; i < maxX; i++) {
    sand.push([])
    for (let j = 0; j < maxY; j++) {
      sand[i].push(0)
    }
  }
  return sand
}

function perturbSand (sand, width, height) {
  for (let i = 0; i < 1; i++) {
    let x = Math.floor(Math.random() * sand.length)
    let y = Math.floor(Math.random() * sand[0].length)
    sand[x][Math.floor(height / size) - 20]++
    sand[Math.floor(width / size) - 20][y]++
  }
  return sand
}

function evolveSand (sand) {
  for (let t = 1; t < 100; t++) {
    for (let i = 1; i < (sand.length - 1); i++) {
      for (let j = 1; j < (sand[i].length - 1); j++) {
        if (sand[i][j] > 4) {
          sand[i - 1][j]++
          sand[i + 1][j]++
          sand[i][j - 1]++
          sand[i][j + 1]++
          sand[i][j] -= 4
        }

        if ((i === 1) || (j === 1) || (i === sand.length - 2) || (j === sand[i].length - 2)) {
          sand[i][j] = 0
        }
      }
    }
  }
  return sand
}

document.addEventListener('DOMContentLoaded', function () {
  let canvas = document.getElementById('canvas')
  let ctx = canvas.getContext('2d')
  resizeCanvas(canvas)
  window.sand = initSand(canvas.width, canvas.height)
  window.go = true
  setInterval(() => {
    if (window.go) {
      window.sand = perturbSand(window.sand, canvas.width, canvas.height)
      window.sand = evolveSand(window.sand)
      clearCtx(ctx)
      drawSand(ctx, window.sand, canvas.width, canvas.height)
    }
  }, 50)
})
