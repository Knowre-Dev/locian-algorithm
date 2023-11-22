import _ from 'lodash'

export function fracIdentity (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []
  if (operator === 'fraction') {
    if (tree_1[1][0] === 'natural' && tree_1[1][1] === '1') {
      operator = tree_1[0].shift()
      newOperand = tree_1[0]
    } else {
      newOperand = tree_1
    }
  } else {
    for (const v of tree_1) {
      newOperand.push(fracIdentity(v))
    }
  }
  return [operator].concat(newOperand)
}
