import _ from 'lodash'

export function negParenthesis (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  const operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []
  if (operator === 'addchain') {
    if (tree_1[0][0] === 'add' && tree_1[0][1][0] === 'negative') {
      tree_1[0] = ['sub', tree_1[0][1][1]]
    }
    newOperand = tree_1
  } else {
    for (const v of tree_1) {
      newOperand.push(negParenthesis(v))
    }
  }
  return [operator].concat(newOperand)
}
