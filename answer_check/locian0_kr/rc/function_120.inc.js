import _ from 'lodash'

export function powerOne (tree = null) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []

  if (operator === 'power') {
    if (tree_1[0][0] === 'natural' && tree_1[0][1] === '1') {
      operator = 'natural'
      newOperand.push('1')
    } else {
      newOperand = tree_1
    }
  } else {
    for (const v of tree_1) {
      newOperand.push(powerOne(v))
    }
  }
  return [operator].concat(newOperand)
}
