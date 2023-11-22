import _ from 'lodash'

export function natElimZero (tree = null) {
  if (!Array.isArray(tree)) {
    return tree
  }

  const operator = tree[0]
  const tree_1 = tree.slice(1)

  const newOperand = []

  if (operator === 'natural') {
    newOperand.push(tree_1[0].replaceAll(new RegExp('^0+(?!$)', 'g'), ''))
  } else {
    for (const v of tree_1) {
      newOperand.push(natElimZero(v))
    }
  }
  return [operator].concat(newOperand)
}
