const isMatch = (opener, closer) =>
  openers.findIndex(o => o === opener) === closers.findIndex(c => c === closer)

const filterOutPartALines = lines =>
  lines.filter(i => {
    const stack = []
    return !i.find(char => {
      if (!openers.includes(char)) {
        return !isMatch(stack.pop(), char)
      }
      stack.push(char)
    })
  })

const completionString = line => {
  const stack = []

  line.forEach(char => {
    if (openers.includes(char)) {
      stack.push(char)
    } else {
      stack.pop()
    }
  })

  return stack
    .reverse()
    .reduce((acc, cur) => acc + closers[openers.findIndex(o => o === cur)], '')
}

const getScore = char => closers.findIndex(c => c === char) + 1

const scoreCompletionString = str =>
  str.split('').reduce((acc, cur) => acc * 5 + getScore(cur), 0)

const openers = ['(', '[', '{', '<']
const closers = [')', ']', '}', '>']

const getIncompleteRowScore = fileName => {
  const input = require('fs')
    .readFileSync(fileName, 'utf8')
    .split('\n')
    .filter(d => d)
    .map(r => r.split(''))

  const scores = filterOutPartALines(input)
    .map(completionString)
    .map(scoreCompletionString)
    .sort((a, b) => a - b)

  return scores[Math.floor(scores.length / 2)]
}

const process = (part, expectedSampleAnswer) => {
  const sampleAnswer = getIncompleteRowScore('./day_10/sample_input.txt')

  console.log(`part ${part} sample answer`, sampleAnswer)
  if (sampleAnswer !== expectedSampleAnswer) {
    throw new Error(
      `part ${part} sample answer should be ${expectedSampleAnswer}`
    )
  }

  console.log(
    `part ${part} real answer`,
    getIncompleteRowScore('./day_10/input.txt')
  )
}

process('B', 288957)
