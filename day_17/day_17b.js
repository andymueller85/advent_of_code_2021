const getTrajectories = fileName => {
  const [[minX, maxX], [minY, maxY]] = require('fs')
    .readFileSync(fileName, 'utf8')
    .replace(/\r/g, '')
    .replace(/\n/g, '')
    .split(',')
    .map(r => r.split('..').map(c => parseInt(c, 10)))

  const target = { minX, maxX, minY, maxY }

  const targetHit = p =>
    p.x >= target.minX &&
    p.y >= target.minY &&
    p.x <= target.maxX &&
    p.y <= target.maxY

  const shotStillGoing = (p, v) =>
    !targetHit(p) &&
    (v.y >= 0 || p.y >= target.minY) &&
    ((v.x >= 0 && p.x <= target.maxX) || (v.x <= 0 && p.x >= target.minX))

  const fireShot = velocity => {
    const p = { x: 0, y: 0 }
    const v = { ...velocity }

    while (shotStillGoing(p, v)) {
      if (!targetHit(p)) {
        p.x += v.x
        p.y += v.y
        if (v.x !== 0) {
          v.x += v.x > 0 ? -1 : 1
        }
        v.y--
      }
    }

    return {
      finalX: p.x,
      finalY: p.y,
      hit: targetHit(p)
    }
  }

  let answer = 0

  // +-300 is arbitrary, and enough for this dataset. could probably be smarter.
  Array.from({ length: 600 }, (_, i) => i - 300).forEach(y => {
    let shotMinX = -300
    let shotMaxX = 300
    let result = { hit: false }

    while (shotMinX < shotMaxX && !result.hit) {
      const middle = Math.floor((shotMinX + shotMaxX) / 2)
      result = fireShot({ x: middle, y })
      if (result.hit) {
        // this is a very naive solution. If we have a hit try all the x's
        // around it - +-20 is a high enough range for this dataset
        Array.from({ length: 40 }, (_, i) => middle - (i - 20)).forEach(x => {
          answer += fireShot({ x, y }).hit
        })
      } else if (result.finalY < target.minY) {
        shotMinX = middle + 1
      } else {
        shotMaxX = middle - 1
      }
    }
  })

  return answer
}

const process = (part, expectedSampleAnswer) => {
  const sampleAnswer = getTrajectories('./day_17/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(`part ${part} real answer`, getTrajectories('./day_17/input.txt'))
}

process('B', 112)
