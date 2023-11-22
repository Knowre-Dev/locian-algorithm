import _ from 'lodash'

export function divFrac (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []
  if (operator === 'mulchain') {
    const tree_1_length = tree_1.length
    for (let k = 0; k < tree_1_length; k++) {
      if (k === 0) {
        newOperand.push(tree_1[k])
      } else if (tree_1[k][0] === 'div' && (newOperand[newOperand.length - 1])[0] === 'mul') {
        const num = divFrac(newOperand.pop()[1])
        const denum = divFrac(tree_1[k][1])
        if (tree_1.length === 2) {
          operator = 'fraction'
          newOperand.push(num)
          newOperand.push(denum)
        } else {
          const tempArr = ['fraction'].concat([num, denum])
          newOperand.push(['mul'].concat([tempArr]))
        }
      } else {
        newOperand.push(divFrac(tree_1[k]))
      }
    }
    if (newOperand.length === 1) {
      operator = newOperand[0][1].shift()
      newOperand = newOperand.shift()[1]
    }
  } else {
    for (const arr of tree_1) {
      newOperand.push(divFrac(arr))
    }
  }
  return [operator].concat(newOperand)
}
