import _ from 'lodash'

export function rootToExp (tree = null) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  let tree_1 = tree.slice(1)
  if (operator === 'nthroot') {
    let newPower = tree_1[0]
    if (tree_1[1][0] === 'mulchain') { // 루트 안이 곱셈식일 경우
      const newOperand = []
      operator = 'mulchain'
      const tree_1_1 = tree_1[1]
      for (const v of tree_1_1) {
        if (Array.isArray(v)) {
          const term = ['nthroot', newPower, v[1]]
          newOperand.push([v[0], rootToExp(term)])
        } else {
          newOperand.push(v)
        }
      }
      return newOperand
    } else if (tree_1[1][0] === 'power') { // 루트 안이 거듭제곱일 경우
      newPower = ['fraction', tree_1[1][2], newPower]
      const newOperand = ['power', tree_1[1][1], newPower]

      return newOperand
    } else {
      newPower = ['fraction', ['natural', '1'], newPower]
      const newOperand = ['power', tree_1[1], newPower]

      return newOperand
    }
  } else if (operator === 'squareroot') {
    const newOperand = [['natural', '2']].concat(tree_1)
    tree_1 = ['nthroot'].concat(newOperand)
    return rootToExp(tree_1)
  } else {
    const newOperand = []
    for (const v of tree_1) {
      newOperand.push(rootToExp(v))
    }
    tree_1 = [operator].concat(newOperand)
  }

  return tree_1
}
