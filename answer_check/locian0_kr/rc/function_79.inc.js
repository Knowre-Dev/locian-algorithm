import _ from 'lodash'

export function decElimZero (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  const newOperand = []
  if (operator === 'decimal') {
    const decArr = tree_1[0].split('')

    while (decArr[decArr.length - 1] === '0') {
      decArr.splice(-1)
    }

    if (decArr[decArr.length - 1] === '.') {
      operator = 'natural'
      decArr.splice(-1)
    }
    const dec = decArr.join('')
    newOperand.push(dec)
  } else {
    for (const v of tree_1) {
      newOperand.push(decElimZero(v))
    }
  }
  return [operator].concat(newOperand)
}
