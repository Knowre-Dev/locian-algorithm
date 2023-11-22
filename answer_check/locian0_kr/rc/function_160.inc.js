import _ from 'lodash'

export function mulNegative (tree) {
  if (!Array.isArray(tree) || tree.length < 1) {
    return tree
  }

  const operator = tree[0]
  const operand = tree.slice(1)
  const newOperand = []
  let sign = 1
  if (operator === 'negative') {
    const newsubtree = mulNegative(operand[0])
    if (newsubtree[0] === 'negative') {
      return newsubtree[1]
    }
    return [operator, newsubtree]
  }
  if (operator === 'mulchain') {
    for (const mterm of operand) {
      if (mterm[1][0] === 'negative') {
        sign = -1 * sign
        mterm[1] = mterm[1][1]
      }
      newOperand.push(mterm)
    }
  } else {
    for (const subtree of operand) {
      let newsubtree = mulNegative(subtree)
      if (operator === 'fraction' && newsubtree[0] === 'negative') {
        sign = -1 * sign
        newsubtree = newsubtree[1]
      }
      newOperand.push(newsubtree)
    }
  }

  const tree_1 = [operator].concat(newOperand)
  return sign === -1
    ? ['negative', tree_1]
    : tree_1
}
