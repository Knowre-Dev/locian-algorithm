import _ from 'lodash'

export function mulPowSeparation (tree = null) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []

  if (operator === 'power') {
    if (tree_1[0][0] === 'mulchain') {
      operator = 'mulchain'
      const tree_1_0 = tree_1[0]
      for (const t1 of tree_1_0) {
        if (Array.isArray(t1)) {
          newOperand.push([t1[0], ['power', t1[1], tree_1[1]]])
        }
      }
    } else {
      newOperand = tree_1
    }
  } else {
    for (const v of tree_1) {
      newOperand.push(mulPowSeparation(v))
    }
  }
  return [operator].concat(newOperand)
}
