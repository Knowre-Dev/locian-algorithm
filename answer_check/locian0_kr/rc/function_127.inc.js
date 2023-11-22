import _ from 'lodash'

export function ineqRearrange (tree = null) {
  if (!Array.isArray(tree)) {
    return tree
  }

  const operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []

  if (operator === 'inequality') {
    if (tree_1[0][0] === 'negative') {
      const temp = []
      const tree_2 = tree_1.reverse()
      for (const v of tree_2) {
        if (Array.isArray(v)) {
          v[0] === 'negative'
            ? temp.push(v[1])
            : temp.push(['negative', v])
        } else {
          temp.push(v)
        }
      }
      newOperand = temp
    } else {
      newOperand = tree_1
    }
  } else {
    newOperand = tree_1
  }
  return [operator].concat(newOperand)
}
