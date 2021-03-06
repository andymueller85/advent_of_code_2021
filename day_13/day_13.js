const swapXY = paper =>
  paper[0].map((_, colIndex) => paper.map(row => row[colIndex]))

const foldHorizontal = (paper, foldIndex) => {
  const adjustedPaper = foldIndex > paper.length / 2 ? paper : paper.reverse()
  const top = adjustedPaper.slice(0, foldIndex)
  const bottom = adjustedPaper.slice(foldIndex + 1)

  return top
    .reverse()
    .map((r, rIdx) =>
      r.map((c, cIdx) => {
        if (rIdx > bottom.length - 1) return c
        return c === '#' || bottom[rIdx][cIdx] === '#' ? '#' : '.'
      })
    )
    .reverse()
}

const partAFolder = (paper, instructions) =>
  [instructions[0]].reduce((acc, [axis, foldIndex]) => {
    const foldedPaper =
      axis === 'y'
        ? foldHorizontal(paper, foldIndex)
        : swapXY(foldHorizontal(swapXY(paper), foldIndex))

    return acc + foldedPaper.flat().filter(d => d === '#').length
  }, 0)

const partBFolder = (paper, instructions) =>
  instructions.reduce((acc, [axis, foldIndex]) => {
    return axis === 'y'
      ? foldHorizontal(acc, foldIndex)
      : swapXY(foldHorizontal(swapXY(acc), foldIndex))
  }, paper)

const foldPaper = (fileName, folderFn) => {
  const [rawDots, rawInstructions] = require('fs')
    .readFileSync(fileName, 'utf8')
    .split('\n\n')

  const dots = rawDots
    .split(/\r?\n/)
    .filter(d => d)
    .map(d => d.split(',').map(c => parseInt(c, 10)))

  const max = i => Math.max(...dots.map(d => d[i])) + 1
  const paper = Array.from({ length: max(1) }, () =>
    Array.from({ length: max(0) }, () => '.')
  )
  dots.forEach(([col, row]) => (paper[row][col] = '#'))

  const instructions = rawInstructions
    .split(/\r?\n/)
    .filter(d => d)
    .map(d => d.split('='))
    .map(([axis, val]) => [axis.charAt(axis.length - 1), parseInt(val, 10)])

  return folderFn(paper, instructions)
}

const process = (part, fn) => {
  const log = (answer, answerType) => {
    if (part === 'A') {
      console.log(`part ${part} ${answerType} answer`, answer)
    } else {
      answer.forEach((a, i) => console.log(`${a.join('')} ${i}`))
    }
  }

  log(foldPaper('./day_13/sample_input.txt', fn), 'sample')
  log(foldPaper('./day_13/input.txt', fn), 'real')
}

process('A', partAFolder)
process('B', partBFolder)
