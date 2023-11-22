import { addCommutative } from '../rc/function_47.inc.js'
import _ from 'lodash'

export function powBaseSort (tree = null) {
  if (!Array.isArray(tree)) {
    return tree
  }

  const operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []

  if (operator === 'power') {
    const base = addCommutative(tree_1[0])
    const expo = tree_1[1]

    if (base[0] === 'addchain' && expo[1] % 2 === 0) {
      if (base[1][0] === 'sub') {
        base.shift()

        const newBaseTerm = []
        for (const b of base) {
          b[0] === 'sub'
            ? newBaseTerm.push(['add', b[1]])
            : newBaseTerm.push(['sub', b[1]])
        }
        const newBase = ['addchain'].concat(newBaseTerm)
        newOperand = [newBase, expo]
      } else {
        newOperand = [base, expo]
      }
    } else if (base[0] === 'negative' && expo[1] % 2 === 0) {
      base.shift()
      newOperand = powBaseSort([base[0], expo])
    } else {
      newOperand = [base, expo]
    }
  } else {
    for (const v of tree_1) {
      newOperand.push(powBaseSort(v))
    }
  }
  return [operator].concat(newOperand)
}
