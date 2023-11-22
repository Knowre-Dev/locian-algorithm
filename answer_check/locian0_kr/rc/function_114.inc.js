import _ from 'lodash'

export function mulToNega (tree = null) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []
  const newTree = []
  if (operator === 'mulchain') {
    if (tree_1[0][1][0] === 'negative' && tree_1[0][1][1][0] === 'natural' && tree_1[0][1][1][1] !== '1') {
      const first_term = tree_1.shift()
      operator = 'negative'
      const newFirst = ['mul', first_term[1][1]]

      newTree.push(newFirst)
      for (const t of tree_1) {
        newTree.push(t)
      }

      newOperand.push('mulchain')
      for (const n of newTree) {
        newOperand.push(n)
      }

      newOperand = [newOperand]
    } else {
      newOperand = tree_1
    }
  } else {
    for (const v of tree_1) {
      newOperand.push(mulToNega(v))
    }
  }
  return [operator].concat(newOperand)
}
