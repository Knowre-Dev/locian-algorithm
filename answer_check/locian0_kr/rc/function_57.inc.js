import _ from 'lodash'

export function divIdentity (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []
  if (operator === 'mulchain') {
    for (const v of tree_1) {
      if (v[0] !== 'div' || v[1][0] !== 'natural' || v[1][1] !== '1') {
        newOperand.push(v)
      }
    }

    if (newOperand.length === 1) {
      operator = newOperand[0][1].shift()
      newOperand = newOperand[0][1]
    }
  } else {
    for (const v of tree_1) {
      newOperand.push(divIdentity(v))
    }
  }
  return [operator].concat(newOperand)
}
